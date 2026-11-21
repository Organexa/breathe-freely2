import { LinearGradient } from 'expo-linear-gradient';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadows, space } from '../theme';

interface CardProps {
  children: React.ReactNode;
  accent?: 'green' | 'amber' | 'none';
  glow?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

function CardBase({ children, accent = 'none', glow, onPress, accessibilityLabel, style }: CardProps) {
  const tint = accent === 'amber' ? colors.amber : colors.green;
  const inner = (
    <View style={[styles.card, style]}>
      {glow && accent !== 'none' ? (
        <LinearGradient
          colors={[`${tint}26`, `${tint}00`]}
          start={{ x: 1, y: 1 }}
          end={{ x: 0.2, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {accent !== 'none' ? (
        <LinearGradient
          colors={[tint, `${tint}4D`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.accent}
        />
      ) : null}
      {children}
    </View>
  );
  if (!onPress) return inner;
  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => (pressed ? styles.pressed : null)}
    >
      {inner}
    </Pressable>
  );
}

export const Card = memo(CardBase);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.highlight,
    borderWidth: 1,
    borderRadius: radius.m,
    padding: space.card,
    overflow: 'hidden',
    ...shadows.card,
  },
  accent: { position: 'absolute', top: 0, left: 0, right: 0, height: 4 },
  pressed: { opacity: 0.85 },
});
