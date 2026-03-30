import { clsx } from "clsx";
import { formatDistanceToNowStrict, subDays } from "date-fns";

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function relativeDate(value?: string | Date | null) {
  if (!value) {
    return "Unknown";
  }

  return formatDistanceToNowStrict(new Date(value), { addSuffix: true });
}

export function truncate(text: string, max = 180) {
  if (text.length <= max) {
    return text;
  }

  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export function timeframeStart(timeframe?: string) {
  switch (timeframe) {
    case "24h":
      return subDays(new Date(), 1);
    case "7d":
      return subDays(new Date(), 7);
    case "30d":
      return subDays(new Date(), 30);
    default:
      return undefined;
  }
}

export function normalizeToken(token: string) {
  return token.trim().toLowerCase();
}

export function unique<T>(values: T[]) {
  return [...new Set(values)];
}
