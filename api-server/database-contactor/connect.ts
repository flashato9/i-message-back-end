import knex from "knex";
import { errorDBLogger, infoDBLogger } from "../../misc/loggers";

export const pg = knex({ client: "pg", connection: process.env.PG_CONNECTION_STRING });

let DBconnected = false;

export async function connectToDB() {
  try {
    infoDBLogger(`Connecting to database @ ${process.env.PG_CONNECTION}`);
    const result = await pg.raw("SELECT NOW()");
    infoDBLogger("Database succesfully connected. Time is:", result.rows[0].now);
    DBconnected = true;
  } catch (error) {
    errorDBLogger("Error occured when connecting to database.", error);
    DBconnected = false;
  }
}
connectToDB();
