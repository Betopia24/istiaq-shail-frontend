/** Money from the API is in minor units (pence / cents). */
export function formatMoney(pence: number | null | undefined, currency: "GBP" | "USD" | string = "GBP", options: { decimals?: boolean } = {}): string {
  if (pence == null) return "–";
  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: options.decimals ? 2 : 0,
  }).format(pence / 100);
}

/** "£1,250,000" typed by a person → pence. Returns undefined for empty or non-numeric input. */
export function parseMoneyToPence(input: string | number | null | undefined): number | undefined {
  if (input == null || input === "") return undefined;
  const value = typeof input === "number" ? input : Number(String(input).replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) && value > 0 ? Math.round(value * 100) : undefined;
}

export function formatDate(value: string | Date | null | undefined, style: "short" | "long" | "month" = "short"): string {
  if (!value) return "–";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "–";
  const options: Intl.DateTimeFormatOptions =
    style === "month" ? { month: "short", year: "numeric" } : style === "long" ? { day: "numeric", month: "long", year: "numeric" } : { day: "2-digit", month: "short", year: "numeric" };
  return new Intl.DateTimeFormat("en-GB", options).format(date);
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "–";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "–";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

export function formatNumber(value: number | null | undefined): string {
  return value == null ? "–" : new Intl.NumberFormat("en-GB").format(value);
}

export function initials(name: string | null | undefined): string {
  return (name ?? "").split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "?";
}
