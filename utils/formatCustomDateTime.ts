
interface DateTimeInputs {
    isoDateStr : string,
}

export default function formatCustomDateTime(isoDateStr: string): string {
  const date = new Date(isoDateStr);

  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) {
    throw new Error("Fecha ISO inválida");
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",    
    month: "numeric",   
    year: "numeric",    
    hour: "numeric",    
    minute: "2-digit",  
    hour12: true,      
    timeZone: "UTC"
  });

  const parts = formatter.formatToParts(date);

  const weekday = parts.find((p) => p.type === "weekday")?.value || "";
  const month = parts.find((p) => p.type === "month")?.value || "";
  const year = parts.find((p) => p.type === "year")?.value || "";
  const hour = parts.find((p) => p.type === "hour")?.value || "";
  const minute = parts.find((p) => p.type === "minute")?.value || "";
  const dayPeriod = parts.find((p) => p.type === "dayPeriod")?.value || "";

  return `${weekday}, ${month}, ${year}, ${hour}:${minute} ${dayPeriod}`;
}