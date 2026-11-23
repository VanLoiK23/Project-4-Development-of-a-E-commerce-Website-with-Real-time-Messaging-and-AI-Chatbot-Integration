/**
 * CHỈ LÀ DỮ LIỆU MOCK / FOR MOCK PURPOSES ONLY
 * Toàn bộ hàm gọi API xác thực có độ trễ giả lập ~700ms.
 * Khi kết nối với Spring REST thật, chỉ cần thay đổi nội dung file này.
 */

import {
  ApiResponse,
  AuthProvider,
  LoginParams,
  RegisterParams,
  RequestResetParams,
  ResendOtpParams,
  ResetPasswordParams,
  User,
  VerifyOtpParams,
} from "@/types/auth";
import {
  MOCK_ACCOUNTS,
  MOCK_OTP,
  MOCK_TOKENS,
  mockStore,
} from "@/mocks/auth";

const ARTIFICIAL_DELAY = 700;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login(params: LoginParams): Promise<ApiResponse<User>> {
  await sleep(ARTIFICIAL_DELAY);

  const emailLower = params.email.trim().toLowerCase();

  // 1. Kiểm tra kịch bản lỗi mạng / máy chủ
  if (emailLower === MOCK_ACCOUNTS.SERVER_ERROR.email) {
    return {
      ok: false,
      error: {
        code: "NETWORK_ERROR",
        message: "Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền và thử lại.",
      },
    };
  }

  // 2. Kịch bản tài khoản bị tạm khóa
  if (emailLower === MOCK_ACCOUNTS.LOCKED.email) {
    return {
      ok: false,
      error: {
        code: "ACCOUNT_LOCKED",
        message: "Tài khoản tạm khóa 15 phút do nhập sai nhiều lần. Hãy sử dụng chức năng đặt lại mật khẩu hoặc thử lại sau.",
        lockDurationMinutes: 15,
      },
    };
  }

  // 3. Kịch bản tài khoản chưa xác thực email
  if (emailLower === MOCK_ACCOUNTS.UNVERIFIED.email) {
    mockStore.resetOtp(emailLower);
    return {
      ok: false,
      error: {
        code: "EMAIL_UNVERIFIED",
        message: "Tài khoản chưa được xác thực email. Mã xác thực mới đã được gửi tới email của bạn.",
      },
    };
  }

  // 4. Kịch bản tài khoản demo thành công
  if (
    emailLower === MOCK_ACCOUNTS.DEMO.email &&
    params.password === MOCK_ACCOUNTS.DEMO.password
  ) {
    return {
      ok: true,
      data: {
        id: "usr_demo_1",
        email: MOCK_ACCOUNTS.DEMO.email,
        fullName: MOCK_ACCOUNTS.DEMO.fullName,
        role: MOCK_ACCOUNTS.DEMO.role,
        emailVerified: true,
      },
    };
  }

  // 5. Thông tin sai chung (không tiết lộ email tồn tại hay không)
  return {
    ok: false,
    error: {
      code: "INVALID_CREDENTIALS",
      message: "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.",
    },
  };
}

export async function register(
  params: RegisterParams
): Promise<ApiResponse<{ email: string }>> {
  await sleep(ARTIFICIAL_DELAY);

  const emailLower = params.email.trim().toLowerCase();

  if (emailLower === MOCK_ACCOUNTS.SERVER_ERROR.email) {
    return {
      ok: false,
      error: {
        code: "NETWORK_ERROR",
        message: "Không thể kết nối tới máy chủ. Vui lòng thử lại sau.",
      },
    };
  }

  if (emailLower === MOCK_ACCOUNTS.TAKEN.email || emailLower === MOCK_ACCOUNTS.DEMO.email) {
    return {
      ok: false,
      error: {
        code: "EMAIL_TAKEN",
        message: "Email này đã được đăng ký tài khoản.",
        field: "email",
      },
    };
  }

  // Khởi tạo trạng thái OTP cho email mới
  mockStore.resetOtp(emailLower);

  return {
    ok: true,
    data: {
      email: emailLower,
    },
  };
}

export async function verifyOtp(
  params: VerifyOtpParams
): Promise<ApiResponse<{ verified: boolean }>> {
  await sleep(ARTIFICIAL_DELAY);

  const emailLower = params.email.trim().toLowerCase();
  const code = params.code.trim();

  if (emailLower === MOCK_ACCOUNTS.SERVER_ERROR.email) {
    return {
      ok: false,
      error: {
        code: "NETWORK_ERROR",
        message: "Lỗi kết nối khi xác thực mã. Vui lòng thử lại.",
      },
    };
  }

  const remaining = mockStore.getRemainingAttempts(emailLower);
  if (remaining <= 0) {
    return {
      ok: false,
      error: {
        code: "OTP_ATTEMPTS_EXCEEDED",
        message: "Bạn đã nhập sai mã quá 5 lần. Mã đã bị vô hiệu hóa, vui lòng nhấn Gửi lại mã mới.",
      },
    };
  }

  if (code === MOCK_OTP.EXPIRED_CODE) {
    return {
      ok: false,
      error: {
        code: "OTP_EXPIRED",
        message: "Mã xác thực đã hết hạn (hiệu lực 5 phút). Vui lòng yêu cầu mã mới.",
      },
    };
  }

  if (code === MOCK_OTP.VALID_CODE) {
    mockStore.resetOtp(emailLower);
    return {
      ok: true,
      data: { verified: true },
    };
  }

  // Mã sai: tính lại số lần
  const left = mockStore.recordFailedAttempt(emailLower);
  if (left <= 0) {
    return {
      ok: false,
      error: {
        code: "OTP_ATTEMPTS_EXCEEDED",
        message: "Bạn đã nhập sai mã quá 5 lần. Mã xác thực đã bị khóa, hãy nhấn Gửi lại mã mới.",
      },
    };
  }

  return {
    ok: false,
    error: {
      code: "OTP_INVALID",
      message: `Mã xác thực không đúng. Bạn còn ${left} lần thử.`,
      remainingAttempts: left,
    },
  };
}

export async function resendOtp(
  params: ResendOtpParams
): Promise<ApiResponse<{ resent: boolean }>> {
  await sleep(ARTIFICIAL_DELAY);

  const emailLower = params.email.trim().toLowerCase();
  if (emailLower === MOCK_ACCOUNTS.SERVER_ERROR.email) {
    return {
      ok: false,
      error: {
        code: "NETWORK_ERROR",
        message: "Không thể gửi lại mã do lỗi mạng. Vui lòng thử lại.",
      },
    };
  }

  mockStore.resetOtp(emailLower);
  return {
    ok: true,
    data: { resent: true },
  };
}

export async function requestPasswordReset(
  params: RequestResetParams
): Promise<ApiResponse<{ sent: boolean }>> {
  await sleep(ARTIFICIAL_DELAY);

  const emailLower = params.email.trim().toLowerCase();
  if (emailLower === MOCK_ACCOUNTS.SERVER_ERROR.email) {
    return {
      ok: false,
      error: {
        code: "NETWORK_ERROR",
        message: "Không thể xử lý yêu cầu lúc này. Vui lòng thử lại sau.",
      },
    };
  }

  // Luôn trả về thành công với thông báo chung (chống enumeration email)
  return {
    ok: true,
    data: { sent: true },
  };
}

export async function verifyResetToken(
  token?: string | null
): Promise<ApiResponse<{ valid: boolean }>> {
  await sleep(400);

  if (!token) {
    return {
      ok: false,
      error: {
        code: "TOKEN_INVALID",
        message: "Liên kết không hợp lệ hoặc đã hết hạn.",
      },
    };
  }

  if (token === MOCK_TOKENS.VALID) {
    return {
      ok: true,
      data: { valid: true },
    };
  }

  if (token === MOCK_TOKENS.EXPIRED) {
    return {
      ok: false,
      error: {
        code: "TOKEN_EXPIRED",
        message: "Liên kết đặt lại mật khẩu đã hết hạn (hiệu lực 30 phút).",
      },
    };
  }

  return {
    ok: false,
    error: {
      code: "TOKEN_INVALID",
      message: "Liên kết không hợp lệ hoặc đã hết hạn.",
    },
  };
}

export async function resetPassword(
  params: ResetPasswordParams
): Promise<ApiResponse<{ success: boolean }>> {
  await sleep(ARTIFICIAL_DELAY);

  if (params.token !== MOCK_TOKENS.VALID) {
    return {
      ok: false,
      error: {
        code: "TOKEN_INVALID",
        message: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
      },
    };
  }

  return {
    ok: true,
    data: { success: true },
  };
}

export async function getAuthProviders(): Promise<AuthProvider[]> {
  return [
    {
      id: "google",
      name: "Google",
      isDefault: true,
    },
  ];
}

export async function loginWithSocial(
  providerId: string
): Promise<ApiResponse<User>> {
  await sleep(ARTIFICIAL_DELAY);

  if (providerId === "google") {
    return {
      ok: true,
      data: {
        id: "usr_google_1",
        email: "google.user@example.com",
        fullName: "Google Test User",
        role: "customer",
        emailVerified: true,
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
