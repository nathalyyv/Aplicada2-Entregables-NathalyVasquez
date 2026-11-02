import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const API_URL = "https://aplicada2-entregables-nathalyvasquez.onrender.com"; 

export default function PerfilScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      const storedEmail = await AsyncStorage.getItem('userEmail');
      if (storedName) setNombre(storedName);
      if (storedEmail) setEmail(storedEmail);
    };
    cargarDatos();
  }, []);

  const actualizarPerfil = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const urlCompleta = `${API_URL}/usuarios/perfil`;
      console.log("Enviando petición a:", urlCompleta);

      const response = await fetch(urlCompleta, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre })
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (response.ok) {
        await AsyncStorage.setItem('userName', data.nombre || nombre);
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
      } else {
        Alert.alert('Error', data.error || data.mensaje || 'No se pudo actualizar');
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      Alert.alert('Error', 'Hubo un fallo de conexión con el servidor');
    }
  };

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userName');
    await AsyncStorage.removeItem('userEmail');
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.emailText}>{email || 'Cargando...'}</Text>

      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Tu nombre"
      />

      <TouchableOpacity style={styles.saveButton} onPress={actualizarPerfil}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 5, color: '#333' },
  emailText: { fontSize: 16, marginBottom: 15, color: '#666' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 16 },
  saveButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  logoutButton: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});