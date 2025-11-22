import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: '홈',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="journal" 
        options={{ 
          headerShown: false,
        }} 
      />
    </Stack>
  );
}
