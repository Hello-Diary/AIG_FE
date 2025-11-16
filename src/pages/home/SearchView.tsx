import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// 💡 Constants 임포트 추가 (Safe Area 처리를 위해)
import DiaryEntryItem from '@/src/components/home/DiaryEntryItem';
import { ChevronLeftIcon, SearchIcon } from '@/src/components/home/SvgIcons';
import c from '@/src/constants/colors';
import Constants from 'expo-constants';

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

interface SearchViewProps {
    setCurrentView: (view: 'home' | 'calendar' | 'search') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchSuggestions: string[];
    grammarSuggestions: GrammarSuggestion[];
    previousSearches: DiaryEntry[];
    removeSearchTag: (tag: string) => void;
}

const SearchView: React.FC<SearchViewProps> = ({ 
    setCurrentView, 
    searchQuery, 
    setSearchQuery, 
    searchSuggestions,
    grammarSuggestions,
    previousSearches,
    removeSearchTag
}) => {
    return (
        <ScrollView 
            style={styles.container}
            bounces={false}
            showsVerticalScrollIndicator={false}
        >
            {/* Search Header */}
            <View style={styles.searchHeader}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => setCurrentView('home')}
                >
                    <ChevronLeftIcon />
                </TouchableOpacity>
                <Text style={styles.searchHeaderTitle}>검색</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Active Search Bar */}
            <View style={styles.activeSearchContainer}>
                <TextInput 
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="키워드를 영어로 검색하세요" 
                    style={styles.activeSearchInput}
                    placeholderTextColor="#9199A6"
                    autoFocus
                />
                {/* 돋보기 아이콘 */}
                <View style={styles.searchIcon}>
                    <SearchIcon />
                </View>
            </View>

            {/* Search Tags (최근 검색어) */}
            <View style={styles.searchTagsSection}>
                <View style={styles.searchTagsHeader}>
                    <Text style={styles.sectionTitle}>최근 검색어</Text>
                    <TouchableOpacity>
                        <Text style={styles.clearAllButton}>모두 지우기</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.tagsGrid}>
                    {searchSuggestions.map((tag: string, index: number) => (
                        <View key={index} style={styles.searchTagRow}>
                            <Text style={styles.searchTagText}>{tag}</Text>
                            <TouchableOpacity 
                                style={styles.removeTagButton}
                                onPress={() => removeSearchTag(tag)}
                            >
                                <Text style={styles.removeTagText}>X</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>

            {/* Grammar Suggestions (사전 검색 결과) */}
            <View style={styles.grammarSection}>
                <Text style={styles.sectionTitle2}>검색결과</Text>
                <Text style={styles.sectionSubTitle}>나의 사전에서 찾은 결과</Text>
                <View style={styles.grammarList}>
                    {grammarSuggestions.map((item, index: number) => (
                        <TouchableOpacity key={index} style={styles.grammarItem}>
                            <Text style={styles.grammarIcon}>{item.icon}</Text>
                            <Text style={styles.grammarText}>{item.text}</Text>
                            <Text style={styles.grammarArrow}>›</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Previous Searches (일기 검색 결과) */}
            <View style={styles.previousSearchSection}>
                <Text style={styles.sectionSubTitle}>일기에서 찾은 결과</Text>
                <View style={styles.entriesList}>
                    {previousSearches.map((entry, index: number) => (
                        <DiaryEntryItem key={index} entry={entry} isSearchItem={true} />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: c.mainwhite },
    // 💡 Header 높이와 Safe Area를 HomeView와 일관되게 수정
    searchHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 16, 
        backgroundColor: c.primary, 
        // Safe Area + 상단 여백 (HomeView와 높이 일치)
        paddingTop: 13 + Constants.statusBarHeight, 
        paddingBottom: 16,
    },
    backButton: { padding: 4 },
    searchHeaderTitle: { fontSize: 18, fontWeight: '500', color: c.mainwhite, flex: 1, textAlign: 'center', marginHorizontal: 16 },
    placeholder: { width: 24 },
    activeSearchContainer: { position: 'relative', paddingHorizontal: 16, paddingBottom: 16, backgroundColor: c.primary },
    activeSearchInput: { backgroundColor: c.mainwhite, color: c.black, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, fontSize: 15, height: 40 },
    
    // 💡 돋보기 아이콘 위치 수정: Input 중앙에 위치하도록 translateY 조정
    searchIcon: { 
        position: 'absolute', 
        right: 36, 
        top: '50%', // ActiveSearchContainer의 50% 지점
        transform: [{ translateY: -12 }] // TextInput의 높이와 컨테이너 패딩을 고려하여 중앙 정렬
    },
    searchTagsSection: { paddingHorizontal: 16, paddingVertical: 16 },
    searchTagsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 12, fontWeight: '600', color: '#777' },
    clearAllButton: { color: '#B4B4B4', fontSize: 10, fontWeight: '600' },
    tagsGrid: { gap: 12 },
    searchTagRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#D4D4D4' },
    searchTagText: { color: '#777', fontSize: 13, fontWeight: '400' },
    removeTagButton: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
    removeTagText: { color: '#777', fontSize: 18, fontWeight: 'bold' },
    grammarSection: { paddingHorizontal: 16, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
    sectionTitle2: { fontSize: 15, fontWeight: '500', color: c.black },
    sectionSubTitle: { fontSize: 13, fontWeight: '500', color: '#626262' },
    grammarList: { gap: 12 },
    grammarItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
    grammarIcon: { fontSize: 16, color: c.primary},
    grammarText: { flex: 1, fontSize: 16, color: '#374151' },
    grammarArrow: { fontSize: 18, color: '#9ca3af' },
    previousSearchSection: { paddingHorizontal: 16, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
    entriesList: { gap: 16 },
});

export default SearchView;