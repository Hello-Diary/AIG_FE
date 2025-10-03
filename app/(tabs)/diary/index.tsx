import React from 'react';
import DiaryScreen from './writeDiary';

<<<<<<< HEAD
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
=======
export default function DiaryPage() {
  return <DiaryScreen />;
}
>>>>>>> f28377c6f5e7d039e34d0ae9be8e2effb78810a6
