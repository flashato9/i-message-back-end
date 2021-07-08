import { devDBErrorLogger, devDBInfoLogger } from "../../../../../misc/loggers";
import { pg } from "../../../connect";
import { UserTuple } from "../../../models/internal-to-queries-interal/models";
import { USERS_TN } from "./constants";

/**
 *
 * @param user
 * @precod exists(user.username)===false.
 * @returns
 */
export async function createTuple(user: UserTuple) {
  try {
    devDBInfoLogger(`Inserting tuple into "${USERS_TN}" table.`);
    await pg(USERS_TN).insert(user);
    devDBInfoLogger("Successfully inserted tuple:", user);
    return;
  } catch (error: any) {
    devDBErrorLogger(`Error executing ${createTuple.name}()-->`, error);
    if (parseInt(error.code) === 23505)
      throw {
        code: "tempcode",
        message: `User account with username="${user.username}", already exists in database`,
      };
    throw {
      code: "tempcode",
      message: `An error occured trying to create user account with username="${user.username}", in database`,
    };
  }
}
