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

///From Front-end
////INTERFACES
//HTTP
export interface HttpError {
  code: string;
  message: string;
}

export interface HttpStatusResponse {
  success: boolean;
  status_code: number;
  message: string;
}
//Sign-In
export interface SignInRequest {
  username: string;
  password: string;
}
export interface SignInResponse {
  submitted: SignInRequest;
  response_status: HttpStatusResponse;
  payload: string;
}
//Password Reset
export interface PasswordResetCodeCredentials {
  username: string;
}
export type PasswordResetCodeRequest = PasswordResetCodeCredentials;
export interface PasswordResetCodeResponse {
  submitted: PasswordResetCodeRequest;
  response_status: HttpStatusResponse;
}
export interface PasswordResetConfirmCredentials {
  username: string;
}
export interface PasswordResetConfirmationRequest {
  confirmation_code: number;
  new_password: string;
}
export interface PasswordResetConfirmationResponse {
  submitted: PasswordResetConfirmationRequest;
  response_status: HttpStatusResponse;
}
//Sign Up
export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}
export interface SignUpResponse {
  submitted: SignUpRequest;
  response_status: HttpStatusResponse;
}
export interface SignUpConfirmationCodeCredentials {
  username: string;
}
export interface SignUpConfirmationGetCodeResponse {
  submitted: null;
  response_status: HttpStatusResponse;
}
export interface SignUpConfirmationSubmitCodeResponse {
  submitted: SignUpConfirmationCodeRequest;
  response_status: HttpStatusResponse;
}
export interface SignUpConfirmationCodeRequest {
  confirmation_code: number;
}
