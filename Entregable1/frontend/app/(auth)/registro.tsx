import { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import styles from "../../styles";

export default function Registro() {
  const { registro, login } = useAuth();
  const router = useRouter();
  const { admin } = useLocalSearchParams<{ admin?: string }>();
  const esAdmin = admin === "1";

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const enviar = async () => {
    if (!nombre.trim() || !email.trim() || !password) {
      setError("Completa todos los campos");
      return;
    }
    setError("");
    setCargando(true);
    try {
      await registro(nombre.trim(), email.trim(), password, esAdmin ? "admin" : "cliente");
      await login(email.trim(), password);
    } catch (e: any) {
      setError(e.message);
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: esAdmin ? "Registro administrador" : "Registro" }} />
      <Text style={styles.title}>{esAdmin ? "Cuenta de administrador" : "Crear cuenta"}</Text>

      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {cargando ? (
        <ActivityIndicator size="large" color="#6c3fc5" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={enviar}>
          <Text style={styles.buttonText}>Registrarme</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Ya tengo cuenta</Text>
      </TouchableOpacity>

      {!esAdmin && (
        <TouchableOpacity onPress={() => router.push({ pathname: "/registro", params: { admin: "1" } })}>
          <Text style={styles.link}>Registrarme como administrador</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}