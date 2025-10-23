import c from "@/src/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

// AsyncStorage 키 정의
const REMINDER_ON_KEY = "@HelloDiary:isReadingReminderOn";
const REMINDER_TIME_KEY = "@HelloDiary:reminderTime";

export default function Reminder() {
  const [showPicker, setShowPicker] = useState(false);
  const [reminderTime, setReminderTime] = useState<Date>(new Date());
  const [isReadingReminderOn, setIsReadingReminderOn] = useState(false);

  const REMINDER_ID = "reading-reminder";

  // 초기화: 푸시 권한 요청, Android 채널 생성, 저장된 설정 불러오기
  useEffect(() => {
    // 저장된 설정 불러오기
    const loadSettings = async () => {
      try {
        const reminderOn = await AsyncStorage.getItem(REMINDER_ON_KEY);
        const reminderTimeStr = await AsyncStorage.getItem(REMINDER_TIME_KEY);

        if (reminderOn !== null) {
          const isReminderOn = reminderOn === "true";
          setIsReadingReminderOn(isReminderOn);

          // 알림이 켜져있었고, 저장된 시간이 있다면 불러오기
          if (isReminderOn && reminderTimeStr !== null) {
            setReminderTime(new Date(reminderTimeStr));
          }
        }
      } catch (e) {
        console.error("Failed to load reminder settings.", e);
      }
    };

    loadSettings();
    registerForPushNotificationsAsync();

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync();
    }
  }, []);

  // 스위치 토글 (AsyncStorage에 켜짐/꺼짐 상태 저장)
  const toggleSwitch = async () => {
    const newValue = !isReadingReminderOn;
    setIsReadingReminderOn(newValue);

    try {
      // 1. 스위치 상태를 스토리지에 저장
      await AsyncStorage.setItem(REMINDER_ON_KEY, String(newValue));

      if (newValue) {
        // 2. 켰을 경우: 현재 시간을 스토리지에 저장하고 알림 예약
        await AsyncStorage.setItem(
          REMINDER_TIME_KEY,
          reminderTime.toISOString()
        );
        scheduleNotification(reminderTime);
      } else {
        // 3. 껐을 경우: 알림 취소
        cancelNotification();
        setShowPicker(false); // 스위치 끄면 picker 닫기
      }
    } catch (e) {
      console.error("Failed to save reminder switch state.", e);
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

            {/* 확인 버튼 (AsyncStorage에 시간 저장) */}
            <TouchableOpacity
              onPress={async () => {
                try {
                  // 1. 새 시간을 스토리지에 저장
                  await AsyncStorage.setItem(
                    REMINDER_TIME_KEY,
                    reminderTime.toISOString()
                  );
                  // 2. 알람 예약
                  scheduleNotification(reminderTime);
                  setShowPicker(false); // picker 닫기
                } catch (e) {
                  console.error("Failed to save reminder time.", e);
                }
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
    // 시뮬레이터에서는 알림이 작동하지 않으므로 alert 대신 콘솔 로그
    console.log("Must use physical device for Push Notifications");
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
