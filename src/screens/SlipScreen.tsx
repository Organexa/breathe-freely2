import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { formatDuration } from '../logic/time';
import { ScreenProps } from '../navigation/types';
import { colors, radius, space, type } from '../theme';

export function SlipScreen({ navigation, route }: ScreenProps<'Slip'>) {
  const insets = useSafeAreaInsets();
  const previous = route.params.previousMs;

  const footer = (
    <>
      <Button label="Start again from now" icon="refresh" onPress={() => navigation.popToTop()} />
      <Button label="Open the breathing guide" variant="text" onPress={() => navigation.replace('Sos')} />
    </>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Screen footer={footer} contentStyle={styles.content}>
        <View style={styles.icon}>
          <Ionicons name="heart-outline" size={48} color={colors.green} />
        </View>
        <Text style={[type.xl, styles.title]}>This doesn't erase your progress.</Text>
        <Text style={[type.bodyLarge, styles.body]}>
          Most people who quit for good slip along the way. What matters is what you do next — and
          you're already doing it.
        </Text>
        {previous > 60_000 ? (
          <Card accent="green">
            <Text style={[type.small, styles.kicker]}>Your last streak</Text>
            <Text style={[type.l, styles.streak]}>{formatDuration(previous)}</Text>
            <Text style={[type.body, styles.body]}>
              Your body benefited from every minute of it. You've proven you can do it.
            </Text>
          </Card>
        ) : null}
        <Text style={[type.body, styles.note]}>Progress starts from now. Your timer has restarted.</Text>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.base },
  content: { paddingTop: space.xxl, gap: space.base },
  icon: {
    width: 88,
    height: 88,
    borderRadius: radius.l,
    backgroundColor: `${colors.green}14`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: colors.text },
  body: { color: colors.textSecondary },
  kicker: { color: colors.green },
  streak: { color: colors.text, marginVertical: space.xs },
  note: { color: colors.textMuted },
});
