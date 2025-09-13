import c from '@/src/constants/colors';
import { router } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function DictionaryScreen() {
  return (
    <View style={styles.container}>
      <Text>Dictionary Screen</Text>
      <Button title="상세 페이지로" onPress={() => router.push('/dictionary/details')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.button,
  },
});
