import c from "@/src/constants/colors";
import { IdiomData } from "@/src/types/dictionary";
import Ionicons from "@expo/vector-icons/Ionicons";
import { JSX, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Dictionary() {
  // mock data
  const idiomData: IdiomData[] = [
    {
      id: 1,
      english: "Have a blast",
      korean: "아주 재미있고 즐거운 시간을 보내다",
      example: "We had a blast playing soccer at the park yesterday",
      usage: ["발고 친근한 구어체", "긍정적인 분위기에서만 사용"],
      variations: [
        "had a blast at + 장소/행사",
        "have a blast with + 사람/활동",
        "감탄형: That was a blast!",
      ],
    },
    {
      id: 2,
      english: "call it a day",
      korean: "하루 일과를 마치다, 그만두다",
      example: "Let's call it a day and continue tomorrow",
      usage: ["업무나 활동을 끝낼 때 사용", "비공식적 상황에서 주로 사용"],
      variations: [
        "call it a night (밤에 사용)",
        "let's call it a day",
        "I think we should call it a day",
      ],
    },
    {
      id: 3,
      english: "under the weather",
      korean: "몸이 좋지 않은, 컨디션이 안 좋은",
      example: "I'm feeling under the weather today",
      usage: ["가벼운 병이나 불편함 표현", "정중한 표현"],
      variations: [
        "feeling under the weather",
        "a bit under the weather",
        "slightly under the weather",
      ],
    },
    {
      id: 4,
      english: "cost an arm and a leg",
      korean: "매우 비싸다",
      example: "That car costs an arm and a leg",
      usage: ["과장된 표현", "비공식적 대화에서 사용"],
      variations: [
        "costs an arm and a leg",
        "cost me an arm and a leg",
        "worth an arm and a leg",
      ],
    },
    {
      id: 5,
      english: "once in a blue moon",
      korean: "아주 드물게, 거의 없는",
      example: "I only see him once in a blue moon",
      usage: ["매우 드문 일 표현", "부정적 뉘앙스 포함"],
      variations: [
        "happens once in a blue moon",
        "see/meet once in a blue moon",
        "only once in a blue moon",
      ],
    },
  ];

  const [selectedIdiom, setSelectedIdiom] = useState<IdiomData | null>(null);

  const handleIdiomPress = (idiom: IdiomData): void => {
    if (selectedIdiom?.id === idiom.id) {
      setSelectedIdiom(null);
    } else {
      setSelectedIdiom(idiom);
    }
  };

  const renderIdiomItem = (idiom: IdiomData, index: number): JSX.Element => {
    const isExpanded: boolean = selectedIdiom?.id === idiom.id;

    return (
      <View key={idiom.id || `${idiom.english}-${index}`}>
        <TouchableOpacity
          style={styles.idiomItem}
          onPress={() => handleIdiomPress(idiom)}
        >
          <View style={styles.idiomHeader}>
            <View style={styles.diamond} />
            <Text style={styles.idiomText}>{idiom.english}</Text>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#666"
            />
          </View>
          {isExpanded && (
            <View style={styles.expandedContent}>
              <Text style={styles.koreanMeaning}>{idiom.korean}</Text>
              <Text style={styles.example}>{idiom.example}</Text>

              <View style={styles.detailsBox}>
                <Text style={styles.sectionTitle}>뉘앙스</Text>
                {idiom.usage.map((usage, idx) => (
                  <Text key={idx} style={styles.bulletPoint}>
                    • {usage}
                  </Text>
                ))}

                <Text style={styles.sectionTitle}>자주 쓰는 조합</Text>
                {idiom.variations.map((variation, idx) => (
                  <Text key={idx} style={styles.bulletPoint}>
                    • {variation}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // mock data 반복 - id 중복으로 인해 same key ERROR 발생함
  // TODO: API 명세 완료되면 데이터 받아오는 걸로 교체
  const displayData = idiomData.concat(idiomData).concat(idiomData);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {displayData.map((idiom, index) => renderIdiomItem(idiom, index))}
      </ScrollView>
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
    flex: 1,
    height: "100%",
    paddingHorizontal: 20,
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
    flexDirection: "row",
    alignItems: "center",
  },
  diamond: {
    width: 8,
    height: 8,
    backgroundColor: c.primary,
    transform: [{ rotate: "45deg" }],
    marginRight: 15,
  },
  idiomText: {
    flex: 1,
    textAlign: "center",
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
  },
});
