import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, space, type } from '../theme';
import { Chip } from './Chip';
import { Field } from './Field';

export const CURRENCIES = [
  { symbol: '₹', code: 'INR' },
  { symbol: '$', code: 'USD' },
  { symbol: '£', code: 'GBP' },
  { symbol: '€', code: 'EUR' },
] as const;

export interface CostDraft {
  currency: string;
  customCurrency: boolean;
  price: string;
  perPack: string;
  perDay: string;
}

export interface CostErrors {
  currency?: string;
  price?: string;
  perPack?: string;
  perDay?: string;
}

export function draftFrom(s: {
  currency: string;
  pricePerPack: number;
  cigarettesPerPack: number;
  cigarettesPerDay: number;
}): CostDraft {
  return {
    currency: s.currency,
    customCurrency: !CURRENCIES.some((c) => c.symbol === s.currency),
    price: String(s.pricePerPack),
    perPack: String(s.cigarettesPerPack),
    perDay: String(s.cigarettesPerDay),
  };
}

const num = (v: string): number => Number(v.replace(',', '.').trim());

export function validateDraft(d: CostDraft): {
  errors: CostErrors;
  values?: { currency: string; pricePerPack: number; cigarettesPerPack: number; cigarettesPerDay: number };
} {
  const errors: CostErrors = {};
  const currency = d.currency.trim();
  const price = num(d.price);
  const perPack = num(d.perPack);
  const perDay = num(d.perDay);
  if (currency.length < 1 || currency.length > 3) errors.currency = 'Use 1 to 3 characters.';
  if (!d.price.trim() || !Number.isFinite(price) || price <= 0 || price > 1_000_000)
    errors.price = 'Enter the price of one pack.';
  if (!Number.isInteger(perPack) || perPack < 1 || perPack > 100)
    errors.perPack = 'Enter a whole number from 1 to 100.';
  if (!Number.isInteger(perDay) || perDay < 1 || perDay > 200)
    errors.perDay = 'Enter a whole number from 1 to 200.';
  if (Object.keys(errors).length > 0) return { errors };
  return {
    errors,
    values: {
      currency,
      pricePerPack: Math.round(price * 100) / 100,
      cigarettesPerPack: perPack,
      cigarettesPerDay: perDay,
    },
  };
}

interface CostFieldsProps {
  draft: CostDraft;
  errors: CostErrors;
  onChange: (d: CostDraft) => void;
}

export function CostFields({ draft, errors, onChange }: CostFieldsProps) {
  const set = (patch: Partial<CostDraft>) => onChange({ ...draft, ...patch });
  return (
    <View style={styles.wrap}>
      <View style={styles.group}>
        <Text style={[type.small, styles.label]}>Currency</Text>
        <View style={styles.chips} accessibilityRole="radiogroup">
          {CURRENCIES.map((c) => (
            <Chip
              key={c.code}
              label={`${c.symbol} ${c.code}`}
              selected={!draft.customCurrency && draft.currency === c.symbol}
              onPress={() => set({ currency: c.symbol, customCurrency: false })}
            />
          ))}
          <Chip
            label="Other"
            selected={draft.customCurrency}
            onPress={() => set({ customCurrency: true, currency: draft.customCurrency ? draft.currency : '' })}
          />
        </View>
        {draft.customCurrency ? (
          <Field
            label="Currency symbol"
            value={draft.currency}
            onChangeText={(t) => set({ currency: t })}
            maxLength={3}
            autoCapitalize="characters"
            placeholder="e.g. Rs, ¥, kr"
            error={errors.currency}
          />
        ) : null}
      </View>
      <Field
        label="Price per pack"
        prefix={draft.currency || undefined}
        value={draft.price}
        onChangeText={(t) => set({ price: t })}
        keyboardType="decimal-pad"
        placeholder="350"
        error={errors.price}
      />
      <View style={styles.row}>
        <View style={styles.flex}>
          <Field
            label="Cigarettes a day"
            value={draft.perDay}
            onChangeText={(t) => set({ perDay: t })}
            keyboardType="number-pad"
            placeholder="10"
            error={errors.perDay}
          />
        </View>
        <View style={styles.flex}>
          <Field
            label="Per pack"
            value={draft.perPack}
            onChangeText={(t) => set({ perPack: t })}
            keyboardType="number-pad"
            placeholder="20"
            error={errors.perPack}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.l },
  group: { gap: space.s },
  label: { color: colors.textSecondary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s },
  row: { flexDirection: 'row', gap: space.m },
  flex: { flex: 1 },
});
