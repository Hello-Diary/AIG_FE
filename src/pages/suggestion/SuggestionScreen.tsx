import { batchToggleFlashcardsApi } from "@/src/api/flashcardApi";
import {
  getSuggestionApi,
  postNewSuggestionApi,
} from "@/src/api/suggestionApi";
import BackButton from "@/src/components/common/BackButton";
import c from "@/src/constants/colors";
import { useJournalStore } from "@/src/stores/useJournalStore";
import { useSuggestionStore } from "@/src/stores/useSuggestionStore";
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

// SuggestionList 컴포넌트 (이전 Suggestion 컴포넌트의 역할)

type SuggestionListProps = {
  suggestions: Suggestion[];
  onToggle: (suggestionId: string) => void;
  isLoading: boolean;
};

function SuggestionList({
  suggestions,
  onToggle,
  isLoading,
}: SuggestionListProps) {
  const [selectedIdiom, setSelectedIdiom] = useState<Suggestion | null>(null);

  // 확장/축소 핸들러
  const handleIdiomPress = (idiom: Suggestion): void => {
    if (selectedIdiom?.suggestionId === idiom.suggestionId) {
      setSelectedIdiom(null);
    } else {
      setSelectedIdiom(idiom);
    }
  };

  const renderIdiomItem = (idiom: Suggestion, index: number): JSX.Element => {
    const isExpanded: boolean =
      selectedIdiom?.suggestionId === idiom.suggestionId;
    // isFlashcard는 상위 컴포넌트의 suggestions 상태에서 관리됩니다.
    const isToggled: boolean = idiom.isFlashcard; 

    return (
      <View key={`${idiom.suggestionId}-${index}`}>
        <TouchableOpacity
          style={suggestionStyles.idiomItem}
          onPress={() => handleIdiomPress(idiom)}
          activeOpacity={0.8}
        >
          <View style={suggestionStyles.idiomHeader}>
            {/* 다이아몬드 토글 버튼: onToggle 호출 */}
            <TouchableOpacity
              onPress={() => onToggle(idiom.suggestionId)}
              style={suggestionStyles.diamondButton}
            >
              <View
                style={[
                  suggestionStyles.diamond,
                  isToggled && suggestionStyles.diamondToggled,
                ]}
              />
            </TouchableOpacity>

            {/* 숙어 텍스트 */}
            <Text style={suggestionStyles.idiomText}>{idiom.idiom}</Text>

            {/* 확장 아이콘 */}
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#666"
            />
          </View>
          {isExpanded && (
            <View style={suggestionStyles.expandedContent}>
              <Text style={suggestionStyles.koreanMeaning}>
                {idiom.meaning}
              </Text>
              <Text style={suggestionStyles.example}>
                예: {idiom.naturalExample}
              </Text>
              <Text style={suggestionStyles.example}>
                적용: {idiom.appliedSentence}
              </Text>
              <View style={suggestionStyles.detailsBox}>
                <Text style={suggestionStyles.sectionTitle}>맥락 (Context)</Text>
                <Text style={suggestionStyles.bulletPoint}>
                  • {idiom.context}
                </Text>
                <Text style={suggestionStyles.sectionTitle}>유래 (Origin)</Text>
                <Text style={suggestionStyles.bulletPoint}>
                  • {idiom.origin}
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={suggestionStyles.loadingContainer}>
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    );
  }

  if (suggestions.length === 0 && !isLoading) {
    return (
      <View style={suggestionStyles.loadingContainer}>
        <Text style={suggestionStyles.emptyText}>추천 표현이 없습니다.</Text>
        <Text style={suggestionStyles.emptySubText}>
          일기 내용을 바탕으로 새로운 표현을 받아보세요.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={suggestionStyles.content}
      showsVerticalScrollIndicator={false}
    >
      {suggestions.map((idiom, index) => renderIdiomItem(idiom, index))}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// SuggestionScreen 컴포넌트 (메인 화면)

export default function SuggestionScreen() {
  const router = useRouter();
  const { isSuggested, setIsSuggested } = useSuggestionStore();
  const { currentJournalId } = useJournalStore();

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSuggestions = async () => {
      setIsLoading(true);

      if (!currentJournalId) {
        console.error("Journal ID is missing.", currentJournalId);
        setIsLoading(false);
        return;
      }

      try {
        let apiData: Suggestion[];

        console.log("ai 추천 표현", isSuggested);

        if (isSuggested) {
          // 이미 추천을 받은 경우: 기존 목록 로드
          apiData = await getSuggestionApi(currentJournalId);
        } else {
          // 첫 요청인 경우: 새로 생성 요청
          apiData = await postNewSuggestionApi(currentJournalId);
          setIsSuggested(true);
        }
        
        // API 응답을 기반으로 isFlashcard 상태를 초기화
        setSuggestions(apiData);

      } catch (error) {
        console.error("Failed to load suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSuggestions();
  }, [currentJournalId, isSuggested]);

  // 다이아몬드 토글 핸들러: suggestions 상태를 업데이트
  const handleToggle = (suggestionId: string) => {
    setSuggestions((currentSuggestions) =>
      currentSuggestions.map((s) =>
        s.suggestionId === suggestionId
          ? { ...s, isFlashcard: !s.isFlashcard }
          : s
      )
    );
  };

  // 나의 사전에 저장 버튼 핸들러
  const handleAddDictionary = async () => {
    setIsSaving(true);

    // isFlashcard가 true인 항목만 추출하여 payload 생성
    const itemsToToggle = suggestions
      .filter((s) => s.isFlashcard)
      .map((s) => ({
        suggestionId: s.suggestionId,
        isFlashcard: true, // 사전에 추가(true)
      }));
      
    if (itemsToToggle.length === 0) {
        alert("저장할 표현을 선택해주세요.");
        setIsSaving(false);
        return;
    }

    try {
      await batchToggleFlashcardsApi({ suggestions: itemsToToggle });
      router.push("/dictionary");
    } catch (error) {
      console.error("Failed to save flashcards:", error);
      alert("저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };
  
  // 저장할 항목이 하나라도 있는지 확인
  const isAnyToggledForSave = suggestions.some(s => s.isFlashcard);

  return (
    <SafeAreaView style={screenStyles.container}>
      <View style={screenStyles.header}>
        <BackButton />
        <Text style={screenStyles.headerTitle}>AI 추천 표현</Text>
        <View style={{ width: 24 }} />
      </View>

      <SuggestionList
        suggestions={suggestions}
        onToggle={handleToggle}
        isLoading={isLoading}
      />

      <View style={screenStyles.bottomFixedContainer}>
        <TouchableOpacity
          style={[
            screenStyles.addButton, 
            (isSaving || !isAnyToggledForSave) && screenStyles.addButtonDisabled
          ]}
          onPress={handleAddDictionary}
          disabled={!isAnyToggledForSave}
        >
          {isSaving ? (
            <ActivityIndicator color={c.primary} />
          ) : (
            <View style={screenStyles.footerButtonUnderline}>
              <Text style={screenStyles.footerButtonText}>나의 사전에 저장</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const screenStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: c.bg || c.mainwhite,
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
    color: c.black,
  },
  bottomFixedContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: c.bg,
    paddingHorizontal: 20,
    paddingBottom: 55,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
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
  },
  addButtonDisabled: {
    backgroundColor: c.gray4,
    borderColor: c.button,
  },
  footerButtonUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: c.primary,
  },
  buttonUnderlineDisabled: {
    borderBottomWidth: 1,
    borderBottomColor: c.button,
  },
  footerButtonText: {
    color: c.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  buttonTextDisabled: {
    color: c.button,
  }
});

const suggestionStyles = StyleSheet.create({
  // SuggestionList 컴포넌트에 필요한 스타일
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: c.bg || c.mainwhite,
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
    backgroundColor: c.primary,
  },
  idiomText: {
    flex: 1,
    fontSize: 16,
    color: c.black,
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
    color: c.black,
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
    color: c.black,
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
});