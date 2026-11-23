"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PasswordField } from "@/components/ui/PasswordField";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
import { resetPassword } from "@/api/auth";
import { validatePassword, validatePasswordMatch } from "@/lib/validation";

interface ResetPasswordFormProps {
  token: string;
}

/**
 * Client Component ResetPasswordForm.
 * Validates new password with live requirements checklist and password match.
 * Redirects to /login?reset=1 upon successful password update.
 */
export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const pErr = validatePassword(password);
    const cErr = validatePasswordMatch(password, confirmPassword);

    setPasswordError(pErr);
    setConfirmError(cErr);

    if (pErr || cErr) return;

    setIsLoading(true);

    try {
      const res = await resetPassword({ token, password });

      if (!res.ok) {
        setServerError(res.error.message);
        return;
      }

      router.push("/login?reset=1");
    } catch {
      setServerError("Không thể kết nối tới máy chủ. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {serverError && <Alert variant="danger">{serverError}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <PasswordField
            id="reset-password"
            name="password"
            label="Mật khẩu mới"
            placeholder="Tối thiểu 8 ký tự"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError(null);
            }}
            onBlur={() => setPasswordError(validatePassword(password))}
            error={passwordError}
            required
            autoComplete="new-password"
            disabled={isLoading}
          />

          <PasswordRequirements password={password} />
        </div>

        <PasswordField
          id="reset-confirm-password"
          name="confirmPassword"
          label="Nhập lại mật khẩu mới"
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (confirmError) setConfirmError(null);
          }}
          onBlur={() =>
            setConfirmError(validatePasswordMatch(password, confirmPassword))
          }
          error={confirmError}
          required
          autoComplete="new-password"
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          loading={isLoading}
        >
          Lưu mật khẩu mới
        </Button>
      </form>
    </div>
  );
}
