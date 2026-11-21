import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';

interface TimerRingProps {
  /** 0..1 progress shown as lit ticks around the dial. */
  progress: number;
  size?: number;
  children?: React.ReactNode;
}

const TICKS = 60;

/** SVG-free progress dial: 60 ticks around a circle, lit clockwise from the top. */
function TimerRingBase({ progress, size = 264, children }: TimerRingProps) {
  const lit = Math.round(Math.min(1, Math.max(0, progress)) * TICKS);
  const radius = size / 2 - 8;
  const tickW = 4;
  const tickH = 14;

  return (
    <View style={{ width: size, height: size }} accessibilityElementsHidden={false}>
      <View
        style={[
          styles.glow,
          { width: size * 0.78, height: size * 0.78, borderRadius: size, left: size * 0.11, top: size * 0.11 },
        ]}
      />
      {Array.from({ length: TICKS }, (_, i) => {
        const angle = (i / TICKS) * 2 * Math.PI;
        const x = size / 2 + radius * Math.sin(angle) - tickW / 2;
        const y = size / 2 - radius * Math.cos(angle) - tickH / 2;
        const on = i < lit;
        const head = on && i === lit - 1;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: tickW,
              height: tickH,
              borderRadius: 2,
              backgroundColor: on ? colors.green : colors.highlight,
              opacity: on ? (head ? 1 : 0.85) : 1,
              transform: [{ rotate: `${(i / TICKS) * 360}deg` }],
            }}
          />
        );
      })}
      <View style={[StyleSheet.absoluteFill, styles.center]}>{children}</View>
    </View>
  );
}

export const TimerRing = memo(TimerRingBase);

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    backgroundColor: colors.green,
    opacity: 0.06,
  },
  center: { alignItems: 'center', justifyContent: 'center' },
});
