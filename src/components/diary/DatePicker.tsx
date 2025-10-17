import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DatePicker() {
  return (
    <TouchableOpacity
      style={styles.modalOverlay}
      activeOpacity={1}
      onPressOut={handleCancelDate}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>날짜 지정</Text>
        <DateTimePicker
          value={tempDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
          locale="ko-KR"
          textColor={c.black}
        />
        <View style={styles.modalButtonContainer}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={handleCancelDate}
          >
            <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
              취소
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.confirmButton]}
            onPress={handleConfirmDate}
          >
            <Text style={styles.modalButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
// Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  modalButtonContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: { backgroundColor: "#F0F0F0", marginRight: 8 },
  confirmButton: { backgroundColor: c.blue, marginLeft: 8 },
  modalButtonText: { fontSize: 16, fontWeight: "600", color: c.mainwhite },
  cancelButtonText: { color: c.black },
});