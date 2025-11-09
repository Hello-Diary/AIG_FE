// src/screens/HomeView.tsx (수정된 전체 코드)

import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; 
import { useRouter } from 'expo-router';
import Constants from 'expo-constants'; 
// Svg Icons
import CalendarSvg from '../../assets/images/calender.svg'; 
import { SearchIcon, PlusIcon, Plus2Icon, ChevronLeftIcon, ChevronRightIcon } from '../components/home/SvgIcons';
// Components
import MiniCalendar from '../components/home/MiniCalendar';
import DiaryEntryItem from '../components/home/DiaryEntryItem';

// --- Interfaces ---
interface DiaryEntry {
  emoji: string;
  title: string;
  content: string;
  time?: string;
}

interface HomeViewProps {
  setCurrentView: (view: 'home' | 'calendar' | 'search') => void;
  // koreanDayNames prop은 MiniCalendar에 전달되므로 그대로 유지합니다.
  diaryEntries: DiaryEntry[];
  koreanDayNames: string[]; 
}
// ------------------

// 캘린더 이미지 (SVG 컴포넌트)
const CalendarImage = () => (
    <CalendarSvg 
        width={24}
        height={24}
    />
);

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; 

// 💡 캘린더 포맷팅을 위한 한국어 요일 매핑 상수 정의
const KOREAN_DAY_NAMES_MAP = ["일", "월", "화", "수", "목", "금", "토"];

// ===============================================
// 💡 Calendar Logic Hook (주 단위 로직)
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

// ... (ExpandedCalendar 컴포넌트 생략 - 변경 없음)

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

            {/* Day headers */}
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

            {/* Calendar grid */}
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
  
  // 💡 선택된 날짜 포맷팅 함수 (KOREAN_DAY_NAMES_MAP 사용)
  const formatSelectedDate = (date: Date): string => {
      const today = new Date();
      const isToday = today.toDateString() === date.toDateString();

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const dayOfMonth = String(date.getDate()).padStart(2, '0');
      const dayOfWeekIndex = date.getDay(); // 0:일 ~ 6:토
      
      // KOREAN_DAY_NAMES_MAP에서 직접 한국어 요일 추출
      const dayOfWeek = KOREAN_DAY_NAMES_MAP[dayOfWeekIndex]; 

      const dateString = `${year}.${month}.${dayOfMonth} (${dayOfWeek})`;

      return isToday ? `오늘 ${dateString}` : dateString;
  };
  
  // prop으로 받은 koreanDayNames를 MiniCalendar에 전달합니다. (MiniCalendar는 이 값을 요일 헤더에 사용)
  const formattedDate = formatSelectedDate(selectedDate);


  return (
    <ScrollView 
        style={styles.container} 
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
            // 💡 koreanDayNames prop은 MiniCalendar 요일 헤더를 위해 상위에서 받은 값을 그대로 전달합니다.
            koreanDayNames={koreanDayNames} 
            days={miniCalendarDays} 
            selectedDate={selectedDate} 
            onDayPress={handleMiniDaySelect} 
          />
      )}
      
      {/* 💡 선택된 날짜 표시 (이제 항상 한국어 요일이 표시됨) */}
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
            <Text style={styles.todaySubtitle}>오늘 작성된 일기가 아직 없어요.</Text>
            <Text style={styles.todaySubtitle}>바텀을 눌러 첫 문장을 시작해보세요.</Text>
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

      {/* Floating action button */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push("/diary")}>
        <PlusIcon />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { 
      backgroundColor: '#4052E2', 
      paddingHorizontal: 20, 
      paddingBottom: 20, 
      paddingTop: 20 + Constants.statusBarHeight, 
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greeting: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  
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
  sundayText: { color: '#ef4444' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarCell: { width: '14.28%', height: 40, justifyContent: 'center', alignItems: 'center' },
  dayButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 16 },
  selectedDayButton: { backgroundColor: '#4052E2' },
  dayButtonText: { color: '#374151' },
  selectedDayButtonText: { color: '#ffffff' },
  // ----------------------------------------
  
  // 선택된 날짜 표시 컨테이너
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
  todayTitle: { color: '#4052E2', fontWeight: '500', fontSize: 16 },
  todaySubtitle: { color: '#6b7280', fontSize: 14 },
  recentSection: { marginTop: 16 },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  recentTitle: { fontSize: 18, fontWeight: '500' },
  moreButton: { color: '#6b7280' },
  entriesList: { gap: 16 },
  fab: { position: 'absolute', right: 16, bottom: 80, backgroundColor: '#4052E2', width: 52, height: 52, borderRadius: 50, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
});

export default HomeView;