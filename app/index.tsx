import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboardingAndDelay = async () => {
      
      // 1. AsyncStorage 데이터 읽기 작업
      const dataPromise = AsyncStorage.getItem('@hasSeenOnboarding');
      
      // 2. 최소 2초를 기다리는 지연 작업 정의
      const delayPromise = new Promise(resolve => setTimeout(resolve, 2000)); // 2초 지연
      
      // 3. 데이터 로딩과 2초 지연 작업 중 더 오래 걸리는 쪽을 기다립니다.
      const [value] = await Promise.all([dataPromise, delayPromise]);
      
      // 4. 모든 작업 완료 후 상태 업데이트
      const seen = value === 'true';
      setHasSeenOnboarding(seen);
    };
    
    checkOnboardingAndDelay();
  }, []);

  // hasSeenOnboarding이 null인 동안 (최소 2초) 요청하신 로딩 화면을 표시합니다.
  if (hasSeenOnboarding === null) {
    return (
      <SafeAreaView style={customStyles.container}>
        <View style={customStyles.contentContainer}>
          <Text style={customStyles.title}>HELLO{"\n"}DIARY</Text>
          <Text style={customStyles.subtitle}>
            일기로 영어를 학습하는 헬로 다이어리
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // 온보딩을 이미 봤다면, 로그인 페이지로 이동
  if (hasSeenOnboarding) {
    // 💡 현재 폴더 구조 (login/)에 맞춥니다.
    return <Redirect href="/login" />; 
  }
  
  // 온보딩을 보지 않았다면, 온보딩 페이지로 이동
  // 💡 현재 폴더 구조 (onboarding/)에 맞춥니다.
  return <Redirect href="/onboarding" />;
}

const customStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4052E2", 
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 54,
  },
  subtitle: {
    fontSize: 18,
    color: "#7B89FF",
    textAlign: "center",
    fontWeight: "semibold",
  },
});