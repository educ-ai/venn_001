import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'theme/ThemeContext';
import { Button } from 'components/Button';

type OnboardingFormButtonProps = {
  onPress: () => void;
  disabled: boolean;
  isSubmitting: boolean;
};

export function OnboardingFormButton({
  onPress,
  disabled,
  isSubmitting,
}: OnboardingFormButtonProps): React.JSX.Element {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const renderIcon = () => {
    if (isSubmitting) {
      return <ActivityIndicator size="small" color={colors.foregroundPrimary} />;
    }
    return (
      <Text
        style={{
          color: disabled ? colors.foregroundMuted : colors.foregroundPrimary,
        }}>
        →
      </Text>
    );
  };

  return (
    <View style={{ width: '100%' }}>
      <Button
        title={t('onboarding.submit')}
        onPress={onPress}
        disabled={disabled}
        icon={renderIcon()}
      />
    </View>
  );
}
