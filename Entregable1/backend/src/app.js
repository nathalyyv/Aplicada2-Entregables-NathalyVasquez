import express from "express";
import cors from "cors";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import serviciosRoutes from "./routes/servicios.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.use("/auth", authRoutes);
app.use("/servicios", serviciosRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

export default app;