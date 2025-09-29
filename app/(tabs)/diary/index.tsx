import c from "@/src/constants/colors";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DiaryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Diary Write Page</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 20,
    marginTop: 10,
    backgroundColor: c.bg,
  },
});
