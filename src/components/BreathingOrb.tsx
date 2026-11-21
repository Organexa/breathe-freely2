import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, space, type } from '../theme';

export interface BreathPhase {
  key: 'inhale' | 'hold' | 'exhale';
  label: string;
  prompt: string;
  seconds: number;
}

export const PHASES: BreathPhase[] = [
  { key: 'inhale', label: 'Breathe in', prompt: 'Slowly, through your nose', seconds: 4 },
  { key: 'hold', label: 'Hold', prompt: 'Gently, no strain', seconds: 2 },
  { key: 'exhale', label: 'Breathe out', prompt: 'Long and slow, through your mouth', seconds: 6 },
];

const CYCLE = PHASES.reduce((n, p) => n + p.seconds, 0);

function phaseAt(tick: number): { phase: BreathPhase; left: number; cycle: number } {
  let pos = tick % CYCLE;
  for (const phase of PHASES) {
    if (pos < phase.seconds) return { phase, left: phase.seconds - pos, cycle: Math.floor(tick / CYCLE) };
    pos -= phase.seconds;
  }
  return { phase: PHASES[0], left: PHASES[0].seconds, cycle: Math.floor(tick / CYCLE) };
}

interface BreathingOrbProps {
  running: boolean;
  onCycle?: (cycles: number) => void;
}

/** Self-driven breathing guide. Scales 1 → 1.15 on inhale and back on exhale. */
export function BreathingOrb({ running, onCycle }: BreathingOrbProps) {
  const [tick, setTick] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const { phase, left, cycle } = phaseAt(tick);

  useEffect(() => {
    if (cycle > 0) onCycle?.(cycle);
  }, [cycle, onCycle]);

  // Animate the orb at the start of each phase.
  useEffect(() => {
    if (!running) return undefined;
    AccessibilityInfo.announceForAccessibility(phase.label);
    const duration = phase.seconds * 1000;
    const easing = Easing.inOut(Easing.sin);
    const anims = [
      Animated.timing(opacity, {
        toValue: phase.key === 'exhale' ? 0.5 : 0.9,
        duration,
        easing,
        useNativeDriver: true,
      }),
    ];
    if (!reduceMotion) {
      anims.push(
        Animated.timing(scale, {
          toValue: phase.key === 'exhale' ? 1 : 1.15,
          duration,
          easing,
          useNativeDriver: true,
        }),
      );
    }
    const a = Animated.parallel(anims);
    a.start();
    return () => a.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase.key, cycle, running, reduceMotion]);

  return (
    <View style={styles.wrap}>
      <View style={styles.stage}>
        <Animated.View style={[styles.halo, { opacity, transform: [{ scale }] }]} />
        <Animated.View style={[styles.orb, { transform: [{ scale }] }]}>
          <LinearGradient
            colors={['#FFFFFF', colors.green, colors.greenMuted]}
            locations={[0, 0.55, 1]}
            start={{ x: 0.3, y: 0.1 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.orbFill}
          />
          <Text style={styles.count} accessibilityLabel={`${left} seconds`}>
            {left}
          </Text>
        </Animated.View>
      </View>
      <Text style={[type.xl, styles.label]} accessibilityLiveRegion="polite">
        {phase.label}
      </Text>
      <Text style={[type.bodyLarge, styles.prompt]}>{phase.prompt}</Text>
    </View>
  );
}

const ORB = 200;

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  stage: { width: ORB * 1.5, height: ORB * 1.5, alignItems: 'center', justifyContent: 'center' },
  halo: {
    position: 'absolute',
    width: ORB * 1.35,
    height: ORB * 1.35,
    borderRadius: ORB,
    backgroundColor: colors.green,
    opacity: 0.15,
  },
  orb: {
    width: ORB,
    height: ORB,
    borderRadius: ORB / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbFill: { ...StyleSheet.absoluteFillObject },
  count: { fontFamily: fonts.heading, fontSize: 56, color: colors.base },
  label: { color: colors.text, marginTop: space.l },
  prompt: { color: colors.textSecondary, marginTop: space.xs },
});
