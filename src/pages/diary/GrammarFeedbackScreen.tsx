import { postGrammarCheckApi } from "@/src/api/grammarApi";
import { deleteJournalApi, getJournalApi } from "@/src/api/journalApi";
import HomeButton from "@/src/components/common/HomeButton";
import MoreButton from "@/src/components/common/MoreButton";
import DeleteModal from "@/src/components/diary/DeleteModal";
import MoveModal from "@/src/components/diary/MoveModal";
import c from "@/src/constants/colors";
import { useJournalStore } from "@/src/stores/useJournalStore";
import { useSuggestionStore } from "@/src/stores/useSuggestionStore";
import { useAuthStore } from "@/src/stores/useUserStore";
import { Edit, GrammarRequest, GrammarResponse, ProcessedSegment } from "@/src/types/grammar";
import { JournalResponse } from "@/src/types/journal";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GrammarFeedbackScreen() {
  const { userId } = useAuthStore();
  const { currentJournalId } = useJournalStore();
  const { setIsSuggested } = useSuggestionStore();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDestModalVisible, setIsDestModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<"my" | "ai">("my");
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [originalDiary, setOriginalDiary] = useState<JournalResponse>({} as JournalResponse);
  const [grammarFeedback, setGrammarFeedback] = useState<GrammarResponse>();
  const [processedContent, setProcessedContent] = useState<ProcessedSegment[]>(
    []
  );

  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(280)).current;

  const getOriginalDiary = async () => {
    if (!currentJournalId) {
      console.log("No journal ID found");
      return;
    }
    if (!userId) {
      console.log("No user ID found");
      return;
    }

    try {
      const res = await getJournalApi(userId, currentJournalId);
      setOriginalDiary(res);
      setIsSuggested(res.isSuggested);  // isSuggested 전역 상태에 저장
    } catch (error) {
      console.error("Failed to get original diary:", error);
    }
  };

  const getFeedbackDiary = async () => {
    if (!currentJournalId) {
      console.log("No journal ID found");
      return;
    }

    if (!originalDiary) {
      console.log("Original diary not rendered");
      return;
    }

    try {
      const data: GrammarRequest = {
        text: originalDiary.content
      };

      const res = await postGrammarCheckApi(data);
      setGrammarFeedback(res);
    } catch (error) {
      console.error("Failed to get grammar feedback:", error);
    }
  };

  // 원본 텍스트와 수정 정보를 결합하는 헬퍼 함수
  const processFeedback = (
    originalContent: string,
    edits: Edit[]
  ): ProcessedSegment[] => {
    const result: ProcessedSegment[] = [];
    let currentIndex = 0;

    // start 인덱스 기준으로 오름차순 정렬
    const sortedEdits = [...edits].sort((a, b) => a.start - b.start);

    sortedEdits.forEach((edit, index) => {
      // 1. 수정 시작점 이전의 원본 텍스트 추가
      if (edit.start > currentIndex) {
        const text = originalContent.substring(currentIndex, edit.start);
        result.push({
          text: text,
          key: `seg-${currentIndex}-${index}`,
        });
      }

      // 2. 교정된 텍스트 추가 (클릭 가능한 부분)
      const originalWord = originalContent.substring(edit.start, edit.end);
      
      // 💡 수정된 핵심 로직: errDesc가 null이면 err_cat 정보를 사용해 대체 설명을 생성
      const effectiveExplanation = edit.err_desc 
        ? edit.err_desc 
        : `[${edit.err_cat || '오류'}] '${originalWord}'이(가) 문맥상 올바르지 않아 '${edit.replace}'로 교정되었습니다.`;

      // err_type 필드가 없으므로 err_cat을 사용하여 설명 생성
      // 마침표 삽입(`INSERT`)의 경우, `wrong`이 빈 문자열이므로, 
      // 해당 교정은 `explanation`이 존재해도 클릭되지 않게 하려면 렌더링 단에서 `item.wrong` 체크 필요

      result.push({
        text: edit.replace, // 교정된 단어
        key: `edit-${edit.start}-${index}`,
        wrong: originalWord, // 교정 전 단어 (INSERT의 경우 빈 문자열)
        explanation: effectiveExplanation, // 설명
      });

      // 3. 현재 인덱스를 업데이트
      currentIndex = edit.end;
    });

    // 4. 마지막 수정 이후의 남은 원본 텍스트 추가
    if (currentIndex < originalContent.length) {
      const text = originalContent.substring(currentIndex);
      result.push({
        text: text,
        key: `seg-end-${currentIndex}`,
      });
    }

    return result;
  };

  const formatDate = (d: Date | undefined) => {
    if (!d) {
      return "날짜 없음";
    }

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(
      2,
      "0"
    )}`;
  };

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
    } else if (action === "delete") {
      setIsDeleteModalVisible(true);
      toggleMenu();
    }
  };

  const handleDestinationConfirm = () => {
    setIsDestModalVisible(false);
    router.push("/dictionary");
  };

  const handleDestinationCancel = () => {
    setIsDestModalVisible(false);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteModalVisible(false);

    try {
      if (currentJournalId !== "" && userId) {
        await deleteJournalApi(userId, currentJournalId);
      }
    } catch (error) {
      console.error("Failed to delete journal:", error);
    }

    router.push("/");
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const handleSuggestion = () => {
    if (!originalDiary) {
      console.log("No original diary rendered");
      return;
    }

    router.push("/suggestion");
  };

  useEffect(() => {
    getOriginalDiary();
  }, [currentJournalId, userId]); // 의존성 배열 수정

  useEffect(() => {
    // originalDiary가 있을 때만 getFeedbackDiary 호출
    if (originalDiary && originalDiary.content) {
      getFeedbackDiary();
    }
  }, [originalDiary]); // originalDiary가 변경될 때 실행

  useEffect(() => {
    if (grammarFeedback && originalDiary) {
      // API 응답의 edits 배열과 원본 content를 사용해 UI용 배열 생성
      const segments = processFeedback(originalDiary.content, grammarFeedback.edits);
      setProcessedContent(segments);
      setSelectedTab("my");
    }
  }, [grammarFeedback, originalDiary]);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <MoveModal
        destination="dictionary"
        visible={isDestModalVisible}
        onConfirm={handleDestinationConfirm}
        onCancel={handleDestinationCancel}
      />

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
          <Text style={styles.date}>{originalDiary?.date}</Text>
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
              <Text style={styles.title}>{originalDiary?.title}</Text>
              <View style={styles.emoji}>
                <Text>{originalDiary?.emoji}</Text>
              </View>
            </View>

            {selectedTab === "my" ? (
              <Text style={styles.content}>{originalDiary?.content}</Text>
            ) : (
              <Text style={styles.content}>
                {processedContent.map((item) => {
                  // explanation이 있고, 'INSERT' (마침표 등)가 아닌 'MODIFY'나 'DELETE' 교정에 대해서만 클릭 가능하게 처리
                  // 'INSERT' 교정의 경우 item.wrong이 빈 문자열("")
                  if (item.explanation && item.wrong !== "") {
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

          {/* processedContent.find로 변경 */}
          {selectedTab === "ai" && selectedWord && (
            <View style={styles.explainBox}>
              <Text style={styles.explainTitle}>
                {processedContent.find((d) => d.key === selectedWord)?.wrong} →{" "}
                {processedContent.find((d) => d.key === selectedWord)?.text}
              </Text>
              <Text style={styles.explainText}>
                {
                  processedContent.find((d) => d.key === selectedWord)
                    ?.explanation
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomFixedContainer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={handleSuggestion}
        >
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