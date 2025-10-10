import BackButton from '@/src/components/buttons/BackButton';

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
      {/* <Stack.Screen
        name="add"
        options={{
          title: '단어 추가',
          headerStyle: styles.header,
          headerTitleStyle: styles.title,
          headerShadowVisible: false,
        }}
      /> */}
    </Stack>
  );
}

const styles = StyleSheet.create({
});