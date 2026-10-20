import { useCallback, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { request } from "../services/api";
import styles from "../styles";

export default function ServiciosScreen({ navigation }) {
  const { esAdmin, usuario, logout } = useAuth();
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={logout}>
          <Text style={{ color: "#c0392b", fontWeight: "600" }}>Salir</Text>
        </TouchableOpacity>
      ),
      headerRight: () =>
        esAdmin ? (
          <TouchableOpacity onPress={() => navigation.navigate("CrearServicio")}>
            <Text style={{ color: "#6c3fc5", fontWeight: "600" }}>+ Nuevo</Text>
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, esAdmin, logout]);

  const cargar = useCallback(async () => {
    setError("");
    setCargando(true);
    try {
      const data = await request("/servicios");
      setServicios(data);
    } catch (e) {
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

  const eliminar = (servicio) => {
    Alert.alert(
      "Eliminar servicio",
      `¿Seguro que quieres eliminar "${servicio.nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await request(`/servicios/${servicio.id}`, { method: "DELETE" });
              cargar();
            } catch (e) {
              Alert.alert("Error", e.message);
            }
          },
        },
      ]
    );
  };

  if (cargando) {
    return (
      <View style={[styles.container, { alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#6c3fc5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={cargar}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
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
        <View style={local.card}>
          <Text style={local.nombre}>{item.nombre}</Text>
          <Text style={local.detalle}>Duración: {item.duracion} min</Text>
          <Text style={local.detalle}>Precio: ${item.precio}</Text>

          {esAdmin && (
            <View style={local.acciones}>
              <TouchableOpacity
                style={[local.boton, { backgroundColor: "#6c3fc5" }]}
                onPress={() => navigation.navigate("CrearServicio", { servicio: item })}
              >
                <Text style={local.botonTexto}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[local.boton, { backgroundColor: "#c0392b" }]}
                onPress={() => eliminar(item)}
              >
                <Text style={local.botonTexto}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    />
  );
}

const local = StyleSheet.create({
  card: {
    backgroundColor: "#f5f0ff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  nombre: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  detalle: { fontSize: 15, color: "#444" },
  acciones: { flexDirection: "row", gap: 10, marginTop: 12 },
  boton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  botonTexto: { color: "#fff", fontWeight: "600" },
});