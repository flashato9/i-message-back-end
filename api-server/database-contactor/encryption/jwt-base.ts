import jwt from "jsonwebtoken";
import { UserTuple } from "../models/internal-to-queries-interal/models";

export function generateJWT(user: UserTuple) {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  return jwt.sign(
    {
      email: user.email,
      username: user.username,
      expiryDate: expiry.getTime() / 1000,
    },
    <string>process.env.JWT_SECRET_KEY
  );
}
