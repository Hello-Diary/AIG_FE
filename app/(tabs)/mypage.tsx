import c from '@/src/constants/colors';
import { StyleSheet, Text, View } from "react-native";

export default function MyPageScreen() {
  return (
    <View style={styles.container}>
      <Text>My Page Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.button,
  },
});