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

// 화면 내부에서 토글 상태를 관리하기 위한 타입
export interface SelectableSuggestion extends IdiomSuggestion {
  isFlashcard: boolean; // 로컬 UI 상태
}

// const MOCK_SUGGESTIONS: IdiomSuggestion[] = [
//   {
//     id: "sug-id-001",
//     idiom: "Bite the bullet",
//     Meaning: "고통스럽거나 어려운 일을 (불평 없이) 참아내다",
//     naturalExample: "I have to bite the bullet and finish this report tonight.",
//     appliedSentence: "하기 싫은 발표지만, 'bite the bullet' 하고 준비해야지.",
//     context: "어쩔 수 없이 해야 하는 힘든 일을 받아들일 때 사용합니다.",
//     origin:
//       "과거 전쟁 중 마취제가 없을 때 부상병들이 총알을 물고 고통을 참던 것에서 유래했습니다.",
//   },
//   {
//     id: "sug-id-002",
//     idiom: "Break the ice",
//     Meaning: "어색한 분위기를 깨다, 서먹함을 없애다",
//     naturalExample: "He told a joke to break the ice at the party.",
//     appliedSentence:
//       "새로운 팀원들과 'break the ice' 하기 위해 자기소개를 제안했어요.",
//     context: "처음 만났거나 서먹한 사람들 사이의 긴장을 풀 때 사용합니다.",
//     origin:
//       "과거 쇄빙선(Icebreaker)이 얼어붙은 강을 깨고 배의 길을 열어주던 것에서 유래했습니다.",
//   },
//   {
//     id: "sug-id-003",
//     idiom: "Hit the nail on the head",
//     Meaning: "정곡을 찌르다, 정확히 알아맞히다",
//     naturalExample: "You really hit the nail on the head with that analysis.",
//     appliedSentence: "그녀의 지적은 'hit the nail on the head'였어요.",
//     context: "어떤 문제의 핵심이나 원인을 정확하게 파악했을 때 사용합니다.",
//     origin: "망치로 못의 머리(head)를 정확히 때리는 모습에서 유래했습니다.",
//   },
//   {
//     id: "sug-id-004",
//     idiom: "On the ball",
//     Meaning: "일을 능숙하게 처리하다, 상황 파악이 빠르다",
//     naturalExample: "Our new manager is really on the ball.",
//     appliedSentence: "그녀는 항상 'on the ball' 해서 믿고 맡길 수 있어요.",
//     context: "업무나 스포츠 등에서 민첩하고 유능한 모습을 묘사할 때 씁니다.",
//     origin: "스포츠에서 공을 잘 다루는 선수에서 유래했습니다.",
//   },
// ];

export default function SuggestionScreen() {
  const router = useRouter();
  const { isSuggested, setIsSuggested } = useSuggestionStore();
  const { currentJournalId } = useJournalStore();

  const [suggestions, setSuggestions] = useState<SelectableSuggestion[]>([]);
  // const [suggestions, setSuggestions] = useState<SelectableSuggestion[]>(
  //   MOCK_SUGGESTIONS.map((s) => ({
  //     ...s,
  //     isFlashcard: false, // Default to unchecked
  //   }))
  // );
  const [apiResponse, setApiResponse] = useState<IdiomSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // 항목 확장을 위한 state (IdiomSuggestion 타입 사용)
  const [selectedIdiom, setSelectedIdiom] = useState<IdiomSuggestion | null>(
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
        let responseSuggestions: IdiomSuggestion[] = []; // API 결과를 담을 변수

        if (isSuggested) {
          const res = await getSuggestionApi(currentJournalId);
          responseSuggestions = res.suggestions; // API 응답을 변수에 저장
        } else {
          const res = await getNewSuggestionApi(currentJournalId);
          responseSuggestions = res.suggestions; // API 응답을 변수에 저장
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
        s.id === id ? { ...s, isFlashcard: !s.isFlashcard } : s
      )
    );
  };

  // 항목 확장/축소 핸들러 (IdiomSuggestion의 'id' 사용)
  const handleIdiomPress = (idiom: IdiomSuggestion): void => {
    if (selectedIdiom?.id === idiom.id) {
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
        suggestionId: s.id,
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
    idiom: SelectableSuggestion,
    index: number
  ): JSX.Element => {
    // 'id' 기준으로 확장 여부 확인
    const isExpanded: boolean = selectedIdiom?.id === idiom.id;
    const isToggled: boolean = idiom.isFlashcard; // state에 저장된 값 사용

    return (
      // key 값으로 'id' 사용
      <View key={`${idiom.id}-${index}`}>
        <TouchableOpacity
          style={styles.idiomItem}
          onPress={() => handleIdiomPress(idiom)} // 본문 클릭 시 확장
          activeOpacity={0.8}
        >
          <View style={styles.idiomHeader}>
            {/* 다이아몬드 토글 버튼 ('id' 사용) */}
            <TouchableOpacity
              onPress={() => handleToggle(idiom.id)}
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
              <Text style={styles.koreanMeaning}>{idiom.Meaning}</Text>
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
