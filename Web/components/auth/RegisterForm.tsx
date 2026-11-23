"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/ui/TextField";
import { PasswordField } from "@/components/ui/PasswordField";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { AuthStepper } from "@/components/auth/AuthStepper";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { register } from "@/api/auth";
import {
  validateEmail,
  validateFullName,
  validatePassword,
  validatePasswordMatch,
  validatePhoneVN,
  validateTerms,
} from "@/lib/validation";

/**
 * Client Component RegisterForm (Step 1/2).
 * Validates full name, email, optional phone, password checklist, and required terms checkbox.
 * Saves email into sessionStorage and navigates to /register/verify upon completion.
 */
export function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState<{
    fullName?: string | null;
    email?: string | null;
    phone?: string | null;
    password?: string | null;
    confirmPassword?: string | null;
    acceptedTerms?: string | null;
    server?: string | null;
  }>({});

  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTakenEmail, setIsTakenEmail] = useState(false);

  const validateAll = () => {
    const errs = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      phone: validatePhoneVN(formData.phone),
      password: validatePassword(formData.password),
      confirmPassword: validatePasswordMatch(formData.password, formData.confirmPassword),
      acceptedTerms: validateTerms(formData.acceptedTerms),
    };
    return errs;
  };

  const handleBlur = (field: keyof typeof formData) => {
    if (field === "fullName") {
      setErrors((p) => ({ ...p, fullName: validateFullName(formData.fullName) }));
    } else if (field === "email") {
      setErrors((p) => ({ ...p, email: validateEmail(formData.email) }));
    } else if (field === "phone") {
      setErrors((p) => ({ ...p, phone: validatePhoneVN(formData.phone) }));
    } else if (field === "password") {
      setErrors((p) => ({ ...p, password: validatePassword(formData.password) }));
    } else if (field === "confirmPassword") {
      setErrors((p) => ({
        ...p,
        confirmPassword: validatePasswordMatch(formData.password, formData.confirmPassword),
      }));
    }
  };

  const handleChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsTakenEmail(false);

    if (hasSubmittedOnce) {
      if (field === "fullName") {
        setErrors((p) => ({ ...p, fullName: validateFullName(value as string) }));
      } else if (field === "email") {
        setErrors((p) => ({ ...p, email: validateEmail(value as string) }));
      } else if (field === "phone") {
        setErrors((p) => ({ ...p, phone: validatePhoneVN(value as string) }));
      } else if (field === "password") {
        setErrors((p) => ({
          ...p,
          password: validatePassword(value as string),
          confirmPassword: validatePasswordMatch(value as string, formData.confirmPassword),
        }));
      } else if (field === "confirmPassword") {
        setErrors((p) => ({
          ...p,
          confirmPassword: validatePasswordMatch(formData.password, value as string),
        }));
      } else if (field === "acceptedTerms") {
        setErrors((p) => ({ ...p, acceptedTerms: validateTerms(value as boolean) }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmittedOnce(true);
    setErrors({});
    setIsTakenEmail(false);

    const validationErrors = validateAll();
    const hasError = Object.values(validationErrors).some(Boolean);

    if (hasError) {
      setErrors(validationErrors);

      // Focus first error field
      if (validationErrors.fullName) {
        document.getElementById("register-fullname")?.focus();
      } else if (validationErrors.email) {
        document.getElementById("register-email")?.focus();
      } else if (validationErrors.phone) {
        document.getElementById("register-phone")?.focus();
      } else if (validationErrors.password) {
        document.getElementById("register-password")?.focus();
      } else if (validationErrors.confirmPassword) {
        document.getElementById("register-confirm-password")?.focus();
      } else if (validationErrors.acceptedTerms) {
        document.getElementById("register-terms")?.focus();
      }
      return;
    }

    setIsLoading(true);

    try {
      const res = await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
      });

      if (!res.ok) {
        if (res.error.code === "EMAIL_TAKEN") {
          setIsTakenEmail(true);
          setErrors({ email: res.error.message });
          document.getElementById("register-email")?.focus();
          return;
        }

        setErrors({ server: res.error.message });
        return;
      }

      // Save email safely into sessionStorage for Step 2 OTP
      try {
        sessionStorage.setItem("pending_verify_email", formData.email.trim().toLowerCase());
      } catch {
        // sessionStorage blocked
      }

      router.push("/register/verify");
    } catch {
      setErrors({
        server: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền và thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <AuthStepper currentStep={1} />

      {errors.server && (
        <Alert variant="danger">
          <span>{errors.server}</span>
        </Alert>
      )}

      {isTakenEmail && (
        <Alert variant="warn">
          <span>Email này đã được sử dụng. Bạn có muốn </span>
          <Link href="/login" className="font-semibold underline hover:text-ink">
            Đăng nhập ngay
          </Link>
          <span> không?</span>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          id="register-fullname"
          name="fullName"
          label="Họ và tên"
          placeholder="Nguyễn Văn A"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          onBlur={() => handleBlur("fullName")}
          error={errors.fullName}
          required
          autoComplete="name"
          disabled={isLoading}
        />

        <TextField
          id="register-email"
          name="email"
          type="email"
          label="Địa chỉ email"
          placeholder="ten@domain.com"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          error={errors.email}
          required
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          disabled={isLoading}
        />

        <TextField
          id="register-phone"
          name="phone"
          type="tel"
          label="Số điện thoại (Không bắt buộc)"
          placeholder="0912 345 678"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          onBlur={() => handleBlur("phone")}
          error={errors.phone}
          hint="Dùng để nhận thông báo đơn hàng và liên hệ giao hàng"
          autoComplete="tel"
          disabled={isLoading}
        />

        <div className="space-y-2">
          <PasswordField
            id="register-password"
            name="password"
            label="Mật khẩu"
            placeholder="Tối thiểu 8 ký tự"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            onBlur={() => handleBlur("password")}
            error={errors.password}
            required
            autoComplete="new-password"
            disabled={isLoading}
          />

          <PasswordRequirements password={formData.password} />
        </div>

        <PasswordField
          id="register-confirm-password"
          name="confirmPassword"
          label="Nhập lại mật khẩu"
          placeholder="Xác nhận lại mật khẩu"
          value={formData.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          onBlur={() => handleBlur("confirmPassword")}
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
          disabled={isLoading}
        />

        <div className="pt-1">
          <Checkbox
            id="register-terms"
            name="acceptedTerms"
            checked={formData.acceptedTerms}
            onChange={(e) => handleChange("acceptedTerms", e.target.checked)}
            error={errors.acceptedTerms}
            disabled={isLoading}
            required
            label={
              <span>
                Tôi đồng ý với{" "}
                <Link
                  href="/policies/terms"
                  className="font-medium underline hover:text-ink-2"
                >
                  Điều khoản sử dụng
                </Link>{" "}
                và{" "}
                <Link
                  href="/policies/privacy"
                  className="font-medium underline hover:text-ink-2"
                >
                  Chính sách bảo mật
                </Link>
              </span>
            }
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          loading={isLoading}
        >
          Tiếp tục · Xác thực email
        </Button>
      </form>

      <SocialLoginButtons termsNotice />

      <div className="text-center pt-2 text-sm text-ink-2">
        Đã có tài khoản?{" "}
        <Link
          href="/login"
          className="font-semibold text-ink underline hover:text-ink-2"
        >
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}
