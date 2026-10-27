import { prisma } from "../db.js";

const esFechaValida = (fechaStr, horaStr) => {
  const regexFecha = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;
  const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!regexFecha.test(fechaStr) || !regexHora.test(horaStr)) {
    return false;
  }

  const [year, month, day] = fechaStr.split("-").map(Number);
  const fecha = new Date(year, month - 1, day);
  if (
    fecha.getFullYear() !== year ||
    fecha.getMonth() !== month - 1 ||
    fecha.getDate() !== day
  ) {
    return false;
  }

  const ahora = new Date();
  const [hour, minute] = horaStr.split(":").map(Number);
  const fechaReserva = new Date(year, month - 1, day, hour, minute);

  if (fechaReserva < ahora) {
    return false;
  }

  return true;
};

export const crearReserva = async (req, res, next) => {
  try {
    const { fecha, hora, servicioId } = req.body;
    const usuarioId = req.usuario.id;

    if (!fecha || !hora || !servicioId) {
      return res.status(400).json({ error: "Faltan datos obligatorios (fecha, hora, servicioId)" });
    }

    if (!esFechaValida(fecha, hora)) {
      return res.status(400).json({ error: "Fecha u hora inválida, o es una fecha pasada" });
    }

    const servicio = await prisma.servicio.findUnique({ where: { id: Number(servicioId) } });
    if (!servicio) {
      return res.status(404).json({ error: "El servicio no existe" });
    }

    const nuevaReserva = await prisma.reserva.create({
      data: {
        fecha,
        hora,
        estado: "pendiente",
        usuarioId,
        servicioId: Number(servicioId)
      },
      include: { servicio: true }
    });

    return res.status(201).json(nuevaReserva);
  } catch (err) {
    next(err);
  }
};

export const misReservas = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const reservas = await prisma.reserva.findMany({
      where: { usuarioId },
      include: { servicio: true },
      orderBy: { id: "desc" }
    });
    return res.json(reservas);
  } catch (err) {
    next(err);
  }
};

export const todasReservas = async (req, res, next) => {
  try {
    const reservas = await prisma.reserva.findMany({
      include: {
        servicio: true,
        usuario: { select: { id: true, nombre: true, email: true } }
      },
      orderBy: { id: "desc" }
    });
    return res.json(reservas);
  } catch (err) {
    next(err);
  }
};

export const cambiarEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const estadosValidos = ["pendiente", "completada", "cancelada"];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    const reservaActualizada = await prisma.reserva.update({
      where: { id: Number(id) },
      data: { estado }
    });

    return res.json(reservaActualizada);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }
    next(err);
  }
};

export const cancelarReserva = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const reserva = await prisma.reserva.findUnique({
      where: { id: Number(id) }
    });

    if (!reserva || reserva.usuarioId !== usuarioId) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    if (reserva.estado !== "pendiente") {
      return res.status(400).json({ error: "Solo se pueden cancelar reservas pendientes" });
    }

    const reservaCancelada = await prisma.reserva.update({
      where: { id: Number(id) },
      data: { estado: "cancelada" }
    });

    return res.json(reservaCancelada);
  } catch (err) {
    next(err);
  }
};