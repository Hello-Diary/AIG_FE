import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Text as RNText,
} from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg'; 

interface DeleteModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({
  visible,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
            <RNText style={styles.closeButtonText}>✕</RNText>
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <Circle cx="24" cy="24" r="24" fill="#DEDEDE" />
              <SvgText
                x="24"
                y="33"
                textAnchor="middle"
                fontSize="28"
                fontWeight="bold"
                fill="#FFF"
              >
                !
              </SvgText>
            </Svg>
          </View>

          <RNText style={styles.title}>
  {'해당 일기를 '}
  <RNText style={styles.blueText}>삭제</RNText>
  {'하시겠습니까?'}
</RNText>
          <RNText style={styles.description}>
            삭제 시, 영구적으로 사라지며 복구할 수 없습니다.
          </RNText>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <RNText style={[styles.buttonText, styles.cancelButtonText]}>
                취소
              </RNText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
            >
              <RNText style={styles.buttonText}>예</RNText>
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 320,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#999999',
    fontWeight: 'bold',
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: 600,
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#A7A7A7',
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#DFE1EE',
  },
  confirmButton: {
    backgroundColor: '#4052E2',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  cancelButtonText: {
    color: '#9497B4',
  },
  blueText: {
    color: '#4052E2',
    fontWeight: 600,
  },
});