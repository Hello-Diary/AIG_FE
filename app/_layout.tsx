import c from '@/src/constants/colors';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';

function useNotificationObserver() {
  const router = useRouter();
  
  useEffect(() => {
    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (typeof url === 'string') {
        router.push("/diary");
      }
    }

    const response = Notifications.getLastNotificationResponse();
    if (response?.notification) {
      redirect(response.notification);
    }

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      redirect(response.notification);
    });

    return () => {
      subscription.remove();
    };
  }, []);
}

export default function RootLayout() {
  useNotificationObserver();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: c.bg },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}