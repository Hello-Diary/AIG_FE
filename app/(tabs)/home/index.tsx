import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const Calendar = () => <Text style={styles.icon}>📅</Text>;
const Search = () => <Text style={styles.icon}>🔍</Text>;
const Plus = () => <Text style={styles.icon}>➕</Text>;
const Home = () => <Text style={styles.icon}>🏠</Text>;
const User = () => <Text style={styles.icon}>👤</Text>;
const ChevronLeft = () => <Text style={styles.icon}>‹</Text>;
const ChevronRight = () => <Text style={styles.icon}>›</Text>;

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
            placeholderTextColor="#666"
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
            <Plus />
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

      {/* Bottom navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Home />
          <Text style={[styles.navText, styles.activeNavText]}>홈</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => setCurrentView('calendar')}
        >
          <Calendar />
          <Text style={styles.navText}>나의시간</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <User />
          <Text style={styles.navText}>마이</Text>
        </TouchableOpacity>
      </View>

      {/* Floating action button */}
      <TouchableOpacity style={styles.fab}>
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

        {/* Bottom navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => setCurrentView('home')}
          >
            <Home />
            <Text style={styles.navText}>홈</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Calendar />
            <Text style={[styles.navText, styles.activeNavText]}>나의시간</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <User />
            <Text style={styles.navText}>마이</Text>
          </TouchableOpacity>
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
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '500',
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
  wifi: {
    width: 16,
    height: 8,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  battery: {
    width: 24,
    height: 12,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  searchContainer: {
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#ffffff',
    color: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 16,
  },
  searchIcon: {
    position: 'absolute',
    right: 12,
    top: 8,
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
    backgroundColor: '#3b82f6',
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
    backgroundColor: '#3b82f6',
    padding: 8,
    borderRadius: 8,
  },
  todayText: {
    flex: 1,
  },
  todayTitle: {
    color: '#3b82f6',
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
    backgroundColor: '#3b82f6',
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
    color: '#3b82f6',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    backgroundColor: '#3b82f6',
    width: 56,
    height: 56,
    borderRadius: 28,
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