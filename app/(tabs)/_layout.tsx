import c from '@/src/constants/colors';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Tabs.Screen
        name="dictionary"
        options={{
          title: '나의 사전',
          headerStyle: styles.header,
          headerTitleStyle: styles.title,
          headerShadowVisible: false,
        }}
      />
    </Tabs>
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