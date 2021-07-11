import { devDBErrorLogger, devDBInfoLogger } from "../../../../../misc/loggers";
import { pg } from "../../../connect";
import { UserTuple } from "../../../models/internal-to-queries-interal/models";
import { USERS_TN } from "./constants";

/**
 *
 * @param username
 * @precond tupleExists(username) ===true
 * @returns
 */
export async function getUserTuple(username: string): Promise<UserTuple> {
  //using false for null
  const tableName = "users";
  try {
    devDBInfoLogger(`Reading tuple from "${USERS_TN}" table.`);
    const data: UserTuple = (await pg(tableName).select("*").where({ username: username }))[0];
    devDBInfoLogger("Successfully read user tuple.");
    return data;
  } catch (error) {
    devDBErrorLogger(`Error executing ${getUserTuple.name}()-->`, error);
    throw { code: "tempcode", message: `An error occured trying to find user account with username="${username}", in database` };
  }
}
export async function tupleExists(username: string): Promise<boolean> {
  try {
    devDBInfoLogger(`Reading tuple from "${USERS_TN}" table.`);
    const data = await pg(USERS_TN).select("*").where({ username: username });
    devDBInfoLogger("Successfully read user tuple.");
    if (data.length === 0) return false;
    else return true;
  } catch (error) {
    devDBErrorLogger(`Error executing ${tupleExists.name}()-->`, error);
    throw { code: "tempcode", message: `An error occured trying to find user account with username="${username}", in database` };
  }
}
