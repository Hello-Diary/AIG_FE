import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
// Svg Icons
import CalendarSvg from "@/assets/images/calender.svg";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    Plus2Icon,
    SearchIcon,
} from "../../components/home/SvgIcons";
// Components
import AddDiaryButton from "@/src/components/diary/AddDiaryButton";
import c from "@/src/constants/colors";
import MiniCalendar from "../../components/home/MiniCalendar";

import { Ionicons } from "@expo/vector-icons";
import { getAllJournalApi, getJournalByDateApi } from "../../api/journalApi";
import { useJournalStore } from "../../stores/useJournalStore";
import { useAuthStore } from "../../stores/useUserStore";
import { JournalResponse } from "../../types/journal";

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface JournalListResponse {
  journals: JournalResponse[];
  pagination: PaginationInfo;
}

interface DiaryEntry extends JournalResponse {}

interface GrammarSuggestion {
  text: string;
  icon: string;
}

type HomeViewScreen =
  | "home"
  | "calendar"
  | "search"
  | "comingSoon"
  | "journalList";

interface HomeViewProps {
  setCurrentView: (view: "home" | "calendar" | "search") => void;
  koreanDayNames: string[];
}
interface DiaryEntryItemProps {
  entry: DiaryEntry;
  isSearchItem?: boolean;
  isJournalListItem?: boolean;
  onPress: () => void;
}

const MAX_CONTENT_LENGTH = 30;

const truncateContent = (content: string): string => {
  if (content.length > MAX_CONTENT_LENGTH) {
    return content.substring(0, MAX_CONTENT_LENGTH) + "...";
  }
  return content;
};

const formatDateToString = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  } catch (e) {
    return "날짜 오류";
  }
};

const DiaryEntryItem: React.FC<DiaryEntryItemProps> = ({
  entry,
  isSearchItem = false,
  isJournalListItem = false,
  onPress,
}) => (
  <TouchableOpacity
    style={[
      isJournalListItem ? listStyles.journalItem : itemStyles.entryItem,
      isSearchItem ? itemStyles.searchEntryItem : itemStyles.defaultEntryItem,
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={itemStyles.entryContent}>
      <View style={itemStyles.titleAndEmojiWrapper}>
        <Text style={itemStyles.entryEmoji}>{entry.emoji || "✍️"}</Text>
        <Text style={itemStyles.entryTitle}>{entry.title}</Text>

        {isJournalListItem && (
          <Text style={itemStyles.entryDate}>
            {formatDateToString(entry.date as unknown as string)}
          </Text>
        )}
      </View>

      <View style={itemStyles.entryTextContainer}>
        <Text
          style={itemStyles.entryText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {truncateContent(entry.content)}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const itemStyles = StyleSheet.create({
  defaultEntryItem: {
    paddingBottom: 16,
  },
  searchEntryItem: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 8,
    marginBottom: 0,
    borderBottomWidth: 0,
    paddingBottom: 16,
  },
  entryItem: {
    width: "100%",
  },
  entryTime: {
    color: "#6b7280",
    fontSize: 14,
    marginBottom: 4,
  },
  entryContent: {
    flexDirection: "column",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#F4F4F4",
    borderRadius: 8,
    padding: 20,
    backgroundColor: "#fff",
    width: "100%",
  },

  titleAndEmojiWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    gap: 8,
    marginBottom: 2,
  },

  entryEmoji: {
    fontSize: 16,
    marginRight: -4,
  },

  entryTitle: {
    fontWeight: "600",
    fontSize: 14,
    color: "#000",
    flexShrink: 1,
    marginRight: "auto",
  },

  entryDate: {
    fontSize: 13,
    color: c.gray3,
    marginLeft: "auto",
    flexShrink: 0,
  },

  entryTextContainer: {
    width: "100%",
    minWidth: 0,
    flexShrink: 1,
    overflow: "hidden",
  },

  entryText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "400",
    flexShrink: 1,
  },
});
const CalendarImage = () => <CalendarSvg width={24} height={24} />;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const KOREAN_DAY_NAMES_MAP = ["일", "월", "화", "수", "목", "금", "토"];

const normalizeDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const isYesterday = (journalDate: Date): boolean => {
  const yesterday = normalizeDate(new Date());
  yesterday.setDate(yesterday.getDate() - 1);
  return normalizeDate(journalDate).getTime() === yesterday.getTime();
};

const isThisWeekExcludingYesterday = (journalDate: Date): boolean => {
  const today = normalizeDate(new Date());
  const journalDay = normalizeDate(journalDate);

  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - today.getDay());

  if (
    journalDay.getTime() >= lastSunday.getTime() &&
    journalDay.getTime() < today.getTime()
  ) {
    if (!isYesterday(journalDay)) {
      return true;
    }
  }
  return false;
};

const mapToDiaryEntry = (journal: JournalResponse): DiaryEntry => ({
  ...journal,
});

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
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + direction,
      1
    );
    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };

  const handleDaySelect = (day: number) => {
    const newSelectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(newSelectedDate);
  };

  const handleMiniDaySelect = (dateObject: Date) => {
    setCurrentDate(dateObject);
    setSelectedDate(dateObject);
  };

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

  const selectedDayOfMonth =
    selectedDate.getFullYear() === displayYear &&
    selectedDate.getMonth() === displayMonth
      ? selectedDate.getDate()
      : null;

  return (
    <View style={styles.expandedCalendarContainer}>
      <View style={styles.monthNavigation}>
        <TouchableOpacity
          onPress={() => navigateMonth(-1)}
          style={styles.chevronButton}
        >
          <ChevronLeftIcon />
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {MONTH_NAMES[displayMonth]}, {displayYear}
        </Text>
        <TouchableOpacity
          onPress={() => navigateMonth(1)}
          style={styles.chevronButton}
        >
          <ChevronRightIcon />
        </TouchableOpacity>
      </View>

      <View style={styles.calendarHeaderRow}>
        {DAY_NAMES.map((day: string, index: number) => (
          <Text
            key={index}
            style={[
              styles.calendarDayName,
              index === 0 ? styles.sundayText : null,
            ]}
          >
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
                  day === selectedDayOfMonth ? styles.selectedDayButton : null,
                ]}
                onPress={() => handleDaySelect(day)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    day === selectedDayOfMonth
                      ? styles.selectedDayButtonText
                      : null,
                  ]}
                >
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

interface ComingSoonViewProps {
  setCurrentView: (view: HomeViewScreen) => void;
}

const ComingSoonView: React.FC<ComingSoonViewProps> = ({ setCurrentView }) => (
  <View style={comingSoonStyles.container}>
    <TouchableOpacity
      style={comingSoonStyles.backButton}
      onPress={() => setCurrentView("home")}
    >
      <ChevronLeftIcon />
    </TouchableOpacity>
    <Text style={comingSoonStyles.message}>
      {"🚨 현재 준비 중인 기능입니다 🚨"}
    </Text>
    <Text style={comingSoonStyles.subtitle}>
      빠른 시일 내에 제공해드리겠습니다. 감사합니다!
    </Text>
  </View>
);

interface JournalListViewProps {
  setCurrentScreen: (view: HomeViewScreen) => void;
  userId: string | null;
  handleGoToFeedback: (journal: JournalResponse) => void;
  DiaryEntryItem: React.FC<DiaryEntryItemProps>;
}

const JournalListView: React.FC<JournalListViewProps> = ({
  setCurrentScreen,
  userId,
  handleGoToFeedback,
  DiaryEntryItem,
}) => {
  const [journals, setJournals] = useState<JournalResponse[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPagingLoading, setIsPagingLoading] = useState(false);

  const MAX_VISIBLE_PAGES = 4;

  const fetchJournals = async (page: number) => {
    if (!userId) {
      setJournals([]);
      return;
    }
    setIsPagingLoading(true);
    try {
      // @ts-ignore
      const response: JournalListResponse = await getAllJournalApi(
        userId,
        page
      );

      setJournals(response.journals);
      setPagination(response.pagination);
      setCurrentPage(response.pagination.currentPage);
    } catch (error) {
      console.error("Failed to fetch journal list:", error);
      Alert.alert("오류", "일기 목록을 불러오지 못했습니다.");
      setJournals([]);
    } finally {
      setIsPagingLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchJournals(1);
    }
  }, [userId]);

  const handlePageChange = (page: number) => {
    if (
      pagination &&
      page >= 1 &&
      page <= pagination.totalPages &&
      !isPagingLoading
    ) {
      fetchJournals(page);
    }
  };
  const renderPageNumbers = () => {
    if (!pagination) return null;

    const { totalPages, currentPage } = pagination;

    let startGroup = Math.max(
      1,
      currentPage - Math.floor(MAX_VISIBLE_PAGES / 2)
    );
    let endGroup = Math.min(totalPages, startGroup + MAX_VISIBLE_PAGES - 1);

    if (endGroup - startGroup + 1 < MAX_VISIBLE_PAGES) {
      startGroup = Math.max(1, endGroup - MAX_VISIBLE_PAGES + 1);
    }

    const pages = [];

    if (startGroup > 1) {
      pages.push(
        <TouchableOpacity
          key={1}
          onPress={() => handlePageChange(1)}
          style={paginationStyles.pageButton}
          disabled={isPagingLoading}
        >
          <Text style={paginationStyles.pageButtonText}>{"1"}</Text>
        </TouchableOpacity>
      );
      if (startGroup > 2) {
        pages.push(
          <Text key="..." style={paginationStyles.pageButtonText}>
            ...
          </Text>
        );
      }
    }

    for (let i = startGroup; i <= endGroup; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          onPress={() => handlePageChange(i)}
          style={[
            paginationStyles.pageButton,
            i === currentPage ? paginationStyles.activePageButton : null,
          ]}
          disabled={i === currentPage || isPagingLoading}
        >
          <Text
            style={[
              paginationStyles.pageButtonText,
              i === currentPage ? paginationStyles.activePageButtonText : null,
            ]}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    if (endGroup < totalPages) {
      if (endGroup < totalPages - 1) {
        pages.push(
          <Text key="...end" style={paginationStyles.pageButtonText}>
            ...
          </Text>
        );
      }
      pages.push(
        <TouchableOpacity
          key={totalPages}
          onPress={() => handlePageChange(totalPages)}
          style={paginationStyles.pageButton}
          disabled={isPagingLoading}
        >
          <Text style={paginationStyles.pageButtonText}>{totalPages}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={paginationStyles.pageGroupWrapper}>
        <TouchableOpacity
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={!pagination.hasPrevious || isPagingLoading}
          style={{ opacity: pagination.hasPrevious ? 1 : 0.5 }}
        >
          <ChevronLeftIcon />
        </TouchableOpacity>
        {pages}
        <TouchableOpacity
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={!pagination.hasNext || isPagingLoading}
          style={{ opacity: pagination.hasNext ? 1 : 0.5 }}
        >
          <ChevronRightIcon />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={listStyles.container}>
      <View style={listStyles.header}>
        <TouchableOpacity
          onPress={() => setCurrentScreen("home")}
          style={{ padding: 4 }}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={listStyles.headerTitle}>나의 일기 목록</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={listStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          listStyles.scrollViewContent,
          {
            flexGrow: 1,
            justifyContent: "space-between",
          },
        ]}
      >
        {isPagingLoading && journals.length === 0 ? (
          <ActivityIndicator
            size="large"
            color={c.primary}
            style={{ marginTop: 50 }}
          />
        ) : journals.length > 0 ? (
          <View style={listStyles.journalList}>
            {journals.map((entry, index) => (
              <DiaryEntryItem
                key={entry.journalId}
                isJournalListItem={true}
                entry={entry as DiaryEntry}
                onPress={() => handleGoToFeedback(entry)}
              />
            ))}
          </View>
        ) : (
          <View style={listStyles.journalListEmpty}>
            <Text style={listStyles.noDataText}>작성된 일기가 없습니다.</Text>
          </View>
        )}

        {pagination && pagination.totalPages > 1 && (
          <View style={paginationStyles.paginationContainer}>
            {renderPageNumbers()}
          </View>
        )}
        {isPagingLoading && journals.length > 0 && (
          <ActivityIndicator
            size="small"
            color={c.primary}
            style={{ marginVertical: 10 }}
          />
        )}
      </ScrollView>
    </View>
  );
};

const listStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.bg,
    paddingTop: Constants.statusBarHeight,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: c.black,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    paddingBottom: 50,
  },
  journalList: {
    paddingTop: 10,
  },
  journalListEmpty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  journalItem: {
    width: "100%",
    marginBottom: 0,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 50,
    color: "#6b7280",
  },
});

const paginationStyles = StyleSheet.create({
  paginationContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 20,
  },
  pageGroupWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  pageButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  activePageButton: {
    backgroundColor: c.bg,
  },
  pageButtonText: {
    fontSize: 16,
    color: c.black,
  },
  activePageButtonText: {
    color: c.primary,
    fontWeight: "bold",
  },
});

const HomeView: React.FC<HomeViewProps> = ({ koreanDayNames }) => {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<HomeViewScreen>("home");
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);

  const userId = useAuthStore((state) => state.userId);
  const userName = useAuthStore((state) => state.name);
  const displayUserName = userName || "Guest";

  const setRefetchJournals = useJournalStore(
    (state) => state.setRefetchJournals
  );

  const [selectedDateEntries, setSelectedDateEntries] = useState<
    JournalResponse[]
  >([]);
  const [isEntryLoading, setIsEntryLoading] = useState(true);

  const [allJournals, setAllJournals] = useState<JournalResponse[]>([]);
  const [isRecentLoading, setIsRecentLoading] = useState(true);

  const {
    currentDate,
    selectedDate,
    navigateMonth,
    handleDaySelect,
    handleMiniDaySelect,
    getDaysInMonth,
    getMiniCalendarDays,
  } = useCalendarLogic(new Date());

  const fetchSelectedDiary = async (date: Date) => {
    if (!userId) {
      setIsEntryLoading(false);
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    setIsEntryLoading(true);
    try {
      const journals = await getJournalByDateApi(userId, formattedDate);
      setSelectedDateEntries(journals);
    } catch (error) {
      console.error(`Failed to fetch diary for ${formattedDate}:`, error);
      setSelectedDateEntries([]);
    } finally {
      setIsEntryLoading(false);
    }
  };

  useEffect(() => {
    fetchSelectedDiary(selectedDate);
  }, [userId, selectedDate]);

  const fetchAllDiaries = async () => {
    if (!userId) {
      setIsRecentLoading(false);
      return;
    }

    setIsRecentLoading(true);
    try {
      const response: JournalListResponse = await getAllJournalApi(userId, 1);

      const journals = response.journals;

      const sortedJournals = journals.sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );

      setAllJournals(sortedJournals);
    } catch (error) {
      console.error("Failed to fetch all diaries:", error);
      setAllJournals([]);
    } finally {
      setIsRecentLoading(false);
    }
  };

  useEffect(() => {
    setRefetchJournals(fetchAllDiaries);
    fetchAllDiaries();
  }, [userId, setRefetchJournals]);

  const handleCalendarToggle = () => {
    setIsCalendarExpanded((prev) => !prev);
  };

  const handleSetCurrentView = (view: HomeViewScreen) => {
    if (view === "home" || view === "journalList") {
      setIsCalendarExpanded(false);
    }
    setCurrentScreen(view);
  };

  const handleSearchPress = () => {
    handleSetCurrentView("comingSoon");
  };

  const handleGoToDiary = () => {
    router.push("/diary");
  };

  const handleGoToFeedback = () => {
    router.push("/grammar");
  };

  const handleMorePress = () => {
    handleSetCurrentView("journalList");
  };

  const miniCalendarDays = getMiniCalendarDays(selectedDate);

  const formatSelectedDate = (date: Date): string => {
    const today = new Date();
    const isToday = today.toDateString() === date.toDateString();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dayOfMonth = String(date.getDate()).padStart(2, "0");
    const dayOfWeekIndex = date.getDay();

    const dayOfWeek = KOREAN_DAY_NAMES_MAP[dayOfWeekIndex];

    const dateString = `${year}.${month}.${dayOfMonth} (${dayOfWeek})`;

    return isToday ? `오늘 ${dateString}` : dateString;
  };

  const formattedDate = formatSelectedDate(selectedDate);

  if (currentScreen === "comingSoon") {
    return <ComingSoonView setCurrentView={handleSetCurrentView} />;
  }

  if (currentScreen === "journalList") {
    return (
      <JournalListView
        setCurrentScreen={handleSetCurrentView}
        userId={userId}
        handleGoToFeedback={handleGoToFeedback}
        DiaryEntryItem={DiaryEntryItem}
      />
    );
  }

  const renderSelectedDateEntry = () => {
    const isTodaySelected =
      normalizeDate(selectedDate).getTime() ===
      normalizeDate(new Date()).getTime();

    if (isEntryLoading) {
      return (
        <View style={[styles.todaySection, styles.loadingContainer]}>
          <ActivityIndicator size="small" color={c.primary} />
          <Text style={styles.loadingText}>일기 불러오는 중...</Text>
        </View>
      );
    }

    if (selectedDateEntries.length > 0) {
      return (
        <View style={[styles.todaySection, { paddingVertical: 8 }]}>
          {selectedDateEntries.map((entry, index) => (
            <DiaryEntryItem
              key={index}
              entry={mapToDiaryEntry(entry)}
              onPress={handleGoToFeedback}
            />
          ))}
        </View>
      );
    }

    return (
      <View style={[styles.todaySection, { paddingVertical: 8 }]}>
        {isTodaySelected ? (
          <TouchableOpacity
            style={styles.todayHeader}
            onPress={handleGoToDiary}
            activeOpacity={0.8}
          >
            <View style={styles.addButton}>
              <Plus2Icon />
            </View>
            <View style={styles.todayText}>
              <Text style={styles.todayTitle}>Today</Text>
              <Text style={styles.todaySubtitle}>
                오늘 작성된 일기가 아직 없어요.
              </Text>
              <Text style={styles.todaySubtitle}>
                버튼을 눌러 첫 문장을 시작해보세요.
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.todayHeader}>
            <Text style={styles.recentTitle}>
              {formattedDate.split(" ")[0]}
            </Text>
            <Text style={styles.loadingText}>
              선택된 날짜에 작성된 일기가 없습니다.
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderRecentSection = () => {
    if (isRecentLoading) {
      return (
        <ActivityIndicator
          size="small"
          color={c.primary}
          style={{ marginTop: 20 }}
        />
      );
    }

    const yesterdayEntries = allJournals.filter((j) =>
      isYesterday(new Date(j.date))
    );

    const thisWeekEntries = allJournals.filter((j) =>
      isThisWeekExcludingYesterday(new Date(j.date))
    );

    const hasRecentEntries =
      yesterdayEntries.length > 0 || thisWeekEntries.length > 0;

    if (!hasRecentEntries) {
      return (
        <Text style={{ color: "#6b7280", textAlign: "center", marginTop: 20 }}>
          최근에 작성된 일기가 없습니다.
        </Text>
      );
    }

    return (
      <View style={styles.entriesList}>
        {yesterdayEntries.length > 0 && (
          <View style={styles.recentGroup}>
            <Text style={styles.recentGroupTitle}>어제 작성한 일기</Text>
            {yesterdayEntries.map((entry, index) => (
              <DiaryEntryItem
                key={index}
                entry={mapToDiaryEntry(entry)}
                onPress={handleGoToFeedback}
              />
            ))}
          </View>
        )}
        {thisWeekEntries.length > 0 && (
          <View style={styles.recentGroup}>
            <Text style={styles.recentGroupTitle}>이번 주에 작성한 일기</Text>
            {thisWeekEntries.map((entry, index) => (
              <DiaryEntryItem
                key={index + yesterdayEntries.length}
                entry={mapToDiaryEntry(entry)}
                onPress={handleGoToFeedback}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.greeting}>Hello, {displayUserName}</Text>
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
              onPress={handleSearchPress}
            >
              <View style={styles.searchInput}>
                <Text style={styles.searchPlaceholder}>검색</Text>
              </View>
              <View style={styles.searchIcon}>
                <SearchIcon />
              </View>
            </TouchableOpacity>
          </View>
        </View>
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
        <View style={styles.selectedDateDisplayContainer}>
          <Text style={styles.selectedDateText}>{formattedDate}</Text>
        </View>

        {renderSelectedDateEntry()}

        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>최근에 작성한 일기</Text>
            <TouchableOpacity onPress={handleMorePress}>
              <Text style={styles.moreButton}>더보기</Text>
            </TouchableOpacity>
          </View>

          {renderRecentSection()}
        </View>
      </ScrollView>

      <AddDiaryButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  header: {
    backgroundColor: c.primary,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20 + Constants.statusBarHeight,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  greeting: { fontSize: 18, fontWeight: "600", color: c.mainwhite },

  searchBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
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
    position: "relative",
    flex: 1,
    minWidth: 0,
  },

  searchInput: {
    backgroundColor: "#ffffff",
    color: "#000",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 15,
    height: 40,
    justifyContent: "center",
  },
  searchPlaceholder: { color: "#9199A6", fontSize: 15 },
  searchIcon: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  expandedCalendarContainer: { paddingHorizontal: 16, paddingVertical: 16 },
  monthNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  monthTitle: { fontSize: 18, fontWeight: "500" },
  chevronButton: { padding: 4 },
  calendarHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  calendarDayName: {
    textAlign: "center",
    fontWeight: "500",
    color: "#374151",
    flex: 1,
  },
  sundayText: { color: c.red },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap" },
  calendarCell: {
    width: "14.28%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  dayButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  selectedDayButton: { backgroundColor: c.primary },
  dayButtonText: { color: "#374151" },
  selectedDayButtonText: { color: c.mainwhite },
  selectedDateDisplayContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },

  todaySection: { paddingHorizontal: 16, paddingVertical: 16 },
  todayHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: c.border2,
    backgroundColor: c.mainwhite,
    borderRadius: 8,
    padding: 15,
  },
  addButton: { padding: 8, borderRadius: 8 },
  todayText: { flex: 1 },
  todayTitle: { color: c.primary, fontWeight: "semibold", fontSize: 16 },
  todaySubtitle: { color: "#9199A6", fontSize: 14 },

  recentSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },

  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  recentTitle: { fontSize: 18, fontWeight: "500" },
  moreButton: { color: "#6b7280" },

  entriesList: { gap: 0 },
  recentGroup: { marginBottom: 20 },
  recentGroupTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#374151",
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: c.border2,
    backgroundColor: c.mainwhite,
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: 0,
  },
  loadingText: {
    color: "#6b7280",
    fontSize: 16,
  },
});

const comingSoonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.mainwhite,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 0 + Constants.statusBarHeight,
  },
  backButton: {
    position: "absolute",
    top: 13 + Constants.statusBarHeight,
    left: 16,
    padding: 8,
  },
  message: {
    fontSize: 22,
    fontWeight: "700",
    color: c.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
});

export default HomeView;
