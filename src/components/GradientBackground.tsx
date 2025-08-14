import c from '@/src/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

interface GradientBackgroundProps {
  children: ReactNode;
}

export default function GradientBackground({ children }: GradientBackgroundProps) {
  return (
    <LinearGradient style={styles.container} colors={[c.bgup, c.bgdown]}>
        {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: c.bg,
    flex: 1
  },
})