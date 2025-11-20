import DictionaryBlueIcon from "@/assets/icons/book-blue.svg";
import DictionaryIcon from "@/assets/icons/book.svg";
import HomeBlueIcon from "@/assets/icons/home-blue.svg";
import HomeIcon from "@/assets/icons/home.svg";
import MyPageBlueIcon from "@/assets/icons/user-blue.svg";
import MyPageIcon from "@/assets/icons/user.svg";

import c from "@/src/constants/colors";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.bluegray1,
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="home"
        options={{
          title: "홈",
          headerShown: false,
          tabBarIcon: ({ size, focused }) =>
            focused ? (
              <HomeBlueIcon width={size} height={size} />
            ) : (
              <HomeIcon width={size} height={size} />
            ),
        }}
      />
      <Tabs.Screen
        name="dictionary"
        options={{
          title: "나의 사전",
          headerShown: false,
          tabBarIcon: ({ size, focused }) =>
            focused ? (
              <DictionaryBlueIcon width={size} height={size} />
            ) : (
              <DictionaryIcon width={size} height={size} />
            ),
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: "마이페이지",
          headerShown: false,
          tabBarIcon: ({ size, focused }) =>
            focused ? (
              <MyPageBlueIcon width={size} height={size} />
            ) : (
              <MyPageIcon width={size} height={size} />
            ),
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="grammar"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="suggestion"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}