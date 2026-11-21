import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, space, type } from '../theme';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  hint: string;
}

function EmptyStateBase({ icon, title, hint }: EmptyStateProps) {
  return (
    <View style={styles.wrap} accessible accessibilityLabel={`${title}. ${hint}`}>
      <Ionicons name={icon} size={48} color={colors.textMuted} />
      <Text style={[type.bodyLarge, styles.title]}>{title}</Text>
      <Text style={[type.body, styles.hint]}>{hint}</Text>
    </View>
  );
}

export const EmptyState = memo(EmptyStateBase);

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: space.xl, gap: space.s },
  title: { color: colors.text, textAlign: 'center' },
  hint: { color: colors.textMuted, textAlign: 'center', maxWidth: 280 },
});
