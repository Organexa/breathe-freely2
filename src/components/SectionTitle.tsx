import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, space, type } from '../theme';

function SectionTitleBase({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={[type.m, styles.title]} accessibilityRole="header">
        {title}
      </Text>
      {subtitle ? <Text style={[type.body, styles.sub]}>{subtitle}</Text> : null}
    </View>
  );
}

export const SectionTitle = memo(SectionTitleBase);

const styles = StyleSheet.create({
  wrap: { marginTop: space.section, marginBottom: space.m, gap: space.xs },
  title: { color: colors.text },
  sub: { color: colors.textSecondary },
});
