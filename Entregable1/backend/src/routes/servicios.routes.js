import { Router } from "express";
import { verificarToken, soloAdmin } from "../middlewares/auth.middleware.js";
import {
  listarServicios,
  crearServicio,
  editarServicio,
  eliminarServicio,
} from "../controllers/servicios.controller.js";

const router = Router();

router.get("/", verificarToken, listarServicios);
router.post("/", verificarToken, soloAdmin, crearServicio);
router.put("/:id", verificarToken, soloAdmin, editarServicio);
router.delete("/:id", verificarToken, soloAdmin, eliminarServicio);

export default router;