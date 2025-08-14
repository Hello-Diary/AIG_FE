import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: '홈',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="dictionary"
        options={{
          title: '나의 사전',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: '마이페이지',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}