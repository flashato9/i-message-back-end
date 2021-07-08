export interface TempError {
  code: TempFailureCode;
  message: string;
}
export enum TempFailureCode {
  NO_SUCH_USER,
  USER_NOT_CONFIRMED,
  INCORRECT_PASSWORD,
  ALREADY_CONFIRMED,
}
