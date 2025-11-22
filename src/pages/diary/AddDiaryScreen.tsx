import DownArrowIcon from "@/assets/icons/down-arrow.svg";
import EmojiIcon from "@/assets/icons/emoji-button.svg";
import RefreshIcon from "@/assets/icons/refresh.svg";
import XIcon from "@/assets/icons/x-button.svg";
import c from "@/src/constants/colors";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { AxiosError } from "axios";
import React, { useRef, useState, useEffect, useCallback } from "react"; 
import {
  Animated,
  Button,
  InputAccessoryView,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { postJournalApi } from "@/src/api/journalApi";
import { getAllQuestionApi } from "@/src/api/questionApi";

import BackButton from "@/src/components/common/BackButton";
import MoreButton from "@/src/components/common/MoreButton";
import BottomModal from "@/src/components/diary/BottomModal";
import DeleteModal from "@/src/components/diary/DeleteModal";
import RewriteModal from "@/src/components/diary/RewriteModal";
import SaveModal from "@/src/components/diary/SaveModal";

import { useJournalStore } from "@/src/stores/useJournalStore";
import { useAuthStore } from "@/src/stores/useUserStore";
import { JournalRequest } from "@/src/types/journal";
import { Question } from "@/src/types/question";
import { useRouter, useFocusEffect } from "expo-router"; 


const inputAccessoryViewID = "diaryInputAccessory";

export default function DiaryScreen() {
  const { userId } = useAuthStore();
  const { diaryDate, setCurrentJournalId } = useJournalStore();
  const [topicQuestion, setTopicQuestion] = useState<Question | null>(null);

  const [date, setDate] = useState(diaryDate);
  const [tempDate, setTempDate] = useState(date);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRewriteModalVisible, setIsRewriteModalVisible] = useState(false);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDictionaryVisible, setDictionaryVisible] = useState(false);

  const router = useRouter();
  const emojiInputRef = useRef<TextInput>(null);
  const slideAnim = useRef(new Animated.Value(280)).current;

  useFocusEffect(
    useCallback(() => {
      return () => {
        setTitle("");
        setDescription("");
        setSelectedEmoji("");
        setTopicQuestion(null);
        console.log("DiaryScreen: Unsaved data cleared upon blurring.");
      };
    }, [])
  );

  const isButtonEnabled =
    title.trim() !== "" && description.trim() !== "" && !isSubmitting;

  const handleSubmit = async () => {
    if (!isButtonEnabled || isSubmitting) return;

    if (!userId) {
      console.error("User ID is missing. Redirecting to login.");
      Alert.alert("로그인 필요", "일기를 제출하려면 로그인해야 합니다.");
      router.replace("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const data: JournalRequest = {
        title,
        content: description,
        emoji: selectedEmoji || null,
        date,
        questionId: topicQuestion ? topicQuestion.questionId : null,
      };

      const res = await postJournalApi(userId, data);

      setCurrentJournalId(res.journalId);
      router.push("/feedback");
    } catch (error) {
      console.error("일기 제출 실패:", error);
      Alert.alert("제출 오류", "일기 제출에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmojiInput = (currentInputText: string) => {
    const newChar = currentInputText.replace(selectedEmoji, "");
    
    if (newChar.length > 0) {
      const newEmoji = newChar; 
      
      setSelectedEmoji(newEmoji);
      
      Keyboard.dismiss();

      if (emojiInputRef.current) {
        setTimeout(() => {
            emojiInputRef.current?.clear(); 
        }, 0);
      }
      
    } else if (currentInputText.length < selectedEmoji.length) {
      setSelectedEmoji("");
    }
  };

  const handleDrawTopic = async () => {
    try {
      const question = await getAllQuestionApi();

      if (question && (question as Question).text) {
        console.log("선택된 주제 카드 Text:", (question as Question).text);
        setTopicQuestion(question as Question);
      } else {
        setTopicQuestion(null);
        Alert.alert("알림", "가져올 질문이 없습니다.");
      }
    } catch (error) {
      console.error("주제 카드 가져오기 실패:", error);
      Alert.alert("오류", "주제 카드를 가져오는 중 오류가 발생했습니다.");
    }
  };

  const handleClearTopic = () => {
    setTopicQuestion(null);
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
        setPickerVisible(false);
        if (event.type === 'set' && selectedDate) {
            setDate(selectedDate);
            setTempDate(selectedDate);
        }
    } else {
        const currentDate = selectedDate || tempDate;
        setTempDate(currentDate);
    }
  };

  const handleConfirmDate = () => {
    setDate(tempDate);
    setPickerVisible(false);
  };

  const handleCancelDate = () => {
    setTempDate(date);
    setPickerVisible(false);
  };

  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(
      2,
      "0"
    )}`;
  };

  const toggleMenu = () => {
    const toValue = isMenuOpen ? 280 : 0;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuAction = (action: string) => {
    if (action === "delete") {
      setIsDeleteModalVisible(true);
    } else if (action === "save") {
      setIsSaveModalVisible(true);
    } else if (action === "rewrite") {
      setIsRewriteModalVisible(true);
    }
    toggleMenu();
  };

  const handleRewriteConfirm = () => {
    setIsRewriteModalVisible(false);
    setTitle("");
    setDescription("");
    setDate(new Date());
    setTempDate(new Date());
    setSelectedEmoji("");
    setTopicQuestion(null);
  };

  const handleRewriteCancel = () => {
    setIsRewriteModalVisible(false);
  };

  const handleSaveConfirm = async () => {
    setIsSaveModalVisible(false);

    if (title.trim() === "" && description.trim() === "") {
        router.push("/");
        return;
    }
    if (!userId) {
      console.error("User ID is missing for saving. Redirecting to login.");
      router.replace("/login"); 
      return;
    }

    try {
      const data: JournalRequest = {
        title,
        content: description,
        emoji: selectedEmoji || null,
        date,
        questionId: topicQuestion ? topicQuestion.questionId : null,
      };

      const res = await postJournalApi(userId, data);
      setCurrentJournalId(res.journalId);
    } catch (error) {
      console.error("일기 임시 저장 실패:", error);
    }

    router.push("/");
  };

  const handleSaveCancel = () => {
    setIsSaveModalVisible(false);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteModalVisible(false);
    router.push("/");
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 날짜 선택 모달 */}
      {Platform.OS === "ios" ? (
        <BottomModal
          visible={isPickerVisible}
          title="날짜 지정"
          pageType="datePicker"
          onClose={handleCancelDate}
        >
          <View style={styles.modalContent}>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={onDateChange}
              locale="ko-KR"
              textColor={c.black}
              maximumDate={new Date()}
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
        </BottomModal>
      ) : ( 
        isPickerVisible && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
            locale="ko-KR"
            maximumDate={new Date()}
          />
        )
      )}

      <RewriteModal
        visible={isRewriteModalVisible}
        onConfirm={handleRewriteConfirm}
        onCancel={handleRewriteCancel}
      />

      <SaveModal
        visible={isSaveModalVisible}
        onConfirm={handleSaveConfirm}
        onCancel={handleSaveCancel}
      />

      <DeleteModal
        visible={isDeleteModalVisible}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {/* Menu Overlay */}
      {isMenuOpen && (
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={toggleMenu}
        />
      )}

      {/* Side Menu */}
      <Animated.View
        style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}
      >
        <View style={styles.menuContent}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuAction("rewrite")}
          >
            <Text style={styles.menuItemText}>처음부터 다시 쓰기</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuAction("save")}
          >
            <Text style={styles.menuItemText}>임시저장하고 나가기</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemDelete]}
            onPress={() => handleMenuAction("delete")}
          >
            <Text style={[styles.menuItemText, styles.menuItemDeleteText]}>
              삭제하기
            </Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
        </View>
      </Animated.View>

      <TextInput
        ref={emojiInputRef}
        style={styles.hiddenInput}
        value={selectedEmoji}
        onChangeText={handleEmojiInput}
        maxLength={2}
      />

      <BottomModal
        visible={isDictionaryVisible}
        title="나의 사전"
        pageType="dictionary"
        onClose={() => setDictionaryVisible(false)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <BackButton />

          <TouchableOpacity
            style={styles.dateContainer}
            onPress={() => setPickerVisible(true)}
          >
            <Text style={styles.dateText}>{formatDate(date)}</Text>
            <DownArrowIcon style={{ marginLeft: 6 }} />
          </TouchableOpacity>

          <MoreButton toggleMenu={toggleMenu} />
        </View>

        {/* Diary Writing Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <TextInput
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
                placeholder="제목없음"
                placeholderTextColor={c.gray3}
                editable={!isSubmitting}
              />
            </View>

            {/* Emoji Button */}
            <TouchableOpacity
              style={styles.emojiButton}
              onPress={() => emojiInputRef.current?.focus()}
              disabled={isSubmitting}
            >
              {selectedEmoji ? (
                <Text style={styles.emojiText}>{selectedEmoji}</Text>
              ) : (
                <EmojiIcon width={24} height={24} />
              )}
            </TouchableOpacity>
          </View>

          {/* Diary Writing Section */}
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="자유롭게 영어 일기를 작성하세요."
            placeholderTextColor={c.gray3}
            multiline={true}
            textAlignVertical="top"
            inputAccessoryViewID={inputAccessoryViewID}
            editable={!isSubmitting}
          />

          {Platform.OS === "ios" && (
            <InputAccessoryView nativeID={inputAccessoryViewID}>
              <View
                style={{
                  backgroundColor: c.lightblue,
                  padding: 8,
                  alignItems: "flex-end",
                }}
              >
                <Button title="닫기" onPress={Keyboard.dismiss} />
              </View>
            </InputAccessoryView>
          )}
        </View>

        <TouchableOpacity
          style={styles.infoContainer}
          onPress={handleDrawTopic}
          disabled={isSubmitting}
        >
          {topicQuestion ? (
            <>
              <View style={styles.alertIconContainer}>
                <RefreshIcon />
              </View>
              <Text style={styles.infoText}>주제카드 다시 뽑기</Text>
            </>
          ) : (
            <>
              <View style={styles.alertIconContainer}>
                <Text style={styles.alertIconText}>!</Text>
              </View>
              <Text style={styles.infoText}>
                첫 문장이 어렵다면 주제카드를 뽑아보세요.
              </Text>
            </>
          )}
        </TouchableOpacity>

        {topicQuestion && (
          <View style={styles.topicCard}>
            <Text style={styles.topicCardText}>{topicQuestion.text}</Text>
            <TouchableOpacity
              style={styles.topicCardCloseButton}
              onPress={handleClearTopic}
              disabled={isSubmitting}
            >
              <XIcon width={16} height={16} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Button Section */}
      <View style={styles.bottomFixedContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            isButtonEnabled && styles.submitButtonActive,
            !isButtonEnabled && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!isButtonEnabled || isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "제출 중..." : "피드백 받기"}
          </Text>
        </TouchableOpacity>

        {!isDictionaryVisible && !isPickerVisible && (
          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => setDictionaryVisible(true)}
            disabled={isSubmitting}
          >
            <Text style={styles.linkText}>나의 사전 열기</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 998,
  },
  sideMenu: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 280,
    height: "150%",
    backgroundColor: c.mainwhite,
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  menuContent: {
    paddingTop: 60,
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  menuItem: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 16,
    color: c.black,
    fontWeight: "600",
  },
  menuItemDelete: {
    backgroundColor: "transparent",
  },
  menuItemDeleteText: {
    color: c.red,
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: c.black,
    fontWeight: "500",
  },
  card: {
    backgroundColor: c.mainwhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
    padding: 16,
    marginBottom: 20,
    height: 350,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
    marginBottom: 12,
    position: "relative",
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  titleInput: {
    flex: 1,
    fontSize: 15,
    color: c.black,
  },
  hiddenInput: {
    position: "absolute",
    top: -100,
    left: 0,
    height: 0,
    width: 0,
    opacity: 0,
  },
  editIcon: {
    padding: 5,
    marginLeft: 4, 
  },
  emojiButton: {
    width: 32,
    height: 32,
    borderRadius: 6.759,
    backgroundColor: "#DEDEDE",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  emojiText: {
    fontSize: 20,
  },
  descriptionInput: {
    flex: 1,
    fontSize: 13,
    color: c.black,
    lineHeight: 20,
  },

  // Info
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoText: { fontSize: 13, color: c.border, textDecorationLine: "underline" },
  alertIconContainer: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: c.border,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  alertIconText: { color: c.mainwhite, fontWeight: "bold", fontSize: 12 },
  topicCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#FAFAFA",
  },
  topicCardText: {
    flex: 1,
    fontSize: 14,
    color: c.black,
    textAlign: "left",
    lineHeight: 20,
    marginRight: 8,
  },
  topicCardCloseButton: { padding: 4 },
  bottomFixedContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: c.bg,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: c.button,
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  submitButtonActive: { backgroundColor: c.primary },
  submitButtonDisabled: { backgroundColor: c.gray3 },
  submitButtonText: { fontSize: 20, fontWeight: "600", color: c.mainwhite },
  linkContainer: { alignItems: "center", paddingVertical: 8 },
  linkText: { fontSize: 14, color: c.primary, textDecorationLine: "underline" },
  modalContent: {
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
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