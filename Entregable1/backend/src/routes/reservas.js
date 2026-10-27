import { Router } from "express";
import {
  crearReserva,
  misReservas,
  todasReservas,
  cambiarEstado,
  cancelarReserva
} from "../controllers/reservas.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { esAdmin, esCliente } from "../middlewares/esAdmin.middleware.js";

const router = Router();

router.post("/", verificarToken, esCliente, crearReserva);
router.get("/mis-reservas", verificarToken, esCliente, misReservas);
router.delete("/:id", verificarToken, esCliente, cancelarReserva);

router.get("/", verificarToken, esAdmin, todasReservas);
router.put("/:id/estado", verificarToken, esAdmin, cambiarEstado);

export default router;