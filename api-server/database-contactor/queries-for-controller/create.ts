import { generatePasswordHash, generatePasswordSalt } from "../encryption/crypto-base";
import { generateConfirmationCode } from "../encryption/random-number";
import { UserSignUpCred } from "../models/can-be-exposed/models";
import { UserTuple } from "../models/internal-to-queries-interal/models";
import { createTuple } from "../queries-internal/single-table-queries/users/create";
import { tupleExists } from "../queries-internal/single-table-queries/users/read";

export async function exists(username: string) {
  try {
    return await tupleExists(username);
  } catch (error) {
    throw error;
  }
}
/**
 *
 * @param userS
 * @precon user.username not exists
 * @returns
 */
export async function createUser(userS: UserSignUpCred) {
  const password_salt = generatePasswordSalt();
  const password_hash = generatePasswordHash(userS.password, password_salt);
  const user: UserTuple = {
    username: userS.username,
    email: userS.email,
    password_hash: password_hash,
    password_salt: password_salt,
    confirmation_code: generateConfirmationCode(),
    code_confirmed: false,
  };
  try {
    await createTuple(user);
    return;
  } catch (error) {
    throw error;
  }
}
