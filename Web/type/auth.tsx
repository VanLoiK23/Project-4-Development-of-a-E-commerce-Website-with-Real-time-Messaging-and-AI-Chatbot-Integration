/**
 * Contract Authentication Types synchronized from Backend AuthController.java & DTOs.
 * Backend Controller: com.thuongmaidientu.api.web.AuthController (@RequestMapping("/api/auth"))
 */

// ============================================================================
// 1. Backend Enums & Primitives
// ============================================================================

export type AccountRole = "ADMIN" | "CUSTOMER" | "admin" | "customer";
export type AccountStatus = "ACTIVE" | "LOCKED" | "active" | "locked";
export type Gender = "MALE" | "FEMALE" | "OTHER" | "Nam" | "Nữ" | "Khác";

// ============================================================================
// 2. Request DTOs (Mapped directly from com.thuongmaidientu.dto.request.*)
// ============================================================================

/**
 * com.thuongmaidientu.dto.request.LoginRequest
 * Validation in BE:
 * - userNameOrEmail: @NotBlank @Email
 * - password: @NotBlank
 */
export interface LoginRequest {
  userNameOrEmail: string;
  password: string;
}

/**
 * com.thuongmaidientu.dto.request.RegisterRequest
 * Validation in BE:
 * - firstName: @NotBlank
 * - lastName: @NotBlank
 * - phone: @NotBlank @Pattern(regexp = "^(0|\\+84)[0-9]{9}$")
 * - email: @NotBlank @Email
 * - ngaySinh: @NotNull @Past @JsonFormat(pattern = "yyyy-MM-dd")
 * - gender: @NotBlank @Pattern(regexp = "^(MALE|FEMALE|OTHER|Nam|Nữ|Khác)$")
 * - password: @NotBlank @Size(min = 8)
 */
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  ngaySinh: string; // ISO yyyy-MM-dd
  gender: Gender | string;
  password: string;
}

/**
 * com.thuongmaidientu.dto.request.ValidateRequestDTO
 * Dùng cho cả 2 endpoint:
 * - POST /api/auth/send-otp-check-email (@NotBlank @Email email, otp optional)
 * - POST /api/auth/verify-otp (@NotBlank @Email email, @NotBlank otp)
 */
export interface ValidateRequestDTO {
  email: string;
  otp?: string;
}

/**
 * com.thuongmaidientu.dto.request.ForgotPasswordRequest
 * Validation in BE:
 * - email: @NotBlank @Email
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * com.thuongmaidientu.dto.request.ResetPasswordRequest
 * Validation in BE:
 * - token: string
 * - password: string
 */
export interface ResetPasswordRequest {
  token: string;
  password: string;
}

// ============================================================================
// 3. Response DTOs (Mapped directly from com.thuongmaidientu.dto.response.*)
// ============================================================================

/**
 * com.thuongmaidientu.dto.response.TokenResponse
 */
export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType: string; // default "Bearer"
  expiresIn: number; // in seconds
}

/**
 * com.thuongmaidientu.dto.response.AccountResponse
 */
export interface AccountResponse {
  id: number;
  fullName: string;
  email: string;
  username: string;
  role: "ADMIN" | "CUSTOMER";
  status: "ACTIVE" | "LOCKED";
  createdAt: string | Date;
}

/**
 * com.thuongmaidientu.dto.response.LoginResponse
 */
export interface LoginResponse {
  token: TokenResponse;
  user: AccountResponse;
}

/**
 * com.thuongmaidientu.dto.response.MessageResponse
 * Trả về từ POST /api/auth/logout: { message: "Đăng xuất thành công" }
 */
export interface MessageResponse {
  message: string;
}

/**
 * Map.of("accessToken", authService.refreshToken(refreshToken))
 * Trả về từ POST /api/auth/refresh
 */
export interface RefreshTokenResponse {
  accessToken: string;
}

/**
 * Map.of("isSuccess", isSuccess)
 * Trả về từ POST /api/auth/send-otp-check-email
 */
export interface SendOtpResponse {
  isSuccess: boolean;
}

/**
 * Map.of("success", success)
 * Trả về từ POST /api/auth/verify-otp
 */
export interface VerifyOtpResponse {
  success: boolean;
}

/**
 * Map.of("success", success) từ forgot-password & reset-password
 */
export interface SuccessResponse {
  success: boolean;
}

export type ForgotPasswordResponse = SuccessResponse;
export type ResetPasswordResponse = SuccessResponse;

/**
 * com.thuongmaidientu.dto.response.ErrorResponse<T>
 * Chuẩn lỗi trả về từ GlobalHandlerException bên Backend
 */
export interface BackendErrorResponse<T = string | Record<string, string>> {
  timestamp?: string;
  status?: number;
  error?: string;
  message: T;
}

// ============================================================================
// 4. Frontend Application & Client Flow Types
// ============================================================================

export type AuthMode = "login" | "register";

export interface User {
  id: string | number;
  email: string;
  fullName: string;
  username?: string;
  phone?: string;
  role: "customer" | "admin" | "ADMIN" | "CUSTOMER";
  status?: "ACTIVE" | "LOCKED" | "active" | "locked";
  emailVerified?: boolean;
  createdAt?: string | Date;
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
    | "VALIDATION_ERROR"
    | "USER_NOT_FOUND"
    | "UNKNOWN_ERROR";
  message: string;
  remainingAttempts?: number;
  lockDurationMinutes?: number;
  field?: string;
  validationErrors?: Record<string, string>;
}

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: AuthError };

/**
 * Flexible LoginParams: can receive userNameOrEmail or email (auto-mapped).
 */
export interface LoginParams {
  userNameOrEmail?: string;
  email?: string;
  password: string;
}

/**
 * RegisterParams: supports full BE RegisterRequest plus client confirmation & terms.
 */
export interface RegisterParams extends Partial<RegisterRequest> {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  ngaySinh: string;
  gender: Gender | string;
  password: string;
  confirmPassword?: string;
  acceptedTerms?: boolean;
  fullName?: string;
}

/**
 * Parameters for sending OTP (ValidateRequestDTO mapping)
 */
export interface SendOtpParams {
  email: string;
  otp?: string;
}

/**
 * Parameters for verifying OTP (ValidateRequestDTO mapping)
 */
export interface VerifyOtpParams {
  email: string;
  otp?: string;
  code?: string;
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
