import { NextFunction, Request, Response } from "express";
import { SignUpResponse } from "../../database-contactor/models/can-be-exposed/models";
import { createUser } from "../../database-contactor/queries-for-controller/create";
import { userExists } from "../../database-contactor/queries-for-controller/read";
import { getUser, User } from "../../database-contactor/queries-for-controller/user";

export async function signUpPost(req: Request, res: Response, next: NextFunction) {
  if (!req.body.username || !req.body.email || !req.body.password) {
    const result: SignUpResponse = {
      submitted: { email: req.body.email || "", password: req.body.password || "", username: req.body.username },
      response_status: {
        message: "All fields are required. Please submit username, email and password fields",
        status_code: 0,
        success: false,
      },
    };
    return res.status(400).json(result);
  }
  const username = String(req.body.username);
  const password = String(req.body.password);
  const email = String(req.body.email);
  if (!User.usernameReqMet(username)) {
    const result: SignUpResponse = {
      submitted: { email: email, password: password, username: username },
      response_status: {
        message:
          "The username does not meet the requirements. 3<= username length <=100.\nThe username must include only a-z, A-Z, 0-9 and _ characters.",
        status_code: 1,
        success: false,
      },
    };
    return res.status(400).json(result);
  }
  if (!User.emailReqMet(email)) {
    const result: SignUpResponse = {
      submitted: { email: email, password: password, username: username },
      response_status: {
        message: "The email is not valid.",
        status_code: 2,
        success: false,
      },
    };
    return res.status(400).json(result);
  }
  if (!User.strongPasswordReqMet(password)) {
    const result: SignUpResponse = {
      submitted: { email: email, password: password, username: username },
      response_status: {
        message: `The password does not meet the requirements.
8 <= Password length <= 100.
Password must not contain spaces.
Password must have at least 1 lowercase, 1 uppercase, 1 number and 1 speacial character symbol (!@#$&-).  `,
        status_code: 3,
        success: false,
      },
    };
    return res.status(400).json(result);
  }
  try {
    if (await userExists(username)) {
      const result: SignUpResponse = {
        submitted: { email: email, password: password, username: username },
        response_status: {
          message: "There is already an existing account with the username.",
          status_code: 4,
          success: false,
        },
      };
      return res.status(400).json(result);
    }
    const user = { username: req.body.username, email: req.body.email, password: req.body.password };
    await createUser(user);
    const userInDB = await getUser(user.username);
    await userInDB.sendConfirmationCode();
    const result: SignUpResponse = {
      submitted: { email: email, password: password, username: username },
      response_status: {
        message: `User account has been created. The confirmation code has been sent to "${userInDB.email}"`,
        status_code: 10,
        success: true,
      },
    };
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
}
