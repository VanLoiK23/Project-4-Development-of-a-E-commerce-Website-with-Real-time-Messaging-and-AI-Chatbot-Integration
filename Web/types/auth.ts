/**
 * Shared types for authentication flows.
 */

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: "customer" | "admin";
  emailVerified: boolean;
}

export interface AuthError {
  code:
    | "INVALID_CREDENTIALS"
    | "ACCOUNT_LOCKED"
    | "EMAIL_UNVERIFIED"
    | "EMAIL_TAKEN"
    | "OTP_INVALID"
    | "OTP_EXPIRED"
    | "OTP_ATTEMPTS_EXCEEDED"
    | "TOKEN_INVALID"
    | "TOKEN_EXPIRED"
    | "NETWORK_ERROR"
    | "UNKNOWN_ERROR";
  message: string;
  remainingAttempts?: number;
  lockDurationMinutes?: number;
  field?: string;
}

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: AuthError };

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface VerifyOtpParams {
  email: string;
  code: string;
}

export interface ResendOtpParams {
  email: string;
}

export interface RequestResetParams {
  email: string;
}

export interface ResetPasswordParams {
  token: string;
  password: string;
}

export interface AuthProvider {
  id: "google";
  name: string;
  isDefault: boolean;
}
