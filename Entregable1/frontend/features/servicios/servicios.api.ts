import { request } from "../../services/api";

export type Servicio = {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: number;
};

export type DatosServicio = Omit<Servicio, "id">;

export const listarServicios = () => request<Servicio[]>("/servicios");

export async function obtenerServicio(id: number) {
  const lista = await listarServicios();
  const servicio = lista.find((s) => s.id === id);
  if (!servicio) throw new Error("Servicio no encontrado");
  return servicio;
}

export const guardarServicio = (id: number | null, datos: DatosServicio) =>
  request(id ? `/servicios/${id}` : "/servicios", {
    method: id ? "PUT" : "POST",
    body: datos,
  });

export const eliminarServicio = (id: number) => request(`/servicios/${id}`, { method: "DELETE" });