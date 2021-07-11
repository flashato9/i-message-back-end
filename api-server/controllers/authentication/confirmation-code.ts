import { NextFunction, Request, Response } from "express";
import {
  PasswordResetCodeResponse,
  PasswordResetConfirmationResponse,
  SignUpConfirmationGetCodeResponse,
  SignUpConfirmationSubmitCodeResponse,
} from "../../database-contactor/models/can-be-exposed/models";
import { userExists } from "../../database-contactor/queries-for-controller/read";
import { getUser, User } from "../../database-contactor/queries-for-controller/user";

export async function signUpConfirmationCodeGet(req: Request, res: Response, next: NextFunction) {
  if (!req.params.username) {
    const result: SignUpConfirmationGetCodeResponse = {
      response_status: { message: `The username is required.`, success: false, status_code: 0 },
      submitted: null,
    };
    return res.status(400).json(result);
  }
  const username = String(req.params.username);
  try {
    const ex = await userExists(username);
    if (!ex) {
      const result: SignUpConfirmationGetCodeResponse = {
        response_status: { message: "No account exists with the username.", success: false, status_code: 1 },
        submitted: null,
      };
      return res.status(400).json(result);
    }
    const user = await getUser(username);
    if (user.codeConfirmed) {
      const result: SignUpConfirmationGetCodeResponse = {
        response_status: { message: "Account is already confirmed.", success: false, status_code: 2 },
        submitted: null,
      };
      return res.status(400).json(result);
    }
    await user.sendConfirmationCode();
    const result: SignUpConfirmationGetCodeResponse = {
      response_status: { message: "The confirmation code has been submitted.", success: true, status_code: 10 },
      submitted: null,
    };
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
}
export async function resetPasswordConfirmationCodeGet(req: Request, res: Response, next: NextFunction) {
  const username = req.params.username;
  try {
    const ex = await userExists(username);
    if (!ex) {
      const result: PasswordResetCodeResponse = {
        response_status: { message: "The username does not exist", status_code: 0, success: false },
        submitted: { username },
      };
      return res.status(400).json(result);
    }
    const user = await getUser(username);
    await user.sendConfirmationCode();
    const result: PasswordResetCodeResponse = {
      response_status: { message: "The password reset code has been sent.", status_code: 10, success: true },
      submitted: { username },
    };
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function signUpConfirmationCodePost(req: Request, res: Response, next: NextFunction) {
  if (!req.params.username || !req.body.confirmation_code) {
    const result: SignUpConfirmationSubmitCodeResponse = {
      response_status: {
        message: `All fields are required. Please submit both "username", and "confirmation_code"`,
        success: false,
        status_code: 0,
      },
      submitted: { confirmation_code: req.body.confirmation_code },
    };
    return res.status(400).json(result);
  }
  const username = String(req.params.username);
  const confirmation_code = parseInt(req.body.confirmation_code);
  if (isNaN(confirmation_code)) {
    const result: SignUpConfirmationSubmitCodeResponse = {
      response_status: { message: `The confirmation_code is not a valid integer`, success: false, status_code: 1 },
      submitted: { confirmation_code: confirmation_code },
    };
    return res.status(400).json(result);
  }
  try {
    const ex = await userExists(username);

    if (!ex) {
      const result: SignUpConfirmationSubmitCodeResponse = {
        response_status: {
          message: `No account exists with the username.`,
          success: false,
          status_code: 2,
        },
        submitted: { confirmation_code: confirmation_code },
      };
      return res.status(400).json(result);
    }
    const user = await getUser(username);
    if (user.codeConfirmed) {
      const result: SignUpConfirmationSubmitCodeResponse = {
        response_status: {
          message: `The account is already confirmed.`,
          success: false,
          status_code: 3,
        },
        submitted: { confirmation_code: confirmation_code },
      };
      return res.status(400).json(result);
    }
    if (user.confirmationCode !== confirmation_code) {
      const result: SignUpConfirmationSubmitCodeResponse = {
        response_status: {
          message: `The confirmation code is incorrect`,
          success: false,
          status_code: 4,
        },
        submitted: { confirmation_code: confirmation_code },
      };
      return res.status(400).json(result);
    }
    await user.setCodeConfirmed();

    const result: SignUpConfirmationSubmitCodeResponse = {
      response_status: {
        message: `The account is now confirmed.`,
        success: true,
        status_code: 10,
      },
      submitted: { confirmation_code: confirmation_code },
    };
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
}
export async function resetPasswordPost(req: Request, res: Response, next: NextFunction) {
  if (!req.params.username) {
    const result: PasswordResetConfirmationResponse = {
      response_status: {
        message: `All fields are required. Please submit all three values "username", "confirmation_code" and "new_password".`,
        success: false,
        status_code: 0,
      },
      submitted: { confirmation_code: req.body.confirmation_code, new_password: req.params.new_password },
    };
    return res.status(400).json(result);
  }
  if (!req.body.confirmation_code || !req.body.new_password) {
    const result: PasswordResetConfirmationResponse = {
      response_status: {
        message: `All fields are required. Please submit both "confirmation_code" and "new_password".`,
        success: false,
        status_code: 1,
      },
      submitted: { confirmation_code: req.body.confirmation_code, new_password: req.params.new_password },
    };
    return res.status(400).json(result);
  }
  const username = String(req.params.username);
  const confirmation_code = parseInt(req.body.confirmation_code);
  if (isNaN(confirmation_code)) {
    const result: PasswordResetConfirmationResponse = {
      response_status: {
        message: `The confirmation code must be a valid integer.`,
        success: false,
        status_code: 2,
      },
      submitted: { confirmation_code: req.body.confirmation_code, new_password: req.params.new_password },
    };
    return res.status(400).json(result);
  }
  const password = String(req.body.new_password);
  if (!User.strongPasswordReqMet(password)) {
    const result: PasswordResetConfirmationResponse = {
      response_status: {
        message: `The password does not meet the requirements.
8 <= Password length <= 100.
Password must not contain spaces.
Password must have at least 1 lowercase, 1 uppercase, 1 number and 1 speacial character symbol (!@#$&-).  
        `,
        success: false,
        status_code: 5,
      },
      submitted: { confirmation_code: confirmation_code, new_password: password },
    };
    return res.status(400).json(result);
  }
  try {
    const ex = await userExists(username);
    if (!ex) {
      const result: PasswordResetConfirmationResponse = {
        response_status: {
          message: `The username does not exist.`,
          success: false,
          status_code: 3,
        },
        submitted: { confirmation_code: confirmation_code, new_password: password },
      };
      return res.status(400).json(result);
    }
    const user = await getUser(username);
    if (user.confirmationCode !== confirmation_code) {
      const result: PasswordResetConfirmationResponse = {
        response_status: {
          message: `The confirmation code is incorrect.`,
          success: false,
          status_code: 4,
        },
        submitted: { confirmation_code: confirmation_code, new_password: password },
      };
      return res.status(400).json(result);
    }
    if (user.isValid(password)) {
      const result: PasswordResetConfirmationResponse = {
        response_status: {
          message: `The password is the same as your previous password(s). Please enter a different password.`,
          success: false,
          status_code: 6,
        },
        submitted: { confirmation_code: confirmation_code, new_password: password },
      };
      return res.status(400).json(result);
    }
    await user.changePassword(password);
    const result: PasswordResetConfirmationResponse = {
      response_status: {
        message: `The password has been succesfully changed.`,
        success: true,
        status_code: 10,
      },
      submitted: { confirmation_code: confirmation_code, new_password: password },
    };
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
}
