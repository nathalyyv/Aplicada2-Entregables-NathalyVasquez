import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { crearReserva } from "../../../features/reservas/reservas.api";
import { validarReserva } from "../../../lib/validaciones";
import styles from "../../../styles";

export default function NuevaReserva() {
  const router = useRouter();
  const { servicioId, nombre } = useLocalSearchParams<{ servicioId: string; nombre: string }>();
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const reservar = async () => {
    const problema = validarReserva(fecha, hora);
    if (problema) {
      setError(problema);
      return;
    }
    setError("");
    setCargando(true);
    try {
      await crearReserva(Number(servicioId), fecha, hora);
      Alert.alert("Listo", "Tu reserva fue creada y está pendiente");
      router.replace("/reservas");
    } catch (e: any) {
      setError(e.message);
      setCargando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: "Nueva reserva" }} />
      <Text style={styles.title}>Reservar</Text>
      <Text style={{ textAlign: "center", marginBottom: 16, fontSize: 17 }}>{nombre}</Text>

      <TextInput
        style={styles.input}
        placeholder="Fecha (AAAA-MM-DD)"
        value={fecha}
        onChangeText={setFecha}
        keyboardType="numbers-and-punctuation"
        maxLength={10}
      />
      <TextInput
        style={styles.input}
        placeholder="Hora (HH:MM)"
        value={hora}
        onChangeText={setHora}
        keyboardType="numbers-and-punctuation"
        maxLength={5}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {cargando ? (
        <ActivityIndicator size="large" color="#6c3fc5" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={reservar}>
          <Text style={styles.buttonText}>Confirmar reserva</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}