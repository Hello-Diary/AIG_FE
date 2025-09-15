import c from '@/src/constants/colors';
import { StyleSheet, Text, View } from 'react-native';

export default function DictionaryDetailScreen() {
  return (
    <View style={styles.container}>
      <Text>detail Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.bg,
  },
});
