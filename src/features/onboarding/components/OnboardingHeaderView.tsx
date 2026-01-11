import React from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'theme/ThemeContext';

type OnboardingHeaderViewProps = {
  step: number;
};

export function OnboardingHeaderView({
  step,
}: OnboardingHeaderViewProps): React.JSX.Element {
  const { t } = useTranslation();
  const { colors, typography, spacing } = useTheme();

  return (
    <View
      style={{
        alignItems: 'center',
        gap: spacing.sm,
      }}>
      <Text
        style={{
          color: colors.foreground,
          fontFamily: typography.fontFamily,
          fontSize: typography.large,
          fontWeight: typography.fontWeightSemibold,
        }}>
        {t('onboarding.title')}
      </Text>
      <Text
        style={{
          color: colors.foregroundMuted,
          fontFamily: typography.fontFamily,
          fontSize: typography.small,
        }}>
        {t('onboarding.stepProgress', { step, total: 5 })}
      </Text>
    </View>
  );
}
