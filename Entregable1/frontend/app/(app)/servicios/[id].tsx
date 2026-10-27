import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import { type Servicio, obtenerServicio } from "../../../features/servicios/servicios.api";
import styles from "../../../styles";

export default function DetalleServicio() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { esAdmin } = useAuth();
  const router = useRouter();
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setServicio(await obtenerServicio(Number(id)));
      } catch (e: any) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    })();
  }, [id]);

  if (cargando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6c3fc5" />
      </View>
    );
  }

  if (error || !servicio) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error || "Servicio no encontrado"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Detalle" }} />
      <Text style={styles.title}>{servicio.nombre}</Text>
      <Text style={[styles.cardText, { textAlign: "center", marginBottom: 16 }]}>
        {servicio.descripcion}
      </Text>
      <Text style={[styles.cardText, { textAlign: "center" }]}>Duración: {servicio.duracion} min</Text>
      <Text style={[styles.cardText, { textAlign: "center" }]}>Precio: ${servicio.precio}</Text>

      {!esAdmin && (
        <TouchableOpacity
          style={[styles.button, { marginTop: 20 }]}
          onPress={() =>
            router.push({
              pathname: "/reservas/nueva",
              params: { servicioId: String(servicio.id), nombre: servicio.nombre },
            })
          }
        >
          <Text style={styles.buttonText}>Reservar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}