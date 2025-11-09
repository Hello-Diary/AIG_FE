// src/components/DiaryEntryItem.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DiaryEntry {
  emoji: string;
  title: string;
  content: string;
  time?: string; // HomeView에서 time이 없을 수 있으므로 선택적으로 설정
}

interface DiaryEntryItemProps {
  entry: DiaryEntry;
  isSearchItem?: boolean;
}

const DiaryEntryItem: React.FC<DiaryEntryItemProps> = ({ entry, isSearchItem = false }) => (
  <View style={[styles.entryItem, isSearchItem ? styles.searchEntryItem : styles.defaultEntryItem]}>
    {/* time 속성이 있고 검색 항목이 아닐 때만 렌더링 */}
    {!isSearchItem && entry.time ? (
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
);

const styles = StyleSheet.create({
  defaultEntryItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 16,
  },
  searchEntryItem: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderBottomWidth: 0, // 검색 항목은 별도의 배경색을 가지므로 하단 줄 제거
    paddingBottom: 16,
  },
  entryItem: {
    // 공통 스타일 (필요시 추가)
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
});

export default DiaryEntryItem;