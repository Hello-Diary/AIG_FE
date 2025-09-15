import c from '@/src/constants/colors';
import { StyleSheet, Text, View } from 'react-native';

export default function DictionaryAddScreen() {
  return (
    <View style={styles.container}>
      <Text>add Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.bg,
  },
});
