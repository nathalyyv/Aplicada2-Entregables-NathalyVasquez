import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { request, setUnauthorizedHandler, TOKEN_KEY } from "../services/api";

type Usuario = { id: number; email: string; rol: string; exp?: number };

type AuthValue = {
  token: string | null;
  usuario: Usuario | null;
  esAdmin: boolean;
  cargando: boolean;
  login: (email: string, password: string) => Promise<void>;
  registro: (nombre: string, email: string, password: string, rol: string) => Promise<void>;
  logout: () => Promise<void>;
};

const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function base64Decode(str: string) {
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

function decodificarToken(token: string): Usuario | null {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(base64Decode(payload));
  } catch {
    return null;
  }
}

const expirado = (u: Usuario | null) => !!u?.exp && u.exp * 1000 < Date.now();

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
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

      if (guardado && datos && !expirado(datos)) {
        setToken(guardado);
        setUsuario(datos);
      } else if (guardado) {
        await AsyncStorage.removeItem(TOKEN_KEY);
      }
      setCargando(false);
    })();
  }, [logout]);

  useEffect(() => {
    if (!usuario?.exp) return;
    const ms = usuario.exp * 1000 - Date.now();
    if (ms <= 0) {
      logout();
      return;
    }
    const t = setTimeout(logout, Math.min(ms, 2147483647));
    return () => clearTimeout(t);
  }, [usuario, logout]);

  const login = async (email: string, password: string) => {
    const data = await request<{ token: string }>("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    });
    await AsyncStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUsuario(decodificarToken(data.token));
  };

  const registro = async (nombre: string, email: string, password: string, rol: string) => {
    await request("/auth/registro", {
      method: "POST",
      body: { nombre, email, password, rol },
      auth: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{ token, usuario, esAdmin: usuario?.rol === "admin", cargando, login, registro, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}