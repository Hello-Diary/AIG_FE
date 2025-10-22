import PlusButton from "@/src/components/diary/AddDiaryButton";
import Reminder from "@/src/components/mypage/Reminder";
import c from "@/src/constants/colors";
import { useUserStore } from "@/src/stores/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyPageScreen() {
  // 전역으로 관리되는 사용자 정보 상태
  const { userId, email, name } = useUserStore();

  // 사용자 정보 수정 시 사용하는 상태
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(name);

  // 임시 프로필 이미지 URL 상태
  const [profileUrl, setProfileUrl] = useState<string | null>(null);

  const handleEdit = () => {
    setIsEditing(!isEditing);
    setNewName(name);
  };

  // 여기에 async await 추가 & postUserData 함수 호출
  const handleSubmit = () => {
    // API 호출
    const response = { data: { name: "유민" } };
    const updatedUser = response.data;

    useUserStore.getState().setName(updatedUser.name);

    // 편집 모드 종료
    setIsEditing(false);
  };

  const handleLogout = () => {
    // 로그아웃 로직
    console.log("로그아웃");
  };

  const handleWithdraw = () => {
    // 탈퇴하기 로직
    console.log("탈퇴하기");
  };

  useEffect(() => {
    // TODO: GET /api/users/{userId} API 호출하여 사용자 정보 가져오기;
    const response = {
      data: {
        userId: "id",
        name: "처음 가져온 이름",
        email: "처음 가져온 이메일",
        role: "처음 가져온 역할",
        createdAt: "2025-10-10",
      },
    };

    const userData = response.data;

    setNewName(userData.name);
    useUserStore.getState().setName(userData.name);
    useUserStore.getState().setEmail(userData.email);
    useUserStore.getState().setRole(userData.role);
    useUserStore.getState().setCreatedAt(new Date(userData.createdAt));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              profileUrl
                ? { uri: profileUrl }
                : require("@/assets/icons/default-profile.png")
            }
            style={styles.profileImage}
          />
        </View>

        <Text style={styles.profileName}>{name}</Text>
      </View>

      {/* Reading Reminder Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>읽기 알림</Text>
        <Reminder />
      </View>

      {/* Account Info Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>계정정보</Text>
          {!isEditing && (
            <TouchableOpacity onPress={handleEdit} activeOpacity={0.7}>
              <View style={styles.editButton}>
                <Ionicons name="settings-outline" size={20} color={c.gray2} />
              </View>
            </TouchableOpacity>
          )}
          {isEditing && (
            <TouchableOpacity onPress={handleSubmit} activeOpacity={0.7}>
              <View style={styles.editButton}>
                <Text style={{ fontSize: 14, color: c.primary }}>완료</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoSection}>
          {!isEditing && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>이름</Text>
              <Text style={styles.infoValue}>{name}</Text>
            </View>
          )}

          {isEditing && (
            <View
              style={{
                ...styles.infoItem,
                borderColor: "#D0D0D0",
                borderBottomWidth: 1,
              }}
            >
              <Text style={styles.infoLabel}>이름</Text>
              <TextInput
                placeholder="이름을 입력하세요"
                value={newName}
                onChangeText={setNewName}
                style={styles.infoValue}
              />
            </View>
          )}

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>이메일 정보</Text>
            <Text style={styles.infoValue}>{email}</Text>
          </View>
        </View>

        {/* 로그아웃 버튼 */}
        <TouchableOpacity
          style={styles.actionItem}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>로그아웃</Text>
        </TouchableOpacity>

        {/* 탈퇴하기 버튼 */}
        <TouchableOpacity
          style={styles.actionItem}
          onPress={handleWithdraw}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>탈퇴하기</Text>
        </TouchableOpacity>
      </View>

      <PlusButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 10,
    backgroundColor: c.bg,
  },
  profileSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 27,
    marginTop: 20,
    marginHorizontal: 10,
    paddingVertical: 20,
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: c.black,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#F4F4F4",
    borderRadius: 8,
    backgroundColor: c.mainwhite,
    padding: 20,
    gap: 10,
    shadowColor: "#E1E1E1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  sectionHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    color: c.black,
  },
  infoSection: {
    display: "flex",
    flexDirection: "column",
    borderRadius: 8,
    backgroundColor: c.lightblue,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  editButton: {
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  infoItem: {
    marginVertical: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 5,
  },
  actionItem: {
    paddingVertical: 10,
  },
  actionText: {
    fontSize: 16,
    color: "#333",
  },
});
