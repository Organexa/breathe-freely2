import { DarkTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useApp } from '../state/AppContext';
import { colors, fonts } from '../theme';
import { CravingLogScreen } from '../screens/CravingLogScreen';
import { HealthTimelineScreen } from '../screens/HealthTimelineScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { JournalScreen } from '../screens/JournalScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { RestoreScreen } from '../screens/RestoreScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SlipScreen } from '../screens/SlipScreen';
import { SosScreen } from '../screens/SosScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.green,
    background: colors.base,
    card: colors.base,
    text: colors.text,
    border: colors.highlight,
    notification: colors.amber,
  },
};

export function RootNavigator() {
  const { state } = useApp();
  const onboarded = state.settings.onboarded;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.base },
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: fonts.bodySemi, fontSize: 18 },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.base },
          animation: 'slide_from_right',
        }}
      >
        {!onboarded ? (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Restore" component={RestoreScreen} options={{ title: 'Restore progress' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="Sos"
              component={SosScreen}
              options={{ headerShown: false, animation: 'fade_from_bottom' }}
            />
            <Stack.Screen name="CravingLog" component={CravingLogScreen} options={{ title: 'Log craving' }} />
            <Stack.Screen
              name="Slip"
              component={SlipScreen}
              options={{ headerShown: false, gestureEnabled: false, animation: 'fade' }}
            />
            <Stack.Screen name="Journal" component={JournalScreen} options={{ title: 'Craving journal' }} />
            <Stack.Screen
              name="HealthTimeline"
              component={HealthTimelineScreen}
              options={{ title: 'Health timeline' }}
            />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
            <Stack.Screen name="Restore" component={RestoreScreen} options={{ title: 'Restore progress' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
