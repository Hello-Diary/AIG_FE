import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import c from '../constants/colors';

export default function BackButton() {
  return (
    <Pressable onPress={() => router.back()}>
      <Ionicons name="chevron-back" size={18} color={c.gray2} />
    </Pressable>
  );
}
