import { tupleExists } from "../queries-internal/single-table-queries/users/read";

export async function userExists(username: string): Promise<boolean> {
  try {
    return await tupleExists(username);
  } catch (error) {
    throw error;
  }
}
