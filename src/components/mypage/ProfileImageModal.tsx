import c from "@/src/constants/colors";
import React, { useEffect, useState } from "react";
import {
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface ProfileModalProps {
  visible: boolean;
  onConfirm: (selectedKey: string) => void;
  onCancel: () => void;
  profileChoices: { [key: string]: any };
  currentKeyword: string | null;
}

export default function ProfileImageModal({
  visible,
  onConfirm,
  onCancel,
  profileChoices,
  currentKeyword,
}: ProfileModalProps) {
  // 모달 내부에서 선택된 키워드를 임시로 저장
  const [selectedKey, setSelectedKey] = useState(currentKeyword || "default");

  // 모달이 열릴 때마다 현재 키워드로 선택 상태 동기화
  useEffect(() => {
    if (visible) {
      setSelectedKey(currentKeyword || "default");
    }
  }, [visible, currentKeyword]);

  const handleConfirm = () => {
    onConfirm(selectedKey);
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.modalContainer}>
          <Text style={styles.title}>프로필 이미지 변경</Text>

          {/* 프로필 이미지 선택 그리드 */}
          <View style={styles.profileChoiceContainer}>
            {Object.keys(profileChoices).map((key) => (
              <TouchableOpacity
                key={key}
                onPress={() => setSelectedKey(key)}
                style={[
                  styles.profileChoice,
                  selectedKey === key && styles.profileChoiceSelected,
                ]}
                activeOpacity={0.7}
              >
                <Image
                  source={profileChoices[key]}
                  style={styles.profileChoiceImage}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* 버튼 컨테이너 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                취소
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={[styles.buttonText, styles.confirmButtonText]}>
                확인
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    maxWidth: 340,
    backgroundColor: c.bg,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: c.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: c.black,
    marginBottom: 20,
    textAlign: "center",
  },
  profileChoiceContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // 여러 줄로 표시
    gap: 15,
    justifyContent: "center", // 중앙 정렬
    alignItems: "center",
    marginTop: 5,
    marginBottom: 25,
  },
  profileChoice: {
    width: 70, // 크기 키움
    height: 70,
    borderRadius: 35, // 원형
    borderWidth: 3,
    borderColor: "transparent", // 기본 테두리는 투명
    overflow: "hidden",
  },
  profileChoiceSelected: {
    borderColor: c.primary, // 선택 시 파란색 테두리
  },
  profileChoiceImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  // --- 버튼 관련 스타일 ---
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: "#CDCED7",
  },
  confirmButton: {
    backgroundColor: c.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: c.mainwhite,
  },
  confirmButtonText: {
    color: "white",
  },
});
