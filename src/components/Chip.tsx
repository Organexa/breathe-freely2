import React, { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, space, touchTarget, type } from '../theme';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  tone?: 'green' | 'red' | 'amber';
}

function ChipBase({ label, selected, onPress, tone = 'green' }: ChipProps) {
  const c = tone === 'red' ? colors.danger : tone === 'amber' ? colors.amber : colors.green;
  return (
    <Pressable
      accessible
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.chip,
        selected ? { backgroundColor: `${c}22`, borderColor: c } : null,
      ]}
    >
      <Text style={[type.body, { color: selected ? c : colors.text }]}>{label}</Text>
    </Pressable>
  );
}

export const Chip = memo(ChipBase);

const styles = StyleSheet.create({
  chip: {
    minHeight: touchTarget,
    justifyContent: 'center',
    paddingHorizontal: space.base,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.highlight,
    backgroundColor: colors.card,
  },
});
