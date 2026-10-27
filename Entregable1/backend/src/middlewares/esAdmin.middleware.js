export const esAdmin = (req, res, next) => {
  if (req.usuario?.rol !== "admin") {
    return res.status(403).json({ error: "Acceso denegado" });
  }
  next();
};

export const esCliente = (req, res, next) => {
  if (req.usuario?.rol === "admin") {
    return res.status(403).json({ error: "Acceso denegado" });
  }
  next();
};