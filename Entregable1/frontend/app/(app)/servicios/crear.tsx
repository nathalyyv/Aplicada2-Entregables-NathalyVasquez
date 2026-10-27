import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import { guardarServicio } from "../../../features/servicios/servicios.api";
import styles from "../../../styles";

export default function CrearServicio() {
  const router = useRouter();
  const { esAdmin } = useAuth();
  const p = useLocalSearchParams<{
    id?: string;
    nombre?: string;
    descripcion?: string;
    duracion?: string;
    precio?: string;
  }>();
  const editando = !!p.id;

  const [nombre, setNombre] = useState(p.nombre ?? "");
  const [descripcion, setDescripcion] = useState(p.descripcion ?? "");
  const [duracion, setDuracion] = useState(p.duracion ?? "");
  const [precio, setPrecio] = useState(p.precio ?? "");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  if (!esAdmin) {
    return <Text style={styles.error}>Solo los administradores pueden ver esta pantalla</Text>;
  }

  const guardar = async () => {
    if (!nombre.trim() || !descripcion.trim() || !duracion || !precio) {
      setError("Completa todos los campos");
      return;
    }
    setError("");
    setCargando(true);
    try {
      await guardarServicio(p.id ? Number(p.id) : null, {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        duracion: Number(duracion),
        precio: Number(precio),
      });
      router.back();
    } catch (e: any) {
      setError(e.message);
      setCargando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: editando ? "Editar servicio" : "Nuevo servicio" }} />
      <Text style={styles.title}>{editando ? "Editar servicio" : "Nuevo servicio"}</Text>

      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <TextInput
        style={styles.input}
        placeholder="Duración (minutos)"
        keyboardType="numeric"
        value={duracion}
        onChangeText={setDuracion}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        keyboardType="decimal-pad"
        value={precio}
        onChangeText={setPrecio}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {cargando ? (
        <ActivityIndicator size="large" color="#6c3fc5" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={guardar}>
          <Text style={styles.buttonText}>{editando ? "Guardar cambios" : "Guardar servicio"}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}