import BackButton from "@/src/components/common/BackButton";
import c from "@/src/constants/colors";

// API 함수 import
import { batchToggleFlashcardsApi } from "@/src/api/flashcardApi";
import { getNewSuggestionApi, getSuggestionApi } from "@/src/api/suggestionApi";

// 타입 import
import {
  FlashcardRequest,
} from "@/src/types/dictionary";

// Store import
import { useJournalStore } from "@/src/stores/useJournalStore";
import { useSuggestionStore } from "@/src/stores/useSuggestionStore";

// React & React Native
import { Suggestion } from "@/src/types/suggestion";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { JSX, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SuggestionScreen() {
  const router = useRouter();
  const { isSuggested, setIsSuggested } = useSuggestionStore();
  const { currentJournalId } = useJournalStore();

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // 항목 확장을 위한 state (IdiomSuggestion 타입 사용)
  const [selectedIdiom, setSelectedIdiom] = useState<Suggestion | null>(
    null
  );

  useEffect(() => {
    const loadSuggestions = async () => {
      if (!currentJournalId) {
        console.warn("currentJournalId is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        let responseSuggestions: Suggestion[] = []; // API 결과를 담을 변수

        if (isSuggested) {
          const res = await getSuggestionApi(currentJournalId);
          responseSuggestions = res; // API 응답을 변수에 저장
        } else {
          const res = await getNewSuggestionApi(currentJournalId);
          responseSuggestions = res; // API 응답을 변수에 저장
          setIsSuggested(true);
        }

        // API 응답(responseSuggestions)을 직접 map으로
        const initialSuggestions = responseSuggestions.map((s) => ({
          ...s,
          isFlashcard: false, // Default to unchecked
        }));
        setSuggestions(initialSuggestions); // state에 저장

      } catch (error) {
        console.error("Failed to load suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSuggestions();
  }, [isSuggested, currentJournalId, setIsSuggested]);

  // 다이아몬드 아이콘 토글 핸들러 (IdiomSuggestion의 'id' 사용)
  const handleToggle = (id: string) => {
    setSuggestions((currentSuggestions) =>
      currentSuggestions.map((s) =>
        s.suggestionId === id ? { ...s, isFlashcard: !s.isFlashcard } : s
      )
    );
  };

  // 항목 확장/축소 핸들러 (IdiomSuggestion의 'id' 사용)
  const handleIdiomPress = (idiom: Suggestion): void => {
    if (selectedIdiom?.suggestionId === idiom.suggestionId) {
      setSelectedIdiom(null);
    } else {
      setSelectedIdiom(idiom);
    }
  };

  // 사전에 저장 핸들러
  const handleAddDictionary = async () => {
    setIsSaving(true);

    // 저장할 항목만 필터링
    const itemsToSave = suggestions
      .filter((s) => s.isFlashcard) // true로 토글된 항목만
      .map((s) => ({
        suggestionId: s.suggestionId,
        isFlashcard: true,
      }));

    if (itemsToSave.length === 0) {
      alert("저장할 표현을 선택해주세요.");
      setIsSaving(false);
      return;
    }

    const payload: FlashcardRequest = {
      suggestions: itemsToSave,
    };

    try {
      console.log("Saving flashcards with payload:", payload);
      const res = await batchToggleFlashcardsApi(payload);

      router.push("/dictionary"); // 성공 시 사전으로 이동
    } catch (error) {
      console.error("Failed to save flashcards:", error);
      alert("저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // 하나라도 선택되었는지 확인
  const isAnyToggled = suggestions.some((s) => s.isFlashcard);

  // 렌더링 함수
  const renderIdiomItem = (
    idiom: Suggestion,
    index: number
  ): JSX.Element => {
    // 'id' 기준으로 확장 여부 확인
    const isExpanded: boolean = selectedIdiom?.suggestionId === idiom.suggestionId;
    const isToggled: boolean = idiom.isFlashcard; // state에 저장된 값 사용

    return (
      // key 값으로 'id' 사용
      <View key={`${idiom.suggestionId}-${index}`}>
        <TouchableOpacity
          style={styles.idiomItem}
          onPress={() => handleIdiomPress(idiom)} // 본문 클릭 시 확장
          activeOpacity={0.8}
        >
          <View style={styles.idiomHeader}>
            {/* 다이아몬드 토글 버튼 ('id' 사용) */}
            <TouchableOpacity
              onPress={() => handleToggle(idiom.suggestionId)}
              style={styles.diamondButton}
            >
              <View
                style={[styles.diamond, isToggled && styles.diamondToggled]}
              />
            </TouchableOpacity>

            <Text style={styles.idiomText}>{idiom.idiom}</Text>

            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#666"
            />
          </View>
          {isExpanded && (
            <View style={styles.expandedContent}>
              {/* 'Meaning' (M 대문자) 사용 */}
              <Text style={styles.koreanMeaning}>{idiom.meaning}</Text>
              <Text style={styles.example}>예: {idiom.naturalExample}</Text>
              <Text style={styles.example}>적용: {idiom.appliedSentence}</Text>
              <View style={styles.detailsBox}>
                <Text style={styles.sectionTitle}>맥락 (Context)</Text>
                <Text style={styles.bulletPoint}>• {idiom.context}</Text>
                <Text style={styles.sectionTitle}>유래 (Origin)</Text>
                <Text style={styles.bulletPoint}>• {idiom.origin}</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // 로딩 및 빈 상태 처리
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={c.primary} />
        </View>
      );
    }

    if (suggestions.length === 0 && !isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.emptyText}>추천 표현이 없습니다.</Text>
          <Text style={styles.emptySubText}>
            일기 작성 후 AI 피드백을 받아보세요!
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        {suggestions.map((idiom, index) => renderIdiomItem(idiom, index))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>AI 추천 표현</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 컨텐츠 영역 */}
      {renderContent()}

      {/* 하단 고정 버튼 */}
      {suggestions.length > 0 && (
        <View style={styles.bottomFixedContainer}>
          <TouchableOpacity
            style={[
              styles.addButton,
              (isSaving || !isAnyToggled) && styles.addButtonDisabled,
            ]}
            onPress={handleAddDictionary}
            disabled={isSaving || !isAnyToggled}
          >
            {isSaving ? (
              <ActivityIndicator color={c.primary} />
            ) : (
              <View
                style={[
                  styles.footerButtonUnderline,
                  !isAnyToggled && styles.disabledButtonUnderline,
                ]}
              >
                <Text
                  style={[
                    styles.footerButtonText,
                    !isAnyToggled && styles.disabledButtonText,
                  ]}
                >
                  나의 사전에 저장
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

// 스타일 시트 (제공된 코드와 동일)
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: c.bg || "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  emptySubText: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
  },
  idiomItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: c.mainwhite,
    padding: 20,
    marginVertical: 6,
    shadowColor: "#E1E1E1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  idiomHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  diamondButton: {
    padding: 10,
    margin: -10,
    marginRight: 5,
  },
  diamond: {
    width: 12,
    height: 12,
    backgroundColor: c.button,
    transform: [{ rotate: "45deg" }],
    marginRight: 15,
  },
  diamondToggled: {
    backgroundColor: c.primary, // 활성화 색상
  },
  idiomText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  expandedContent: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    paddingTop: 15,
    borderTopColor: "#E0E0E0",
    borderStyle: "solid",
    borderTopWidth: 1,
  },
  koreanMeaning: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
    fontWeight: "500",
  },
  example: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
    fontStyle: "italic",
  },
  detailsBox: {
    width: "100%",
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    marginTop: 10,
  },
  bulletPoint: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
    paddingLeft: 5,
    lineHeight: 18,
  },
  bottomFixedContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: c.bg,
    paddingHorizontal: 20,
    paddingBottom: 55, // SafeArea 고려
    paddingTop: 12,
  },
  addButton: {
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: c.primary,
    borderRadius: 10,
    alignItems: "center",
    padding: 20,
    gap: 8,
    backgroundColor: c.mainwhite,
  },
  addButtonDisabled: {
    backgroundColor: "#f0f0f0",
    borderColor: "#ccc",
  },
  footerButtonUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: c.primary,
  },
  disabledButtonUnderline: {
    borderBottomColor: "#888",
  },
  footerButtonText: {
    color: c.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  disabledButtonText: {
    color: "#888",
  },
});
