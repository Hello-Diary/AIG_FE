import c from "@/src/constants/colors";
import { Pressable, StyleSheet, Text } from "react-native";

export default function MoreButton() {
  return (
    // TODO: 더보기 기능 추가
    <Pressable onPress={() => {}}>
      <Text style={styles.moreButton}>⋯</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  moreButton: {
    fontSize: 25,
    color: c.gray1,
  },
});
