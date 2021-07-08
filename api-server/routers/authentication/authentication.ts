import express from "express";
import {
  resetPasswordConfirmationCodeGet,
  resetPasswordPost,
  signUpConfirmationCodeGet,
  signUpConfirmationCodePost,
} from "../../controllers/authentication/confirmation-code";
import { signInPost } from "../../controllers/authentication/sign-in/sign-in";
import { signUpPost } from "../../controllers/authentication/sign-up";

export const apiAuth = express.Router();
apiAuth.post("/sign-in", signInPost);
apiAuth.route("/sign-in/:username/reset-password").post(resetPasswordPost);
apiAuth.route("/sign-in/:username/reset-password/confirm-code").get(resetPasswordConfirmationCodeGet);
apiAuth.post("/sign-up", signUpPost);
apiAuth.route("/sign-up/:username/confirm-code").get(signUpConfirmationCodeGet).post(signUpConfirmationCodePost);
