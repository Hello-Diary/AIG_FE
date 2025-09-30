import { Stack } from 'expo-router';

export default function DiaryLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: '일기',
          headerShown: false,
        }}
      />
    </Stack>
  );
}