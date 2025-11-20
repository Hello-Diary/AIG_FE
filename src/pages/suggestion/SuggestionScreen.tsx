import {
  getSuggestionByJournalIdApi,
  postSuggestionApi,
} from "@/src/api/suggestionApi";
import BackButton from "@/src/components/common/BackButton";
import Suggestion, {
  SuggestionWithState,
} from "@/src/components/suggestion/Suggestion";
import c from "@/src/constants/colors";
import { useJournalStore } from "@/src/stores/useJournalStore";
import { useSuggestionStore } from "@/src/stores/useSuggestionStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

  const [apiData, setApiData] = useState<[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionWithState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSuggestions = async () => {
      setIsLoading(true);

      try {
        if (isSuggested) {
          const apiData = await getSuggestionByJournalIdApi(currentJournalId);
        } else {
          const data = {
            idiom: "",
            origin: "",
            Meaning: "",
            context: "",
            naturalExample: "",
            appliedSentence: "",
          };
          const apiData = await postSuggestionApi(data);
          setIsSuggested(true);

        //   setSuggestions(apiData.map((s) => ({;
        }
      } catch (error) {
        console.error("Failed to load suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSuggestions();
  }, [isSuggested]);

  const handleToggle = (suggestionId: string) => {
    setSuggestions((currentSuggestions) =>
      currentSuggestions.map((s) =>
        s.suggestionId === suggestionId
          ? { ...s, isFlashcard: !s.isFlashcard }
          : s
      )
    );
  };

  const handleAddDictionary = async () => {
    setIsSaving(true);

    try {
    //   await batchToggleFlashcardsApi(payload);
      router.push("/dictionary");
    } catch (error) {
      console.error("Failed to save flashcards:", error);
      alert("저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>AI 추천 표현</Text>
        <View style={{ width: 24 }} />
      </View>

      <Suggestion
        suggestions={suggestions}
        onToggle={handleToggle}
        isLoading={isLoading}
      />

      <View style={styles.bottomFixedContainer}>
        <TouchableOpacity
          style={[styles.addButton, isSaving && styles.addButtonDisabled]}
          onPress={handleAddDictionary}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color={c.primary} />
          ) : (
            <View style={styles.footerButtonUnderline}>
              <Text style={styles.footerButtonText}>나의 사전에 저장</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
    backgroundColor: "#f0f0f0",
    borderColor: "#ccc",
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
