import { NextFunction, Request, Response } from "express";
import passport from "passport";

export function signInPost(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return res.status(500).json(error);
    }
    if (user === false) {
      return res.status(401).json(info);
    } else {
      return res.status(200).json({ token: user.jwt });
    }
  })(req, res);
}
