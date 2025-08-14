import c from '@/src/constants/colors';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function MyPageLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: '마이페이지',
          headerStyle: styles.header,
          headerTitleStyle: styles.title,
          headerShadowVisible: false,
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
