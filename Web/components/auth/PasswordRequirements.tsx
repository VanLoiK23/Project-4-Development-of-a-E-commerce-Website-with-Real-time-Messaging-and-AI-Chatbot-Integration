import React from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { checkPasswordRequirements } from "@/lib/validation";

interface PasswordRequirementsProps {
  password?: string;
  className?: string;
}

/**
 * Server-compatible PasswordRequirements component.
 * Displays an explicit checklist with icons and accessible text:
 * - At least 8 characters
 * - At least one letter
 * - At least one number
 */
export function PasswordRequirements({
  password = "",
  className,
}: PasswordRequirementsProps) {
  const rules = checkPasswordRequirements(password);

  const requirements = [
    {
      id: "length",
      label: "Ít nhất 8 ký tự",
      met: rules.minLength,
    },
    {
      id: "letter",
      label: "Chứa ít nhất một chữ cái",
      met: rules.hasLetter,
    },
    {
      id: "number",
      label: "Chứa ít nhất một chữ số",
      met: rules.hasNumber,
    },
  ];

  return (
    <div
      className={cn(
        "p-3 rounded-md bg-surface-subtle border border-line text-xs space-y-1.5",
        className
      )}
      aria-label="Yêu cầu độ an toàn của mật khẩu"
    >
      <p className="font-medium text-ink mb-1">Mật khẩu cần đáp ứng:</p>
      <ul className="space-y-1">
        {requirements.map((item) => (
          <li
            key={item.id}
            className={cn(
              "flex items-center gap-2 transition-colors",
              item.met ? "text-success font-medium" : "text-ink-3"
            )}
          >
            {item.met ? (
              <Check size={14} className="shrink-0 text-success" aria-hidden="true" />
            ) : (
              <X size={14} className="shrink-0 text-ink-3" aria-hidden="true" />
            )}
            <span>{item.label}</span>
            <span className="sr-only">
              {item.met ? "(Đã đạt)" : "(Chưa đạt)"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
