// src/screens/HomeView.tsx

import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Svg Icons
import CalendarSvg from '@/assets/images/calender.svg';
import { ChevronLeftIcon, ChevronRightIcon, Plus2Icon, SearchIcon } from '../../components/home/SvgIcons';
// Components
import AddDiaryButton from '@/src/components/diary/AddDiaryButton';
import c from '@/src/constants/colors';
import DiaryEntryItem from '../../components/home/DiaryEntryItem';
import MiniCalendar from '../../components/home/MiniCalendar';

// --- Interfaces ---
interface DiaryEntry {
  emoji: string;
  title: string;
  content: string;
  time?: string;
}

interface HomeViewProps {
  setCurrentView: (view: 'home' | 'calendar' | 'search') => void;
  diaryEntries: DiaryEntry[];
  koreanDayNames: string[]; 
}
// ------------------

const CalendarImage = () => (
    <CalendarSvg 
        width={24}
        height={24}
    />
);

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; 

const KOREAN_DAY_NAMES_MAP = ["일", "월", "화", "수", "목", "금", "토"];

// ===============================================
// Calendar Logic Hook
// ===============================================

const useCalendarLogic = (initialDate: Date) => {
    const [currentDate, setCurrentDate] = useState(initialDate);
    const [selectedDate, setSelectedDate] = useState(initialDate);

    const getMiniCalendarDays = (focusDate: Date) => {
        const days = [];
        const today = new Date();    
        const dayOfWeek = focusDate.getDay(); 
        const sunday = new Date(focusDate);
        sunday.setDate(focusDate.getDate() - dayOfWeek); 

        for (let i = 0; i < 7; i++) {
            const date = new Date(sunday);
            date.setDate(sunday.getDate() + i);
            days.push({
                day: date.getDate(),
                isToday: date.toDateString() === today.toDateString(), 
                dateObject: date,
            });
        }
        return days;
    };

    const navigateMonth = (direction: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1);
        setCurrentDate(newDate);
        setSelectedDate(newDate); 
    };

    const handleDaySelect = (day: number) => {
        const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newSelectedDate);
    }
    
    const handleMiniDaySelect = (dateObject: Date) => {
        setCurrentDate(dateObject); 
        setSelectedDate(dateObject);
    }

    const getDaysInMonth = (date: Date): (number | null)[] => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let days: (number | null)[] = Array(firstDay).fill(null);
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        while (days.length % 7 !== 0) {
             if (days.length % 7 === 0) break;
             days.push(null);
        }
        return days;
    };

    return { 
        currentDate, 
        selectedDate, 
        navigateMonth, 
        handleDaySelect, 
        handleMiniDaySelect,
        getDaysInMonth, 
        getMiniCalendarDays,
    };
};

interface ExpandedCalendarProps {
    currentDate: Date;
    selectedDate: Date;
    navigateMonth: (direction: number) => void;
    handleDaySelect: (day: number) => void;
    getDaysInMonth: (date: Date) => (number | null)[];
}

const ExpandedCalendar: React.FC<ExpandedCalendarProps> = ({ 
    currentDate, 
    selectedDate,
    navigateMonth, 
    handleDaySelect,
    getDaysInMonth, 
}) => {
    const days: (number | null)[] = getDaysInMonth(currentDate);
    const displayMonth = currentDate.getMonth();
    const displayYear = currentDate.getFullYear();
    
    const selectedDayOfMonth = selectedDate.getFullYear() === displayYear && selectedDate.getMonth() === displayMonth
        ? selectedDate.getDate()
        : null;

    return (
        <View style={styles.expandedCalendarContainer}>
            <View style={styles.monthNavigation}>
                <TouchableOpacity onPress={() => navigateMonth(-1)} style={styles.chevronButton}>
                    <ChevronLeftIcon />
                </TouchableOpacity>
                <Text style={styles.monthTitle}>
                    {MONTH_NAMES[displayMonth]}, {displayYear}
                </Text>
                <TouchableOpacity onPress={() => navigateMonth(1)} style={styles.chevronButton}>
                    <ChevronRightIcon />
                </TouchableOpacity>
            </View>

            <View style={styles.calendarHeaderRow}>
                {DAY_NAMES.map((day: string, index: number) => (
                    <Text key={index} style={[
                        styles.calendarDayName, 
                        index === 0 ? styles.sundayText : null
                    ]}>
                        {day}
                    </Text>
                ))}
            </View>

            <View style={styles.calendarGrid}>
                {days.map((day: number | null, index: number) => (
                    <View key={index} style={styles.calendarCell}>
                        {day !== null && (
                            <TouchableOpacity 
                                style={[
                                    styles.dayButton,
                                    day === selectedDayOfMonth ? styles.selectedDayButton : null
                                ]}
                                onPress={() => handleDaySelect(day)} 
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.dayButtonText,
                                    day === selectedDayOfMonth ? styles.selectedDayButtonText : null
                                ]}>
                                    {day}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
};


// ===============================================
// HomeView 메인 컴포넌트
// ===============================================

const HomeView: React.FC<HomeViewProps> = ({ setCurrentView, diaryEntries, koreanDayNames }) => {
  const router = useRouter(); 
  
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  
  const { 
      currentDate, 
      selectedDate, 
      navigateMonth, 
      handleDaySelect, 
      handleMiniDaySelect, 
      getDaysInMonth, 
      getMiniCalendarDays 
  } = useCalendarLogic(new Date());

  const handleCalendarToggle = () => {
    setIsCalendarExpanded(prev => !prev);
  };
  
  const miniCalendarDays = getMiniCalendarDays(selectedDate);
  
  const formatSelectedDate = (date: Date): string => {
      const today = new Date();
      const isToday = today.toDateString() === date.toDateString();

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const dayOfMonth = String(date.getDate()).padStart(2, '0');
      const dayOfWeekIndex = date.getDay(); 
      
      const dayOfWeek = KOREAN_DAY_NAMES_MAP[dayOfWeekIndex]; 

      const dateString = `${year}.${month}.${dayOfMonth} (${dayOfWeek})`;

      return isToday ? `오늘 ${dateString}` : dateString;
  };
  
  const formattedDate = formatSelectedDate(selectedDate);


  return (
    <View style={styles.container}>
      <ScrollView 
          style={{ flex: 1 }} 
          bounces={false}
          showsVerticalScrollIndicator={false}
      >
        {/* Header (Safe Area 처리) */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.greeting}>Hello, Handong</Text>
          </View>
          
          <View style={styles.searchBarWrapper}> 
              <TouchableOpacity 
                  style={styles.calendarIconButton}
                  onPress={handleCalendarToggle}
              >
                  <CalendarImage />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.searchContainer}
                onPress={() => setCurrentView('search')}
              >
                <View style={styles.searchInput}>
                  <Text style={styles.searchPlaceholder}>search</Text>
                </View>
                <View style={styles.searchIcon}>
                  <SearchIcon />
                </View>
              </TouchableOpacity>
          </View>
        </View>

        {/* 달력 영역 */}
        {isCalendarExpanded ? (
            <ExpandedCalendar 
              currentDate={currentDate}
              selectedDate={selectedDate}
              navigateMonth={navigateMonth}
              handleDaySelect={handleDaySelect}
              getDaysInMonth={getDaysInMonth}
            />
        ) : (
            <MiniCalendar 
              koreanDayNames={koreanDayNames} 
              days={miniCalendarDays} 
              selectedDate={selectedDate} 
              onDayPress={handleMiniDaySelect} 
            />
        )}
        
        {/* 선택된 날짜 표시 */}
        <View style={styles.selectedDateDisplayContainer}>
            <Text style={styles.selectedDateText}>
                {formattedDate}
            </Text>
        </View>

        {/* Today section */}
        <View style={[styles.todaySection, { paddingVertical: 8 }]}> 
          <View style={styles.todayHeader}>
            <View style={styles.addButton}>
              <Plus2Icon />
            </View>
            <View style={styles.todayText}>
              <Text style={styles.todayTitle}>Today</Text>
              <Text style={styles.todaySubtitle}>오늘 작성된 일기가 없어요.</Text>
              <Text style={styles.todaySubtitle}>연필 버튼을 눌러 오늘의 일기를 작성해보세요.</Text>
            </View>
          </View>

          {/* Recent entries */}
          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>
                  {isCalendarExpanded ? 
                      `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일에 작성된 일기` : 
                      '최근에 작성한 일기'}
              </Text>
              <TouchableOpacity onPress={handleCalendarToggle}> 
                <Text style={styles.moreButton}>{isCalendarExpanded ? '달력 닫기' : '더보기'}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.entriesList}>
              {diaryEntries.map((entry: DiaryEntry, index: number) => (
                <DiaryEntryItem key={index} entry={entry} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <AddDiaryButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: c.mainwhite },
  header: { 
      backgroundColor: c.primary, 
      paddingHorizontal: 20, 
      paddingBottom: 20, 
      paddingTop: 20 + Constants.statusBarHeight, 
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greeting: { fontSize: 16, fontWeight: '600', color: c.mainwhite },
  
  searchBarWrapper: { 
      flexDirection: 'row', 
      alignItems: 'center',
      gap: 8, 
  },
  calendarIconButton: {
      padding: 4,
  },
  calendarIconImage: {
      width: 24, 
      height: 24,
  },
    
  searchContainer: { 
      position: 'relative',
      flex: 1, 
  },
  
  searchInput: { backgroundColor: '#ffffff', color: '#000', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, fontSize: 15, height: 40, justifyContent: 'center' },
  searchPlaceholder: { color: '#9199A6', fontSize: 15 },
  searchIcon: { position: 'absolute', right: 20, top: "50%", transform: [{ translateY: -12}] },
  
  // ----------------------------------------
  // Expanded Calendar Styles
  // ----------------------------------------
  expandedCalendarContainer: { paddingHorizontal: 16, paddingVertical: 16 },
  monthNavigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  monthTitle: { fontSize: 18, fontWeight: '500' },
  chevronButton: { padding: 4 }, 
  calendarHeaderRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  calendarDayName: { textAlign: 'center', fontWeight: '500', color: '#374151', flex: 1 },
  sundayText: { color: c.red },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarCell: { width: '14.28%', height: 40, justifyContent: 'center', alignItems: 'center' },
  dayButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 16 },
  selectedDayButton: { backgroundColor: c.primary },
  dayButtonText: { color: '#374151' },
  selectedDayButtonText: { color: c.mainwhite },
  // ----------------------------------------
  
  selectedDateDisplayContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  
  todaySection: { paddingHorizontal: 16, paddingVertical: 16 },
  todayHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  addButton: { padding: 8, borderRadius: 8 },
  todayText: { flex: 1 },
  todayTitle: { color: c.primary, fontWeight: '500', fontSize: 16 },
  todaySubtitle: { color: '#6b7280', fontSize: 14 },
  recentSection: { marginTop: 16 },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  recentTitle: { fontSize: 18, fontWeight: '500' },
  moreButton: { color: '#6b7280' },
  entriesList: { gap: 16 },
});

export default HomeView;