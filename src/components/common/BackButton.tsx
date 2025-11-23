import c from '@/src/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import React from 'react';

interface BackButtonProps {
  onPress?: () => void;
}

export default function BackButton({ onPress }: BackButtonProps) {
  const handlePress = onPress || (() => router.back());

  return (
    <Pressable onPress={handlePress}>
      <Ionicons name="chevron-back" size={25} color={c.gray1} />
    </Pressable>
  );
}