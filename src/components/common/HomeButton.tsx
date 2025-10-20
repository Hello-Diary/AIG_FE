import c from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable } from "react-native";

export default function HomeButton() {
  return (
    <Pressable onPress={() => router.push("/(tabs)")}>
      <Ionicons
        name="home-outline"
        style={{ padding: 8 }}
        size={25}
        color={c.gray1}
      />
    </Pressable>
  );
}
