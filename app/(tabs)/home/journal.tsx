// JournalFeedbackScreen.tsx (전체 코드)

import BackButton from "@/src/components/common/BackButton";
import MoreButton from "@/src/components/common/MoreButton";
import c from "@/src/constants/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 💡 API 및 타입 임포트 (경로를 실제 파일 위치에 맞게 수정하세요)
import { useAuthStore } from "@/src/stores/useUserStore";
import { patchJournalApi } from "../../../src/api/journalApi"; // <-- 실제 경로로 변경 필요
import { JournalRequest, JournalResponse } from "../../../src/types/journal";
// 💡 [추가] Journal Store에서 갱신 함수 가져오기
import { useJournalStore } from "../../../src/stores/useJournalStore";

// 화면 너비 계산 및 메뉴 폭 설정
const { width } = Dimensions.get("window");
const MENU_WIDTH = width * 0.65; 

export default function JournalFeedbackScreen() {
  const router = useRouter();
  const { journalData } = useLocalSearchParams();
  
  // 💡 Zustand에서 userId 가져오기
  const userId = useAuthStore(state => state.userId);
  // 💡 [추가] Journal Store에서 홈 화면 갱신 함수 가져오기
  const refetchJournals = useJournalStore(state => state.refetchJournals); 

  // 로딩 상태 추가
  const [isLoading, setIsLoading] = useState(false);

  // API에서 가져온 일기 데이터의 전체 구조를 저장
  let fullJournalData: JournalResponse | null = null;

  let initialData = {
    journalId: "", // 💡 journalId 추가
    title: "missed the bus",
    description: "Today I waked up late and missed the school bus. I runned to the bus stop but the bus already gone. My mom was little angry because I was not ready. At school, I forget my homework at home. It was not best day for me.",
    selectedEmoji: "😔",
    date: new Date(2025, 7, 1),
    questionId: null, // JournalRequest에 맞추기 위해 추가
  };

  if (typeof journalData === "string") {
    try {
      const parsedData = JSON.parse(journalData);
      fullJournalData = parsedData; // 전체 데이터를 저장
      
      // JournalResponse 데이터를 초기 상태로 매핑
      initialData = {
        journalId: parsedData.journalId, // 💡 journalId 사용
        title: parsedData.title,
        description: parsedData.content,
        selectedEmoji: parsedData.emoji || "✍️",
        date: parsedData.date ? new Date(parsedData.date) : initialData.date,
        questionId: parsedData.questionId || null,
      };
    } catch (e) {
      console.error("Failed to parse journal data:", e);
    }
  }
  
  // 💡 API 호출에 필요한 journalId를 초기화합니다.
  const [journalId] = useState(initialData.journalId);
  
  const [selectedTab, setSelectedTab] = useState("myDiary");
  const [date] = useState(initialData.date);
  
  // 💡 원본 데이터 (View Mode)
  const [viewTitle, setViewTitle] = useState(initialData.title);
  const [viewDescription, setViewDescription] = useState(initialData.description);
  const [viewSelectedEmoji, setViewSelectedEmoji] = useState(initialData.selectedEmoji);
  
  // 💡 편집 상태 (Edit Mode)
  const [editingTitle, setEditingTitle] = useState(initialData.title);
  const [editingDescription, setEditingDescription] = useState(initialData.description);
  const [editingEmoji, setEditingEmoji] = useState(initialData.selectedEmoji); // 💡 이모지 편집 상태 추가

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ... (formatDate 함수 생략) ...
  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(
      2,
      "0"
    )}`;
  };
  
  const handleGoBack = () => {
    if (isEditing) {
      setIsEditing(false);
      return;
    }
    router.back();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // 🚨 API를 사용하여 수정 내용을 서버에 저장하는 함수
  const handleSaveEdit = async () => {
    if (!userId || !journalId || !editingTitle || !editingDescription) {
      Alert.alert("오류", "사용자 정보나 일기 내용이 부족합니다.");
      return;
    }
    
    // 💡 JournalRequest 객체 생성 (date는 기존 date 객체를 사용하거나 필요에 따라 포맷)
    // const formattedDate = date.toISOString().split('T')[0]; // 이미 date 객체이므로 필요 없음
    
    const requestData: JournalRequest = {
      title: editingTitle,
      content: editingDescription,
      emoji: editingEmoji,
      // date를 API에 정의된 형식에 맞게 전달해야 합니다. (여기서는 Date 객체 그대로 전달)
      date: date instanceof Date ? date.toISOString().split("T")[0] : date, 
      questionId: fullJournalData?.questionId || null, 
    };

    setIsLoading(true);
    try {
      // 💡 API 호출
      await patchJournalApi(userId, journalId, requestData);

      // 💡 성공 시 View Mode 상태 업데이트
      setViewTitle(editingTitle);
      setViewDescription(editingDescription);
      setViewSelectedEmoji(editingEmoji);

      
      Alert.alert("성공", "일기가 성공적으로 수정되었습니다.", [
          { 
              text: "확인", 
              onPress: async () => {
                  // 🚨 [핵심 수정] 홈 화면으로 돌아가기 전에 갱신 함수 호출
                  // HomeView의 fetchAllDiaries가 호출되어 목록 데이터가 갱신됩니다.
                  await refetchJournals(); 
                  
                  setIsEditing(false);
                  router.back(); // 홈 화면으로 돌아가기
              }
          }
      ]);
      
    } catch (error) {
      console.error("일기 수정 실패:", error);
      Alert.alert("오류", "일기 수정에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = () => {
    router.push("/suggestion");
  };

  const handleMenuAction = (action: string) => {
    setIsMenuOpen(false); 

    switch (action) {
      case "edit":
        Alert.alert(
            "알림", 
            "현재 글을 수정합니다.", 
            [
                { text: "취소", style: "cancel" },
                { 
                    text: "확인", 
                    onPress: () => {
                        // 💡 편집 모드 진입 시 View Mode의 최신 데이터를 편집 상태로 복사
                        setEditingTitle(viewTitle);
                        setEditingDescription(viewDescription);
                        setEditingEmoji(viewSelectedEmoji);
                        setIsEditing(true);
                    }
                }
            ]
        );
        break;
      case "goToHome":
        router.push("/(tabs)/home"); 
        break;
      case "delete":
        Alert.alert("알림", "아직 준비중인 기능이에요!");
        break;
      case "koreanMeaning":
      case "nativePronunciation":
      case "history":
      default:
        Alert.alert("알림", "아직 준비중인 기능이에요!");
        break;
    }
  };
  
  // 💡 Emoji 선택 핸들러 (간단한 Placeholder)
  const handleEmojiSelect = (emoji: string) => {
    setEditingEmoji(emoji);
  }

  // ... (MenuOverlay, MenuButton 컴포넌트 생략) ...
  const MenuOverlay = () => (
    <TouchableOpacity 
      style={menuStyles.overlay} 
      activeOpacity={1}
      onPress={() => setIsMenuOpen(false)} // 메뉴 바깥 영역 클릭 시 닫기
    >
      <TouchableOpacity 
        style={menuStyles.menuDrawer}
        activeOpacity={1} // 메뉴 영역 내부 클릭 시 닫히지 않도록 방지
      >
        <MenuButton text="한글 뜻 보기" action="koreanMeaning" />
        <MenuButton text="원어민 발음 듣기" action="nativePronunciation" />
        <MenuButton text="수정하기" action="edit" isPrimary />
        <MenuButton text="작성 히스토리 보기" action="history" />
        <MenuButton text="홈으로 나가기" action="goToHome" isPrimary />
        <MenuButton text="삭제하기" action="delete" isDanger />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const MenuButton = ({ text, action, isPrimary = false, isDanger = false }: { text: string, action: string, isPrimary?: boolean, isDanger?: boolean }) => (
    <TouchableOpacity 
      style={menuStyles.menuButton} 
      onPress={() => handleMenuAction(action)}
    >
      <Text 
        style={[
          menuStyles.menuText, 
          isPrimary && { color: c.primary }, 
          isDanger && { color: c.red } 
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );

  // 임시 이모지 목록
  const EMOJI_OPTIONS = ["😊", "😔", "🥳", "😭", "😮", "😴", "🤔"];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={c.primary} />
          <Text style={styles.loadingText}>수정 중...</Text>
        </View>
      )}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <BackButton onPress={handleGoBack} />
          <TouchableOpacity style={styles.dateContainer} disabled={true}>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </TouchableOpacity>
          <MoreButton toggleMenu={toggleMenu} disabled={isEditing} /> 
        </View>

        {isEditing ? (
            <View style={styles.editContainer}>
                {/* 💡 이모지 수정 영역 */}
                <View style={styles.emojiSelectionContainer}>
                    {EMOJI_OPTIONS.map((emoji, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.emojiOption,
                                editingEmoji === emoji && styles.selectedEmojiOption
                            ]}
                            onPress={() => handleEmojiSelect(emoji)}
                        >
                            <Text style={styles.emojiOptionText}>{emoji}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                
                <TextInput
                    style={styles.titleInput}
                    value={editingTitle}
                    onChangeText={setEditingTitle}
                    placeholder="제목을 입력하세요"
                    placeholderTextColor={c.gray3}
                />
                <TextInput
                    style={styles.descriptionInput}
                    value={editingDescription}
                    onChangeText={setEditingDescription}
                    placeholder="내용을 입력하세요"
                    placeholderTextColor={c.gray3}
                    multiline
                />
                {/* 💡 저장 버튼에 handleSaveEdit 연결 */}
                <TouchableOpacity 
                    style={styles.saveButton} 
                    onPress={handleSaveEdit} 
                    disabled={isLoading}
                >
                    <Text style={styles.saveButtonText}>
                        {isLoading ? "저장 중..." : "저장하기"}
                    </Text>
                </TouchableOpacity>
            </View>
        ) : (
            <>
                {/* View Mode JSX (탭, 카드 등) */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            selectedTab === "myDiary" && styles.tabButtonActive,
                        ]}
                        onPress={() => setSelectedTab("myDiary")}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                selectedTab === "myDiary" && styles.tabTextActive,
                            ]}
                        >
                            내가 쓴 일기
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            selectedTab === "aiCorrection" && styles.tabButtonActive,
                        ]}
                        onPress={() => setSelectedTab("aiCorrection")}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                selectedTab === "aiCorrection" && styles.tabTextActive,
                            ]}
                        >
                            AI 교정 일기
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    {selectedTab === "myDiary" ? (
                        <>
                            <View style={styles.cardHeader}>
                                <Text style={[styles.titleText, {textAlign: 'center', flex: 1}]}>{viewTitle}</Text>
                                <View style={[styles.emojiDisplay, {position: 'absolute', right: 0}]}>
                                    <Text style={styles.emojiText}>{viewSelectedEmoji}</Text>
                                </View>
                            </View>
                            <Text style={styles.descriptionText}>{viewDescription}</Text>
                        </>
                    ) : (
                        <View style={styles.aiContentContainer}>
                            <Text style={styles.aiContentPlaceholder}>
                                AI 교정 일기는 여기에 표시됩니다.
                            </Text>
                        </View>
                    )}
                </View>
            </>
        )}
      </ScrollView>

      {/* AI 추천 버튼 (수정 모드에서는 숨김) */}
      {selectedTab === "myDiary" && !isEditing && (
        <View style={styles.bottomFixedContainer}>
          <TouchableOpacity
            style={styles.suggestionButton}
            onPress={handleSuggestion}
          >
            <Text style={styles.suggestionButtonText}>AI 추천 표현 보기</Text>
            <View style={styles.rightArrowIcon}>
              <Text style={styles.rightArrowText}>&gt;</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      
      {isMenuOpen && <MenuOverlay />}
    </SafeAreaView>
  );
}

const menuStyles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        zIndex: 10,
        justifyContent: 'flex-start', 
        alignItems: 'flex-end', 
        paddingTop: 50, 
    },
    menuDrawer: {
        width: MENU_WIDTH,
        height: '100%',
        backgroundColor: c.mainwhite,
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 10,
    },
    menuButton: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: c.border,
        justifyContent: 'center',
    },
    menuText: {
        fontSize: 16,
        color: c.black,
        fontWeight: '500',
    },
});

const styles = StyleSheet.create({
    // ... (기존 스타일) ...
    container: {
        flex: 1,
        backgroundColor: c.bg,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        paddingTop: 10,
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    dateText: {
        fontSize: 16,
        color: c.black,
        fontWeight: "500",
    },
    tabContainer: {
        flexDirection: "row",
        marginBottom: 20,
        height: 48,
        borderRadius: 61,
        backgroundColor: c.bg,
        borderWidth: 1,
        borderColor: "#4052E2",
    },
    tabButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 61,
        paddingVertical: 10,
    },
    tabButtonActive: {
        backgroundColor: c.primary,
    },
    tabText: {
        fontSize: 16,
        fontWeight: "600",
        color: c.primary,
    },
    tabTextActive: {
        color: c.mainwhite,
    },
    card: {
        backgroundColor: c.mainwhite,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#4052E2",
        padding: 16,
        marginBottom: 20,
        minHeight: 350,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
        marginBottom: 12,
        position: 'relative',
    },
    titleText: {
        fontSize: 16,
        color: c.black,
        fontWeight: '500',
    },
    emojiDisplay: {
        width: 32,
        height: 32,
        borderRadius: 6.759,
        backgroundColor: "#DEDEDE",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },
    emojiText: {
        fontSize: 20,
    },
    descriptionText: {
        flex: 1,
        fontSize: 15,
        color: c.black,
        lineHeight: 24,
    },
    aiContentContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 300,
    },
    aiContentPlaceholder: {
        fontSize: 16,
        color: c.gray3,
    },
    bottomFixedContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 12,
    },
    suggestionButton: {
        backgroundColor: c.mainwhite,
        borderRadius: 10,
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#4052E2",
    },
    suggestionButtonText: {
        fontSize: 18,
        fontWeight: "600",
        color: c.primary,
        marginRight: 8,
    },
    rightArrowIcon: {
        marginLeft: 4,
    },
    rightArrowText: {
        fontSize: 18,
        color: c.primary,
        fontWeight: "600",
    },
    
    // 💡 수정 모드 스타일
    editContainer: {
        padding: 16,
        backgroundColor: c.mainwhite,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: c.primary, 
        minHeight: 400,
        marginBottom: 20,
    },
    titleInput: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: c.border,
    },
    descriptionInput: {
        fontSize: 15,
        lineHeight: 24,
        minHeight: 250,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: c.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: c.mainwhite,
        fontSize: 18,
        fontWeight: '600',
    },

    // 💡 이모지 선택 영역 스타일 추가
    emojiSelectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: c.bg,
    },
    emojiOption: {
        padding: 8,
        borderRadius: 5,
    },
    selectedEmojiOption: {
        backgroundColor: c.primary, 
    },
    emojiOptionText: {
        fontSize: 20,
    },

    // 💡 로딩 오버레이 스타일 추가
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: c.primary,
        fontSize: 16,
    }
});