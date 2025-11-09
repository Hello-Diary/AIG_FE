// src/components/home/MiniCalendar.tsx (수정된 전체 코드)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface DayData {
    day: number;
    isToday: boolean;
    dateObject: Date;
}

interface MiniCalendarProps {
  koreanDayNames: string[];
  days: DayData[]; 
  selectedDate: Date; 
  onDayPress: (dateObject: Date) => void; 
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ koreanDayNames, days, selectedDate, onDayPress }) => {
    
    const isSelected = (dateObject: Date) => 
        dateObject.toDateString() === selectedDate.toDateString();

    return (
        <View style={styles.miniCalendar}>
            <View style={styles.calendarDays}>
                {days.map((item, index) => {
                    const isItemSelected = isSelected(item.dateObject);
                    const dayName = koreanDayNames[index];
                    
                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.dayWrapper} 
                            onPress={() => onDayPress(item.dateObject)}
                            activeOpacity={0.7}
                        >
                            <View style={[
                                styles.dayContainer, // 요일 + 날짜를 감싸는 메인 타원
                                isItemSelected ? styles.selectedDayContainer : styles.defaultDayContainer,
                            ]}>
                                {/* 1. 요일 이름 */}
                                <Text style={[
                                    styles.dayNameText,
                                    isItemSelected ? styles.selectedDayNameText : styles.defaultDayNameText,
                                ]}>
                                    {dayName}
                                </Text>

                                {/* 2. 날짜 (흰색 원으로 감싸기) */}
                                <View style={styles.dateCircle}>
                                    <Text style={[
                                        styles.dateText,
                                        isItemSelected ? styles.selectedDateText : styles.defaultDateText,
                                        // 💡 item.isToday 강조 스타일 제거
                                    ]}>
                                        {item.day}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  miniCalendar: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  
  calendarDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
  },
  
  dayContainer: {
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: 8, 
      height: 70, 
      width: '85%', 
      borderRadius: 35, 
  },
  defaultDayContainer: {
      backgroundColor: '#fff',
  },
  selectedDayContainer: {
      backgroundColor: '#4052E2',
  },
  
  dayNameText: {
    fontSize: 14,
    fontWeight: 'medium',
  },
  defaultDayNameText: {
      color: '#000',
  },
  selectedDayNameText: {
      color: '#ffffff',
  },

  dateCircle: {
    width: 30,
    height: 30,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'medium',
  },
  defaultDateText: {
    color: '#000', // 흰색 원 위: 어두운 텍스트
  },
  selectedDateText: {
    color: '#000', // 선택된 날짜의 흰색 원 위: 어두운 텍스트
  },
  // 💡 todayDateText 스타일 정의 자체가 제거되었습니다.
});

export default MiniCalendar;