import { prisma } from "../db.js";

export const actualizarPerfil = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id; 
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: Number(usuarioId) },
      data: { nombre },
      select: {
        id: true,
        nombre: true,
        email: true,
      }
    });

    return res.json(usuarioActualizado);
  } catch (err) {
    next(err);
  }
};