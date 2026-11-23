/**
 * Formats price in Vietnamese Dong (VND), e.g. 24990000 -> "24.990.000 ₫"
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
}

/**
 * Masks email address for privacy in verification displays, e.g. "nguyenvana@gmail.com" -> "n***@gmail.com"
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;
  const [local, domain] = email.split("@");
  if (local.length <= 1) {
    return `${local}***@${domain}`;
  }
  return `${local[0]}***@${domain}`;
}
