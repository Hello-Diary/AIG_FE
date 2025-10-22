import BackButton from '@/src/components/common/BackButton';

import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function DictionaryLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: '나의 사전',
          headerShown: false,
          headerLeft: () => (
            <BackButton />
          ),
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
});