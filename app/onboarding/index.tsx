import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 화면 크기
const { width, height } = Dimensions.get("window");

// 온보딩 데이터 (이미지 5개)
const onboardingData = [
  { id: "1", title: "온보딩 페이지 1", image: "onboarding1.png" },
  { id: "2", title: "온보딩 페이지 2", image: "onboarding2.png" },
  { id: "3", title: "온보딩 페이지 3", image: "onboarding3.png" },
  { id: "4", title: "온보딩 페이지 4", image: "onboarding4.png" },
  { id: "5", title: "온보딩 페이지 5", image: "onboarding5.png" },
];

const LAST_PAGE_INDEX = onboardingData.length - 1;

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // 로그인 페이지로 이동하고, 온보딩 완료 상태를 저장
  const handleCompleteOnboarding = async () => {
    try {
      await AsyncStorage.setItem("@hasSeenOnboarding", "true");
      // replace를 사용해 온보딩 화면으로 다시 돌아올 수 없게 합니다.
      router.replace("/login");
    } catch (e) {
      console.error("Failed to save onboarding status", e);
    }
  };

  const handleNext = () => {
    // 요청하신 (prev) => (prev + 1) 로직입니다.
    const nextIndex = currentIndex + 1;

    if (currentIndex === LAST_PAGE_INDEX) {
      // 마지막 페이지라면 온보딩 완료 처리
      handleCompleteOnboarding();
    } else {
      // 다음 페이지로 스크롤
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      // onViewableItemsChanged가 setCurrentIndex를 호출할 것입니다.
    }
  };

  // 사용자가 직접 스와이프할 때 currentIndex를 업데이트
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const renderItem = ({ item }: { item: (typeof onboardingData)[0] }) => {
    return (
      <View style={styles.page}>
        {/* 이미지 플레이스홀더입니다.
          실제 이미지를 사용하려면 아래 View를 <Image> 컴포넌트로 바꾸고
          require('../../assets/images/onboarding1.png')와 같이 경로를 설정하세요.
        */}
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageText}>{item.title}</Text>
          <Text style={styles.imageText}>({item.image})</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef} // ref 연결
        data={onboardingData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        onViewableItemsChanged={onViewableItemsChanged} // 뷰 변경 리스너
        viewabilityConfig={viewabilityConfig} // 뷰 설정
        bounces={false} // 끝에서 튕기지 않게
      />
      {/* 하단 버튼 영역 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleCompleteOnboarding}
          style={styles.button}
        >
          <Text style={styles.buttonText}>스킵</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext} // handleNext 함수로 변경
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {/* 마지막 페이지인지 확인하여 텍스트 변경 */}
            {currentIndex === LAST_PAGE_INDEX ? "로그인하기" : "다음"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  page: {
    width: width,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 120, // 버튼 영역 확보
  },
  imagePlaceholder: {
    width: width * 0.8,
    height: height * 0.6,
    backgroundColor: "#eee",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  imageText: {
    fontSize: 18,
    color: "#555",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
