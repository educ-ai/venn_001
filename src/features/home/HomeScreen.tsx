import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'theme/ThemeContext';
import { ThemeToggle } from 'components/ThemeToggle';
import { OnboardingFormStep1 } from 'features/onboarding/screens/OnboardingFormStep1';

export function HomeScreen(): React.JSX.Element {
  const { colors, spacing } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.sm,
        }}>
        <ThemeToggle />
      </View>
      <OnboardingFormStep1 />
    </SafeAreaView>
  );
}
