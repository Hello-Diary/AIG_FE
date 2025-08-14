import c from '@/src/constants/colors';
import { StyleSheet, Text, View } from "react-native";

export default function DictionaryScreen() {
  return (
    <View style={styles.container}>
      <Text>Dictionary Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.button,
  },
});