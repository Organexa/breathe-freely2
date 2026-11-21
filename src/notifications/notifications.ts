import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Settings } from '../state/types';

const CHANNEL_ID = 'encouragement';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export type PermissionResult = 'granted' | 'denied' | 'blocked';

async function ensureChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Encouragement',
    description: 'Daily reminders and your weekly progress',
    importance: Notifications.AndroidImportance.DEFAULT,
    lightColor: '#4ADE80',
  });
}

export async function getPermission(): Promise<PermissionResult> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return 'granted';
  return current.canAskAgain ? 'denied' : 'blocked';
}

/** Asks for notification permission. "blocked" means Android will not show the prompt again. */
export async function askPermission(): Promise<PermissionResult> {
  try {
    await ensureChannel();
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return 'granted';
    if (!current.canAskAgain) return 'blocked';
    const next = await Notifications.requestPermissionsAsync();
    if (next.granted) return 'granted';
    return next.canAskAgain ? 'denied' : 'blocked';
  } catch (e) {
    console.warn('Breathe Freely: notification permission failed', e);
    return 'denied';
  }
}

export async function clearAll(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.warn('Breathe Freely: could not clear notifications', e);
  }
}

const MORNING_MESSAGES = [
  'A new smoke-free day. You have already come a long way.',
  'Good morning. Every hour without smoking is your body healing.',
  'Today is another chance to feel proud. One craving at a time.',
];
const EVENING_MESSAGES = [
  'Another day done. Take a breath — you earned it.',
  'Evenings can be tough. If a craving shows up, open the SOS breather.',
  'Look how far you have come today. Rest well.',
];

const pick = (list: string[]): string => list[Math.floor(Math.random() * list.length)];

/** Replaces every scheduled reminder with the ones the settings ask for. */
export async function rescheduleAll(s: Settings): Promise<void> {
  await clearAll();
  if (!s.onboarded || !s.notificationsEnabled) return;
  try {
    if ((await getPermission()) !== 'granted') return;
    await ensureChannel();
    const jobs: Promise<string>[] = [];
    if (s.morningEnabled) {
      jobs.push(
        Notifications.scheduleNotificationAsync({
          content: { title: 'Breathe Freely', body: pick(MORNING_MESSAGES) },
          trigger: {
            channelId: CHANNEL_ID,
            hour: s.morningTime.hour,
            minute: s.morningTime.minute,
            repeats: true,
          },
        }),
      );
    }
    if (s.eveningEnabled) {
      jobs.push(
        Notifications.scheduleNotificationAsync({
          content: { title: 'Breathe Freely', body: pick(EVENING_MESSAGES) },
          trigger: {
            channelId: CHANNEL_ID,
            hour: s.eveningTime.hour,
            minute: s.eveningTime.minute,
            repeats: true,
          },
        }),
      );
    }
    if (s.weeklyEnabled) {
      // Same weekday as the quit moment, at the morning reminder time. Weekday: 1 = Sunday.
      const weekday = new Date(s.quitAt).getDay() + 1;
      jobs.push(
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'Your weekly progress',
            body: 'Another week of healing. Open Breathe Freely to see your money saved.',
          },
          trigger: {
            channelId: CHANNEL_ID,
            weekday,
            hour: s.morningTime.hour,
            minute: s.morningTime.minute,
            repeats: true,
          },
        }),
      );
    }
    await Promise.all(jobs);
  } catch (e) {
    console.warn('Breathe Freely: could not schedule notifications', e);
  }
}
