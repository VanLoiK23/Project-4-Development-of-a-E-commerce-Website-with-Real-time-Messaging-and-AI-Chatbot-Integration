/**
 * Formats price in Vietnamese Dong (VND), e.g. 24990000 -> "24.990.000 ₫"
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
}

/**
 * Formats sold count into friendly Vietnamese display:
 * - 3300 -> "Đã bán 3,3k"
 * - 134 -> "Đã bán 134"
 * - 15000 -> "Đã bán 15k"
 */
export function formatSoldCount(count: number): string {
  if (count >= 1000) {
    const inK = count / 1000;
    const formatted = inK % 1 === 0 ? inK.toString() : inK.toFixed(1).replace(".", ",");
    return `Đã bán ${formatted}k`;
  }
  return `Đã bán ${count}`;
}

/**
 * Formats ISO date string to dd/MM/yyyy
 */
export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
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
