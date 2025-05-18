

export function formatCustomDateTime(isoDateStr:string,timeStr:string): string {
  const date = new Date(isoDateStr);
  const [hours, minutes] = timeStr.split(":").map(Number);

  // Validación básica de horas
  if (isNaN(date.getTime())) {
    throw new Error("Formato ISO de fecha inválido");
  }

  // Validación básica de horas
  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error("Formato de hora inválido. Debe ser HH:mm");
  }

  date.setHours(hours);
  date.setMinutes(minutes);

  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short", // "Thu"
    month: "short", // "May"
    day: "numeric", // "12"
    year: "numeric", // "2025"
    hour: "numeric", // "6"
    minute: "2-digit", // "32"
    hour12: true, // AM/PM
  });

  const parts = formatter.formatToParts(date);
  
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const hour = parts.find((p) => p.type === "hour")?.value ?? "";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "";
  const dayPeriod = parts.find((p) => p.type === "dayPeriod")?.value ?? "";

  return `${weekday}, ${month} ${day}, ${year}, ${hour}:${minute} ${dayPeriod}`;
}

export function formatToObjectDateTime(isoDateStr:string,timeStr:string): object {
  const date = new Date(isoDateStr);
  const [hours, minutes] = timeStr.split(":").map(Number);

  // Validación básica de horas
  if (isNaN(date.getTime())) {
    throw new Error("Formato ISO de fecha inválido");
  }

  // Validación básica de horas
  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error("Formato de hora inválido. Debe ser HH:mm");
  }

  date.setHours(hours);
  date.setMinutes(minutes);

  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short", // "Thu"
    month: "numeric", // "May"
    day: "numeric", // "12"
    year: "numeric", // "2025"
    hour: "numeric", // "6"
    minute: "2-digit", // "32"
    hour12: true, // AM/PM
  });

  const parts = formatter.formatToParts(date);
  
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const hour = parts.find((p) => p.type === "hour")?.value ?? "";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "";
  const dayPeriod = parts.find((p) => p.type === "dayPeriod")?.value ?? "";

  return {weekday, month, day, year, hour, minute, dayPeriod};
}