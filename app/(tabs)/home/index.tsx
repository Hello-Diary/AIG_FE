import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path } from "react-native-svg";

const Search = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={styles.icons}>
    <Path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#9199A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M21 21L16.65 16.65" stroke="#9199A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const Plus = () => (
  <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <Path d="M14 23.3326H24.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M19.25 4.08394C19.7141 3.61981 20.3436 3.35907 21 3.35907C21.325 3.35907 21.6468 3.42308 21.9471 3.54746C22.2474 3.67183 22.5202 3.85413 22.75 4.08394C22.9798 4.31376 23.1621 4.58658 23.2865 4.88685C23.4109 5.18712 23.4749 5.50894 23.4749 5.83394C23.4749 6.15895 23.4109 6.48077 23.2865 6.78104C23.1621 7.0813 22.9798 7.35413 22.75 7.58394L8.16667 22.1673L3.5 23.3339L4.66667 18.6673L19.25 4.08394Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const Plus2 = () => (
  <Svg width="34" height="34" viewBox="0 0 34 34" fill="none">
    <Path d="M22.8333 21C28.3561 21 32.8333 16.5228 32.8333 11C32.8333 5.47715 28.3561 1 22.8333 1C17.3104 1 12.8333 5.47715 12.8333 11C12.8333 16.5228 17.3104 21 22.8333 21Z" fill="#4052E2"/>
    <Path d="M22.8333 7V15" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M18.8333 11H26.8333" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M13.4167 11.084H5.08333C4.5308 11.084 4.00089 11.3035 3.61019 11.6942C3.21949 12.0849 3 12.6148 3 13.1673V29.834C3 30.3865 3.21949 30.9164 3.61019 31.3071C4.00089 31.6978 4.5308 31.9173 5.08333 31.9173H17.5833C18.1359 31.9173 18.6658 31.6978 19.0565 31.3071C19.4472 30.9164 19.6667 30.3865 19.6667 29.834V17.334L13.4167 11.084Z" stroke="#4052E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M15.4998 22.541H7.1665" stroke="#4052E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M15.4998 26.709H7.1665" stroke="#4052E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M15.8788 18.0918H11.3333H6.78784" stroke="#4052E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
const ChevronLeft = () => <Text style={styles.icon}>‹</Text>;
const ChevronRight = () => <Text style={styles.icon}>›</Text>;

const router = useRouter();

interface DiaryEntry {
  emoji: string;
  title: string;
  content: string;
  time: string;
}

export default function HomePage() {
  const [currentView, setCurrentView] = useState<'home' | 'calendar'>('home');
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2025, 5, 14)); // June 14, 2025
  
  const monthNames: string[] = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];
  
  const dayNames: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const koreanDayNames: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const diaryEntries: DiaryEntry[] = [
    {
      emoji: '🔥',
      title: 'I missed the bus',
      content: 'I missed the bus today and felt really sad. In t...',
      time: '어제 작성한 일기'
    },
    {
      emoji: '😊',
      title: 'I missed the bus', 
      content: 'I missed the bus today and felt really sad. In t...',
      time: '이번 주에 작성한 일기'
    },
    {
      emoji: '😢',
      title: 'I missed the bus',
      content: 'I missed the bus today and felt really sad. In t...',
      time: ''
    }
  ];

  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year: number = date.getFullYear();
    const month: number = date.getMonth();
    const firstDay: Date = new Date(year, month, 1);
    const lastDay: Date = new Date(year, month + 1, 0);
    const daysInMonth: number = lastDay.getDate();
    const startingDayOfWeek: number = firstDay.getDay();
    
    const days: (number | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction: number): void => {
    const newDate: Date = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const renderHomeView = () => (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Hello, Handong</Text>
        </View>
        
        {/* Search bar */}
        <View style={styles.searchContainer}>
          <TextInput 
            placeholder="search" 
            style={styles.searchInput}
            placeholderTextColor="#9199A6"
          />
          <View style={styles.searchIcon}>
            <Search />
          </View>
        </View>
      </View>

      {/* Mini Calendar */}
      <View style={styles.miniCalendar}>
        <View style={styles.calendarHeader}>
          {koreanDayNames.map((day: string, index: number) => (
            <Text key={index} style={styles.dayName}>{day}</Text>
          ))}
        </View>
        <View style={styles.calendarDays}>
          <Text style={styles.day}>24</Text>
          <Text style={styles.day}>25</Text>
          <Text style={styles.day}>26</Text>
          <View style={styles.selectedDay}>
            <Text style={styles.selectedDayText}>27</Text>
          </View>
          <Text style={styles.day}>28</Text>
          <Text style={styles.day}>29</Text>
          <Text style={styles.day}>30</Text>
        </View>
      </View>

      {/* Today section */}
      <View style={styles.todaySection}>
        <View style={styles.todayHeader}>
          <View style={styles.addButton}>
            <Plus2 />
          </View>
          <View style={styles.todayText}>
            <Text style={styles.todayTitle}>Today</Text>
            <Text style={styles.todaySubtitle}>오늘 작성되 일기가 아직 없어요.</Text>
            <Text style={styles.todaySubtitle}>바텀을 눌러 첫 문장을 시작해보세요.</Text>
          </View>
        </View>

        {/* Recent entries */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>최근에 작성한 일기</Text>
            <TouchableOpacity>
              <Text style={styles.moreButton}>더보기</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.entriesList}>
            {diaryEntries.map((entry: DiaryEntry, index: number) => (
              <View key={index} style={styles.entryItem}>
                {entry.time ? (
                  <Text style={styles.entryTime}>{entry.time}</Text>
                ) : null}
                <View style={styles.entryContent}>
                  <Text style={styles.entryEmoji}>{entry.emoji}</Text>
                  <View style={styles.entryTextContainer}>
                    <Text style={styles.entryTitle}>{entry.title}</Text>
                    <Text style={styles.entryText}>{entry.content}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Floating action button */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push("/diary")}>
        <Plus />
      </TouchableOpacity>
    </ScrollView>
  );

  const renderCalendarView = () => {
    const days: (number | null)[] = getDaysInMonth(currentDate);
    
    return (
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.calendarNavHeader}>
            <TouchableOpacity onPress={() => setCurrentView('home')}>
              <ChevronLeft />
            </TouchableOpacity>
            <Text style={styles.calendarTitle}>Calendar</Text>
            <View style={styles.placeholder} />
          </View>
        </View>

        {/* Calendar Header */}
        <View style={styles.calendarContainer}>
          <View style={styles.monthNavigation}>
            <TouchableOpacity onPress={() => navigateMonth(-1)}>
              <ChevronLeft />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
            </Text>
            <TouchableOpacity onPress={() => navigateMonth(1)}>
              <ChevronRight />
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
                {day && (
                  <View style={[
                    styles.dayButton,
                    day === 14 ? styles.selectedDayButton : null
                  ]}>
                    <Text style={[
                      styles.dayButtonText,
                      day === 14 ? styles.selectedDayButtonText : null
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
                <View style={styles.entryContent}>
                  <Text style={styles.entryEmoji}>{entry.emoji}</Text>
                  <View style={styles.entryTextContainer}>
                    <Text style={styles.entryTitle}>{entry.title}</Text>
                    <Text style={styles.entryText}>{entry.content}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Floating action button */}
        <TouchableOpacity style={styles.fab}>
          <Plus />
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return currentView === 'home' ? renderHomeView() : renderCalendarView();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#4052E2',
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    fontSize: 14,
    color: '#ffffff',
  },
  signals: {
    flexDirection: 'row',
    gap: 2,
  },
  signal: {
    width: 4,
    height: 12,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  searchContainer: {
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#ffffff',
    color: '#000',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 15,
    height: 40,
  },
  searchIcon: {
    position: 'absolute',
    right: 20,
    top: "50%",
    transform: [{ translateY: -12}],
  },
  icons: {
    alignSelf: "center",
    marginBottom: 100,
  },
  icon: {
    fontSize: 20,
  },
  miniCalendar: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayName: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  calendarDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  day: {
    textAlign: 'center',
    paddingVertical: 8,
    fontSize: 16,
  },
  selectedDay: {
    backgroundColor: '#4052E2',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  todaySection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  todayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
  },
  todayText: {
    flex: 1,
  },
  todayTitle: {
    color: '#4052E2',
    fontWeight: '500',
    fontSize: 16,
  },
  todaySubtitle: {
    color: '#6b7280',
    fontSize: 14,
  },
  recentSection: {
    marginTop: 16,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  moreButton: {
    color: '#6b7280',
  },
  entriesList: {
    gap: 16,
  },
  entryItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 16,
  },
  entryTime: {
    color: '#6b7280',
    fontSize: 12,
    marginBottom: 4,
  },
  entryContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  entryEmoji: {
    fontSize: 18,
  },
  entryTextContainer: {
    flex: 1,
  },
  entryTitle: {
    fontWeight: '500',
    fontSize: 16,
  },
  entryText: {
    color: '#4b5563',
    fontSize: 14,
  },
  calendarNavHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffff',
  },
  placeholder: {
    width: 24,
  },
  calendarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  calendarDayName: {
    textAlign: 'center',
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  sundayText: {
    color: '#ef4444',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  selectedDayButton: {
    backgroundColor: '#4052E2',
  },
  dayButtonText: {
    color: '#374151',
  },
  selectedDayButtonText: {
    color: '#ffffff',
  },
  selectedDateSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  selectedDateTitle: {
    color: '#374151',
    fontWeight: '500',
    marginBottom: 16,
  },
  calendarEntryItem: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#9ca3af',
  },
  activeNavText: {
    color: '#4052E2',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    backgroundColor: '#4052E2',
    width: 52,
    height: 52,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});