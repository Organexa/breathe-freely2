import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space } from '../theme';

interface ScreenProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
}

/** Safe-area wrapper with the dark background, a 300ms fade-in and an optional sticky footer. */
export function Screen({ children, footer, scroll = true, contentStyle }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [fade]);

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.content, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.fill, contentStyle]}>{children}</View>
  );

  return (
    <Animated.View style={[styles.root, { opacity: fade }]}>
      {body}
      {footer ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space.base) }]}>
          {footer}
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.base },
  fill: { flex: 1 },
  content: { paddingHorizontal: space.card, paddingTop: space.base, paddingBottom: space.xl },
  footer: {
    paddingHorizontal: space.card,
    paddingTop: space.m,
    gap: space.s,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.highlight,
    backgroundColor: colors.base,
  },
});
