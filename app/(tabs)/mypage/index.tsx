import PlusButton from "@/src/components/PlusButton";
import Reminder from "@/src/components/Reminder";
import c from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyPageScreen() {
  const [profileUrl, setProfileUrl] = useState<string | null>(null); // 프로필 이미지 URL 상태

  const handleLogout = () => {
    // 로그아웃 로직
    console.log("로그아웃");
  };

  const handleWithdraw = () => {
    // 탈퇴하기 로직
    console.log("탈퇴하기");
  };

  const handleEdit = () => {
    // 편집 로직
    console.log("편집");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              profileUrl
                ? { uri: profileUrl }
                : require("@/assets/images/default-profile.png")
            }
            style={styles.profileImage}
          />
        </View>

        <Text style={styles.profileName}>김한동 님</Text>
      </View>

      {/* Reading Reminder Section */}
      <Reminder />

      {/* Account Info Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>계정정보</Text>
          <TouchableOpacity onPress={handleEdit} activeOpacity={0.7}>
            <View style={styles.editButton}>
              <Ionicons name="settings-outline" size={20} color={c.gray2} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>이름</Text>
          <Text style={styles.infoValue}>김한동</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>이메일 정보</Text>
          <Text style={styles.infoValue}>handong.ac.kr@gmail.com</Text>
        </View>
      </View>

      {/* Actions Section */}
      <View style={styles.actionsSection}>
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

      {/* Floating edit button */}
      <PlusButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
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
    paddingVertical: 30,
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
    fontWeight: "600",
    color: c.gray1,
    marginBottom: 20,
  },
  editButton: {
    height: 20,
  },
  infoItem: {
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  actionItem: {
    paddingVertical: 16,
  },
  actionText: {
    fontSize: 16,
    color: "#333",
  },
  floatingEditButton: {
    position: "absolute",
    bottom: 50,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
