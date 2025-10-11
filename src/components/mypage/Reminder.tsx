import c from "@/src/constants/colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Reminder() {
  const [showPicker, setShowPicker] = useState(false);
  const [reminderTime, setReminderTime] = useState<Date>(new Date());
  const [isReadingReminderOn, setIsReadingReminderOn] = useState(true);

  const REMINDER_ID = "reading-reminder";

  // 스위치 토글
  const toggleSwitch = () => {
    const newValue = !isReadingReminderOn;
    setIsReadingReminderOn(newValue);

    if (newValue) {
      scheduleNotification(reminderTime);
    } else {
      cancelNotification();
      setShowPicker(false); // 스위치 끄면 picker 닫기
    }
  };

  // 시간 선택 시
  const onChangeTime = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (Platform.OS === "android") setShowPicker(false); // 안드로이드에서는 선택 후 닫기
    if (selectedDate) {
      setReminderTime(selectedDate);
      if (isReadingReminderOn) {
        cancelNotification();
        scheduleNotification(selectedDate);
      }
    }
  };

  // 알림 예약]
  const scheduleNotification = async (time: Date) => {
    await Notifications.scheduleNotificationAsync({
      identifier: REMINDER_ID,
      content: {
        title: "📖 읽기 시간 알림",
        body: "지금 독서 기록을 작성할 시간이에요!",
      },
      trigger: null,
    });
  };

  // 알림 취소
  const cancelNotification = async () => {
    await Notifications.cancelScheduledNotificationAsync(REMINDER_ID);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>읽기 알림</Text>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>읽기 작성 알림</Text>
        <Switch
          trackColor={{ false: c.gray2, true: c.primary }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#E5E5E5"
          onValueChange={toggleSwitch}
          value={isReadingReminderOn}
          style={styles.switch}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>알림시간</Text>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          disabled={!isReadingReminderOn}
        >
          {(!isReadingReminderOn || !showPicker) && (
            <Text
              style={[
                styles.settingValue,
                !isReadingReminderOn && { color: c.gray2 },
              ]}
            >
              {reminderTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
        </TouchableOpacity>

        {(showPicker && isReadingReminderOn) && (
          <DateTimePicker
            value={reminderTime}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeTime}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    display: "flex",
    flexDirection: "column",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#F4F4F4",
    borderRadius: 8,
    backgroundColor: c.mainwhite,
    padding: 20,
    shadowColor: "#E1E1E1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: c.gray1,
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    color: "#333",
  },
  settingValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
});
