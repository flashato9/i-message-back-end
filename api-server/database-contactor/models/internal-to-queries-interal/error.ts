export interface DatabaseError {
  code: DatabaseErrorCode;
  message: string;
}
export enum DatabaseErrorCode {
  NO_SUCH_USER,
}
