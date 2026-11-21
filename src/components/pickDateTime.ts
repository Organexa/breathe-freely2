import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

/** Opens the Android date picker, then the time picker. Resolves null if cancelled. */
export function pickDateTime(initial: Date, maximumDate = new Date()): Promise<Date | null> {
  if (Platform.OS !== 'android') return Promise.resolve(null);
  return new Promise((resolve) => {
    DateTimePickerAndroid.open({
      value: initial,
      mode: 'date',
      maximumDate,
      onChange: (event, date) => {
        if (event.type !== 'set' || !date) return resolve(null);
        DateTimePickerAndroid.open({
          value: initial,
          mode: 'time',
          is24Hour: false,
          onChange: (e2, time) => {
            if (e2.type !== 'set' || !time) return resolve(null);
            const out = new Date(date);
            out.setHours(time.getHours(), time.getMinutes(), 0, 0);
            resolve(out.getTime() > Date.now() ? new Date() : out);
          },
        });
      },
    });
  });
}

/** Opens the Android time picker. Resolves null if cancelled. */
export function pickTime(hour: number, minute: number): Promise<{ hour: number; minute: number } | null> {
  if (Platform.OS !== 'android') return Promise.resolve(null);
  const value = new Date();
  value.setHours(hour, minute, 0, 0);
  return new Promise((resolve) => {
    DateTimePickerAndroid.open({
      value,
      mode: 'time',
      is24Hour: false,
      onChange: (event, date) => {
        if (event.type !== 'set' || !date) return resolve(null);
        resolve({ hour: date.getHours(), minute: date.getMinutes() });
      },
    });
  });
}
