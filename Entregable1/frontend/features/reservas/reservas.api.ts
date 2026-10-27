import { request } from "../../services/api";

export type Reserva = {
  id: number;
  fecha: string;
  hora: string;
  estado: string;
  servicio: { id: number; nombre: string };
  usuario?: { nombre: string; email: string };
};

export const crearReserva = (servicioId: number, fecha: string, hora: string) =>
  request("/reservas", { method: "POST", body: { servicioId, fecha, hora } });

export const obtenerMisReservas = () => request<Reserva[]>("/reservas/mis-reservas");

export const obtenerTodasReservas = () => request<Reserva[]>("/reservas");

export const cancelarReserva = (id: number) => request(`/reservas/${id}`, { method: "DELETE" });

export const cambiarEstado = (id: number, estado: string) =>
  request(`/reservas/${id}/estado`, { method: "PUT", body: { estado } });