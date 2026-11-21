import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Screen } from '../components/Screen';
import { elapsedMs } from '../logic/time';
import { ScreenProps } from '../navigation/types';
import { useApp } from '../state/AppContext';
import { TRIGGERS, Trigger } from '../state/types';
import { colors, space, type } from '../theme';

export function CravingLogScreen({ navigation, route }: ScreenProps<'CravingLog'>) {
  const { state, logCraving, resetAfterSlip } = useApp();
  const [trigger, setTrigger] = useState<Trigger | null>(null);
  const [resisted, setResisted] = useState<boolean | null>(route.params?.resisted ?? null);
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    if (!trigger || resisted === null) {
      setError(!trigger ? 'Choose what triggered it.' : 'Choose how you responded.');
      return;
    }
    logCraving(trigger, resisted);
    if (resisted) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      navigation.popToTop();
    } else {
      const previousMs = elapsedMs(state.settings.quitAt, Date.now());
      resetAfterSlip();
      navigation.replace('Slip', { previousMs });
    }
  };

  const footer = (
    <View style={styles.row}>
      <Button label="Cancel" variant="secondary" onPress={() => navigation.goBack()} style={styles.flex} />
      <Button label="Save" onPress={save} style={styles.flex2} />
    </View>
  );

  return (
    <Screen footer={footer}>
      <Text style={[type.bodyLarge, styles.lead]}>
        Understanding your triggers helps you prepare for them.
      </Text>

      <Text style={[type.s, styles.heading]}>What triggered this craving?</Text>
      <View style={styles.chips} accessibilityRole="radiogroup">
        {TRIGGERS.map((t) => (
          <Chip
            key={t}
            label={t}
            selected={trigger === t}
            onPress={() => {
              setTrigger(t);
              setError(null);
            }}
          />
        ))}
      </View>

      <Text style={[type.s, styles.heading]}>How did you respond?</Text>
      <View style={styles.row} accessibilityRole="radiogroup">
        <View style={styles.flex}>
          <Chip
            label="Resisted"
            selected={resisted === true}
            onPress={() => {
              setResisted(true);
              setError(null);
            }}
          />
        </View>
        <View style={styles.flex}>
          <Chip
            label="Smoked"
            tone="red"
            selected={resisted === false}
            onPress={() => {
              setResisted(false);
              setError(null);
            }}
          />
        </View>
      </View>

      {resisted === false ? (
        <Text style={[type.body, styles.support]}>
          That's okay. Saving this restarts your timer from now — the healing you've already done
          still counts.
        </Text>
      ) : null}
      {error ? <Text style={[type.body, styles.error]}>{error}</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: { color: colors.textSecondary },
  heading: { color: colors.text, marginTop: space.section, marginBottom: space.m },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s },
  row: { flexDirection: 'row', gap: space.m },
  flex: { flex: 1 },
  flex2: { flex: 2 },
  support: { color: colors.amber, marginTop: space.l },
  error: { color: colors.danger, marginTop: space.l },
});
