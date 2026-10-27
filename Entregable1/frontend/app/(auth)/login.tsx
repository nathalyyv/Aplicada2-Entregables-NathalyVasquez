import { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import styles from "../../styles";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const enviar = async () => {
    if (!email.trim() || !password) {
      setError("Ingresa tu email y contraseña");
      return;
    }
    setError("");
    setCargando(true);
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      setError(e.message);
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Login" }} />
      <Text style={styles.title}>Iniciar sesión</Text>

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
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => router.push("/registro")}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}