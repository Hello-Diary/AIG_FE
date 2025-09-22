import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="dictionary"
        options={{
          title: 'Dictionary',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: 'My Page',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}