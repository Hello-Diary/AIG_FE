import AddDiaryButton from "@/src/components/diary/AddDiaryButton";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/src/components/home/SvgIcons";
import c from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DiaryEntryItem from "../../components/home/DiaryEntryItem";

interface DiaryEntry {
  emoji: string;
  title: string;
  content: string;
  time?: string;
}

interface CalendarViewProps {
  setCurrentView: (view: "home" | "calendar" | "search") => void;
  currentDate: Date;
  navigateMonth: (direction: number) => void;
  getDaysInMonth: (date: Date) => (number | null)[];
  monthNames: string[];
  dayNames: string[];
  diaryEntries: DiaryEntry[];
}

const CalendarView: React.FC<CalendarViewProps> = ({
  setCurrentView,
  currentDate,
  navigateMonth,
  getDaysInMonth,
  monthNames,
  dayNames,
  diaryEntries,
}) => {
  const days: (number | null)[] = getDaysInMonth(currentDate);
  const selectedDay = 14;
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.calendarNavHeader}>캘린더</Text>
        <View style={{ width: 24 }} />
      </View>

        {/* Calendar Header */}
        <View style={styles.calendarContainer}>
          <View style={styles.monthNavigation}>
            <TouchableOpacity onPress={() => navigateMonth(-1)}>
              <ChevronLeftIcon />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
            </Text>
            <TouchableOpacity onPress={() => navigateMonth(1)}>
              <ChevronRightIcon />
            </TouchableOpacity>
          </View>

          {/* Day headers */}
          <View style={styles.calendarHeader}>
            {dayNames.map((day: string, index: number) => (
              <Text
                key={index}
                style={[
                  styles.calendarDayName,
                  index === 0 ? styles.sundayText : null,
                ]}
              >
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={styles.calendarGrid}>
            {days.map((day: number | null, index: number) => (
              <View key={index} style={styles.calendarCell}>
                {day !== null && (
                  <View
                    style={[
                      styles.dayButton,
                      day === selectedDay ? styles.selectedDayButton : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        day === selectedDay
                          ? styles.selectedDayButtonText
                          : null,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Diary entries section */}
        <View style={styles.selectedDateSection}>
          <Text style={styles.selectedDateTitle}>
            선택한 날짜에 작성한 일기
          </Text>
          <View style={styles.entriesList}>
            {diaryEntries.map((entry: DiaryEntry, index: number) => (
              <View key={index} style={styles.calendarEntryItem}>
                <DiaryEntryItem entry={entry} isSearchItem={true} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating action button */}
      <AddDiaryButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: c.mainwhite },
  header: {
    backgroundColor: c.primary,
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  calendarNavHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  calendarTitle: { fontSize: 18, fontWeight: "600", color: c.mainwhite },
  placeholder: { width: 24 },
  calendarContainer: { paddingHorizontal: 16, paddingVertical: 16 },
  monthNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  monthTitle: { fontSize: 18, fontWeight: "500" },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  calendarDayName: {
    textAlign: "center",
    fontWeight: "500",
    color: "#374151",
    flex: 1,
  },
  sundayText: { color: c.red },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap" },
  calendarCell: {
    width: "14.28%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  dayButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  selectedDayButton: { backgroundColor: c.primary },
  dayButtonText: { color: "#374151" },
  selectedDayButtonText: { color: c.mainwhite },
  selectedDateSection: { paddingHorizontal: 16, paddingVertical: 16 },
  selectedDateTitle: { color: "#374151", fontWeight: "500", marginBottom: 16 },
  entriesList: { gap: 16 },
  calendarEntryItem: {
    backgroundColor: "#f9fafb",
    padding: 0,
    borderRadius: 8,
    marginBottom: 16,
  },
});

export default CalendarView;
