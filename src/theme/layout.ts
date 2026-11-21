import { ViewStyle } from 'react-native';

export const space = {
  xs: 4,
  s: 8,
  m: 12,
  base: 16,
  card: 20,
  l: 24,
  section: 28,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  s: 12,
  m: 16,
  l: 24,
  pill: 999,
} as const;

export const touchTarget = 48;

export const shadows: Record<'card' | 'green' | 'amber', ViewStyle> = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  green: {
    shadowColor: '#4ADE80',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  amber: {
    shadowColor: '#F59E0B',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
};
