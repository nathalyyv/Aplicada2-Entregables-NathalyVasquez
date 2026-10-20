import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
import { request } from "../services/api";
import styles from "../styles";

export default function CrearServicioScreen({ navigation, route }) {
  const servicio = route.params?.servicio;
  const editando = !!servicio;

  const [nombre, setNombre] = useState(servicio?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(servicio?.descripcion ?? "");
  const [duracion, setDuracion] = useState(servicio ? String(servicio.duracion) : "");
  const [precio, setPrecio] = useState(servicio ? String(servicio.precio) : "");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const guardar = async () => {
    if (!nombre.trim() || !descripcion.trim() || !duracion || !precio) {
      setError("Completa todos los campos");
      return;
    }
    setError("");
    setCargando(true);
    try {
      await request(editando ? `/servicios/${servicio.id}` : "/servicios", {
        method: editando ? "PUT" : "POST",
        body: {
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          duracion: Number(duracion),
          precio: Number(precio),
        },
      });
      navigation.goBack();
    } catch (e) {
      setError(e.message);
      setCargando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{editando ? "Editar servicio" : "Nuevo servicio"}</Text>

      <TextInput style={styles.input} 
      placeholder="Nombre" value={nombre} 
      placeholderTextColor="#999"
      onChangeText={setNombre} />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        placeholderTextColor="#999"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <TextInput
        style={styles.input}
        placeholder="Duración (minutos)"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={duracion}
        onChangeText={setDuracion}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        placeholderTextColor="#999"
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