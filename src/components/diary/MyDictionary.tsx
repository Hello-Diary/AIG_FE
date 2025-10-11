import c from "@/src/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
} from "react-native";

// ... (IdiomData interface and idiomData array remain the same) ...
interface IdiomData {
  id: number | string;
  english: string;
  korean: string;
  example: string;
}

const idiomData: IdiomData[] = [
    { id: 1, english: "Have a blast", korean: "아주 재미있고 즐거운 시간을 보내다", example: "We had a blast at the party." },
    { id: 2, english: "call it a day", korean: "하루 일과를 마치다, 그만두다", example: "Let's call it a day and go home." },
    { id: 3, english: "under the weather", korean: "몸이 좋지 않은, 컨디션이 안 좋은", example: "I'm feeling a bit under the weather." },
    { id: 4, english: "cost an arm and a leg", korean: "매우 비싸다", example: "This new phone costs an arm and a leg." },
    { id: 5, english: "once in a blue moon", korean: "아주 드물게, 거의 없는", example: "I only go to the cinema once in a blue moon." },
    { id: 6, english: "cost an arm and a leg", korean: "매우 비싸다", example: "This new phone costs an arm and a leg." },
    { id: 7, english: "cost an arm and a leg", korean: "매우 비싸다", example: "This new phone costs an arm and a leg." },
    { id: 8, english: "once in a blue moon", korean: "아주 드물게, 거의 없는", example: "I only go to the cinema once in a blue moon." },
];

interface DictionaryBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const PARTIAL_HEIGHT = SCREEN_HEIGHT * 0.65; 
const FULL_HEIGHT = SCREEN_HEIGHT * 0.65;

export default function DictionaryBottomSheet({ visible, onClose }: DictionaryBottomSheetProps) {
  const [selectedIdiomId, setSelectedIdiomId] = useState<number | string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(PARTIAL_HEIGHT)).current;

  useEffect(() => {
    const toValue = isExpanded ? FULL_HEIGHT : PARTIAL_HEIGHT;
    Animated.timing(animatedHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  useEffect(() => {
    if (visible) {
      setIsExpanded(false);
      setSelectedIdiomId(null);
    }
  }, [visible]);

  const handleIdiomPress = (idiomId: number | string) => {
    setSelectedIdiomId(prevId => (prevId === idiomId ? null : idiomId));
  };

  const renderIdiomItem = (idiom: IdiomData) => {
    const isItemSelected = selectedIdiomId === idiom.id;
    return (
      <View key={idiom.id}>
        <TouchableOpacity style={styles.idiomItem} onPress={() => handleIdiomPress(idiom.id)}>
          <View style={styles.idiomHeader}>
            <View style={styles.diamond} />
            <Text style={styles.idiomText}>{idiom.english}</Text>
            <Ionicons name={isItemSelected ? "chevron-up" : "chevron-down"} size={20} color="#666" />
          </View>
          {isItemSelected && (
            <View style={styles.expandedContent}>
              <Text style={styles.koreanMeaning}>{idiom.korean}</Text>
              <Text style={styles.example}>e.g., "{idiom.example}"</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View style={[styles.container, { height: animatedHeight }]}>
          <View style={styles.header}>
            <View style={styles.handle} />
            <Text style={styles.headerTitle}>나의 사전</Text>
          </View>

          <ScrollView
            style={styles.listContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            {idiomData.map(renderIdiomItem)}

            {!isExpanded && (
              <TouchableOpacity
                style={styles.moreButton}
                onPress={() => setIsExpanded(true)}
              >
                <Ionicons name="arrow-down" size={16} color={c.primary} />
                <Text style={styles.moreButtonText}>더보기</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.collapseButton}
            onPress={onClose}
          >
            <Ionicons name="arrow-up" size={16} color={c.primary} />
            <Text style={styles.collapseButtonText}>간략히</Text>
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
  container: {
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: { alignItems: 'center', paddingVertical: 12 },
  handle: { width: 40, height: 5, borderRadius: 2.5, backgroundColor: '#DCDCDC', marginBottom: 8 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#000" },
  listContainer: {
    flex: 1,
  },
  idiomItem: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, marginVertical: 6, shadowColor: "#E1E1E1", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 4, elevation: 4 },
  idiomHeader: { flexDirection: "row", alignItems: "center" },
  diamond: { width: 8, height: 8, backgroundColor: '#4052E2', transform: [{ rotate: "45deg" }], marginRight: 15 },
  idiomText: { flex: 1, fontSize: 16, color: "#000" },
  expandedContent: { marginTop: 15, paddingTop: 15, borderTopColor: "#E0E0E0", borderTopWidth: 1 },
  koreanMeaning: { fontSize: 15, fontWeight: '500', color: "#333", marginBottom: 8 },
  example: { fontSize: 14, color: "#666", fontStyle: 'italic' },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginTop: 10,
    alignSelf: 'center',
  },
  moreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4052E2',
    marginRight: 6,
  },
  collapseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingBottom: 30,
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  collapseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4052E2',
    marginLeft: 6,
  },
});