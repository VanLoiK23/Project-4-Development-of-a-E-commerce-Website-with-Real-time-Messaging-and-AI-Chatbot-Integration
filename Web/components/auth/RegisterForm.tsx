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
import { sendOtpCheckEmail } from "@/api/auth";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validatePhoneVN,
  validateTerms,
} from "@/lib/validation";
import type { AuthMode, Gender } from "@/types/auth";

interface RegisterFormProps {
  /** Callback khi người dùng bấm chuyển về Login (dùng trong split-card) */
  onSwitchMode?: (mode: AuthMode) => void;
}

/**
 * Client Component RegisterForm (Bước 1/2).
 *
 * Luồng đăng ký mới:
 * 1. Thu thập và validate thông tin người dùng.
 * 2. Khi bấm "Tiếp tục · Xác thực email" → Gọi API auth/send-otp-check-email.
 * 3. Hiển thị thông báo "Đang tiến hành xác nhận email..." không để đứng UI.
 * 4. Khi gửi OTP thành công → hiển thị fallback thông báo gửi thành công và lưu tạm dữ liệu vào sessionStorage.
 * 5. Chuyển sang /register/verify (VerifyOtpForm).
 * 6. Chỉ sau khi verify OTP thành công mới gọi auth/register và chuyển sang Login.
 */
export function RegisterForm({ onSwitchMode }: RegisterFormProps) {
  const router = useRouter();

  const GENDER_OPTIONS: { value: Gender; label: string }[] = [
    { value: "Nam", label: "Nam" },
    { value: "Nữ", label: "Nữ" },
    { value: "Khác", label: "Khác" },
  ];

  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    ngaySinh: "",
    gender: "" as Gender | "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState<{
    lastName?: string | null;
    firstName?: string | null;
    email?: string | null;
    phone?: string | null;
    ngaySinh?: string | null;
    gender?: string | null;
    password?: string | null;
    confirmPassword?: string | null;
    acceptedTerms?: string | null;
    server?: string | null;
  }>({});

  const [statusFeedback, setStatusFeedback] = useState<{
    type: "info" | "success";
    message: string;
  } | null>(null);

  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTakenEmail, setIsTakenEmail] = useState(false);

  /* ── Validation ─────────────────────────────────────────────────────────── */

  function validateLastName(v: string): string | null {
    return !v.trim() ? "Vui lòng nhập họ" : null;
  }

  function validateFirstName(v: string): string | null {
    return !v.trim() ? "Vui lòng nhập tên" : null;
  }

  function validateNgaySinh(v: string): string | null {
    if (!v) return "Vui lòng chọn ngày sinh";
    const d = new Date(v);
    if (isNaN(d.getTime())) return "Ngày sinh không hợp lệ";
    if (d >= new Date()) return "Ngày sinh phải là ngày trong quá khứ";
    return null;
  }

  function validateGender(v: string): string | null {
    if (!v) return "Vui lòng chọn giới tính";
    return null;
  }

  const validateAll = () => ({
    lastName: validateLastName(formData.lastName),
    firstName: validateFirstName(formData.firstName),
    email: validateEmail(formData.email),
    phone: formData.phone ? validatePhoneVN(formData.phone) : null,
    ngaySinh: validateNgaySinh(formData.ngaySinh),
    gender: validateGender(formData.gender),
    password: validatePassword(formData.password),
    confirmPassword: validatePasswordMatch(
      formData.password,
      formData.confirmPassword
    ),
    acceptedTerms: validateTerms(formData.acceptedTerms),
  });

  /* ── Handlers ────────────────────────────────────────────────────────────── */

  const handleBlur = (field: keyof typeof formData) => {
    if (field === "lastName")
      setErrors((p) => ({ ...p, lastName: validateLastName(formData.lastName) }));
    else if (field === "firstName")
      setErrors((p) => ({ ...p, firstName: validateFirstName(formData.firstName) }));
    else if (field === "email")
      setErrors((p) => ({ ...p, email: validateEmail(formData.email) }));
    else if (field === "phone")
      setErrors((p) => ({ ...p, phone: validatePhoneVN(formData.phone) }));
    else if (field === "ngaySinh")
      setErrors((p) => ({ ...p, ngaySinh: validateNgaySinh(formData.ngaySinh) }));
    else if (field === "gender")
      setErrors((p) => ({ ...p, gender: validateGender(formData.gender) }));
    else if (field === "password")
      setErrors((p) => ({ ...p, password: validatePassword(formData.password) }));
    else if (field === "confirmPassword")
      setErrors((p) => ({
        ...p,
        confirmPassword: validatePasswordMatch(
          formData.password,
          formData.confirmPassword
        ),
      }));
  };

  const handleChange = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsTakenEmail(false);
    if (!hasSubmittedOnce) return;

    if (field === "lastName")
      setErrors((p) => ({ ...p, lastName: validateLastName(value as string) }));
    else if (field === "firstName")
      setErrors((p) => ({
        ...p,
        firstName: validateFirstName(value as string),
      }));
    else if (field === "email")
      setErrors((p) => ({ ...p, email: validateEmail(value as string) }));
    else if (field === "phone")
      setErrors((p) => ({ ...p, phone: validatePhoneVN(value as string) }));
    else if (field === "ngaySinh")
      setErrors((p) => ({
        ...p,
        ngaySinh: validateNgaySinh(value as string),
      }));
    else if (field === "gender")
      setErrors((p) => ({
        ...p,
        gender: validateGender(value as string),
      }));
    else if (field === "password") {
      setErrors((p) => ({
        ...p,
        password: validatePassword(value as string),
        confirmPassword: validatePasswordMatch(
          value as string,
          formData.confirmPassword
        ),
      }));
    } else if (field === "confirmPassword") {
      setErrors((p) => ({
        ...p,
        confirmPassword: validatePasswordMatch(formData.password, value as string),
      }));
    } else if (field === "acceptedTerms") {
      setErrors((p) => ({
        ...p,
        acceptedTerms: validateTerms(value as boolean),
      }));
    }
  };

  const focusFirstError = (
    errs: ReturnType<typeof validateAll>
  ) => {
    if (errs.lastName)
      document.getElementById("register-lastname")?.focus();
    else if (errs.firstName)
      document.getElementById("register-firstname")?.focus();
    else if (errs.email)
      document.getElementById("register-email")?.focus();
    else if (errs.phone)
      document.getElementById("register-phone")?.focus();
    else if (errs.ngaySinh)
      document.getElementById("register-dob")?.focus();
    else if (errs.gender)
      document.getElementById("register-gender")?.focus();
    else if (errs.password)
      document.getElementById("register-password")?.focus();
    else if (errs.confirmPassword)
      document.getElementById("register-confirm-password")?.focus();
    else if (errs.acceptedTerms)
      document.getElementById("register-terms")?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmittedOnce(true);
    setErrors({});
    setIsTakenEmail(false);
    setStatusFeedback(null);

    const validationErrors = validateAll();
    const hasError = Object.values(validationErrors).some(Boolean);

    if (hasError) {
      setErrors(validationErrors);
      focusFirstError(validationErrors);
      return;
    }

    setIsLoading(true);
    setStatusFeedback({
      type: "info",
      message: "Đang tiến hành xác nhận email... Vui lòng đợi trong giây lát.",
    });

    try {
      // 1. Gọi tới API auth/send-otp-check-email
      const res = await sendOtpCheckEmail({
        email: formData.email.trim(),
      });

      if (!res.ok) {
        setStatusFeedback(null);
        if (res.error.code === "EMAIL_TAKEN") {
          setIsTakenEmail(true);
          setErrors({ email: res.error.message });
          document.getElementById("register-email")?.focus();
          return;
        }
        setErrors({
          server:
            res.error.message ||
            "Không thể gửi mã xác nhận đến email này. Vui lòng kiểm tra lại.",
        });
        return;
      }

      if (!res.data.isSuccess) {
        setStatusFeedback(null);
        setErrors({
          server: "Không thể gửi mã xác nhận đến email này. Vui lòng thử lại sau.",
        });
        return;
      }

      // 2. Gửi OTP thành công → Lưu tạm dữ liệu đăng ký vào sessionStorage
      try {
        sessionStorage.setItem(
          "pending_verify_email",
          formData.email.trim().toLowerCase()
        );
        sessionStorage.setItem(
          "pending_register_data",
          JSON.stringify({
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            ngaySinh: formData.ngaySinh,
            gender: formData.gender,
            password: formData.password,
          })
        );
      } catch {
        // sessionStorage blocked
      }

      // 3. Fallback thông báo gửi thành công để người dùng biết trước khi chuyển trang
      setStatusFeedback({
        type: "success",
        message: "Mã xác thực đã được gửi tới email của bạn thành công! Đang chuyển đến trang xác thực...",
      });

      setTimeout(() => {
        router.push("/register/verify");
      }, 900);
    } catch {
      setStatusFeedback(null);
      setErrors({
        server:
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền và thử lại.",
      });
      setIsLoading(false);
    }
  };

  /* ── Render ──────────────────────────────────────────────────────────────── */

  return (
    <div className="w-full space-y-4">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-ink tracking-tight">
          Tạo tài khoản
        </h1>
        <p className="text-sm text-ink-2 mt-1">
          Chỉ 2 bước để đồng bộ sở thích cá nhân.
        </p>
      </div>

      <AuthStepper currentStep={1} />

      {statusFeedback && (
        <Alert variant={statusFeedback.type}>
          <span>{statusFeedback.message}</span>
        </Alert>
      )}

      {errors.server && (
        <Alert variant="danger">
          <span>{errors.server}</span>
        </Alert>
      )}

      {isTakenEmail && (
        <Alert variant="warn">
          <span>Email này đã được sử dụng. Bạn có muốn </span>
          {onSwitchMode ? (
            <button
              type="button"
              onClick={() => onSwitchMode("login")}
              className="font-semibold underline hover:opacity-80 cursor-pointer"
            >
              Đăng nhập ngay
            </button>
          ) : (
            <Link href="/login" className="font-semibold underline hover:opacity-80">
              Đăng nhập ngay
            </Link>
          )}
          <span> không?</span>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        {/* Hàng 1: Họ + Tên (2 cột) */}
        <div className="grid grid-cols-2 gap-3">
          <TextField
            id="register-lastname"
            name="lastName"
            label="Họ"
            placeholder="Nguyễn"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            onBlur={() => handleBlur("lastName")}
            error={errors.lastName}
            required
            autoComplete="family-name"
            disabled={isLoading}
          />
          <TextField
            id="register-firstname"
            name="firstName"
            label="Tên"
            placeholder="Văn A"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            onBlur={() => handleBlur("firstName")}
            error={errors.firstName}
            required
            autoComplete="given-name"
            disabled={isLoading}
          />
        </div>

        {/* Hàng 2: Email */}
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

        {/* Hàng 3: Số điện thoại */}
        <TextField
          id="register-phone"
          name="phone"
          type="tel"
          label="Số điện thoại"
          placeholder="0912 345 678"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          onBlur={() => handleBlur("phone")}
          error={errors.phone}
          required
          autoComplete="tel"
          disabled={isLoading}
          hint="Dạng 0xxxxxxxxx hoặc +84xxxxxxxxx"
        />

        {/* Hàng 4: Ngày sinh + Giới tính (2 cột) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Ngày sinh */}
          <div className="flex flex-col gap-1.5 w-full text-left">
            <label
              htmlFor="register-dob"
              className="text-sm font-medium text-ink"
            >
              Ngày sinh
              <span className="text-danger ml-1" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="register-dob"
              name="ngaySinh"
              type="date"
              value={formData.ngaySinh}
              onChange={(e) => handleChange("ngaySinh", e.target.value)}
              onBlur={() => handleBlur("ngaySinh")}
              disabled={isLoading}
              max={new Date().toISOString().split("T")[0]}
              required
              aria-invalid={Boolean(errors.ngaySinh)}
              aria-describedby={errors.ngaySinh ? "register-dob-error" : undefined}
              className={[
                "w-full min-h-[44px] px-3.5 py-2 text-base text-ink bg-surface rounded-md border transition-colors",
                "border-line placeholder:text-ink-3",
                "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand",
                errors.ngaySinh
                  ? "border-danger focus-visible:outline-danger"
                  : "",
                isLoading ? "opacity-50 cursor-not-allowed bg-surface-subtle" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            />
            {errors.ngaySinh && (
              <p
                id="register-dob-error"
                className="text-xs text-danger flex items-center gap-1.5 mt-0.5 leading-normal"
                role="alert"
              >
                <span>{errors.ngaySinh}</span>
              </p>
            )}
          </div>

          {/* Giới tính */}
          <div className="flex flex-col gap-1.5 w-full text-left">
            <label
              htmlFor="register-gender"
              className="text-sm font-medium text-ink"
            >
              Giới tính
              <span className="text-danger ml-1" aria-hidden="true">
                *
              </span>
            </label>
            <select
              id="register-gender"
              name="gender"
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value as Gender)}
              onBlur={() => handleBlur("gender")}
              disabled={isLoading}
              required
              aria-invalid={Boolean(errors.gender)}
              aria-describedby={
                errors.gender ? "register-gender-error" : undefined
              }
              className={[
                "w-full min-h-[44px] px-3.5 py-2 text-base text-ink bg-surface rounded-md border transition-colors",
                "border-line",
                "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand",
                errors.gender
                  ? "border-danger focus-visible:outline-danger"
                  : "",
                isLoading ? "opacity-50 cursor-not-allowed bg-surface-subtle" : "",
                !formData.gender ? "text-ink-3" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <option value="" disabled>
                Chọn giới tính
              </option>
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.gender && (
              <p
                id="register-gender-error"
                className="text-xs text-danger flex items-center gap-1.5 mt-0.5 leading-normal"
                role="alert"
              >
                <span>{errors.gender}</span>
              </p>
            )}
          </div>
        </div>

        {/* Hàng 5: Mật khẩu + Checklist */}
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
          {formData.password && (
            <PasswordRequirements password={formData.password} />
          )}
        </div>

        {/* Hàng 6: Nhập lại mật khẩu */}
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

        {/* Điều khoản */}
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
          {isLoading ? "Đang gửi mã xác nhận..." : "Tiếp tục · Xác thực email"}
        </Button>
      </form>

      <SocialLoginButtons termsNotice />

      {/* Chuyển sang Login */}
      <div className="text-center pt-1 text-sm text-ink-2">
        Đã có tài khoản?{" "}
        {onSwitchMode ? (
          <button
            type="button"
            onClick={() => onSwitchMode("login")}
            className="font-semibold text-ink underline hover:text-ink-2 cursor-pointer"
          >
            Đăng nhập
          </button>
        ) : (
          <Link
            href="/login"
            className="font-semibold text-ink underline hover:text-ink-2"
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </div>
  );
}
