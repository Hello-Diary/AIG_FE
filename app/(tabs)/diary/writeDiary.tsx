import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Keyboard,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, G, ClipPath, Defs, Rect } from "react-native-svg";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Imoticon from '../../../assets/images/imoticon_btn.svg';
import RefreshIcon from '../../../assets/images/refresh.svg';
import ChevronDownIcon from '../../../assets/images/ChevronDownIcon.svg';
import XIcon from '../../../assets/images/X_btn.svg';

const c = {
  bg: '#FFFFFF',
  text: '#000000',
  textLight: '#959595',
  border: '#AFC0DC',
  button: '#D3D3D3',
  alertText: '#AFC0DC',
  link: '#4052E2',
  buttonActive: '#4052E2',
  blue: '#5856D6',
};

const topicSuggestions = [
  'What was the happiest moment of your day?',
  'Was there anything you regretted the most today?',
  'What are you most grateful for right now?',
  'What is one new thing you learned or realized today?',
  'What do you hope to achieve tomorrow?',
];

export default function Diary() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [topicQuestion, setTopicQuestion] = useState('');
  const [isPickerVisible, setPickerVisible] = useState(false);
  const emojiInputRef = useRef<TextInput>(null);

  const [date, setDate] = useState(new Date('2025-09-30')); // Updated to today's date
  const [tempDate, setTempDate] = useState(new Date('2025-09-30')); // Updated to today's date

  const isButtonEnabled = title.trim() !== '' && description.trim() !== '';

  const handleSubmit = () => {
    if (!isButtonEnabled) return;
    console.log('Feedback submitted:', { title, description, emoji: selectedEmoji, date });
  };

  const handleEmojiInput = (currentInputText: string) => {
    if (currentInputText.length < selectedEmoji.length) {
      setSelectedEmoji('');
      return;
    }
    const newEmoji = currentInputText.replace(selectedEmoji, '');
    if (newEmoji) {
      setSelectedEmoji(newEmoji);
      Keyboard.dismiss();
    }
  };

  const handleDrawTopic = () => {
    const randomIndex = Math.floor(Math.random() * topicSuggestions.length);
    setTopicQuestion(topicSuggestions[randomIndex]);
  };

  const handleClearTopic = () => {
    setTopicQuestion('');
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || tempDate;
    setTempDate(currentDate);
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
    return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <Modal
        transparent={true}
        visible={isPickerVisible}
        animationType="slide"
        onRequestClose={handleCancelDate}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={handleCancelDate}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>날짜 지정</Text>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              locale="ko-KR"
              textColor={c.text}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCancelDate}>
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleConfirmDate}>
                <Text style={styles.modalButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <TextInput
        ref={emojiInputRef}
        style={styles.hiddenInput}
        value={selectedEmoji}
        onChangeText={handleEmojiInput}
        maxLength={4}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Svg width="12" height="13" viewBox="0 0 12 13" fill="none">
              <G clipPath="url(#clip0_809_420)">
                <Path
                  d="M7.2 1.87109L2.48528 6.58581L7.2 11.3005"
                  stroke="#626262"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </G>
              <Defs>
                <ClipPath id="clip0_809_420">
                  <Rect width="12" height="12" fill="white" transform="translate(12 0.5) rotate(90)" />
                </ClipPath>
              </Defs>
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateContainer} onPress={() => setPickerVisible(true)}>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
            <ChevronDownIcon style={{ marginLeft: 6 }} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton}>
            <Svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <Path
                d="M8.89209 9.28748C9.26525 9.28748 9.56775 8.98497 9.56775 8.61182C9.56775 8.23866 9.26525 7.93616 8.89209 7.93616C8.51893 7.93616 8.21643 8.23866 8.21643 8.61182C8.21643 8.98497 8.51893 9.28748 8.89209 9.28748Z"
                stroke="#626262"
                strokeWidth="1.35132"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M13.6217 9.28748C13.9949 9.28748 14.2974 8.98497 14.2974 8.61182C14.2974 8.23866 13.9949 7.93616 13.6217 7.93616C13.2485 7.93616 12.946 8.23866 12.946 8.61182C12.946 8.98497 13.2485 9.28748 13.6217 9.28748Z"
                stroke="#626262"
                strokeWidth="1.35132"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M4.16248 9.28748C4.53563 9.28748 4.83813 8.98497 4.83813 8.61182C4.83813 8.23866 4.53563 7.93616 4.16248 7.93616C3.78932 7.93616 3.48682 8.23866 3.48682 8.61182C3.48682 8.98497 3.78932 9.28748 4.16248 9.28748Z"
                stroke="#626262"
                strokeWidth="1.35132"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="제목없음"
              placeholderTextColor={c.textLight}
            />
            <TouchableOpacity style={styles.editIcon}>
              <Svg width="15" height="16" viewBox="0 0 15 16" fill="none">
                <Path d="M7.5 13H13.125" stroke="#959595" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                <Path
                  d="M10.3125 2.68764C10.5611 2.439 10.8984 2.29932 11.25 2.29932C11.4241 2.29932 11.5965 2.33361 11.7574 2.40024C11.9182 2.46687 12.0644 2.56453 12.1875 2.68764C12.3106 2.81076 12.4083 2.95691 12.4749 3.11777C12.5415 3.27863 12.5758 3.45103 12.5758 3.62514C12.5758 3.79925 12.5415 3.97166 12.4749 4.13251C12.4083 4.29337 12.3106 4.43953 12.1875 4.56264L4.375 12.3751L1.875 13.0001L2.5 10.5001L10.3125 2.68764Z"
                  stroke="#959595"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={() => emojiInputRef.current?.focus()}>
              {selectedEmoji ? <Text style={styles.emojiText}>{selectedEmoji}</Text> : <Imoticon width={24} height={24} />}
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="자유롭게 영어 일기를 작성하세요."
            placeholderTextColor={c.textLight}
            multiline
            textAlignVertical="top"
          />
        </View>
        <TouchableOpacity style={styles.infoContainer} onPress={handleDrawTopic}>
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
              <Text style={styles.infoText}>첫 문장이 어렵다면 주제카드를 뽑아보세요.</Text>
            </>
          )}
        </TouchableOpacity>
        {topicQuestion ? (
          <View style={styles.topicCard}>
            <Text style={styles.topicCardText}>{topicQuestion}</Text>
            <TouchableOpacity style={styles.topicCardCloseButton} onPress={handleClearTopic}>
              <XIcon width={16} height={16} />
            </TouchableOpacity>
          </View>
        ) : null}
        <TouchableOpacity
          style={[styles.submitButton, isButtonEnabled && styles.submitButtonActive]}
          onPress={handleSubmit}
          disabled={!isButtonEnabled}
        >
          <Text style={styles.submitButtonText}>피드백 받기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkContainer}>
          <Text style={styles.linkText}>나의 사전 열기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hiddenInput: { position: 'absolute', top: -100, left: 0, height: 0, width: 0, opacity: 0 },
  container: { flex: 1, backgroundColor: c.bg},
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backButton: { padding: 8 },
  moreButton: { padding: 8 },
  dateContainer: { flexDirection: 'row', alignItems: 'center' },
  dateText: { fontSize: 16, color: c.text, fontWeight: '500' },
  card: { backgroundColor:'rgba(255, 255, 255, 0.60)', borderRadius: 12, borderWidth: 1, borderColor: c.border, padding: 16, marginBottom: 20, height: 350 },
  titleContainer: { flexDirection: 'row', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: c.border, marginBottom: 12 },
  titleInput: { flex: 1, fontSize: 15, color: c.text, padding: 0, textAlign: 'center' },
  editIcon: { padding: 8 },
  imageButton: { width: 32, height: 32, borderRadius: 6.759, backgroundColor: '#DEDEDE', alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  emojiText: { fontSize: 20 },
  descriptionInput: { flex: 1, fontSize: 13, color: c.text, lineHeight: 20 },
  infoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  infoText: { fontSize: 13, color: c.alertText, textDecorationLine: 'underline' },
  alertIconContainer: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: c.alertText,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  alertIconText: {
    color: c.bg,
    fontWeight: 'bold',
    fontSize: 12,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  topicCardText: {
    flex: 1,
    fontSize: 14,
    color: c.text,
    textAlign: 'left',
    lineHeight: 20,
    marginRight: 8,
  },
  topicCardCloseButton: {
    padding: 4,
  },
  submitButton: { backgroundColor: c.button, borderRadius: 10, paddingVertical: 20, alignItems: 'center', marginTop: 100, marginBottom: 16 },
  submitButtonActive: { backgroundColor: c.buttonActive },
  submitButtonText: { fontSize: 20, fontWeight: '600', color: c.bg },
  linkContainer: { alignItems: 'center', paddingVertical: 8 },
  linkText: { fontSize: 14, color: c.link, textDecorationLine: 'underline' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContent: { alignItems: 'center', backgroundColor: 'white', borderTopLeftRadius: 12, borderTopRightRadius: 12, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EFEFEF' },
  modalButtonContainer: { flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' },
  modalButton: { flex: 1, paddingVertical: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  cancelButton: { backgroundColor: '#F0F0F0', marginRight: 8 },
  confirmButton: { backgroundColor: c.blue, marginLeft: 8 },
  modalButtonText: { fontSize: 16, fontWeight: '600', color: 'white' },
  cancelButtonText: { color: c.text },
});