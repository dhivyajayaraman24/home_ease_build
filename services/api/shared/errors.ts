export type ApiErrorCode =
  | "authentication_required"
  | "invalid_token"
  | "forbidden"
  | "branch_scope_forbidden"
  | "audit_write_failed"
  | "internal_error";

export interface ApiErrorResponse {
  error: {
    code: ApiErrorCode;
    message: string;
    requestId?: string;
  };
}

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly statusCode: number;
  readonly safeMessage: string;

  constructor(code: ApiErrorCode, statusCode: number, safeMessage: string) {
    super(safeMessage);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = statusCode;
    this.safeMessage = safeMessage;
  }
}

export function authenticationRequired(message = "Authentication is required."): ApiError {
  return new ApiError("authentication_required", 401, message);
}

export function invalidToken(message = "The access token is invalid or expired."): ApiError {
  return new ApiError("invalid_token", 401, message);
}

export function forbidden(message = "You are not allowed to perform this action."): ApiError {
  return new ApiError("forbidden", 403, message);
}

export function branchScopeForbidden(message = "You are not assigned to the requested branch."): ApiError {
  return new ApiError("branch_scope_forbidden", 403, message);
}

export function auditWriteFailed(message = "The audit event could not be recorded."): ApiError {
  return new ApiError("audit_write_failed", 500, message);
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function toSafeError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  return new ApiError("internal_error", 500, "An unexpected error occurred.");
}

export function toApiErrorResponse(error: unknown, requestId?: string): ApiErrorResponse {
  const safeError = toSafeError(error);

  return {
    error: {
      code: safeError.code,
      message: safeError.safeMessage,
      ...(requestId ? { requestId } : {})
    }
  };
}
