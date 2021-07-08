import { NextFunction, Request, Response } from "express";
import { createUser } from "../../database-contactor/queries-for-controller/create";
import { getUser } from "../../database-contactor/queries-for-controller/user";

export async function signUpPost(req: Request, res: Response, next: NextFunction) {
  if (!req.body.username || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields are required. Please submit username,email and password" });
  }
  try {
    const user = { username: req.body.username, email: req.body.email, password: req.body.password };
    await createUser(user);
    const userInDB = await getUser(user.username);
    await userInDB.sendConfirmationCode();
    return res.status(200).json({
      submitted: user,
      message: { one: "User account has been created.", two: `Confirmation code has been sent to "${userInDB.email}".` },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
}
