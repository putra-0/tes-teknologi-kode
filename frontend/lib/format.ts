import { formatDistanceToNow } from "date-fns";

export function formatDate(
  date: Date | string | number | undefined | null,
  opts: Intl.DateTimeFormatOptions = {}
) {
  if (!date) return "";

  try {
    return new Intl.DateTimeFormat("id-ID", {
      year: opts.year ?? "numeric",
      month: opts.month ?? "short",
      day: opts.day ?? "2-digit",
      hour: opts.hour ?? "2-digit",
      minute: opts.minute ?? "2-digit",
      second: opts.second ?? "2-digit",
      hour12: false,
      ...opts,
    })
      .format(new Date(date))
      .replace("pukul", "")
      .replace(",", "")
      .replaceAll(".", ":")
      .trim();
  } catch (_err) {
    console.log(_err);
    return "";
  }
}

export function formatTimeago(date: Date | string | number | undefined | null) {
  if (!date) return "";

  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (_err) {
    console.log(_err);
    return "";
  }
}
