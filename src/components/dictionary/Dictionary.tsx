import {
  batchToggleFlashcardsApi,
  getSavedFlashcardsApi,
} from "@/src/api/flashcardApi";
import c from "@/src/constants/colors";
import { FlashcardResponse, IdiomSuggestion } from "@/src/types/dictionary";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import { JSX, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Dictionary() {
  const [suggestions, setSuggestions] = useState<FlashcardResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIdiom, setSelectedIdiom] = useState<IdiomSuggestion | null>(
    null
  );
  // 선택된 항목들을 추적하는 state
  const [toggledIdioms, setToggledIdioms] = useState<Record<string, boolean>>(
    {}
  );

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const fetchDictionary = async () => {
        setIsLoading(true);
        try {
          const data = await getSavedFlashcardsApi();

          setSuggestions(data);
        } catch (error) {
          console.error("Failed to fetch dictionary:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDictionary();
    }
  }, [isFocused]);

  // 확장/축소 핸들러 (기존 로직)
  const handleIdiomPress = (idiom: IdiomSuggestion): void => {
    if (selectedIdiom?.idiom === idiom.idiom) {
      setSelectedIdiom(null);
    } else {
      setSelectedIdiom(idiom);
    }
  };

  // 다이아몬드 토글 핸들러
  const handleToggleIdiom = (idiom: string) => {
    setToggledIdioms((prev) => ({
      ...prev,
      [idiom]: !prev[idiom],
    }));
  };

  // Batch 업데이트 핸들러
  const handleUpdateDictionary = async () => {
    const itemsToUpdate = Object.keys(toggledIdioms)
      .filter((id) => toggledIdioms[id]) // 토글된 항목만 필터링
      .map((id) => ({
        suggestionId: id, // 컴포넌트의 flashcardId를 API의 suggestionId로 매핑
        isFlashcard: false, // 사전에서 토글 = 제거(false)로 간주
      }));

    if (itemsToUpdate.length === 0) return;

    try {
      // 수정된 API 호출
      const res = await batchToggleFlashcardsApi({ suggestions: itemsToUpdate });

      // 성공 시
      setSuggestions(res);
      setToggledIdioms({}); // 토글 상태 초기화
    } catch (error) {
      console.error("Failed to batch update:", error);
    }
  };

  // 하나라도 토글되었는지 확인
  const isAnyToggled = Object.values(toggledIdioms).some(Boolean);

  const renderIdiomItem = (
    idiom: IdiomSuggestion,
    index: number
  ): JSX.Element => {
    const isExpanded: boolean = selectedIdiom?.idiom === idiom.idiom;
    const isToggled: boolean = !!toggledIdioms[idiom.id];

    return (
      <View key={`${idiom.idiom}-${index}`}>
        <TouchableOpacity
          style={styles.idiomItem}
          onPress={() => handleIdiomPress(idiom)} // 본문 클릭 시 확장
          activeOpacity={0.8}
        >
          <View style={styles.idiomHeader}>
            {/* 다이아몬드 토글 버튼 */}
            <TouchableOpacity
              onPress={() => handleToggleIdiom(idiom.id)}
              style={styles.diamondButton}
            >
              <View
                style={[styles.diamond, isToggled && styles.diamondToggled]}
              />
            </TouchableOpacity>

            {/* 숙어 텍스트 */}
            <Text style={styles.idiomText}>{idiom.idiom}</Text>

            {/* 확장 아이콘 */}
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#666"
            />
          </View>
          {isExpanded && (
            <View style={styles.expandedContent}>
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    );
  }

  if (suggestions.length === 0 && !isLoading) {
    // 로딩이 끝난 후 확인
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>저장된 표현이 없습니다.</Text>
        <Text style={styles.emptySubText}>
          AI 추천 표현에서 사전에 저장해보세요!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* TODO: suggestion이든 flashcard response이든 타입 맞춰서 넣기 */}
        {suggestions.map((idiom, index) =>
          renderIdiomItem(
            {
              id: idiom.flashcardId,
              idiom: idiom.front,
              Meaning: idiom.back,
              naturalExample: "",
              appliedSentence: "",
              context: "",
              origin: "",
            },
            index
          )
        )}
      </ScrollView>

      {/* 하단 버튼 추가 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.updateButton, !isAnyToggled && styles.disabledButton]}
          disabled={!isAnyToggled}
          onPress={handleUpdateDictionary}
        >
          <Text
            style={[
              styles.buttonText,
              !isAnyToggled && styles.disabledButtonText,
            ]}
          >
            나의 사전 수정하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: c.bg || "#fff",
  },
  content: {
    flex: 1, // 스크롤 영역이 버튼을 제외한 나머지 공간을 채우도록
    height: "100%", // 이 속성은 flex: 1과 함께 사용될 때 불필요할 수 있음
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
  horizontalLine: {
    height: 1,
    backgroundColor: "#E0E0E0",
    width: "100%",
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
    width: "100%", // 헤더가 꽉 차도록
    flexDirection: "row",
    alignItems: "center",
  },
  // 다이아몬드 버튼 (터치 영역 확보)
  diamondButton: {
    padding: 10, // 터치 영역 (Hit Slop)
    margin: -10, // 레이아웃 유지를 위해 패딩 상쇄
    marginRight: 5, // 텍스트와의 간격 (15 - 10)
  },
  diamond: {
    width: 12,
    height: 12,
    backgroundColor: c.primary,
    transform: [{ rotate: "45deg" }],
    marginRight: 15,
  },
  // 토글된 다이아몬드 스타일
  diamondToggled: {
    backgroundColor: c.button,
  },
  idiomText: {
    flex: 1, // 텍스트가 남은 공간을 채움
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
  // --- 버튼 스타일 ---
  buttonContainer: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: c.bg,
  },
  updateButton: {
    backgroundColor: c.primary,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: c.mainwhite,
    fontSize: 20,
    fontWeight: "600",
  },
  disabledButtonText: {
    color: "#888",
  },
});
