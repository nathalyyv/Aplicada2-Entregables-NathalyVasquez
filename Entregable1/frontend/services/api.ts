import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TOKEN_KEY = "token";

const API_URL = Constants.expoConfig?.extra?.apiUrl as string;

let onUnauthorized: (() => Promise<void>) | null = null;
export const setUnauthorizedHandler = (fn: () => Promise<void>) => {
  onUnauthorized = fn;
};

type Opciones = { method?: string; body?: object; auth?: boolean };

export async function request<T = any>(
  path: string,
  { method = "GET", body, auth = true }: Opciones = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (auth) {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Revisa tu red y la URL de la API.");
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {}

  if (res.status === 401 && auth) {
    if (onUnauthorized) await onUnauthorized();
    throw new Error("Tu sesión expiró. Inicia sesión de nuevo.");
  }

  if (!res.ok) throw new Error(data?.error || "Ocurrió un error inesperado");
  return data as T;
}