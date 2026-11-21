import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Sos: undefined;
  CravingLog: { resisted?: boolean } | undefined;
  Slip: { previousMs: number };
  Journal: undefined;
  HealthTimeline: undefined;
  Settings: undefined;
  Restore: undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
