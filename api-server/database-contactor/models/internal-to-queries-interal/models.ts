export interface UserTuple {
  username: string;
  email: string;
  password_hash: string;
  password_salt: string;
  confirmation_code: number;
  code_confirmed: boolean;
}
export interface UserTuplePartial {
  username?: string;
  email?: string;
  password_hash?: string;
  password_salt?: string;
  confirmation_code?: number;
  code_confirmed?: boolean;
}
