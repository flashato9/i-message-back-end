import { generatePasswordHash, generatePasswordSalt } from "../encryption/crypto-base";
import { generateJWT } from "../encryption/jwt-base";
import { generateConfirmationCode } from "../encryption/random-number";
import { UserTuple } from "../models/internal-to-queries-interal/models";
import { getUserTuple } from "../queries-internal/single-table-queries/users/read";
import { updateTuple } from "../queries-internal/single-table-queries/users/update";
import { sendConfirmationCodeToEmail as sendConfirmationCodetoEmail } from "./mail/mailer";

/**
 *
 * @param user
 * @precond username exists
 * @returns
 */
export async function getUser(username: string): Promise<User> {
  try {
    const userInDB = await getUserTuple(username);
    return new User(userInDB);
  } catch (error) {
    throw error;
  }
}
class User {
  /**
   *
   * @param user
   * @precon user.username exists.
   */
  constructor(private user: UserTuple) {}

  /**
   * @precon code_confirmed===false || code is confirmed and you are reseting password.
   */
  async sendConfirmationCode() {
    try {
      const code = generateConfirmationCode();
      await updateTuple(this.username, { confirmation_code: code });
      await this.updateUser(this.username);
      await sendConfirmationCodetoEmail(this.user);
    } catch (error) {
      throw error;
    }
  }
  /**
   *
   * @param username
   * @precod this.user is outof date. Intuitively (i.e., there is no private variable for it yet.)
   */
  private async updateUser(username: string) {
    try {
      this.user = await getUserTuple(username);
    } catch (error) {
      throw error;
    }
  }
  /**
   *
   * @param password
   * @precon code confirmed is true.
   */
  async changePassword(password: string) {
    const password_salt = generatePasswordSalt();
    const password_hash = generatePasswordHash(password, password_salt);
    try {
      await updateTuple(this.username, { password_hash: password_hash, password_salt: password_salt });
    } catch (error) {
      throw error;
    }
  }
  /**
   * @precond code is not confirmed
   */
  async setCodeConfirmed() {
    try {
      await updateTuple(this.username, { code_confirmed: true });
      await this.updateUser(this.username);
    } catch (error) {
      throw error;
    }
  }
  //queries
  isValid(password: string) {
    const password_hash = generatePasswordHash(password, this.user["password_salt"]);
    if (password_hash !== this.user["password_hash"]) return false;
    return true;
  }
  //getters
  get username() {
    return this.user.username;
  }
  get email() {
    return this.user.email;
  }
  get confirmationCode() {
    return parseInt(this.user.confirmation_code.toString());
  }
  get codeConfirmed() {
    return this.user.code_confirmed;
  }
  get jwt() {
    return generateJWT(this.user);
  }
}
