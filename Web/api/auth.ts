/**
 * Typed data-access functions for all authentication API calls using custom Axios instance.
 * Synchronized with Backend AuthController.java & Spring Boot REST API @ /api/auth.
 *
 * Backend Endpoints:
 *   POST /api/auth/login                → LoginResponse { token: { accessToken, tokenType, expiresIn }, user: AccountResponse }
 *   POST /api/auth/logout               → MessageResponse { message: "Đăng xuất thành công" }
 *   POST /api/auth/refresh              → { accessToken: string }
 *   POST /api/auth/register             → AccountResponse (HTTP 201)
 *   POST /api/auth/send-otp-check-email → { isSuccess: boolean }
 *   POST /api/auth/verify-otp           → { success: boolean }
 *   GET  /api/auth/account              → AccountResponse (requires Bearer <token>)
 *   POST /api/auth/forgot-password      → { success: boolean }
 *   POST /api/auth/reset-password       → { success: boolean }
 */

import axios from "../utils/axios.customize";
import {
  AccountResponse,
  ApiResponse,
  AuthError,
  AuthProvider,
  BackendErrorResponse,
  ForgotPasswordRequest,
  LoginParams,
  LoginRequest,
  LoginResponse,
  MessageResponse,
  RefreshTokenResponse,
  RegisterParams,
  RegisterRequest,
  RequestResetParams,
  ResendOtpParams,
  ResetPasswordParams,
  ResetPasswordRequest,
  SendOtpParams,
  SendOtpResponse,
  User,
  ValidateRequestDTO,
  VerifyOtpParams,
  VerifyOtpResponse,
} from "@/types/auth";

// ============================================================================
// 1. Constants & Token Storage
// ============================================================================

const ACCESS_TOKEN_KEY = "phone_shop_access_token";

/** Lấy Base URL của API, hỗ trợ client-side và server-side Next.js */
function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return (
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      axios.defaults.baseURL ||
      ""
    );
  }
  return (
    process.env.BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    axios.defaults.baseURL ||
    "http://localhost:8080"
  );
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    localStorage.setItem("access_token", token);
    document.cookie = `access_token=${encodeURIComponent(
      token
    )}; path=/; max-age=86400; SameSite=Lax`;
  } catch {
    console.log("err")
  }
}

export function removeAccessToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem("access_token");
    document.cookie = `access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  } catch {
    console.log("err")
  }
}

export function toUser(account: AccountResponse): User {
  return {
    id: account.id,
    email: account.email,
    fullName: account.fullName,
    username: account.username,
    role: account.role.toLowerCase() as "admin" | "customer",
    status: account.status,
    createdAt: account.createdAt
      ? typeof account.createdAt === "string"
        ? account.createdAt
        : (account.createdAt as Date).toISOString()
      : undefined,
    emailVerified: account.status === "ACTIVE",
  };
}

interface RejectedErrorPayload {
  message?: string | Record<string, string>;
  status?: number;
  statusCode?: number;
  code?: string;
  response?: {
    status?: number;
    data?: BackendErrorResponse | string;
  };
}

function toAuthError(error: unknown): AuthError {
  const err = (error && typeof error === "object"
    ? error
    : {}) as RejectedErrorPayload;

  const rawData =
    err.response?.data && typeof err.response.data === "object"
      ? err.response.data
      : (err as BackendErrorResponse);

  const status = err.response?.status ?? err.status ?? err.statusCode ?? 0;

  if (status === 0 && !err.message && !err.response) {
    return {
      code: "NETWORK_ERROR",
      message:
        "Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền và thử lại.",
    };
  }

  const rawMessage = rawData?.message ?? err.message;
  const backendMessage =
    typeof rawMessage === "string"
      ? rawMessage
      : rawMessage && typeof rawMessage === "object"
        ? Object.values(rawMessage).join("; ")
        : typeof err.response?.data === "string" && err.response.data.trim()
          ? err.response.data
          : "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";

  const validationErrors =
    rawMessage && typeof rawMessage === "object" ? rawMessage : undefined;

  let errorCode: AuthError["code"] = "UNKNOWN_ERROR";
  let userMessage = backendMessage;

  if (status === 406 || status === 401) {
    errorCode = "INVALID_CREDENTIALS";
    userMessage =
      backendMessage ||
      "Email/username hoặc mật khẩu không chính xác. Vui lòng thử lại.";
  } else if (status === 423) {
    errorCode = "ACCOUNT_LOCKED";
    userMessage =
      backendMessage ||
      "Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ hỗ trợ hoặc đặt lại mật khẩu.";
  } else if (status === 400) {
    const lower = backendMessage.toLowerCase();
    if (
      lower.includes("email") &&
      (lower.includes("exist") || lower.includes("đã tồn tại"))
    ) {
      errorCode = "EMAIL_TAKEN";
      userMessage = "Email này đã được đăng ký tài khoản.";
    } else if (lower.includes("otp") || lower.includes("mã xác thực")) {
      errorCode = "OTP_INVALID";
      userMessage = backendMessage || "Mã xác thực OTP không chính xác.";
    } else if (lower.includes("token") || lower.includes("expired")) {
      errorCode = "TOKEN_INVALID";
      userMessage =
        backendMessage ||
        "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.";
    } else if (validationErrors) {
      errorCode = "VALIDATION_ERROR";
      userMessage =
        Object.values(validationErrors)[0] || "Dữ liệu không hợp lệ.";
    } else {
      errorCode = "VALIDATION_ERROR";
    }
  } else if (status === 404) {
    const lower = backendMessage.toLowerCase();
    if (lower.includes("refresh")) {
      errorCode = "TOKEN_EXPIRED";
      userMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
    } else if (lower.includes("not found")) {
      errorCode = "USER_NOT_FOUND";
      userMessage = backendMessage || "Không tìm thấy thông tin tài khoản.";
    }
  }

  return {
    code: errorCode,
    message: userMessage,
    validationErrors,
  };
}

function authHeaders(): { headers?: Record<string, string> } {
  const token = getAccessToken();
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}


export async function login(params: LoginParams): Promise<ApiResponse<User>> {
  const credential = (params.userNameOrEmail ?? params.email ?? "").trim();
  const payload: LoginRequest = {
    userNameOrEmail: credential,
    password: params.password,
  };

  try {
    const res = await axios.post<LoginResponse>("auth/login", payload);
    if (res.data.token?.accessToken) {
      setAccessToken(res.data.token.accessToken);
    }
    return {
      ok: true,
      data: toUser(res.data.user),
    };
  } catch (error) {
    return { ok: false, error: toAuthError(error) };
  }
}

export async function register(
  params: RegisterParams
): Promise<ApiResponse<{ email: string; account: AccountResponse }>> {
  const payload: RegisterRequest = {
    firstName: params.firstName.trim(),
    lastName: params.lastName.trim(),
    phone: params.phone.trim(),
    email: params.email.trim(),
    ngaySinh: params.ngaySinh,
    gender: params.gender,
    password: params.password,
  };

  try {
    const res = await axios.post<AccountResponse>(
      "auth/register",
      payload
    );

    try {
      await sendOtpCheckEmail({ email: payload.email });
    } catch {
      // Không chặn luồng đăng ký nếu gửi mail gặp độ trễ
    }

    return {
      ok: true,
      data: {
        email: res.data.email,
        account: res.data,
      },
    };
  } catch (error) {
    return { ok: false, error: toAuthError(error) };
  }
}

export async function sendOtpCheckEmail(
  params: ValidateRequestDTO | SendOtpParams
): Promise<ApiResponse<SendOtpResponse>> {
  const payload: ValidateRequestDTO = {
    email: params.email.trim(),
    otp: params.otp,
  };

  try {
    const res = await axios.post<SendOtpResponse>(
      "auth/send-otp-check-email",
      payload
    );
    return { ok: true, data: res.data };
  } catch (error) {
    return { ok: false, error: toAuthError(error) };
  }
}

export async function resendOtp(
  params: ResendOtpParams
): Promise<ApiResponse<{ resent: boolean }>> {
  const res = await sendOtpCheckEmail({ email: params.email });
  if (!res.ok) {
    return { ok: false, error: res.error };
  }
  return { ok: true, data: { resent: res.data.isSuccess } };
}

export async function verifyOtp(
  params: VerifyOtpParams
): Promise<ApiResponse<{ verified: boolean }>> {
  const otpValue = (params.otp ?? params.code ?? "").trim();

  if (!otpValue) {
    return {
      ok: false,
      error: {
        code: "OTP_INVALID",
        message: "Vui lòng nhập đầy đủ mã xác thực 6 số.",
      },
    };
  }

  const payload: ValidateRequestDTO = {
    email: params.email.trim(),
    otp: otpValue,
  };

  try {
    const res = await axios.post<VerifyOtpResponse>(
      "auth/verify-otp",
      payload
    );

    if (!res.data.success) {
      return {
        ok: false,
        error: {
          code: "OTP_INVALID",
          message: "Mã xác thực không đúng hoặc đã hết hạn. Vui lòng thử lại.",
        },
      };
    }

    return { ok: true, data: { verified: true } };
  } catch (error) {
    return { ok: false, error: toAuthError(error) };
  }
}

export async function requestPasswordReset(
  params: RequestResetParams | ForgotPasswordRequest
): Promise<ApiResponse<{ sent: boolean }>> {
  const payload: ForgotPasswordRequest = {
    email: params.email.trim(),
  };

  try {
    const res = await axios.post<{ success: boolean }>(
      "auth/forgot-password",
      payload
    );
    return { ok: true, data: { sent: res.data.success } };
  } catch (error) {
    return { ok: false, error: toAuthError(error) };
  }
}

export async function verifyResetToken(
  token?: string | null
): Promise<ApiResponse<{ valid: boolean }>> {
  if (!token || token.trim().length === 0) {
    return {
      ok: false,
      error: {
        code: "TOKEN_INVALID",
        message: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
      },
    };
  }

  return { ok: true, data: { valid: true } };
}


export async function resetPassword(
  params: ResetPasswordParams
): Promise<ApiResponse<{ success: boolean }>> {
  const payload: ResetPasswordRequest = {
    token: params.token,
    password: params.password,
  };

  try {
    const res = await axios.post<{ success: boolean }>(
      "auth/reset-password",
      payload
    );
    return { ok: true, data: { success: res.data.success } };
  } catch (error) {
    return { ok: false, error: toAuthError(error) };
  }
}

export async function getAccount(): Promise<ApiResponse<AccountResponse>> {
  try {
    const res = await axios.get<AccountResponse>(
      "auth/account",
      authHeaders()
    );
    return { ok: true, data: res.data };
  } catch (error) {
    return { ok: false, error: toAuthError(error) };
  }
}

export async function logout(): Promise<void> {
  try {
    await axios.post<MessageResponse>("auth/logout", {}, authHeaders());
  } catch {
  } finally {
    removeAccessToken();
  }
}

export async function refreshAccessToken(): Promise<
  ApiResponse<RefreshTokenResponse>
> {
  try {
    const res = await axios.post<RefreshTokenResponse>("auth/refresh", {});
    if (res.data.accessToken) {
      setAccessToken(res.data.accessToken);
    }
    return { ok: true, data: res.data };
  } catch (error) {
    removeAccessToken();
    return { ok: false, error: toAuthError(error) };
  }
}

export async function getAuthProviders(): Promise<AuthProvider[]> {
  return [{ id: "google", name: "Google", isDefault: true }];
}

export async function loginWithSocial(
  providerId: string
): Promise<ApiResponse<User>> {
  if (providerId === "google") {
    if (typeof window !== "undefined") {
      window.location.href = `${getBaseUrl()}/oauth2/authorization/google`;
    }
    return {
      ok: true,
      data: {
        id: "oauth_redirect",
        email: "",
        fullName: "",
        role: "customer",
      },
    };
  }

  return {
    ok: false,
    error: {
      code: "UNKNOWN_ERROR",
      message: "Phương thức đăng nhập không được hỗ trợ.",
    },
  };
}