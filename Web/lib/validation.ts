/**
 * Pure validation functions for authentication and user inputs.
 * Returns an error message string if invalid, or null if valid.
 */

export function validateEmail(email: string): string | null {
  const trimmed = email ? email.trim() : "";
  if (!trimmed) {
    return "Vui lòng nhập địa chỉ email";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return "Địa chỉ email không đúng định dạng (ví dụ: ten@domain.com)";
  }
  return null;
}

export function validatePhoneVN(phone?: string): string | null {
  if (!phone || !phone.trim()) {
    // Phone is optional in registration
    return null;
  }
  const cleaned = phone.replace(/[\s.-]/g, "");
  const vnPhoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
  if (!vnPhoneRegex.test(cleaned)) {
    return "Số điện thoại không đúng định dạng Việt Nam (ví dụ: 0912345678)";
  }
  return null;
}

export interface PasswordRules {
  minLength: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
}

export function checkPasswordRequirements(password: string): PasswordRules {
  return {
    minLength: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return "Vui lòng nhập mật khẩu";
  }
  const rules = checkPasswordRequirements(password);
  if (!rules.minLength) {
    return "Mật khẩu phải có ít nhất 8 ký tự";
  }
  if (!rules.hasLetter || !rules.hasNumber) {
    return "Mật khẩu phải chứa ít nhất một chữ cái và một chữ số";
  }
  return null;
}

export function validatePasswordMatch(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) {
    return "Vui lòng nhập lại mật khẩu";
  }
  if (password !== confirmPassword) {
    return "Mật khẩu nhập lại không khớp";
  }
  return null;
}

export function validateFullName(name: string): string | null {
  const trimmed = name ? name.trim() : "";
  if (!trimmed) {
    return "Vui lòng nhập họ và tên";
  }
  if (trimmed.length < 2) {
    return "Họ và tên phải có ít nhất 2 ký tự";
  }
  return null;
}

export function validateOtp(code: string): string | null {
  const trimmed = code ? code.trim() : "";
  if (!trimmed) {
    return "Vui lòng nhập mã xác thực gồm 6 chữ số";
  }
  if (!/^[0-9]{6}$/.test(trimmed)) {
    return "Mã xác thực phải gồm đúng 6 chữ số";
  }
  return null;
}

export function validateTerms(accepted: boolean): string | null {
  if (!accepted) {
    return "Bạn cần đồng ý với Điều khoản sử dụng và Chính sách bảo mật để tiếp tục";
  }
  return null;
}
