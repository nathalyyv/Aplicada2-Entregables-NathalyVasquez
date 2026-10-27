import { ActivityIndicator, View } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import styles from "../../styles";

export default function AuthLayout() {
  const { token, cargando } = useAuth();

  if (cargando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6c3fc5" />
      </View>
    );
  }
  if (token) return <Redirect href="/servicios" />;

  return <Stack />;
}