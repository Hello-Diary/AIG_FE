import c from "@/src/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 화면 크기
const { width, height } = Dimensions.get("window");

// 온보딩 데이터 (이미지 5개)
// 이미지 경로를 require()로 직접 지정 - require는 앱이 빌드될 때 경로를 알아야 함
const onboardingData = [
  {
    id: "1",
    title: "온보딩 페이지 1",
    image: require("@/assets/images/onboarding/onboarding1.png"),
  },
  {
    id: "2",
    title: "온보딩 페이지 2",
    image: require("@/assets/images/onboarding/onboarding2.png"),
  },
  {
    id: "3",
    title: "온보딩 페이지 3",
    image: require("@/assets/images/onboarding/onboarding3.png"),
  },
  {
    id: "4",
    title: "온보딩 페이지 4",
    image: require("@/assets/images/onboarding/onboarding4.png"),
  },
  {
    id: "5",
    title: "온보딩 페이지 5",
    image: require("@/assets/images/onboarding/onboarding5.png"),
  },
];

const LAST_PAGE_INDEX = onboardingData.length - 1;

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0); // FlatList의 인덱스는 0부터 시작
  const flatListRef = useRef<FlatList>(null);

  // 로그인 페이지로 이동하고, 온보딩 완료 상태를 저장
  const handleCompleteOnboarding = async () => {
    try {
      await AsyncStorage.setItem("@hasSeenOnboarding", "true");

      // replace를 사용해 온보딩 화면으로 다시 돌아올 수 없게 함
      router.replace("/login");
    } catch (e) {
      console.error("Failed to save onboarding status", e);
    }
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;

    if (currentIndex === LAST_PAGE_INDEX) {
      // 마지막 페이지라면 온보딩 완료 처리
      handleCompleteOnboarding();
    } else {
      // 다음 페이지로 스크롤
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      // onViewableItemsChanged가 setCurrentIndex를 호출할 것
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

  // 뷰 설정 (항목이 50% 이상 보여야 변경으로 간주)
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const renderItem = ({ item }: { item: (typeof onboardingData)[0] }) => {
    return (
      <View style={styles.page}>
        <View style={styles.imageContainer}>
          <Image
            source={item.image}
            style={styles.image} // 이미지 자체에 스타일 적용
            resizeMode="contain" // 이미지가 잘리지 않게
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* skip 버튼 */}
      <Text style={styles.skipText} onPress={handleCompleteOnboarding}>
        {/* 마지막 페이지인지 확인하여 텍스트 변경 */}
        {currentIndex === LAST_PAGE_INDEX ? "완료" : "skip"}
      </Text>

      {/* 온보딩 이미지 리스트 */}
      <FlatList
        ref={flatListRef} // ref 연결
        data={onboardingData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged} // 뷰 변경 리스너
        viewabilityConfig={viewabilityConfig} // 뷰 설정
        bounces={false} // 끝에서 튕기지 않게
      />
      <View style={styles.controlsContainer}>
        <View style={styles.paginationContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                // 현재 인덱스와 일치하면 활성 스타일 적용
                index === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* 하단 버튼 영역 */}
        <View style={styles.buttonContainer}>
          {/* 다음/완료 버튼 */}
          <TouchableOpacity
            onPress={handleNext} // handleNext 함수로 변경
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {/* 마지막 페이지인지 확인하여 텍스트 변경 */}
              {currentIndex === LAST_PAGE_INDEX ? "완료" : "다음"}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>이미 계정이 있으신가요? 바로 </Text>
            <Text
              style={{ ...styles.loginText, color: c.primary }}
              onPress={handleCompleteOnboarding}
            >
              로그인하세요
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.mainwhite,
  },
  page: {
    width: width,
    height: height * 0.75,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: width * 0.8,
    height: height * 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 20,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: c.button,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: c.gray1,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  button: {
    backgroundColor: c.primary,
    paddingVertical: 20,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: c.mainwhite,
    fontSize: 20,
    fontWeight: "bold",
  },
  skipText: {
    position: "absolute",
    top: 70,
    right: 25,
    color: c.gray2,
    fontSize: 18,
    fontWeight: "500",
    zIndex: 10, // FlatList 위에 표시되도록 zIndex 추가
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginText: {
    color: c.bluegray1,
    fontSize: 16,
    fontWeight: "500",
  },
});
