import { devDBErrorLogger, devDBInfoLogger } from "../../../../../misc/loggers";
import { pg } from "../../../connect";
import { UserTuplePartial } from "../../../models/internal-to-queries-interal/models";
import { USERS_TN } from "./constants";

/**
 *
 * @param username
 * @param updateData
 * @precon username exists
 * @returns
 */
export async function updateTuple(username: string, updateData: UserTuplePartial) {
  try {
    devDBInfoLogger(`Updating tuple in "${USERS_TN}" table.`);
    await pg(USERS_TN).where({ username: username }).update(updateData);
    devDBInfoLogger("Successfully updated user tuple.");
    return;
  } catch (error) {
    devDBErrorLogger(`Error executing ${updateTuple.name}()-->`, error);
    throw {
      code: "temp code",
      message: `An error occured trying to update user account with username="${username}", in database`,
    };
  }
}
