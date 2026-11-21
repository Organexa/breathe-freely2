import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { MILESTONES, milestoneProgress, milestoneStatus } from '../logic/milestones';
import { elapsedMs, formatDate, formatUntil } from '../logic/time';
import { useNow } from '../logic/useNow';
import { ScreenProps } from '../navigation/types';
import { useApp } from '../state/AppContext';
import { colors, radius, space, type } from '../theme';

export function HealthTimelineScreen({ navigation }: ScreenProps<'HealthTimeline'>) {
  const { state } = useApp();
  const now = useNow(30_000);
  const quitAt = state.settings.quitAt;
  const elapsed = elapsedMs(quitAt, now);
  const progress = milestoneProgress(elapsed);
  const [open, setOpen] = useState<string | null>(progress.next?.id ?? null);

  return (
    <Screen footer={<Button label="Back to home" variant="secondary" onPress={() => navigation.goBack()} />}>
      <Text style={[type.bodyLarge, styles.lead]}>
        Your body's recovery, one milestone at a time. {progress.reachedCount} of {MILESTONES.length}{' '}
        reached.
      </Text>
      <View style={styles.list}>
        {MILESTONES.map((m, i) => {
          const status = milestoneStatus(m, elapsed);
          const isOpen = open === m.id || status === 'next';
          const tint = status === 'future' ? colors.textMuted : colors.green;
          const last = i === MILESTONES.length - 1;
          return (
            <Pressable
              key={m.id}
              onPress={() => setOpen(open === m.id ? null : m.id)}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`${m.title}. ${
                status === 'done' ? 'Reached' : status === 'next' ? 'Next milestone' : 'Coming up'
              }. ${m.description}`}
              style={styles.row}
            >
              <View style={styles.rail}>
                <View
                  style={[
                    styles.badge,
                    status === 'done' && styles.badgeDone,
                    status === 'next' && styles.badgeNext,
                  ]}
                >
                  {status === 'done' ? (
                    <Ionicons name="checkmark" size={20} color={colors.base} />
                  ) : (
                    <Text style={[type.small, { color: tint, textTransform: 'none' }]}>{m.short}</Text>
                  )}
                </View>
                {!last ? (
                  <View style={[styles.line, status === 'done' ? styles.lineDone : null]} />
                ) : null}
              </View>
              <View style={[styles.body, status === 'next' && styles.bodyNext]}>
                <View style={styles.titleRow}>
                  <Text style={[type.s, { color: status === 'future' ? colors.textSecondary : colors.text }]}>
                    {m.title}
                  </Text>
                  <Text style={[type.body, { color: tint }]}>
                    {status === 'done'
                      ? formatDate(quitAt + m.at)
                      : formatUntil(m.at - elapsed)}
                  </Text>
                </View>
                {isOpen ? (
                  <Text style={[type.body, styles.desc]}>{m.description}</Text>
                ) : null}
                {status === 'next' ? (
                  <View style={styles.track}>
                    <View style={[styles.fill, { width: `${Math.round(progress.progress * 100)}%` }]} />
                  </View>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
      <Text style={[type.body, styles.disclaimer]}>
        Timings are typical averages from public health sources and vary from person to person. This
        is encouragement, not medical advice.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: { color: colors.textSecondary, marginBottom: space.l },
  list: {},
  row: { flexDirection: 'row', gap: space.base },
  rail: { alignItems: 'center', width: 44 },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.highlight,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDone: { backgroundColor: colors.green, borderColor: colors.green },
  badgeNext: { borderColor: colors.green },
  line: { flex: 1, width: 2, backgroundColor: colors.highlight, minHeight: 16 },
  lineDone: { backgroundColor: colors.greenFaint },
  body: { flex: 1, paddingBottom: space.l, paddingTop: space.m },
  bodyNext: {
    backgroundColor: colors.card,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: `${colors.green}55`,
    padding: space.base,
    marginBottom: space.base,
    marginTop: 0,
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space.s },
  desc: { color: colors.textSecondary, marginTop: space.xs },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.highlight, marginTop: space.m, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3, backgroundColor: colors.green },
  disclaimer: { color: colors.textMuted, marginTop: space.base },
});
