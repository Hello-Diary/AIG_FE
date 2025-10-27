import { postLogoutApi } from "@/src/api/authApi";
import {
  deleteUserApi,
  getUserDataApi,
  patchUserDataApi,
} from "@/src/api/userApi";
import PlusButton from "@/src/components/diary/AddDiaryButton";
import ProfileImageModal from "@/src/components/mypage/ProfileImageModal";
import Reminder from "@/src/components/mypage/Reminder";
import c from "@/src/constants/colors";
import { useUserStore } from "@/src/stores/useUserStore";
import { UserPatchRequest, UserResponse } from "@/src/types/user";
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

const profileChoices: { [key: string]: any } = {
  bear: require("@/assets/images/profile/bear.png"),
  cat: require("@/assets/images/profile/cat.png"),
  hippo: require("@/assets/images/profile/hippo.png"),
  lion: require("@/assets/images/profile/lion.png"),
  rabbit: require("@/assets/images/profile/rabbit.png"),
};

const defaultProfile = require("@/assets/images/profile/default-profile.png");

// 키워드에 따라 이미지 소스 반환
const getProfileImageSource = (keyword: string | null) => {
  // 키워드가 유효하고, profileChoices 객체에 존재하면 해당 이미지 반환
  if (keyword && profileChoices[keyword]) {
    return profileChoices[keyword];
  }
  // 그 외 모든 경우(keyword가 null, undefined, 또는 유효하지 않은 값) 기본 이미지 반환
  return defaultProfile;
};

export default function MyPageScreen() {
  // 전역으로 관리되는 사용자 정보 상태
  const {
    userId,
    email,
    name,
    profileKeyword,
    setUserId,
    setEmail,
    setName,
    setProfileKeyword,
  } = useUserStore();

  // 사용자 정보 수정 시 사용하는 상태
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(name);
  const [newProfileKeyword, setNewProfileKeyword] = useState<string | null>(
    profileKeyword
  );

  // Profile Image 모달 표시 상태
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getUserData = async () => {
    if (!userId) {
      console.log("Waiting for User ID...");
      return; // userId가 스토어에서 로드될 때까지 대기
    }

    try {
      // GET API 호출
      const res: UserResponse = await getUserDataApi(userId);
      // const res = {
      //   userId: "id",
      //   name: "처음 가져온 이름",
      //   email: "처음 가져온 이메일",
      //   createdAt: "2025-10-10",
      //   profile: "default",
      // }; // 임시 데이터

      // 전역 스토어 상태 설정
      setUserId(res.userId);
      setName(res.name);
      setEmail(res.email);
      setProfileKeyword(res.profile || "default");

      // 로컬 편집 상태 초기화
      setNewName(res.name);
      setNewProfileKeyword(res.profile || "default");
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // TODO: 사용자에게 에러 피드백
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);

    // 편집 모드 진입 또는 취소 시, 전역 상태 값으로 리셋
    setNewName(name);
    setNewProfileKeyword(profileKeyword);
  };

  const handleSubmit = async () => {
    if (userId === "") {
      console.error("User ID is not available for patching.");
      return;
    }

    const requestData: UserPatchRequest = {
      name: newName,
      profile: newProfileKeyword || "default",
    };

    try {
      // PATCH API 호출
      await patchUserDataApi(userId, requestData);
      await getUserData();

      // 편집 모드 종료
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user data:", error);
      // TODO: 사용자에게 에러 피드백 (예: 토스트 메시지)
    }
  };

  const handleLogout = async () => {
    // 로그아웃 로직
    try {
      const data = { userId: userId };
      
      await postLogoutApi(data);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const handleDeleteUser = async () => {
    // 탈퇴하기 로직
    try {
      await deleteUserApi(userId);
    } catch (error) {
      console.error("Failed to delete user data:", error);
    }
  };

  const handleModalConfirm = (selectedKey: string) => {
    setNewProfileKeyword(selectedKey);
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // 첫 렌더링
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ProfileImageModal
        visible={isModalVisible}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
        profileChoices={profileChoices}
        currentKeyword={newProfileKeyword}
      />

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image
            // 전역 profileKeyword에 따라 이미지 소스 동적 변경 - null이어도 충돌하지 않음
            source={getProfileImageSource(profileKeyword)}
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
          {isEditing && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>프로필 이미지</Text>
              {/* 인라인 선택 UI 대신, 현재 이미지와 변경 버튼 표시 */}
              <View style={styles.profileEditContainer}>
                <Image
                  source={getProfileImageSource(newProfileKeyword)}
                  style={styles.profileEditImage}
                />
                <TouchableOpacity
                  style={styles.changeButton}
                  onPress={() => setIsModalVisible(true)}
                >
                  <Text style={styles.changeButtonText}>변경</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

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
          onPress={handleDeleteUser}
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
    overflow: "hidden", // 이미지가 둥근 모서리를 벗어나지 않도록
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
  profileEditContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  profileEditImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: "cover",
  },
  changeButton: {
    backgroundColor: c.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changeButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
