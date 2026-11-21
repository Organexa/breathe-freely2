import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

/** Current time, refreshed every `intervalMs` while the screen is focused and the app is active. */
export function useNow(intervalMs = 1000): number {
  const focused = useIsFocused();
  const [now, setNow] = useState(() => Date.now());
  const [active, setActive] = useState(AppState.currentState === 'active');

  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => setActive(s === 'active'));
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!focused || !active) return undefined;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [focused, active, intervalMs]);

  return now;
}
