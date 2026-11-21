import { TextStyle } from 'react-native';

export const fonts = {
  heading: 'Fraunces_700Bold',
  headingRegular: 'Fraunces_400Regular',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
} as const;

export const type: Record<string, TextStyle> = {
  hero: { fontFamily: fonts.heading, fontSize: 64, letterSpacing: -1, lineHeight: 72 },
  xxl: { fontFamily: fonts.heading, fontSize: 48, letterSpacing: -1, lineHeight: 56 },
  xl: { fontFamily: fonts.heading, fontSize: 32, lineHeight: 40 },
  l: { fontFamily: fonts.bodySemi, fontSize: 24, lineHeight: 32 },
  m: { fontFamily: fonts.bodySemi, fontSize: 20, lineHeight: 28 },
  s: { fontFamily: fonts.bodySemi, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21 },
  bodyLarge: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  small: { fontFamily: fonts.bodyMedium, fontSize: 12, letterSpacing: 0.8, textTransform: 'uppercase' },
  micro: { fontFamily: fonts.body, fontSize: 10, letterSpacing: 1 },
  mono: { fontFamily: fonts.bodySemi, fontSize: 20, letterSpacing: 1, fontVariant: ['tabular-nums'] },
};
