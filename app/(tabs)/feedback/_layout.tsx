import { Stack } from 'expo-router';

export default function FeedbackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: '일기 피드백',
          headerShown: false,
        }}
      />
    </Stack>
  );
}