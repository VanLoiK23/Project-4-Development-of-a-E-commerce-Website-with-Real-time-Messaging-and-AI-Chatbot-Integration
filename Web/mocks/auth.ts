/**
 * CHỈ LÀ DỮ LIỆU MOCK / FOR MOCK PURPOSES ONLY
 * Giả lập các tình huống xác thực để kiểm thử giao diện theo quy ước AGENTS.md.
 */

export const MOCK_ACCOUNTS = {
  // Đăng nhập thành công
  DEMO: {
    email: "demo@example.com",
    password: "Demo1234",
    fullName: "Nguyễn Văn Demo",
    role: "customer" as const,
  },
  // Tài khoản chưa xác thực email -> chuyển /register/verify
  UNVERIFIED: {
    email: "unverified@example.com",
    fullName: "Trần Chưa Kích Hoạt",
  },
  // Tài khoản bị tạm khóa 15 phút do nhập sai quá 5 lần
  LOCKED: {
    email: "locked@example.com",
  },
  // Kích hoạt lỗi máy chủ / mạng
  SERVER_ERROR: {
    email: "error@example.com",
  },
  // Email đã đăng ký ở form đăng ký
  TAKEN: {
    email: "taken@example.com",
  },
};

export const MOCK_OTP = {
  VALID_CODE: "123456",
  EXPIRED_CODE: "000000",
  MAX_ATTEMPTS: 5,
  EXPIRY_MINUTES: 5,
  RESEND_COOLDOWN_SECONDS: 60,
};

export const MOCK_TOKENS = {
  VALID: "valid-token",
  EXPIRED: "expired-token",
};

// Stateful in-memory mock store for dynamic behaviors (OTP attempts, etc.)
class MockAuthStore {
  private otpAttempts: Record<string, number> = {};

  getRemainingAttempts(email: string): number {
    const attempts = this.otpAttempts[email] || 0;
    return Math.max(0, MOCK_OTP.MAX_ATTEMPTS - attempts);
  }

  recordFailedAttempt(email: string): number {
    const current = (this.otpAttempts[email] || 0) + 1;
    this.otpAttempts[email] = current;
    return Math.max(0, MOCK_OTP.MAX_ATTEMPTS - current);
  }

  resetOtp(email: string) {
    this.otpAttempts[email] = 0;
  }
}

export const mockStore = new MockAuthStore();
