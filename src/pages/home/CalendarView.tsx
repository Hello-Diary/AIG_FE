// src/screens/CalendarView.tsx

import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@/src/components/home/SvgIcons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DiaryEntryItem from '../../components/home/DiaryEntryItem';

interface DiaryEntry {
  emoji: string;
  title: string;
  content: string;
  time?: string;
}

interface CalendarViewProps {
  setCurrentView: (view: 'home' | 'calendar' | 'search') => void;
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
    diaryEntries 
}) => {
    const days: (number | null)[] = getDaysInMonth(currentDate);
    const selectedDay = 14; 

    return (
        <ScrollView 
            style={styles.container}
            bounces={false} // ✅ 스크롤 바운스 제거
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.calendarNavHeader}>
                    <TouchableOpacity onPress={() => setCurrentView('home')}>
                        <ChevronLeftIcon />
                    </TouchableOpacity>
                    <Text style={styles.calendarTitle}>Calendar</Text>
                    <View style={styles.placeholder} />
                </View>
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
                        <Text key={index} style={[
                            styles.calendarDayName, 
                            index === 0 ? styles.sundayText : null
                        ]}>
                            {day}
                        </Text>
                    ))}
                </View>

                {/* Calendar grid */}
                <View style={styles.calendarGrid}>
                    {days.map((day: number | null, index: number) => (
                        <View key={index} style={styles.calendarCell}>
                            {day !== null && (
                                <View style={[
                                    styles.dayButton,
                                    day === selectedDay ? styles.selectedDayButton : null
                                ]}>
                                    <Text style={[
                                        styles.dayButtonText,
                                        day === selectedDay ? styles.selectedDayButtonText : null
                                    ]}>
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
                <Text style={styles.selectedDateTitle}>선택한 날짜에 작성한 일기</Text>
                <View style={styles.entriesList}>
                    {diaryEntries.map((entry: DiaryEntry, index: number) => (
                        <View key={index} style={styles.calendarEntryItem}>
                            <DiaryEntryItem entry={entry} isSearchItem={true} />
                        </View>
                    ))}
                </View>
            </View>

            {/* Floating action button */}
            <TouchableOpacity style={styles.fab}>
                <PlusIcon />
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },
    header: { backgroundColor: '#4052E2', paddingHorizontal: 20, paddingVertical: 50 },
    calendarNavHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    calendarTitle: { fontSize: 18, fontWeight: '500', color: '#ffffff' },
    placeholder: { width: 24 },
    calendarContainer: { paddingHorizontal: 16, paddingVertical: 16 },
    monthNavigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    monthTitle: { fontSize: 18, fontWeight: '500' },
    calendarHeader: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
    calendarDayName: { textAlign: 'center', fontWeight: '500', color: '#374151', flex: 1 },
    sundayText: { color: '#ef4444' },
    calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    calendarCell: { width: '14.28%', height: 40, justifyContent: 'center', alignItems: 'center' },
    dayButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 16 },
    selectedDayButton: { backgroundColor: '#4052E2' },
    dayButtonText: { color: '#374151' },
    selectedDayButtonText: { color: '#ffffff' },
    selectedDateSection: { paddingHorizontal: 16, paddingVertical: 16 },
    selectedDateTitle: { color: '#374151', fontWeight: '500', marginBottom: 16 },
    entriesList: { gap: 16 },
    calendarEntryItem: { backgroundColor: '#f9fafb', padding: 0, borderRadius: 8, marginBottom: 16 }, 
    fab: { position: 'absolute', right: 16, bottom: 80, backgroundColor: '#4052E2', width: 52, height: 52, borderRadius: 50, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
});

export default CalendarView;