import { debug } from "debug";

//regular - for incoming and outgoing internet calls
export const infoDBLogger = debug("iMessage:database:info");
export const errorDBLogger = debug("iMessage:database:error");
export const emailInfoLogger = debug("iMessage:email:info");
export const emailErrorLogger = debug("iMessage:email:error");

//dev for local calls, or calls to DB post connection phase.
export const devEmailInfoLogger = debug("iMessage:dev:email:info");
export const devEmailErrorLogger = debug("iMessage:dev:email:error");
export const devDBInfoLogger = debug("iMessage:dev:database:info");
export const devDBErrorLogger = debug("iMessage:dev:database:error");
