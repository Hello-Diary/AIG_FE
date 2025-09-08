import BackButton from '@/src/components/BackButton';
import c from '@/src/constants/colors';

import { router, Stack } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function DictionaryLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: '나의 사전',
          headerStyle: styles.header,
          headerTitleStyle: styles.title,
          headerShadowVisible: false,
          headerLeft: () => (
            <BackButton />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/dictionary/add')}
            >
              <Text style={styles.addButtonText}>단어 추가</Text>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          title: '단어 추가',
          headerStyle: styles.header,
          headerTitleStyle: styles.title,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          title: '상세 페이지',
          headerStyle: styles.header,
          headerTitleStyle: styles.title,
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: c.button,
  },
  title: {
    color: c.gray2,
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButtonText: {
    color: c.blue4,
    fontSize: 18,
    fontWeight: 'bold',
  },
});