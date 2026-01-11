import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'theme/ThemeContext';
import { FormTextInput } from 'components/Form/FormTextInput';
import { FormErrorText } from 'components/Form/FormErrorText';
import { OnboardingHeaderView } from 'features/onboarding/components/OnboardingHeaderView';
import { OnboardingFormButton } from 'features/onboarding/components/OnboardingFormButton';
import { useOnboardingFormStep1 } from 'features/onboarding/hooks/useOnboardingFormStep1';
import {
  showSuccessAlert,
  showFailureAlert,
} from 'features/onboarding/utils/onboardingAlerts';

export function OnboardingFormStep1(): React.JSX.Element {
  const { t } = useTranslation();
  const { spacing } = useTheme();

  const {
    firstName,
    lastName,
    phone,
    corporationNumber,
    isSubmitting,
    isSubmitDisabled,
    handleSubmit,
    resetForm,
  } = useOnboardingFormStep1({
    onSubmitSuccess: () => showSuccessAlert(resetForm),
    onSubmitFailure: (errorMessage) => showFailureAlert(errorMessage),
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: spacing.lg,
        }}
        keyboardShouldPersistTaps="handled">
        <View style={{ gap: spacing.xl }}>
          <OnboardingHeaderView step={1} />

          <View style={{ width: '100%', gap: spacing.lg }}>
            <View style={{ gap: spacing.xs }}>
              <FormTextInput
                value={firstName.value}
                onChangeText={firstName.onChange}
                onBlur={firstName.onBlur}
                placeholder={t('onboarding.placeholder.firstName')}
                maxLength={50}
                error={!!firstName.error}
                editable={!isSubmitting}
              />
              {firstName.error && <FormErrorText message={firstName.error} />}
            </View>

            <View style={{ gap: spacing.xs }}>
              <FormTextInput
                value={lastName.value}
                onChangeText={lastName.onChange}
                onBlur={lastName.onBlur}
                placeholder={t('onboarding.placeholder.lastName')}
                maxLength={50}
                error={!!lastName.error}
                editable={!isSubmitting}
              />
              {lastName.error && <FormErrorText message={lastName.error} />}
            </View>

            <View style={{ gap: spacing.xs }}>
              <FormTextInput
                value={phone.value}
                onChangeText={phone.onChange}
                onBlur={phone.onBlur}
                placeholder={t('onboarding.placeholder.phone')}
                keyboardType="phone-pad"
                error={!!phone.error}
                editable={!isSubmitting}
              />
              {phone.error && <FormErrorText message={phone.error} />}
            </View>

            <View style={{ gap: spacing.xs }}>
              <FormTextInput
                value={corporationNumber.value}
                onChangeText={corporationNumber.onChange}
                onBlur={corporationNumber.onBlur}
                placeholder={t('onboarding.placeholder.corporationNumber')}
                maxLength={9}
                keyboardType="number-pad"
                error={!!corporationNumber.error}
                editable={!isSubmitting}
              />
              {corporationNumber.error && (
                <FormErrorText message={corporationNumber.error} />
              )}
            </View>

            <OnboardingFormButton
              onPress={handleSubmit}
              disabled={isSubmitDisabled}
              isSubmitting={isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
