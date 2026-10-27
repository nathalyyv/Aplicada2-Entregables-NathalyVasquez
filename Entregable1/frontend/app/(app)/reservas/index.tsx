import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { Stack, useFocusEffect } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import {
  type Reserva,
  cambiarEstado,
  cancelarReserva,
  obtenerMisReservas,
  obtenerTodasReservas,
} from "../../../features/reservas/reservas.api";
import { COLORES_ESTADO } from "../../../lib/validaciones";
import styles from "../../../styles";

export default function Reservas() {
  const { esAdmin } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    setError("");
    setCargando(true);
    try {
      setReservas(esAdmin ? await obtenerTodasReservas() : await obtenerMisReservas());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, [esAdmin]);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  const cancelar = (r: Reserva) => {
    Alert.alert("Cancelar reserva", `¿Cancelar la reserva de "${r.servicio.nombre}"?`, [
      { text: "No", style: "cancel" },
      {
        text: "Sí, cancelar",
        style: "destructive",
        onPress: async () => {
          try {
            await cancelarReserva(r.id);
            cargar();
          } catch (e: any) {
            Alert.alert("Error", e.message);
          }
        },
      },
    ]);
  };

  const completar = async (r: Reserva) => {
    try {
      await cambiarEstado(r.id, "completada");
      cargar();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const titulo = <Stack.Screen options={{ title: esAdmin ? "Reservas" : "Mis reservas" }} />;

  if (cargando) {
    return (
      <View style={styles.center}>
        {titulo}
        <ActivityIndicator size="large" color="#6c3fc5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        {titulo}
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={cargar}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {titulo}
      <FlatList
        data={reservas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#666", marginTop: 40 }}>No hay reservas.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.servicio.nombre}</Text>
            {esAdmin && item.usuario && (
              <Text style={styles.cardText}>Cliente: {item.usuario.nombre}</Text>
            )}
            <Text style={styles.cardText}>Fecha: {item.fecha}</Text>
            <Text style={styles.cardText}>Hora: {item.hora}</Text>
            <Text style={{ fontWeight: "600", marginTop: 4, color: COLORES_ESTADO[item.estado] }}>
              Estado: {item.estado}
            </Text>

            {item.estado === "pendiente" && (
              <View style={styles.smallRow}>
                {esAdmin ? (
                  <TouchableOpacity
                    style={[styles.smallButton, { backgroundColor: "#27ae60" }]}
                    onPress={() => completar(item)}
                  >
                    <Text style={styles.smallButtonText}>Marcar completada</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.smallButton, { backgroundColor: "#c0392b" }]}
                    onPress={() => cancelar(item)}
                  >
                    <Text style={styles.smallButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}