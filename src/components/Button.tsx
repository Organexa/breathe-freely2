import { Ionicons } from '@expo/vector-icons';
import React, { memo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, shadows, space, touchTarget, type } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'danger';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityHint?: string;
}

const palette: Record<ButtonVariant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.green, fg: colors.base, border: colors.green },
  secondary: { bg: colors.card, fg: colors.text, border: colors.highlight },
  outline: { bg: 'transparent', fg: colors.green, border: colors.green },
  text: { bg: 'transparent', fg: colors.textSecondary, border: 'transparent' },
  danger: { bg: 'transparent', fg: colors.danger, border: colors.danger },
};

function ButtonBase({ label, onPress, variant = 'primary', icon, disabled, style, accessibilityHint }: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const p = palette[variant];
  const animate = (to: number) =>
    Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 40, bounciness: 6 }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: !!disabled }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => animate(0.97)}
        onPressOut={() => animate(1)}
        style={[
          styles.base,
          variant === 'text' ? styles.textPad : styles.pad,
          {
            backgroundColor: p.bg,
            borderColor: p.border,
            borderWidth: variant === 'outline' || variant === 'danger' ? 2 : variant === 'secondary' ? 1 : 0,
          },
          variant === 'primary' && !disabled ? shadows.green : null,
          disabled ? styles.disabled : null,
        ]}
      >
        <View style={styles.row}>
          {icon ? <Ionicons name={icon} size={20} color={p.fg} /> : null}
          <Text style={[type.s, { color: p.fg }]}>{label}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export const Button = memo(ButtonBase);

const styles = StyleSheet.create({
  base: {
    minHeight: touchTarget,
    borderRadius: radius.s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pad: { paddingVertical: space.base, paddingHorizontal: space.l },
  textPad: { paddingVertical: space.m, paddingHorizontal: space.base },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s },
  disabled: { opacity: 0.4 },
});
