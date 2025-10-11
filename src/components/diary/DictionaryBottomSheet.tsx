import Dictionary from "@/src/components/dictionary/Dictionary";
import c from "@/src/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface DictionaryBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const PARTIAL_HEIGHT = SCREEN_HEIGHT * 0.65;
const FULL_HEIGHT = SCREEN_HEIGHT * 0.65;

export default function DictionaryBottomSheet({
  visible,
  onClose,
}: DictionaryBottomSheetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(PARTIAL_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? FULL_HEIGHT : PARTIAL_HEIGHT,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  useEffect(() => {
    if (visible) setIsExpanded(false);
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View style={[styles.container, { height: animatedHeight }]}>
          <View style={styles.header}>
            <View style={styles.handle} />
            <Text style={styles.headerTitle}>나의 사전</Text>
          </View>

          {/* ✅ Dictionary 내용 불러오기 */}
          <Dictionary />

          <TouchableOpacity style={styles.collapseButton} onPress={onClose}>
            <Ionicons name="arrow-down" size={16} color={c.primary} />
            <Text style={styles.collapseButtonText}>닫기</Text>
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  header: { alignItems: "center", paddingVertical: 12 },
  handle: {
    width: 40, height: 5, borderRadius: 2.5,
    backgroundColor: "#DCDCDC", marginBottom: 8,
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#000" },
  collapseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
  },
  collapseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: c.primary,
    marginLeft: 6,
  },
});
