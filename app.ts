import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import logger from "morgan";
import path from "path";
import { passportConfig } from "./api-server/controllers/authentication/sign-in/passport-config";
import { apiRoot } from "./api-server/routers/authentication/root";

export const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passportConfig.initialize());

app.use("/api", apiRoot);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
