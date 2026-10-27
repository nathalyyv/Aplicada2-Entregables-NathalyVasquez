export const COLORES_ESTADO: Record<string, string> = {
  pendiente: "#e67e22",
  completada: "#27ae60",
  cancelada: "#c0392b",
};

export function validarReserva(fecha: string, hora: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
    return "Usa el formato AAAA-MM-DD para la fecha y HH:MM para la hora";
  }
  const [a, m, d] = fecha.split("-").map(Number);
  const [h, min] = hora.split(":").map(Number);
  const f = new Date(a, m - 1, d, h, min);
  if (f.getMonth() !== m - 1 || f.getDate() !== d) return "Esa fecha no existe";
  if (f <= new Date()) return "No se puede reservar en una fecha pasada";
  return null;
}