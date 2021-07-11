import { use } from "passport";
import { Strategy } from "passport-local";
import { SignInResponse } from "../../../database-contactor/models/can-be-exposed/models";
import { userExists } from "../../../database-contactor/queries-for-controller/read";
import { getUser } from "../../../database-contactor/queries-for-controller/user";

export const passportConfig = use(
  new Strategy({}, async (username, password, done) => {
    try {
      const ex = await userExists(username);
      if (!ex) {
        const result: SignInResponse = {
          submitted: { password: password, username: username },
          payload: "",
          response_status: { status_code: 0, success: false, message: "The username does not exist." },
        };
        return done(null, result, { message: result.response_status.message });
      }

      const user = await getUser(username);
      if (!user.codeConfirmed) {
        const result: SignInResponse = {
          submitted: { password: password, username: username },
          payload: "",
          response_status: {
            status_code: 2,
            success: false,
            message: "The account associated with the username is not confirmed.",
          },
        };
        return done(null, result, { message: result.response_status.message });
      }

      if (!user.isValid(password)) {
        const result: SignInResponse = {
          submitted: { password: password, username: username },
          payload: "",
          response_status: { status_code: 1, success: false, message: "The password is incorrect" },
        };
        return done(null, result, { message: result.response_status.message });
      }
      const result: SignInResponse = {
        submitted: { password: password, username: username },
        payload: user.jwt,
        response_status: { status_code: 10, success: true, message: "Succesfuly signed in. Welcome! Here is your token." },
      };
      return done(null, result);
    } catch (error: any) {
      const userError: SignInResponse = {
        submitted: { password: password, username: username },
        payload: "",
        response_status: { status_code: 0, success: false, message: error.message },
      };
      return done(userError);
    }
  })
);
