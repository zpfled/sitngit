// Pass a fixed `now` in tests; production labels reflect the build time.
export function reviewAge(publishTime, fallback = "", now = Date.now()) {
  const published = typeof publishTime === "string" ? Date.parse(publishTime) : NaN;
  if (!Number.isFinite(published) || !Number.isFinite(now) || published > now) return fallback;
  const days = Math.floor((now - published) / 86_400_000);
  if (days === 0) return "today";
  const [count, unit] = days >= 365 ? [Math.floor(days / 365), "year"]
    : days >= 30 ? [Math.floor(days / 30), "month"]
    : days >= 7 ? [Math.floor(days / 7), "week"] : [days, "day"];
  return `${count} ${unit}${count === 1 ? "" : "s"} ago`;
}
