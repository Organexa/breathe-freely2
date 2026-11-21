import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { CostDraft, CostErrors, CostFields, draftFrom, validateDraft } from '../components/CostFields';
import { pickDateTime, pickTime } from '../components/pickDateTime';
import { Screen } from '../components/Screen';
import { SectionTitle } from '../components/SectionTitle';
import { formatDateTime, formatTimeOfDay } from '../logic/time';
import { ScreenProps } from '../navigation/types';
import { askPermission, getPermission, PermissionResult } from '../notifications/notifications';
import { useApp } from '../state/AppContext';
import { exportCode } from '../storage/backup';
import { TimeOfDay } from '../state/types';
import { colors, radius, space, touchTarget, type } from '../theme';

export function SettingsScreen({ navigation }: ScreenProps<'Settings'>) {
  const { state, updateSettings, setQuitAt, resetAll } = useApp();
  const s = state.settings;
  const [draft, setDraft] = useState<CostDraft>(() => draftFrom(s));
  const [errors, setErrors] = useState<CostErrors>({});
  const [costSaved, setCostSaved] = useState(false);
  const [permission, setPermission] = useState<PermissionResult | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getPermission().then(setPermission).catch(() => setPermission('denied'));
  }, []);

  const original = draftFrom(s);
  const dirty =
    draft.currency !== original.currency ||
    draft.price !== original.price ||
    draft.perPack !== original.perPack ||
    draft.perDay !== original.perDay;

  const saveCosts = () => {
    const r = validateDraft(draft);
    setErrors(r.errors);
    if (!r.values) return;
    updateSettings(r.values);
    setDraft(draftFrom({ ...s, ...r.values }));
    setCostSaved(true);
  };

  const changeQuit = async () => {
    const picked = await pickDateTime(new Date(s.quitAt));
    if (!picked) return;
    Alert.alert('Change your quit moment?', `Your timer will count from ${formatDateTime(picked.getTime())}.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Change', onPress: () => setQuitAt(picked.getTime()) },
    ]);
  };

  const toggleNotifications = async (on: boolean) => {
    if (!on) {
      updateSettings({ notificationsEnabled: false });
      return;
    }
    const result = await askPermission();
    setPermission(result);
    if (result === 'granted') updateSettings({ notificationsEnabled: true });
  };

  const changeTime = async (key: 'morningTime' | 'eveningTime', current: TimeOfDay) => {
    const t = await pickTime(current.hour, current.minute);
    if (t) updateSettings({ [key]: t });
  };

  const makeCode = async () => {
    try {
      const c = await exportCode({ settings: s, cravings: state.cravings });
      setCode(c);
      await Clipboard.setStringAsync(c);
      setCopied(true);
    } catch (e) {
      console.warn('Breathe Freely: export failed', e);
      Alert.alert("Can't create a code right now", 'Try again in a moment.');
    }
  };

  const eraseAll = () =>
    Alert.alert(
      'Erase all data?',
      'Your timer, settings and craving journal will be deleted from this phone. Export a code first if you want to keep them.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Erase', style: 'destructive', onPress: () => void resetAll() },
      ],
    );

  const notifOn = s.notificationsEnabled && permission === 'granted';
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <Screen footer={<Button label="Done" onPress={() => navigation.goBack()} />}>
      <SectionTitle title="Quit moment" />
      <Card>
        <Row icon="time-outline" label="Smoke-free since" value={formatDateTime(s.quitAt)} onPress={changeQuit} />
      </Card>

      <SectionTitle title="Your costs" subtitle="Used to work out the money you save" />
      <CostFields
        draft={draft}
        errors={errors}
        onChange={(d) => {
          setDraft(d);
          setCostSaved(false);
        }}
      />
      {dirty ? (
        <Button label="Save changes" onPress={saveCosts} style={styles.gapTop} />
      ) : costSaved ? (
        <Text style={[type.body, styles.ok]}>Saved.</Text>
      ) : null}

      <SectionTitle title="Notifications" />
      <Card>
        <View style={styles.switchRow}>
          <Ionicons name="notifications-outline" size={24} color={colors.textSecondary} />
          <Text style={[type.s, styles.rowLabel]}>Reminders</Text>
          <Switch
            accessibilityLabel="Reminders"
            value={notifOn}
            onValueChange={toggleNotifications}
            trackColor={{ false: colors.highlight, true: colors.greenFaint }}
            thumbColor={notifOn ? colors.green : colors.textSecondary}
          />
        </View>
        {permission === 'blocked' ? (
          <View style={styles.blocked}>
            <Text style={[type.body, styles.warn]}>
              Notifications are blocked for Breathe Freely in Android settings.
            </Text>
            <Button label="Open Android settings" variant="text" onPress={() => Linking.openSettings()} />
          </View>
        ) : null}
        {notifOn ? (
          <View style={styles.subRows}>
            <ToggleTimeRow
              label="Morning reminder"
              enabled={s.morningEnabled}
              time={s.morningTime}
              onToggle={(v) => updateSettings({ morningEnabled: v })}
              onPickTime={() => changeTime('morningTime', s.morningTime)}
            />
            <ToggleTimeRow
              label="Evening reminder"
              enabled={s.eveningEnabled}
              time={s.eveningTime}
              onToggle={(v) => updateSettings({ eveningEnabled: v })}
              onPickTime={() => changeTime('eveningTime', s.eveningTime)}
            />
            <ToggleTimeRow
              label="Weekly progress"
              enabled={s.weeklyEnabled}
              onToggle={(v) => updateSettings({ weeklyEnabled: v })}
            />
          </View>
        ) : null}
      </Card>

      <SectionTitle
        title="Backup your progress"
        subtitle="Export a code you can restore on a new phone. Your data never leaves your phone unless you share the code."
      />
      <Card>
        <View style={styles.gap}>
          <Button label="Export progress" icon="copy-outline" onPress={makeCode} />
          {code ? (
            <View style={styles.codeBox}>
              <Text selectable style={[type.body, styles.code]} numberOfLines={4}>
                {code}
              </Text>
              <Text style={[type.body, styles.ok]}>
                {copied ? 'Copied to clipboard. Keep it somewhere safe, like a note to yourself.' : ''}
              </Text>
            </View>
          ) : null}
          <Button
            label="Restore from code"
            variant="secondary"
            icon="download-outline"
            onPress={() => navigation.navigate('Restore')}
          />
        </View>
      </Card>

      <SectionTitle title="About" />
      <Card>
        <View style={styles.gap}>
          <View style={styles.aboutRow}>
            <Ionicons name="shield-checkmark-outline" size={24} color={colors.textSecondary} />
            <Text style={[type.body, styles.aboutText]}>
              All your progress is stored on this phone only. Nothing is shared, tracked or uploaded.
              Uninstalling the app removes everything.
            </Text>
          </View>
          <View style={styles.aboutRow}>
            <Ionicons name="medkit-outline" size={24} color={colors.textSecondary} />
            <Text style={[type.body, styles.aboutText]}>
              Breathe Freely is for motivation, not medical advice. For help quitting, talk to a
              doctor or your local quitline.
            </Text>
          </View>
          <Text style={[type.micro, styles.version]}>Breathe Freely v{version}</Text>
        </View>
      </Card>

      <Button label="Erase all data" variant="danger" onPress={eraseAll} style={styles.erase} />
    </Screen>
  );
}

interface RowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress: () => void;
}

function Row({ icon, label, value, onPress }: RowProps) {
  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}. Change`}
      onPress={onPress}
      style={styles.row}
    >
      <Ionicons name={icon} size={24} color={colors.textSecondary} />
      <View style={styles.flex}>
        <Text style={[type.body, styles.muted]}>{label}</Text>
        <Text style={[type.s, styles.white]}>{value}</Text>
      </View>
      <Text style={[type.s, styles.link]}>Change</Text>
    </Pressable>
  );
}

interface ToggleTimeRowProps {
  label: string;
  enabled: boolean;
  time?: TimeOfDay;
  onToggle: (v: boolean) => void;
  onPickTime?: () => void;
}

function ToggleTimeRow({ label, enabled, time, onToggle, onPickTime }: ToggleTimeRowProps) {
  return (
    <View style={styles.switchRow}>
      <View style={styles.flex}>
        <Text style={[type.bodyLarge, styles.white]}>{label}</Text>
        {time ? (
          <Pressable
            accessible
            accessibilityRole="button"
            accessibilityLabel={`${label} time: ${formatTimeOfDay(time.hour, time.minute)}. Change`}
            onPress={onPickTime}
            disabled={!enabled}
            hitSlop={8}
          >
            <Text style={[type.body, enabled ? styles.link : styles.muted]}>
              {formatTimeOfDay(time.hour, time.minute)}
            </Text>
          </Pressable>
        ) : (
          <Text style={[type.body, styles.muted]}>Once a week, on your quit day</Text>
        )}
      </View>
      <Switch
        accessibilityLabel={label}
        value={enabled}
        onValueChange={onToggle}
        trackColor={{ false: colors.highlight, true: colors.greenFaint }}
        thumbColor={enabled ? colors.green : colors.textSecondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  white: { color: colors.text },
  muted: { color: colors.textSecondary },
  link: { color: colors.green },
  ok: { color: colors.green, marginTop: space.s },
  warn: { color: colors.amber },
  gap: { gap: space.base },
  gapTop: { marginTop: space.base },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.m, minHeight: touchTarget },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: space.m, minHeight: touchTarget },
  rowLabel: { color: colors.text, flex: 1 },
  subRows: {
    marginTop: space.m,
    paddingTop: space.m,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.highlight,
    gap: space.m,
  },
  blocked: { marginTop: space.s },
  codeBox: {
    backgroundColor: colors.base,
    borderRadius: radius.s,
    borderWidth: 1,
    borderColor: colors.highlight,
    padding: space.m,
  },
  code: { color: colors.text, fontFamily: 'monospace' },
  aboutRow: { flexDirection: 'row', gap: space.m },
  aboutText: { color: colors.textSecondary, flex: 1 },
  version: { color: colors.textMuted, textAlign: 'center' },
  erase: { marginTop: space.section },
});
