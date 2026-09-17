export type ApiErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'INVALID_STATUS'
  | 'INVALID_TRANSITION'
  | 'INVALID_DATE'
  | 'ALREADY_EXISTS'
  | 'RATE_LIMITED'
  | 'DATABASE_ERROR'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  code: ApiErrorCode;
  status: number;
  details?: any;

  constructor(code: ApiErrorCode, message: string, status = 400, details?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}
