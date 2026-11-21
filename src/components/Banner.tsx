import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, space, type } from '../theme';

interface BannerProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

function BannerBase({ message, actionLabel, onAction }: BannerProps) {
  return (
    <View style={styles.wrap} accessibilityRole="alert">
      <Ionicons name="alert-circle-outline" size={20} color={colors.amber} />
      <Text style={[type.body, styles.text]}>{message}</Text>
      {actionLabel && onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction} hitSlop={12}>
          <Text style={[type.s, styles.action]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export const Banner = memo(BannerBase);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s,
    padding: space.m,
    borderRadius: radius.s,
    backgroundColor: `${colors.amber}1A`,
    borderWidth: 1,
    borderColor: `${colors.amber}55`,
    marginBottom: space.base,
  },
  text: { flex: 1, color: colors.text },
  action: { color: colors.amber },
});
