import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { Screen } from '../components/Screen';
import { formatDateTime } from '../logic/time';
import { ScreenProps } from '../navigation/types';
import { useApp } from '../state/AppContext';
import { parseCode, RestoreError } from '../storage/backup';
import { colors, space, type } from '../theme';

export function RestoreScreen({ navigation }: ScreenProps<'Restore'>) {
  const { state, restore } = useApp();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const paste = async () => {
    const text = await Clipboard.getStringAsync().catch(() => '');
    if (text) {
      setCode(text.trim());
      setError(null);
    } else setError('Your clipboard is empty.');
  };

  const submit = async () => {
    setBusy(true);
    try {
      const data = await parseCode(code);
      const apply = () => {
        restore(data);
        if (state.settings.onboarded) navigation.popToTop();
      };
      if (state.settings.onboarded) {
        Alert.alert(
          'Replace your current progress?',
          `This code starts from ${formatDateTime(data.settings.quitAt)} with ${data.cravings.length} journal entries. Your current data on this phone will be replaced.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Replace', style: 'destructive', onPress: apply },
          ],
        );
      } else {
        apply();
      }
    } catch (e) {
      setError(e instanceof RestoreError ? e.message : 'This code could not be restored.');
    } finally {
      setBusy(false);
    }
  };

  const footer = (
    <View style={styles.row}>
      <Button label="Cancel" variant="secondary" onPress={() => navigation.goBack()} style={styles.flex} />
      <Button label="Restore" onPress={submit} disabled={busy || code.trim().length === 0} style={styles.flex2} />
    </View>
  );

  return (
    <Screen footer={footer}>
      <Text style={[type.bodyLarge, styles.lead]}>
        Paste the code you exported from Settings on your old phone. It starts with "BF1".
      </Text>
      <Field
        label="Restore code"
        value={code}
        onChangeText={(t) => {
          setCode(t);
          setError(null);
        }}
        placeholder="BF1.…"
        multiline
        autoCapitalize="none"
        autoCorrect={false}
        error={error}
      />
      <Button label="Paste from clipboard" variant="text" icon="clipboard-outline" onPress={paste} style={styles.paste} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: { color: colors.textSecondary, marginBottom: space.l },
  paste: { alignSelf: 'flex-start', marginTop: space.s },
  row: { flexDirection: 'row', gap: space.m },
  flex: { flex: 1 },
  flex2: { flex: 2 },
});
