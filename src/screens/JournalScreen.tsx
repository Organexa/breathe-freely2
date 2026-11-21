import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { Screen } from '../components/Screen';
import { SectionTitle } from '../components/SectionTitle';
import { resistRate, timeOfDayBreakdown, topTriggers } from '../logic/patterns';
import { formatDateTime } from '../logic/time';
import { ScreenProps } from '../navigation/types';
import { useApp } from '../state/AppContext';
import { Craving } from '../state/types';
import { colors, space, type } from '../theme';

const VISIBLE = 50;

export function JournalScreen({ navigation }: ScreenProps<'Journal'>) {
  const { state, deleteCraving } = useApp();
  const cravings = state.cravings;
  const triggers = useMemo(() => topTriggers(cravings), [cravings]);
  const parts = useMemo(() => timeOfDayBreakdown(cravings), [cravings]);
  const rate = resistRate(cravings);
  const maxTrigger = triggers[0]?.count ?? 1;
  const maxPart = Math.max(1, ...parts.map((p) => p.count));
  const peak = parts.reduce((a, b) => (b.count > a.count ? b : a), parts[0]);

  const confirmDelete = (c: Craving) =>
    Alert.alert('Delete this entry?', `${c.trigger} · ${formatDateTime(c.at)}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCraving(c.id) },
    ]);

  const footer = (
    <Button label="Log a craving" icon="add" onPress={() => navigation.navigate('CravingLog')} />
  );

  if (cravings.length === 0) {
    return (
      <Screen footer={footer}>
        <EmptyState
          icon="journal-outline"
          title="No cravings logged yet"
          hint="When a craving hits, log it here or after the breathing guide. Patterns appear after a few entries."
        />
      </Screen>
    );
  }

  return (
    <Screen footer={footer}>
      <View style={styles.stats}>
        <Card style={styles.flex} accent="green">
          <Text style={[type.small, styles.muted]}>Logged</Text>
          <Text style={[type.l, styles.white]}>{cravings.length}</Text>
        </Card>
        <Card style={styles.flex} accent="green">
          <Text style={[type.small, styles.muted]}>Resisted</Text>
          <Text style={[type.l, styles.green]}>{Math.round(rate * 100)}%</Text>
        </Card>
      </View>

      <SectionTitle title="Top triggers" subtitle="What most often sets off a craving" />
      <Card>
        <View style={styles.bars}>
          {triggers.map((t) => (
            <View key={t.trigger} accessible accessibilityLabel={`${t.trigger}: ${t.count}`}>
              <View style={styles.barHead}>
                <Text style={[type.body, styles.white]}>{t.trigger}</Text>
                <Text style={[type.body, styles.muted]}>{t.count}</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${(t.count / maxTrigger) * 100}%` }]} />
              </View>
            </View>
          ))}
        </View>
      </Card>

      <SectionTitle
        title="Time of day"
        subtitle={peak.count > 0 ? `Cravings peak in the ${peak.part.toLowerCase()}` : undefined}
      />
      <Card>
        <View style={styles.columns}>
          {parts.map((p) => (
            <View key={p.part} style={styles.col} accessible accessibilityLabel={`${p.part}: ${p.count}`}>
              <Text style={[type.body, styles.muted]}>{p.count}</Text>
              <View style={styles.colTrack}>
                <View
                  style={[
                    styles.colFill,
                    { height: `${(p.count / maxPart) * 100}%` },
                    p === peak && p.count > 0 ? styles.colPeak : null,
                  ]}
                />
              </View>
              <Text style={[type.micro, styles.muted]}>{p.part}</Text>
            </View>
          ))}
        </View>
      </Card>

      <SectionTitle title="History" subtitle="Long-press an entry to delete it" />
      <View style={styles.list}>
        {cravings.slice(0, VISIBLE).map((c) => (
          <Pressable
            key={c.id}
            onLongPress={() => confirmDelete(c)}
            accessible
            accessibilityLabel={`${c.trigger}, ${c.resisted ? 'resisted' : 'smoked'}, ${formatDateTime(c.at)}`}
            accessibilityHint="Long-press to delete"
            style={styles.item}
          >
            <Ionicons
              name={c.resisted ? 'checkmark-circle' : 'close-circle'}
              size={24}
              color={c.resisted ? colors.green : colors.danger}
            />
            <View style={styles.flex}>
              <Text style={[type.s, styles.white]}>{c.trigger}</Text>
              <Text style={[type.body, styles.muted]}>{formatDateTime(c.at)}</Text>
            </View>
            <Text style={[type.body, { color: c.resisted ? colors.green : colors.danger }]}>
              {c.resisted ? 'Resisted' : 'Smoked'}
            </Text>
          </Pressable>
        ))}
        {cravings.length > VISIBLE ? (
          <Text style={[type.body, styles.muted]}>Showing the latest {VISIBLE} entries.</Text>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', gap: space.m },
  flex: { flex: 1 },
  white: { color: colors.text },
  muted: { color: colors.textSecondary },
  green: { color: colors.green },
  bars: { gap: space.base },
  barHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: space.xs },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.highlight, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4, backgroundColor: colors.green },
  columns: { flexDirection: 'row', justifyContent: 'space-between', gap: space.m },
  col: { flex: 1, alignItems: 'center', gap: space.xs },
  colTrack: {
    height: 96,
    width: 28,
    borderRadius: 6,
    backgroundColor: colors.highlight,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  colFill: { width: '100%', backgroundColor: colors.greenMuted, borderRadius: 6 },
  colPeak: { backgroundColor: colors.amber },
  list: { gap: space.s },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.m,
    minHeight: 64,
    paddingHorizontal: space.base,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.highlight,
  },
});
