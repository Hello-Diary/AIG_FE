import c from '@/src/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable } from 'react-native';

export default function BackButton() {
  return (
    <Pressable onPress={() => router.back()}>
      <Ionicons name="chevron-back" size={25} color={c.gray1} />
    </Pressable>
  );
}
