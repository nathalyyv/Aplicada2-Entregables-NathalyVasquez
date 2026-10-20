import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TOKEN_KEY = "token";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

export async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Revisa tu red y la URL de la API.");
  }

  let data = null;
  try {
    data = await res.json();
  } catch {}

  if (res.status === 401 && auth) {
    if (onUnauthorized) await onUnauthorized();
    throw new Error("Tu sesión expiró. Inicia sesión de nuevo.");
  }

  if (!res.ok) throw new Error(data?.error || "Ocurrió un error inesperado");
  return data;
}