import { use } from "passport";
import { Strategy } from "passport-local";
import { userExists } from "../../../database-contactor/queries-for-controller/read";
import { getUser } from "../../../database-contactor/queries-for-controller/user";

export const passportConfig = use(
  new Strategy({}, async (username, password, done) => {
    try {
      const ex = await userExists(username);
      if (!ex) return done(null, false, { message: "Username does not exist" });
      const user = await getUser(username);
      if (!user.codeConfirmed) return done(null, false, { message: `User account is not confirmed` });
      if (!user.isValid(password)) return done(null, false, { message: `Password is incorrect` });
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);
