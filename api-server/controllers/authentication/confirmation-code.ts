import { NextFunction, Request, Response } from "express";
import { userExists } from "../../database-contactor/queries-for-controller/read";
import { getUser } from "../../database-contactor/queries-for-controller/user";

export async function signUpConfirmationCodeGet(req: Request, res: Response, next: NextFunction) {
  const username = req.params.username;
  try {
    const ex = await userExists(username);
    if (!ex) return res.json({ message: "Username does not exist" });
    const user = await getUser(username);
    if (user.codeConfirmed) return res.status(400).json({ message: "User acocunt is already confirmed" });
    await user.sendConfirmationCode();
    return res.status(200).json({ message: `Confirmation code has been sent to,  "${user.email}".` });
  } catch (error) {
    return res.status(500).json(error);
  }
}
export async function resetPasswordConfirmationCodeGet(req: Request, res: Response, next: NextFunction) {
  const username = req.params.username;
  try {
    const ex = await userExists(username);
    if (!ex) return res.json({ message: "Username does not exist" });
    const user = await getUser(username);
    await user.sendConfirmationCode();
    return res.status(200).json({ message: `Password reset code has been sent to,  "${user.email}".` });
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function signUpConfirmationCodePost(req: Request, res: Response, next: NextFunction) {
  const username = req.params.username;
  if (!req.body.confirmation_code)
    return res.status(400).json({ message: `All fields are required. Please submit "confirmation_code"` });
  const confirmation_code = parseInt(req.body.confirmation_code);
  if (isNaN(confirmation_code)) return res.status(400).json({ message: `Confirmation code is not a valid integer.` });
  try {
    const ex = await userExists(username);
    if (!ex) return res.json({ message: "Username does not exist" });
    const user = await getUser(username);
    if (user.codeConfirmed) return res.status(400).json({ message: "User acocunt is already confirmed" });
    if (user.confirmationCode !== confirmation_code) return res.status(400).json({ message: "Confirmation code is incorrect" });

    await user.setCodeConfirmed();
    return res.status(200).json({ message: `User successfuly confirmed.` });
  } catch (error) {
    return res.status(500).json(error);
  }
}
export async function resetPasswordPost(req: Request, res: Response, next: NextFunction) {
  const username = req.params.username;
  if (!req.body.confirmation_code || !req.body.password)
    return res.status(400).json({ message: `All fields are required. Please submit both "confirmation_code" and "passsword"` });
  const confirmation_code = parseInt(req.body.confirmation_code);
  if (isNaN(confirmation_code)) return res.status(400).json({ message: `Confirmation code is not a valid integer.` });
  const password = String(req.body.password);
  try {
    const ex = await userExists(username);
    if (!ex) return res.json({ message: "Username does not exist" });
    const user = await getUser(username);
    if (user.confirmationCode !== confirmation_code) return res.status(400).json({ message: "Confirmation code is incorrect" });
    await user.changePassword(password);
    return res.status(200).json({ message: `User password was successfuly changed.` });
  } catch (error) {
    return res.status(500).json(error);
  }
}
