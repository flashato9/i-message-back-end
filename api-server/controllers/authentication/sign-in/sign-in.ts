import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { SignInResponse } from "../../../database-contactor/models/can-be-exposed/models";

export function signInPost(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return res.status(500).json(error);
    }
    if (!(<SignInResponse>user).response_status.success) {
      return res.status(400).json(user);
    } else {
      return res.status(200).json(user);
    }
  })(req, res);
}
