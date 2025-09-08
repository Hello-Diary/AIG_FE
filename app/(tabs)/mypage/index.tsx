import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function MyPageScreen() {
  const [isReadingReminderOn, setIsReadingReminderOn] = useState(true);

  const toggleSwitch = () => setIsReadingReminderOn(!isReadingReminderOn);

  const handleLogout = () => {
    // 로그아웃 로직
    console.log('로그아웃');
  };

  const handleWithdraw = () => {
    // 탈퇴하기 로직
    console.log('탈퇴하기');
  };

  const handleEdit = () => {
    // 편집 로직
    console.log('편집');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileAvatar}>
          <Ionicons name="person" size={24} color="#666" />
        </View>
        <Text style={styles.profileName}>김한동 님</Text>
      </View>

      {/* Reading Reminder Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>읽기 알림</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>읽기정성 알림</Text>
          <Switch
            trackColor={{ false: '#E5E5E5', true: '#4A90E2' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E5E5E5"
            onValueChange={toggleSwitch}
            value={isReadingReminderOn}
            style={styles.switch}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>알림시간</Text>
          <Text style={styles.settingValue}>21:00</Text>
        </View>
      </View>

      {/* Account Info Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>계정정보</Text>
          <TouchableOpacity onPress={handleEdit} activeOpacity={0.7}>
            <Text style={styles.editButton}>편집</Text>
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

      {/* Floating Edit Button */}
      <TouchableOpacity 
        style={styles.floatingEditButton}
        onPress={handleEdit}
        activeOpacity={0.8}
      >
        <Ionicons name="pencil" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  editButton: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  infoItem: {
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
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
    color: '#333',
  },
  floatingEditButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});