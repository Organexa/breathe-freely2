import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, space, type } from '../theme';
import { Card } from './Card';

interface StatBlockProps {
  label: string;
  value: string;
  caption?: string;
  icon: keyof typeof Ionicons.glyphMap;
  tone: 'green' | 'amber';
}

function StatBlockBase({ label, value, caption, icon, tone }: StatBlockProps) {
  const c = tone === 'amber' ? colors.amber : colors.green;
  return (
    <Card accent={tone} glow style={styles.card}>
      <View accessible accessibilityLabel={`${label}: ${value}`} style={styles.inner}>
        <View style={styles.head}>
          <Ionicons name={icon} size={16} color={c} />
          <Text style={[type.small, styles.label]}>{label}</Text>
        </View>
        <Text style={[type.l, { color: c }]} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
        {caption ? <Text style={[type.body, styles.caption]}>{caption}</Text> : null}
      </View>
    </Card>
  );
}

export const StatBlock = memo(StatBlockBase);

const styles = StyleSheet.create({
  card: { flex: 1 },
  inner: { gap: space.xs },
  head: { flexDirection: 'row', alignItems: 'center', gap: space.xs + 2 },
  label: { color: colors.textSecondary },
  caption: { color: colors.textMuted },
});
