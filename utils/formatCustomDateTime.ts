

export default function formatCustomDateTime(isoDateStr:string,timeStr:string): string {
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
    month: "numeric", // "5"
    year: "numeric", // "2025"
    hour: "numeric", // "6"
    minute: "2-digit", // "32"
    hour12: true, // AM/PM
  });

  const parts = formatter.formatToParts(date);
  
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const hour = parts.find((p) => p.type === "hour")?.value ?? "";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "";
  const dayPeriod = parts.find((p) => p.type === "dayPeriod")?.value ?? "";

  return `${weekday}, ${month}, ${year}, ${hour}:${minute} ${dayPeriod}`;
}