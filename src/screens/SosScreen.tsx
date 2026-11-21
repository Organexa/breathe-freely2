import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BreathingOrb } from '../components/BreathingOrb';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { ScreenProps } from '../navigation/types';
import { colors, space, touchTarget, type } from '../theme';

const ENCOURAGEMENT = [
  'Cravings rise and fall like a wave. Most pass within a few minutes.',
  'Tense moments are normal. Stay with your breath.',
  'You are doing it. The urge is already getting weaker.',
  'Every craving you ride out makes the next one easier.',
];

export function SosScreen({ navigation }: ScreenProps<'Sos'>) {
  const insets = useSafeAreaInsets();
  const [cycles, setCycles] = useState(0);

  const onCycle = useCallback((n: number) => {
    setCycles(n);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
  }, []);

  const footer = (
    <>
      <Text style={[type.s, styles.question]}>How did it go?</Text>
      <View style={styles.row}>
        <Button
          label="I smoked"
          variant="danger"
          onPress={() => navigation.replace('CravingLog', { resisted: false })}
          style={styles.flex}
        />
        <Button
          label="I resisted"
          icon="checkmark"
          onPress={() => navigation.replace('CravingLog', { resisted: true })}
          style={styles.flex2}
        />
      </View>
      <Text style={[type.body, styles.reassure]}>This doesn't erase your progress. Every attempt counts.</Text>
    </>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Screen footer={footer} scroll={false} contentStyle={styles.content}>
        <View style={styles.top}>
          <View>
            <Text style={[type.m, styles.title]}>Breathe SOS</Text>
            <Text style={[type.body, styles.sub]}>
              {cycles === 0 ? 'Follow the circle' : `${cycles} calm breath${cycles === 1 ? '' : 's'}`}
            </Text>
          </View>
          <Pressable
            accessible
            accessibilityRole="button"
            accessibilityLabel="Close breathing guide"
            onPress={() => navigation.goBack()}
            style={styles.close}
          >
            <Ionicons name="close" size={28} color={colors.textSecondary} />
          </Pressable>
        </View>
        <View style={styles.center}>
          <BreathingOrb running onCycle={onCycle} />
        </View>
        <Text style={[type.bodyLarge, styles.encourage]}>
          {ENCOURAGEMENT[cycles % ENCOURAGEMENT.length]}
        </Text>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.base },
  content: { justifyContent: 'space-between' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text },
  sub: { color: colors.textSecondary },
  close: { width: touchTarget, height: touchTarget, alignItems: 'center', justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  encourage: { color: colors.textSecondary, textAlign: 'center', paddingHorizontal: space.base },
  question: { color: colors.text, textAlign: 'center' },
  row: { flexDirection: 'row', gap: space.m },
  flex: { flex: 1 },
  flex2: { flex: 1.4 },
  reassure: { color: colors.textMuted, textAlign: 'center' },
});
