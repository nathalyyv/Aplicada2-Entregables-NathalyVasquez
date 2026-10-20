import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import RegistroScreen from "../screens/RegistroScreen";
import RegistroAdminScreen from "../screens/RegistroAdminScreen";
import ServiciosScreen from "../screens/ServiciosScreen";
import CrearServicioScreen from "../screens/CrearServicioScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { token, esAdmin, cargando } = useAuth();

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6c3fc5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token ? (
          <>
            <Stack.Screen name="Servicios" component={ServiciosScreen} />
            {esAdmin && (
              <Stack.Screen
                name="CrearServicio"
                component={CrearServicioScreen}
                options={({ route }) => ({
                  title: route.params?.servicio ? "Editar servicio" : "Nuevo servicio",
                })}
              />
            )}
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
            <Stack.Screen name="Registro" component={RegistroScreen} options={{ title: "Registro" }} />
            <Stack.Screen
              name="RegistroAdmin"
              component={RegistroAdminScreen}
              options={{ title: "Registro administrador" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}