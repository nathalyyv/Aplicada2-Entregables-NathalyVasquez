import { createContext, useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { request, setUnauthorizedHandler, TOKEN_KEY } from "../services/api";

const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function base64Decode(str) {
  let output = "";
  let buffer = 0;
  let bits = 0;
  for (const c of str.replace(/=+$/, "")) {
    const val = B64.indexOf(c);
    if (val === -1) continue;
    buffer = (buffer << 6) | val;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output += String.fromCharCode((buffer >> bits) & 0xff);
      buffer &= (1 << bits) - 1;
    }
  }
  return output;
}

function decodificarToken(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(base64Decode(payload));
  } catch {
    return null;
  }
}

const expirado = (datos) => datos?.exp && datos.exp * 1000 < Date.now();

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUsuario(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);

    (async () => {
      const guardado = await AsyncStorage.getItem(TOKEN_KEY);
      const datos = guardado ? decodificarToken(guardado) : null;

      if (datos && !expirado(datos)) {
        setToken(guardado);
        setUsuario(datos);
      } else if (guardado) {
        await AsyncStorage.removeItem(TOKEN_KEY);
      }
      setCargando(false);
    })();
  }, [logout]);

  const login = async (email, password) => {
    const data = await request("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    });
    await AsyncStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUsuario(decodificarToken(data.token));
  };

  const registro = (nombre, email, password, rol) =>
    request("/auth/registro", {
      method: "POST",
      body: { nombre, email, password, rol },
      auth: false,
    });

  return (
    <AuthContext.Provider
      value={{ token, usuario, esAdmin: usuario?.rol === "admin", cargando, login, registro, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);