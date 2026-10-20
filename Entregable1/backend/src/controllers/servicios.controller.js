import { prisma } from "../db.js";

const validar = ({ nombre, descripcion, duracion, precio }) => {
  if (!nombre || !descripcion) {
    return "Nombre y descripción son obligatorios";
  }
  if (!Number.isInteger(Number(duracion)) || Number(duracion) <= 0) {
    return "La duración debe ser un número entero de minutos mayor a 0";
  }
  if (precio === undefined || precio === "" || isNaN(Number(precio)) || Number(precio) < 0) {
    return "El precio debe ser un número válido";
  }
  return null;
};

export const listarServicios = async (req, res, next) => {
  try {
    const servicios = await prisma.servicio.findMany({ orderBy: { id: "asc" } });
    res.json(servicios);
  } catch (err) { next(err) }
};

export const crearServicio = async (req, res, next) => {
  try {
    const error = validar(req.body);
    if (error) return res.status(400).json({ error });

    const { nombre, descripcion, duracion, precio } = req.body;
    const servicio = await prisma.servicio.create({
      data: {
        nombre,
        descripcion,
        duracion: Number(duracion),
        precio: Number(precio),
      },
    });
    res.status(201).json(servicio);
  } catch (err) { next(err) }
};

export const editarServicio = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "ID inválido" });

    const error = validar(req.body);
    if (error) return res.status(400).json({ error });

    const { nombre, descripcion, duracion, precio } = req.body;
    const servicio = await prisma.servicio.update({
      where: { id },
      data: {
        nombre,
        descripcion,
        duracion: Number(duracion),
        precio: Number(precio),
      },
    });
    res.json(servicio);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Servicio no encontrado" });
    next(err);
  }
};

export const eliminarServicio = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "ID inválido" });

    await prisma.servicio.delete({ where: { id } });
    res.json({ mensaje: "Servicio eliminado" });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Servicio no encontrado" });
    next(err);
  }
};