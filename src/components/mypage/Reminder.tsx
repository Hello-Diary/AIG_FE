import c from "@/src/constants/colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Reminder() {
  const [showPicker, setShowPicker] = useState(false);
  const [reminderTime, setReminderTime] = useState<Date>(new Date());
  const [isReadingReminderOn, setIsReadingReminderOn] = useState(false);

  const REMINDER_ID = "reading-reminder";

  // 초기화: 푸시 권한 요청, Android 채널 생성
  useEffect(() => {
    registerForPushNotificationsAsync();

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync();
    }
  }, []);

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

  // 시간 선택
  const onChangeTime = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);

    if (selectedDate) {
      setReminderTime(selectedDate); // 상태만 갱신, 알람은 아직 예약하지 않음
    }
  };

  // 알림 예약
  const scheduleNotification = async (time: Date) => {
    // 시간 기반 예약
    const hour = time.getHours();
    const minute = time.getMinutes();

    await Notifications.scheduleNotificationAsync({
      identifier: REMINDER_ID,
      content: {
        title: "📖 Hello Diary",
        body: "일기를 작성할 시간이에요!",
        data: { reminder: "reading" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  };

  // 알림 취소
  const cancelNotification = async () => {
    await Notifications.cancelScheduledNotificationAsync(REMINDER_ID);
  };

  return (
    <View style={styles.section}>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>읽기 작성 알림</Text>
        <Switch
          trackColor={{ false: "#ccc", true: c.primary }}
          thumbColor={c.mainwhite}
          ios_backgroundColor={c.bg}
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
                !isReadingReminderOn && { color: "#ccc" },
              ]}
            >
              {reminderTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
        </TouchableOpacity>

        {showPicker && isReadingReminderOn && (
          <View style={styles.confirmContainer}>
            {/* 시간 설정 스피너 */}
            <DateTimePicker
              value={reminderTime}
              mode="time"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={onChangeTime}
            />

            {/* 확인 버튼 */}
            <TouchableOpacity
              onPress={() => {
                scheduleNotification(reminderTime); // 버튼 눌러야 알람 예약
                setShowPicker(false); // picker 닫기
              }}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

// 푸시 권한 요청 + Android 채널 생성
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("reading-channel", {
      name: "Reading Reminder",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      if (!projectId) throw new Error("Project ID not found");

      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log("Expo Push Token:", token);
    } catch (e) {
      console.log("Push token error:", e);
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

const styles = StyleSheet.create({
  section: {
    display: "flex",
    flexDirection: "column",
    borderRadius: 8,
    backgroundColor: c.lightblue,
    padding: 20,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
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
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  confirmContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  confirmButton: {
    paddingVertical: 8,
    padding: 16,
    backgroundColor: c.primary,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: c.mainwhite,
    fontWeight: "600",
    fontSize: 14,
  },
});
