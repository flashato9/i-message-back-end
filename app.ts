import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import logger from "morgan";
import path from "path";
import { passportConfig } from "./api-server/controllers/authentication/sign-in/passport-config";
import { apiRoot } from "./api-server/routers/authentication/root";
import { malFormatInputLogger } from "./misc/loggers";

export const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passportConfig.initialize());

app.use("/api", apiRoot);

app.use("/api", (err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  malFormatInputLogger("Server Error:", err);
  // res.locals.message = err.message;
  // res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    server_message: "An error occured on the server. Check your input. Your request will not be processed.",
    error_message: err.message,
  });
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
