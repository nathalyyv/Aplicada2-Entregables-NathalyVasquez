import { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import styles from "../styles";

export default function RegistroAdminScreen({ navigation }) {
  const { registro, login } = useAuth();
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
      await registro(nombre.trim(), email.trim(), password, "admin");
      await login(email.trim(), password);
    } catch (e) {
      setError(e.message);
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta de administrador</Text>

      <TextInput style={styles.input} 
      placeholder="Nombre"
      placeholderTextColor="#999"
       value={nombre} 
       onChangeText={setNombre} 
       />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {cargando ? (
        <ActivityIndicator size="large" color="#6c3fc5" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={enviar}>
          <Text style={styles.buttonText}>Registrarme como administrador</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Volver al registro normal</Text>
      </TouchableOpacity>
    </View>
  );
}