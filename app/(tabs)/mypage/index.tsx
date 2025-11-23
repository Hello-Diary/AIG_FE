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
import { useAuthStore } from "@/src/stores/useUserStore";
import { UserPatchRequest, UserResponse } from "@/src/types/user";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

const profileChoices: Record<string, any> = {
  bear: require("@/assets/images/profile/bear.png"),
  cat: require("@/assets/images/profile/cat.png"),
  hippo: require("@/assets/images/profile/hippo.png"),
  lion: require("@/assets/images/profile/lion.png"),
  rabbit: require("@/assets/images/profile/rabbit.png"),
};

const defaultProfile = require("@/assets/images/profile/default-profile.png");

const getProfileImageSource = (keyword: string | null) => {
  if (keyword && profileChoices[keyword]) return profileChoices[keyword];
  return defaultProfile;
};

export default function MyPageScreen() {
  const { userId, email, name, profileKeyword, signIn, signOut } =
    useAuthStore();

  // 모드 상태
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 수정용 로컬 상태
  const [newName, setNewName] = useState(name);
  const [newProfileKeyword, setNewProfileKeyword] = useState<string | null>(
    profileKeyword
  );

  // 프로필 이미지 변경 모달
  const [isModalVisible, setIsModalVisible] = useState(false);

  const router = useRouter();

  const getUserData = async () => {
    if (!userId) return;

    try {
      const res: UserResponse = await getUserDataApi(userId);

      // 전역 스토어 업데이트
      const profile = {
        userId: res.userId,
        name: res.name,
        email: res.email,
        profileKeyword: res.profile ?? "default",
      };
      signIn(profile);

      // 로컬 상태 초기화
      setNewName(res.name);
      setNewProfileKeyword(res.profile || "default");
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = async () => {
    if (!userId) {
      console.error("User ID missing, cannot patch.");
      return;
    }

    const data: UserPatchRequest = {
      name: newName ? newName : "",
      profile: newProfileKeyword ?? "default",
    };

    try {
      await patchUserDataApi(userId, data);
      await getUserData();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  };

  const handleLogout = async () => {
    if (!userId) return;

    setIsLoggingOut(true);

    try {
      await postLogoutApi({ userId });
      signOut();
      router.replace("/login");
    } catch (e) {
      console.error("로그아웃 실패", e);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleWithdraw = async () => {
    if (!userId) return;

    try {
      await deleteUserApi(userId);
      signOut();
      router.replace("/login");
    } catch (e) {
      console.error("탈퇴 실패", e);
    }
  };

  const handleModalConfirm = (selectedKey: string) => {
    setNewProfileKeyword(selectedKey);
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // 첫 렌더링 시 GET 호출
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* 프로필 이미지 선택 모달 */}
      <ProfileImageModal
        visible={isModalVisible}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
        profileChoices={profileChoices}
        currentKeyword={newProfileKeyword}
      />

      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={getProfileImageSource(profileKeyword)}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.profileName}>{name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>읽기 알림</Text>
        <Reminder />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>계정정보</Text>

          {!isEditing ? (
            <TouchableOpacity onPress={handleEdit} activeOpacity={0.7}>
              <Ionicons name="settings-outline" size={20} color={c.gray2} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleSubmit} activeOpacity={0.7}>
              <Text style={{ color: c.primary, fontSize: 14 }}>완료</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoSection}>
          {isEditing && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>프로필 이미지</Text>
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

          {!isEditing ? (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>이름</Text>
              <Text style={styles.infoValue}>{name}</Text>
            </View>
          ) : (
            <View style={{ ...styles.infoItem }}>
              <Text style={styles.infoLabel}>이름</Text>
              <TextInput
                style={styles.infoValue}
                value={newName ? newName : ""}
                onChangeText={setNewName}
                placeholder="이름을 입력하세요"
              />
            </View>
          )}

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>이메일 정보</Text>
            <Text style={styles.infoValue}>{email}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>로그아웃</Text>
        </TouchableOpacity>

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
    flexDirection: "row",
    alignItems: "center",
    gap: 25,
    marginTop: 20,
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: c.black,
  },
  section: {
    borderWidth: 1,
    borderColor: "#F4F4F4",
    borderRadius: 8,
    backgroundColor: c.mainwhite,
    padding: 20,
    gap: 10,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    color: c.black,
  },
  infoSection: {
    backgroundColor: c.lightblue,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  infoItem: {
    marginVertical: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 16,
    paddingVertical: 5,
    color: "#333",
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
  },
  changeButton: {
    backgroundColor: c.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changeButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
