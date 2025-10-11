import Dictionary from "@/src/components/dictionary/Dictionary";
import c from "@/src/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef } from "react";
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
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.7;   // 화면 높이의 70% 까지 나의 사전 모달 보여지도록

export default function DictionaryBottomSheet({ visible, onClose }: DictionaryBottomSheetProps) {
  const slideY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(slideY, {
      toValue: visible ? 0 : SHEET_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      {/* 배경 (클릭 시 닫기) */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY: slideY }],
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.handle} />
          <Text style={styles.title}>나의 사전</Text>
        </View>

        <Dictionary />

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Ionicons name="arrow-down" size={16} color={c.primary} />
          <Text style={styles.closeText}>닫기</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  header: { alignItems: "center", paddingVertical: 12 },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#DCDCDC",
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: "600", color: "#000" },
  closeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
  },
  closeText: {
    fontSize: 16,
    fontWeight: "600",
    color: c.primary,
    marginLeft: 6,
  },
});
