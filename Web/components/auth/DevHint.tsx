import React from "react";
import { MOCK_ACCOUNTS, MOCK_OTP, MOCK_TOKENS } from "@/mocks/auth";

/**
 * Server Component DevHint.
 * Displays convenient mock credentials only in non-production environments.
 * Strictly hidden in production.
 */
export function DevHint() {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <details className="mt-8 text-xs text-ink-3 bg-surface-subtle border border-line rounded-md p-3 select-none">
      <summary className="font-semibold text-ink cursor-pointer hover:text-brand">
        💡 Gợi ý kiểm thử (Chỉ hiện trong môi trường Dev)
      </summary>
      <div className="mt-2.5 space-y-2 text-ink-2 border-t border-line pt-2 text-[11px] leading-relaxed">
        <div>
          <strong className="text-ink">Đăng nhập thành công:</strong>{" "}
          <code className="bg-surface px-1 py-0.5 rounded border border-line">
            {MOCK_ACCOUNTS.DEMO.email}
          </code>{" "}
          /{" "}
          <code className="bg-surface px-1 py-0.5 rounded border border-line">
            {MOCK_ACCOUNTS.DEMO.password}
          </code>
        </div>
        <div>
          <strong className="text-ink">Chưa kích hoạt OTP:</strong>{" "}
          <code className="bg-surface px-1 py-0.5 rounded border border-line">
            {MOCK_ACCOUNTS.UNVERIFIED.email}
          </code>
        </div>
        <div>
          <strong className="text-ink">Tài khoản tạm khóa:</strong>{" "}
          <code className="bg-surface px-1 py-0.5 rounded border border-line">
            {MOCK_ACCOUNTS.LOCKED.email}
          </code>
        </div>
        <div>
          <strong className="text-ink">Lỗi mạng giả lập:</strong>{" "}
          <code className="bg-surface px-1 py-0.5 rounded border border-line">
            {MOCK_ACCOUNTS.SERVER_ERROR.email}
          </code>
        </div>
        <div>
          <strong className="text-ink">Email đã đăng ký:</strong>{" "}
          <code className="bg-surface px-1 py-0.5 rounded border border-line">
            {MOCK_ACCOUNTS.TAKEN.email}
          </code>
        </div>
        <div>
          <strong className="text-ink">Mã OTP:</strong> Đúng:{" "}
          <code className="bg-surface px-1 py-0.5 rounded border border-line font-bold text-success">
            {MOCK_OTP.VALID_CODE}
          </code>{" "}
          | Hết hạn:{" "}
          <code className="bg-surface px-1 py-0.5 rounded border border-line text-danger">
            {MOCK_OTP.EXPIRED_CODE}
          </code>
        </div>
        <div>
          <strong className="text-ink">Reset Token:</strong> Hợp lệ:{" "}
          <code className="bg-surface px-1 py-0.5 rounded border border-line font-bold text-success">
            {MOCK_TOKENS.VALID}
          </code>{" "}
          | Hết hạn:{" "}
          <code className="bg-surface px-1 py-0.5 rounded border border-line text-danger">
            {MOCK_TOKENS.EXPIRED}
          </code>
        </div>
      </div>
    </details>
  );
}
