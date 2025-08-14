import c from '@/src/constants/colors';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function DictionaryLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: '나의 사전',
          headerStyle: styles.header,
          headerTitleStyle: styles.title,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          title: '상세 페이지',
          headerStyle: styles.header,
          headerTitleStyle: styles.title,
          headerShadowVisible: false,
          headerBackVisible: true,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: c.button,
  },
  title: {
    color: c.gray2,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
