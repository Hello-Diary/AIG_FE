import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Index() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        // AsyncStorage에서 온보딩 완료 여부를 불러옵니다.
        const value = await AsyncStorage.getItem('@hasSeenOnboarding');
        setHasSeenOnboarding(value === 'true');
      } catch (e) {
        console.error('Failed to load onboarding status', e);
        // 에러 발생 시 기본값(온보딩 안 봄)으로 처리
        setHasSeenOnboarding(false);
      }
    };
    checkOnboarding();
  }, []);

  // AsyncStorage 확인 중... 로딩 스피너를 보여줍니다.
  if (hasSeenOnboarding === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 온보딩을 이미 봤다면, 로그인 페이지로 이동
  if (hasSeenOnboarding) {
    return <Redirect href="/login" />;
  }
  
  // 온보딩을 보지 않았다면, 온보딩 페이지로 이동
  return <Redirect href="/onboarding" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
