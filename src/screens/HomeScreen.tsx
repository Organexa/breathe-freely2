import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Banner } from '../components/Banner';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { StatBlock } from '../components/StatBlock';
import { TimerRing } from '../components/TimerRing';
import { milestoneProgress } from '../logic/milestones';
import { cigarettesAvoided, formatMoney, groupDigits, moneySaved } from '../logic/money';
import { elapsedMs, formatClock, formatUntil, splitDuration } from '../logic/time';
import { useNow } from '../logic/useNow';
import { ScreenProps } from '../navigation/types';
import { useApp } from '../state/AppContext';
import { colors, radius, shadows, space, touchTarget, type } from '../theme';

export function HomeScreen({ navigation }: ScreenProps<'Home'>) {
  const { state, retryLoad } = useApp();
  const { settings, cravings } = state;
  const insets = useSafeAreaInsets();
  const now = useNow(1000);

  const elapsed = elapsedMs(settings.quitAt, now);
  const parts = splitDuration(elapsed);
  const ms = milestoneProgress(elapsed);
  const saved = moneySaved(settings, elapsed);
  const avoided = cigarettesAvoided(settings, elapsed);
  const resisted = useMemo(
    () => cravings.filter((c) => c.resisted && c.at >= settings.quitAt).length,
    [cravings, settings.quitAt],
  );

  const openSos = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
    navigation.navigate('Sos');
  };

  const footer = (
    <View style={styles.footerRow}>
      <Button
        label="Log craving"
        variant="secondary"
        icon="create-outline"
        onPress={() => navigation.navigate('CravingLog')}
        style={styles.flex}
      />
      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel="Breathe SOS. Opens a calming breathing guide."
        onPress={openSos}
        style={({ pressed }) => [styles.flex, pressed ? styles.pressed : null]}
      >
        <LinearGradient
          colors={[colors.green, colors.amber]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.sosBorder}
        >
          <View style={styles.sosInner}>
            <Ionicons name="stop-circle-outline" size={20} color={colors.base} />
            <Text style={[type.s, styles.sosText]}>Breathe SOS</Text>
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Screen footer={footer}>
        <View style={styles.header}>
          <View>
            <Text style={[type.small, styles.brand]}>Breathe Freely</Text>
            <Text style={[type.body, styles.greeting]}>You've made a healthy choice</Text>
          </View>
          <Pressable
            accessible
            accessibilityRole="button"
            accessibilityLabel="Settings"
            onPress={() => navigation.navigate('Settings')}
            hitSlop={8}
            style={styles.iconBtn}
          >
            <Ionicons name="settings-outline" size={24} color={colors.textSecondary} />
          </Pressable>
        </View>

        {state.loadFailed ? (
          <Banner
            message="Your saved progress couldn't be read. Nothing has been changed."
            actionLabel="Retry"
            onAction={retryLoad}
          />
        ) : null}

        <View
          style={styles.timerWrap}
          accessible
          accessibilityLabel={`Smoke-free for ${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes and ${parts.seconds} seconds`}
        >
          <Text style={[type.small, styles.timerKicker]}>Smoke-free for</Text>
          <TimerRing progress={ms.progress}>
            <Text style={[type.hero, styles.days]} adjustsFontSizeToFit numberOfLines={1}>
              {groupDigits(parts.days)}
            </Text>
            <Text style={[type.s, styles.daysLabel]}>{parts.days === 1 ? 'day' : 'days'}</Text>
            <Text style={[type.mono, styles.clock]}>{formatClock(parts)}</Text>
          </TimerRing>
          {ms.next ? (
            <Text style={[type.body, styles.nextText]}>
              Next: <Text style={styles.nextStrong}>{ms.next.title} smoke-free</Text>,{' '}
              {formatUntil(ms.remaining)}
            </Text>
          ) : (
            <Text style={[type.body, styles.nextText]}>Every milestone reached. Incredible.</Text>
          )}
        </View>

        <View style={styles.stats}>
          <StatBlock
            label="Money saved"
            value={formatMoney(settings.currency, saved, saved >= 1000 ? 0 : 2)}
            icon="flash-outline"
            tone="amber"
          />
          <StatBlock
            label="Not smoked"
            value={groupDigits(avoided)}
            caption={avoided === 1 ? 'cigarette' : 'cigarettes'}
            icon="ban-outline"
            tone="green"
          />
        </View>

        <Card
          accent="green"
          onPress={() => navigation.navigate('HealthTimeline')}
          accessibilityLabel="Your recovery journey. Opens the health timeline."
          style={styles.card}
        >
          <View style={styles.cardHead}>
            <Text style={[type.s, styles.cardTitle]}>Your recovery journey</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </View>
          {ms.current ? (
            <>
              <Text style={[type.small, styles.green]}>Reached · {ms.current.title}</Text>
              <Text style={[type.bodyLarge, styles.cardBody]}>{ms.current.description}</Text>
            </>
          ) : (
            <Text style={[type.bodyLarge, styles.cardBody]}>
              In the next {formatUntil(ms.remaining).replace('in ', '')} your heart rate starts to
              come down. Your body is already working for you.
            </Text>
          )}
          {ms.next ? (
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.round(ms.progress * 100)}%` }]} />
            </View>
          ) : null}
        </Card>

        <Card
          onPress={() => navigation.navigate('Journal')}
          accessibilityLabel="Craving journal. See your triggers and patterns."
          style={styles.card}
        >
          <View style={styles.cardHead}>
            <Text style={[type.s, styles.cardTitle]}>Craving journal</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </View>
          <Text style={[type.bodyLarge, styles.cardBody]}>
            {resisted > 0
              ? `You've beaten ${resisted} craving${resisted === 1 ? '' : 's'} on this streak.`
              : 'Log cravings to learn your triggers and when they peak.'}
          </Text>
        </Card>

        <Button
          label="I had a slip"
          variant="text"
          icon="refresh-outline"
          onPress={() => navigation.navigate('CravingLog', { resisted: false })}
          style={styles.slip}
          accessibilityHint="Record a cigarette and restart your timer"
        />
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.base },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: colors.green },
  greeting: { color: colors.textSecondary, marginTop: 2 },
  iconBtn: { width: touchTarget, height: touchTarget, alignItems: 'center', justifyContent: 'center' },
  timerWrap: { alignItems: 'center', marginTop: space.l, gap: space.m },
  timerKicker: { color: colors.textSecondary },
  days: { color: colors.text, maxWidth: 200, textAlign: 'center' },
  daysLabel: { color: colors.textSecondary, marginTop: -4 },
  clock: { color: colors.green, marginTop: space.s },
  nextText: { color: colors.textSecondary, textAlign: 'center' },
  nextStrong: { color: colors.text },
  stats: { flexDirection: 'row', gap: space.m, marginTop: space.section },
  card: { marginTop: space.base },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.s },
  cardTitle: { color: colors.text },
  cardBody: { color: colors.textSecondary, marginTop: space.xs },
  green: { color: colors.green },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.highlight,
    marginTop: space.base,
    overflow: 'hidden',
  },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: colors.green },
  slip: { marginTop: space.base, alignSelf: 'center' },
  footerRow: { flexDirection: 'row', gap: space.m },
  flex: { flex: 1 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  sosBorder: { borderRadius: radius.s, padding: 2, ...shadows.green },
  sosInner: {
    minHeight: touchTarget + 4,
    borderRadius: radius.s - 2,
    backgroundColor: colors.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.s,
  },
  sosText: { color: colors.base },
});
