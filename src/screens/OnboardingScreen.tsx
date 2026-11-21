import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { CostDraft, CostErrors, CostFields, draftFrom, validateDraft } from '../components/CostFields';
import { pickDateTime } from '../components/pickDateTime';
import { Screen } from '../components/Screen';
import { formatDateTime } from '../logic/time';
import { ScreenProps } from '../navigation/types';
import { askPermission } from '../notifications/notifications';
import { useApp } from '../state/AppContext';
import { DEFAULT_SETTINGS } from '../state/types';
import { colors, radius, space, type } from '../theme';

const STEPS = 4;

export function OnboardingScreen({ navigation }: ScreenProps<'Onboarding'>) {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [quitAt, setQuitAt] = useState<number | null>(null);
  const [draft, setDraft] = useState<CostDraft>(() => draftFrom(DEFAULT_SETTINGS));
  const [errors, setErrors] = useState<CostErrors>({});
  const [notifNote, setNotifNote] = useState<string | null>(null);

  const finish = (notificationsEnabled: boolean) => {
    const { values } = validateDraft(draft);
    if (!values) {
      setStep(2);
      return;
    }
    completeOnboarding({ ...values, quitAt: quitAt ?? Date.now(), notificationsEnabled });
  };

  const next = () => {
    if (step === 2) {
      const r = validateDraft(draft);
      setErrors(r.errors);
      if (!r.values) return;
    }
    setStep((s) => Math.min(STEPS - 1, s + 1));
  };

  const enableReminders = async () => {
    const result = await askPermission();
    if (result === 'granted') {
      finish(true);
      return;
    }
    setNotifNote(
      result === 'blocked'
        ? 'Notifications are turned off for this app. You can allow them later in Android settings.'
        : 'No problem — you can turn reminders on any time in Settings.',
    );
  };

  const chooseEarlier = async () => {
    const picked = await pickDateTime(new Date(quitAt ?? Date.now()));
    if (picked) setQuitAt(picked.getTime());
  };

  const footer = (() => {
    if (step === 0)
      return (
        <>
          <Button label="Get started" icon="arrow-forward" onPress={next} />
          <Button
            label="I have a restore code"
            variant="text"
            onPress={() => navigation.navigate('Restore')}
          />
        </>
      );
    if (step === STEPS - 1)
      return (
        <>
          <Button label="Turn on reminders" icon="notifications-outline" onPress={enableReminders} />
          <Button label={notifNote ? 'Start my journey' : 'Not now'} variant="text" onPress={() => finish(false)} />
        </>
      );
    return (
      <View style={styles.navRow}>
        <Button label="Back" variant="secondary" onPress={() => setStep((s) => s - 1)} style={styles.flex} />
        <Button label="Continue" onPress={next} style={styles.flex2} />
      </View>
    );
  })();

  return (
    <Screen footer={footer} contentStyle={styles.content}>
      <View style={styles.dots} accessibilityLabel={`Step ${step + 1} of ${STEPS}`}>
        {Array.from({ length: STEPS }, (_, i) => (
          <View key={i} style={[styles.dot, i <= step ? styles.dotOn : null, i === step ? styles.dotCurrent : null]} />
        ))}
      </View>

      {step === 0 ? (
        <View style={styles.step}>
          <View style={styles.heroIcon}>
            <Ionicons name="leaf-outline" size={48} color={colors.green} />
          </View>
          <Text style={[type.small, styles.kicker]}>Welcome to</Text>
          <Text style={[type.xxl, styles.title]}>Breathe Freely</Text>
          <Text style={[type.bodyLarge, styles.lead]}>
            Watch your smoke-free time grow, see the money you keep, and get a calm breathing guide
            the moment a craving hits.
          </Text>
          <Card>
            <View style={styles.promise}>
              {[
                ['person-remove-outline', 'No account, no sign-up'],
                ['cloud-offline-outline', 'Works fully offline'],
                ['shield-checkmark-outline', 'Your data never leaves your phone'],
              ].map(([icon, text]) => (
                <View key={text} style={styles.promiseRow}>
                  <Ionicons name={icon as 'leaf'} size={20} color={colors.green} />
                  <Text style={[type.body, styles.promiseText]}>{text}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>
      ) : null}

      {step === 1 ? (
        <View style={styles.step}>
          <Text style={[type.xl, styles.title]}>When did you quit?</Text>
          <Text style={[type.bodyLarge, styles.lead]}>
            Your timer counts from this moment. If you are quitting today, choose "Right now".
          </Text>
          <View style={styles.choices}>
            <ChoiceCard
              icon="flash-outline"
              title="Right now"
              subtitle="Start my timer today"
              selected={quitAt === null}
              onPress={() => setQuitAt(null)}
            />
            <ChoiceCard
              icon="calendar-outline"
              title="Earlier"
              subtitle={quitAt ? formatDateTime(quitAt) : 'Pick the date and time'}
              selected={quitAt !== null}
              onPress={chooseEarlier}
            />
          </View>
        </View>
      ) : null}

      {step === 2 ? (
        <View style={styles.step}>
          <Text style={[type.xl, styles.title]}>What did smoking cost you?</Text>
          <Text style={[type.bodyLarge, styles.lead]}>
            We use this to show the money you are saving. You can change it later.
          </Text>
          <CostFields draft={draft} errors={errors} onChange={setDraft} />
        </View>
      ) : null}

      {step === 3 ? (
        <View style={styles.step}>
          <View style={styles.heroIcon}>
            <Ionicons name="notifications-outline" size={48} color={colors.green} />
          </View>
          <Text style={[type.xl, styles.title]}>A little encouragement?</Text>
          <Text style={[type.bodyLarge, styles.lead]}>
            Get a gentle note at 7:00 AM and 9:00 PM, plus a weekly progress reminder. They are
            created on your phone — nothing is sent anywhere.
          </Text>
          {notifNote ? <Text style={[type.body, styles.note]}>{notifNote}</Text> : null}
          <Text style={[type.body, styles.disclaimer]}>
            Breathe Freely is for motivation and support, not medical advice.
          </Text>
        </View>
      ) : null}
    </Screen>
  );
}

interface ChoiceCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
}

function ChoiceCard({ icon, title, subtitle, selected, onPress }: ChoiceCardProps) {
  return (
    <Card onPress={onPress} accessibilityLabel={`${title}. ${subtitle}`} style={selected ? styles.choiceOn : undefined}>
      <View style={styles.choiceRow}>
        <Ionicons name={icon} size={24} color={selected ? colors.green : colors.textSecondary} />
        <View style={styles.flex}>
          <Text style={[type.s, { color: colors.text }]}>{title}</Text>
          <Text style={[type.body, { color: colors.textSecondary }]}>{subtitle}</Text>
        </View>
        <Ionicons
          name={selected ? 'radio-button-on' : 'radio-button-off'}
          size={22}
          color={selected ? colors.green : colors.textMuted}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.xl },
  dots: { flexDirection: 'row', gap: space.s, marginBottom: space.xl },
  dot: { height: 4, flex: 1, borderRadius: 2, backgroundColor: colors.highlight },
  dotOn: { backgroundColor: colors.greenFaint },
  dotCurrent: { backgroundColor: colors.green },
  step: { gap: space.base },
  heroIcon: {
    width: 88,
    height: 88,
    borderRadius: radius.l,
    backgroundColor: `${colors.green}14`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.s,
  },
  kicker: { color: colors.green },
  title: { color: colors.text },
  lead: { color: colors.textSecondary, marginBottom: space.s },
  promise: { gap: space.base },
  promiseRow: { flexDirection: 'row', alignItems: 'center', gap: space.m },
  promiseText: { color: colors.text, flex: 1 },
  choices: { gap: space.m },
  choiceRow: { flexDirection: 'row', alignItems: 'center', gap: space.base },
  choiceOn: { borderColor: colors.green },
  note: { color: colors.amber },
  disclaimer: { color: colors.textMuted, marginTop: space.l },
  navRow: { flexDirection: 'row', gap: space.m },
  flex: { flex: 1 },
  flex2: { flex: 2 },
});
