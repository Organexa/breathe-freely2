import React, { memo, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius, space, type } from '../theme';

interface FieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string | null;
  prefix?: string;
  hint?: string;
}

function FieldBase({ label, error, prefix, hint, ...input }: FieldProps) {
  const [focused, setFocused] = useState(false);
  const border = error ? colors.danger : focused ? colors.green : colors.highlight;
  return (
    <View style={styles.wrap}>
      <Text style={[type.small, styles.label]}>{label}</Text>
      <View style={[styles.box, { borderColor: border }]}>
        {prefix ? <Text style={[type.bodyLarge, styles.prefix]}>{prefix}</Text> : null}
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.green}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[type.bodyLarge, styles.input]}
          {...input}
        />
      </View>
      {error ? (
        <Text style={[type.body, styles.error]}>{error}</Text>
      ) : hint ? (
        <Text style={[type.body, styles.hint]}>{hint}</Text>
      ) : null}
    </View>
  );
}

export const Field = memo(FieldBase);

const styles = StyleSheet.create({
  wrap: { gap: space.s },
  label: { color: colors.textSecondary },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderRadius: radius.s,
    paddingHorizontal: space.base,
    minHeight: 52,
  },
  prefix: { color: colors.textSecondary, marginRight: space.s },
  input: { flex: 1, color: colors.text, paddingVertical: 14 },
  error: { color: colors.danger },
  hint: { color: colors.textMuted },
});
