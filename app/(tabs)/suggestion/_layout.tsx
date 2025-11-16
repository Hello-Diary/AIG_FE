import { Stack } from 'expo-router';

export default function SuggestionLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: '일기 AI 피드백',
          headerShown: false,
        }}
      />
    </Stack>
  );
}