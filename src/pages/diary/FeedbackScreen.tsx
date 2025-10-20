import HomeButton from "@/src/components/common/HomeButton";
import MoreButton from "@/src/components/common/MoreButton";
import DeleteModal from "@/src/components/diary/DeleteModal";
import MoveModal from "@/src/components/diary/MoveModal";
import c from "@/src/constants/colors";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FeedbackScreen() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDestModalVisible, setIsDestModalVisible] = useState<boolean>(false);
  // const [isListModalVisible, setIsListModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<"my" | "ai">("my");
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(280)).current;

  const data = {
    date: "2025.02.12",
    originalDiary:
      "Today I waked up late and missed the school bus. I runned to the bus stop but the bus already gone. My mom was little angry because I was not ready. At school, I forget my homework at home. It was not best day for me.",
  };
  const correctedDiary = [
    { text: "Today I ", key: "1" },
    {
      text: "woke",
      key: "2",
      wrong: "waked",
      explanation:
        "‘wake’는 동사의 원형이고, ‘woke’는 과거형입니다. 오늘 있었던 일을 쓰는 것이므로 과거형 ‘woke’를 사용합니다.",
    },
    { text: " up late and missed the school bus. I ", key: "3" },
    {
      text: "ran",
      key: "4",
      wrong: "runned",
      explanation:
        "‘run’의 과거형은 ‘ran’입니다. ‘runned’는 잘못된 형태입니다.",
    },
    {
      text: " to the bus stop, but the bus had already gone. My mom was a little angry because I wasn’t ready. At school, I ",
      key: "5",
    },
    {
      text: "forgot",
      key: "6",
      wrong: "forget",
      explanation:
        "‘forget’의 과거형은 ‘forgot’입니다. 과거 시제에 맞게 수정되었습니다.",
    },
    { text: " my homework at home. It was not the best day for me.", key: "7" },
  ];

  const toggleMenu = () => {
    const toValue = isMenuOpen ? 280 : 0;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuAction = (action: string) => {
    if (action === "dictionary") {
      setIsDestModalVisible(true);
      toggleMenu();
      // } else if (action === "list") {
      // setIsListModalVisible(true);
      //   toggleMenu();
    } else if (action === "delete") {
      setIsDeleteModalVisible(true);
      toggleMenu();
    }
  };

  const handleDestinationConfirm = () => {
    setIsDestModalVisible(false);
    router.push("/dictionary");
  }

  const handleDestinationCancel = () => {
    setIsDestModalVisible(false);
  }

  // const handleListConfirm = () => {
  //   setIsListModalVisible(false);
  //   router.push("/list");
  // }

  // const handleListCancel = () => {
  //   setIsListModalVisible(false);
  // }

  const handleDeleteConfirm = () => {
    console.log("Diary deleted");
    setIsDeleteModalVisible(false);
    // 삭제 후 이전 화면으로 이동하는 로직 추가
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <MoveModal
        destination="dictionary"
        visible={isDestModalVisible}
        onConfirm={handleDestinationConfirm}
        onCancel={handleDestinationCancel}
      />

      {/* <MoveModal
        destination="list"
        visible={isListModalVisible}
        onConfirm={handleListinationConfirm}
        onCancel={handleListinationCancel}
      /> */}

      <DeleteModal
        visible={isDeleteModalVisible}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {/* Menu Overlay */}
      {isMenuOpen && (
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={toggleMenu}
        />
      )}

      {/* Side Menu */}
      <Animated.View
        style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}
      >
        <View style={styles.menuContent}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuAction("dictionary")}
          >
            <Text style={styles.menuItemText}>나의 사전으로 이동하기</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />

          {/* <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuAction("list")}
          >
            <Text style={styles.menuItemText}>일기 목록 보기</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} /> */}

          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemDelete]}
            onPress={() => handleMenuAction("delete")}
          >
            <Text style={[styles.menuItemText, styles.menuItemDeleteText]}>
              삭제하기
            </Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <HomeButton />
          <Text style={styles.date}>{data.date}</Text>
          <MoreButton toggleMenu={toggleMenu} />
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "my" && styles.tabActive]}
            onPress={() => setSelectedTab("my")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "my" && styles.tabTextActive,
              ]}
            >
              내가 쓴 일기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "ai" && styles.tabActive]}
            onPress={() => {
              setSelectedTab("ai");
              setSelectedWord(null);
            }}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "ai" && styles.tabTextActive,
              ]}
            >
              AI 교정 일기
            </Text>
          </TouchableOpacity>
        </View>

        {/* 일기 카드 */}
        <View style={styles.scroll}>
          <View style={styles.card}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>missed the bus</Text>
              <View style={styles.emoji}>
                <Text>😱</Text>
              </View>
            </View>

            {selectedTab === "my" ? (
              <Text style={styles.content}>{data.originalDiary}</Text>
            ) : (
              <Text style={styles.content}>
                {correctedDiary.map((item) => {
                  if (item.explanation) {
                    return (
                      <Text
                        key={item.key}
                        style={[
                          { color: c.primary },
                          selectedWord === item.key &&
                            styles.selectedCorrection,
                        ]}
                        onPress={() =>
                          setSelectedWord(
                            selectedWord === item.key ? null : item.key
                          )
                        }
                      >
                        {item.text}
                      </Text>
                    );
                  } else {
                    return (
                      <Text key={item.key} style={{ color: c.black }}>
                        {item.text}
                      </Text>
                    );
                  }
                })}
              </Text>
            )}
          </View>

          {/* 안내 문구 / 단어 설명 */}
          {selectedTab === "ai" && !selectedWord && (
            <Text style={styles.tip}>
              ⓘ 교정된 단어를 클릭하여 설명을 확인하세요.
            </Text>
          )}
          {selectedTab === "ai" && selectedWord && (
            <View style={styles.explainBox}>
              <Text style={styles.explainTitle}>
                {correctedDiary.find((d) => d.key === selectedWord)?.wrong} →{" "}
                {correctedDiary.find((d) => d.key === selectedWord)?.text}
              </Text>
              <Text style={styles.explainText}>
                {
                  correctedDiary.find((d) => d.key === selectedWord)
                    ?.explanation
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomFixedContainer}>
        <TouchableOpacity style={styles.footerButton}>
          <View style={styles.footerButtonUnderline}>
            <Text style={styles.footerButtonText}>AI 추천 표현 보기</Text>
          </View>
          <Text style={styles.footerButtonText}>&gt;</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },

  // Menu Styles
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 998,
  },
  sideMenu: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 280,
    height: "100%",
    backgroundColor: c.mainwhite,
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  menuContent: {
    paddingTop: 60,
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  menuItem: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 16,
    color: c.black,
    fontWeight: "600",
  },
  menuItemDelete: {
    backgroundColor: "transparent",
  },
  menuItemDeleteText: {
    color: c.red,
    fontSize: 16,
    fontWeight: "600",
  },

  // Header Style
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  date: {
    fontSize: 16,
    fontWeight: "500",
  },
  tabContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: c.bg,
    borderWidth: 1,
    borderColor: c.primary,
    borderRadius: 30,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  tabActive: {
    backgroundColor: c.primary,
  },
  tabText: {
    color: c.primary,
    fontSize: 14,
  },
  tabTextActive: {
    color: c.mainwhite,
    fontWeight: "600",
  },
  scroll: {
    flex: 1,
  },
  card: {
    borderWidth: 1,
    borderColor: c.primary,
    borderRadius: 12,
    backgroundColor: c.mainwhite,
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: c.gray4,
    paddingBottom: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  emoji: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: c.button,
  },
  content: {
    fontSize: 14,
    lineHeight: 22,
  },
  selectedCorrection: {
    backgroundColor: c.yellow,
  },
  tip: {
    color: c.border,
    fontSize: 12,
    marginVertical: 14,
    marginHorizontal: 4,
  },
  explainBox: {
    padding: 12,
    marginBottom: 16,
  },
  explainTitle: {
    fontWeight: "600",
    marginBottom: 4,
    color: c.primary,
  },
  explainText: {
    color: c.black,
    fontSize: 13,
    lineHeight: 20,
  },

  // Button
  bottomFixedContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: c.bg,
    paddingHorizontal: 20,
    paddingBottom: 55,
    paddingTop: 12,
  },
  footerButton: {
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: c.primary,
    borderRadius: 10,
    alignItems: "center",
    padding: 20,
    gap: 8,
  },
  footerButtonUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: c.primary,
  },
  footerButtonText: {
    color: c.primary,
    fontSize: 16,
    fontWeight: "500",
  },
});
