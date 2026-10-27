import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import {
  type Servicio,
  eliminarServicio,
  listarServicios,
} from "../../../features/servicios/servicios.api";
import styles from "../../../styles";

export default function Servicios() {
  const { esAdmin, usuario, logout } = useAuth();
  const router = useRouter();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    setError("");
    setCargando(true);
    try {
      setServicios(await listarServicios());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  const eliminar = (s: Servicio) => {
    Alert.alert("Eliminar servicio", `¿Seguro que quieres eliminar "${s.nombre}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await eliminarServicio(s.id);
            cargar();
          } catch (e: any) {
            Alert.alert("Error", e.message);
          }
        },
      },
    ]);
  };

  const cabecera = (
    <Stack.Screen
      options={{
        title: "Servicios",
        headerLeft: () => (
          <TouchableOpacity onPress={logout}>
            <Text style={{ color: "#c0392b", fontWeight: "600" }}>Salir</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <View style={{ flexDirection: "row", gap: 16 }}>
            <TouchableOpacity onPress={() => router.push("/reservas")}>
              <Text style={{ color: "#6c3fc5", fontWeight: "600" }}>
                {esAdmin ? "Reservas" : "Mis reservas"}
              </Text>
            </TouchableOpacity>
            {esAdmin && (
              <TouchableOpacity onPress={() => router.push("/servicios/crear")}>
                <Text style={{ color: "#6c3fc5", fontWeight: "600" }}>+ Nuevo</Text>
              </TouchableOpacity>
            )}
          </View>
        ),
      }}
    />
  );

  if (cargando) {
    return (
      <View style={styles.center}>
        {cabecera}
        <ActivityIndicator size="large" color="#6c3fc5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        {cabecera}
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={cargar}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {cabecera}
      <FlatList
        data={servicios}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        ListHeaderComponent={
          <Text style={{ marginBottom: 12, color: "#666" }}>
            {usuario?.email} ({usuario?.rol})
          </Text>
        }
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#666", marginTop: 40 }}>
            No hay servicios disponibles todavía.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: "/servicios/[id]", params: { id: String(item.id) } })}
          >
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <Text style={styles.cardText}>Duración: {item.duracion} min</Text>
            <Text style={styles.cardText}>Precio: ${item.precio}</Text>

            {esAdmin && (
              <View style={styles.smallRow}>
                <TouchableOpacity
                  style={[styles.smallButton, { backgroundColor: "#6c3fc5" }]}
                  onPress={() =>
                    router.push({
                      pathname: "/servicios/crear",
                      params: {
                        id: String(item.id),
                        nombre: item.nombre,
                        descripcion: item.descripcion,
                        duracion: String(item.duracion),
                        precio: String(item.precio),
                      },
                    })
                  }
                >
                  <Text style={styles.smallButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.smallButton, { backgroundColor: "#c0392b" }]}
                  onPress={() => eliminar(item)}
                >
                  <Text style={styles.smallButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}