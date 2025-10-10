import HomeButton from "@/src/components/buttons/HomeButton";
import MoreButton from "@/src/components/buttons/MoreButton";
import c from "@/src/constants/colors";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DiaryDetailPage() {
  const [selectedTab, setSelectedTab] = useState<"my" | "ai">("my");
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const date = "2025.08.01";

  const originalDiary = `Today I waked up late and missed the school bus.
I runned to the bus stop but the bus already gone.
My mom was little angry because I was not ready.
At school, I forget my homework at home.
It was not best day for me.`;

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <HomeButton />
        <Text style={styles.date}>{date}</Text>
        <MoreButton />
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
      <ScrollView style={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>missed the bus</Text>
            <View style={styles.emoji}>
              <Text>😱</Text>
            </View>
          </View>

          {selectedTab === "my" ? (
            <Text style={styles.content}>{originalDiary}</Text>
          ) : (
            <Text style={styles.content}>
              {correctedDiary.map((item) => {
                if (item.explanation) {
                  return (
                    <Text
                      key={item.key}
                      style={[
                        { color: c.primary },
                        selectedWord === item.key && styles.selectedCorrection,
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
                    <Text key={item.key} style={{ color: "#000" }}>
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
              {correctedDiary.find((d) => d.key === selectedWord)?.explanation}
            </Text>
          </View>
        )}

        {/* 하단 버튼 */}
        <TouchableOpacity style={styles.footerButton}>
          <View style={styles.footerButtonUnderline}>
            <Text style={styles.footerButtonText}>AI 추천 표현 보기</Text>
          </View>
          <Text style={styles.footerButtonText}>&gt;</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  date: {
    fontSize: 16,
    fontWeight: "500",
  },
  tabContainer: {
    flexDirection: "row",
    margin: 20,
    backgroundColor: c.bg,
    borderWidth: 1,
    borderColor: c.primary,
    borderRadius: 30,
  },
  tab: { flex: 1, alignItems: "center", paddingVertical: 10 },
  tabActive: {
    backgroundColor: c.primary,
    borderRadius: 30,
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
    paddingHorizontal: 20,
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
