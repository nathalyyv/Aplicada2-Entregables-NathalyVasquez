import { Router } from "express"
import { registro, login } from "../controllers/auth.controller.js"
import { actualizarPerfil } from "../controllers/usuarios.controller.js" 
import { verificarToken } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/registro", registro)
router.post("/login", login)

router.put("/usuarios/perfil", verificarToken, actualizarPerfil)

export default router