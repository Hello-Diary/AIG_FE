// app/index.tsx

import { useRouter } from 'expo-router';
import { useState } from 'react';
import CalendarView from '../../../src/pages/home/CalendarView';
import HomeView from '../../../src/pages/home/HomeView';
import SearchView from '../../../src/pages/home/SearchView';

interface DiaryEntry {
  emoji: string;
  title: string;
  content: string;
  time?: string;
}

interface GrammarSuggestion {
    text: string;
    icon: string;
}

export default function HomePage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<'home' | 'calendar' | 'search'>('home');
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2025, 5, 14)); 
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchTags, setSearchTags] = useState<string[]>(['missed', 'bus', 'sad', 'like', 'homework']); 

  // --- Data & Helpers ---
  
  const monthNames: string[] = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];
  
  const dayNames: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const koreanDayNames: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const diaryEntries: DiaryEntry[] = [
    { emoji: '🔥', title: 'I missed the bus', content: 'I missed the bus today and felt really sad. In t...', time: '어제 작성한 일기' },
    { emoji: '😊', title: 'I missed the bus', content: 'I missed the bus today and felt really sad. In t...', time: '이번 주에 작성한 일기' },
    { emoji: '😢', title: 'I missed the bus', content: 'I missed the bus today and felt really sad. In t...', time: '' }
  ];

  const searchSuggestions: string[] = searchTags;
  
  const grammarSuggestions: GrammarSuggestion[] = [
    { text: 'Have a blast', icon: '🔹' },
    { text: 'Call it a day', icon: '🔹' }
  ];

  const previousSearches: DiaryEntry[] = [
    { emoji: '🔥', title: 'I missed the bus', content: 'I missed the bus today and felt really sad. In t...' },
    { emoji: '🔥', title: 'I missed the bus', content: 'I missed the bus today and felt really sad. In t...' }
  ];

  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year: number = date.getFullYear();
    const month: number = date.getMonth();
    const firstDay: Date = new Date(year, month, 1);
    const lastDay: Date = new Date(year, month + 1, 0);
    const daysInMonth: number = lastDay.getDate();
    const startingDayOfWeek: number = firstDay.getDay();
    
    const days: (number | null)[] = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
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

  const removeSearchTag = (tagToRemove: string): void => {
    setSearchTags(searchTags.filter(tag => tag !== tagToRemove));
  };

  // -----------------------------------------------------------------------

  if (currentView === 'home') {
    return (
        <HomeView 
            setCurrentView={setCurrentView} 
            diaryEntries={diaryEntries} 
            koreanDayNames={koreanDayNames} 
        />
    );
  } else if (currentView === 'calendar') {
    return (
        <CalendarView 
            setCurrentView={setCurrentView} 
            currentDate={currentDate}
            navigateMonth={navigateMonth}
            getDaysInMonth={getDaysInMonth}
            monthNames={monthNames}
            dayNames={dayNames}
            diaryEntries={diaryEntries}
        />
    );
  } else { // currentView === 'search'
    return (
        <SearchView 
            setCurrentView={setCurrentView} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchSuggestions={searchSuggestions}
            grammarSuggestions={grammarSuggestions}
            previousSearches={previousSearches}
            removeSearchTag={removeSearchTag} 
        />
    );
  }
}