// src/components/DiaryEntryItem.tsx (수정된 부분)

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DiaryEntry {
  emoji: string;
  title: string;
  content: string;
  time?: string; 
}

interface DiaryEntryItemProps {
  entry: DiaryEntry;
  isSearchItem?: boolean;
}

const DiaryEntryItem: React.FC<DiaryEntryItemProps> = ({ entry, isSearchItem = false }) => (
  <View style={[styles.entryItem, isSearchItem ? styles.searchEntryItem : styles.defaultEntryItem]}>
    <View style={styles.entryContent}>
      <View style={styles.titleAndEmojiWrapper}>
        <Text style={styles.entryEmoji}>{entry.emoji}</Text>
        <Text style={styles.entryTitle}>{entry.title}</Text>
      </View>
      
      <View style={styles.entryTextContainer}>
        {/* 💡 수정: numberOfLines 속성을 사용하여 최대 줄 수를 2줄 또는 3줄로 제한 */}
        <Text 
          style={styles.entryText}
          numberOfLines={3} // 텍스트를 최대 3줄로 제한합니다.
          ellipsizeMode="tail" // 텍스트가 잘릴 경우 ... (말줄임표)를 표시합니다.
        >
          {entry.content}
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  defaultEntryItem: {
    paddingBottom: 16,
  },
  searchEntryItem: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderBottomWidth: 0, 
    paddingBottom: 16,
  },
  entryItem: {
  },
  entryTime: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 4,
  },
  entryContent: {
    flexDirection: 'column', 
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: "#F4F4F4",
    borderRadius: 8,
    padding: 20,
    backgroundColor: "#fff",
  },
  
  titleAndEmojiWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 2,
  },
  
  entryEmoji: {
    fontSize: 16, 
  },
  
  entryTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: "#000",
  },
  
  entryTextContainer: {
    flex: 1,
  },
  
  entryText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '400',
    width: '100%', 
  },
});

export default DiaryEntryItem;