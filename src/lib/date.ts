export function formatDateParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error(`Could not format date parts for timezone "${timeZone}".`);
  }

  return { year, month, day };
}

export function formatDateStringInTimeZone(date: Date, timeZone: string) {
  const { year, month, day } = formatDateParts(date, timeZone);
  return `${year}-${month}-${day}`;
}

export function formatTimeStringInTimeZone(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = formatter.formatToParts(date);
  const hour = parts.find((part) => part.type === "hour")?.value;
  const minute = parts.find((part) => part.type === "minute")?.value;

  if (!hour || !minute) {
    throw new Error(`Could not format time parts for timezone "${timeZone}".`);
  }

  return `${hour}:${minute}`;
}

export function isFutureTimeForDate(date: string, time: string, now: Date, timeZone: string) {
  const today = formatDateStringInTimeZone(now, timeZone);
  return date !== today || time > formatTimeStringInTimeZone(now, timeZone);
}

export function isIsoDateString(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function formatIsoDateForDisplay(value: string, timeZone: string) {
  if (!isIsoDateString(value)) {
    throw new Error(`Invalid ISO date string "${value}".`);
  }

  const [year, month, day] = value.split("-").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone,
  }).format(utcDate);
}
