import crypto from "crypto";
export function generatePasswordHash(password: string, password_salt: string) {
  return crypto.pbkdf2Sync(password, password_salt, 1000, 64, "sha512").toString("hex");
}
export function generatePasswordSalt() {
  return crypto.randomBytes(16).toString("hex");
}
