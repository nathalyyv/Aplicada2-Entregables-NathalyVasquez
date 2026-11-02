import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function programarNotificacionReserva(nombreServicio, fechaReservaStr) {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Se necesitan permisos para enviar notificaciones.');
    return;
  }

  const fechaReserva = new Date(fechaReservaStr);
  const triggerTime = new Date(fechaReserva.getTime() - 60 * 1000); 
  const trigger = triggerTime > new Date() ? triggerTime : new Date(Date.now() + 5 * 1000);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "¡Recordatorio de tu cita!",
      body: `Tienes una reserva para el servicio: ${nombreServicio} próximamente.`,
      sound: true,
    },
    trigger,
  });
}