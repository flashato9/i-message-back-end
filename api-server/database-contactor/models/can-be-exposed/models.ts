export interface UserSignUpCred {
  username: string;
  email: string;
  password: string;
}
export interface UserSignInCred {
  username: string;
  password: string;
}
export interface AuthenticatedUserCred {
  username: string;
  email: string;
  password: string;
  jwt: string;
}
