import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from 'theme/ThemeContext';
import { FormTextInput } from 'components/Form/FormTextInput';
import { FormErrorText } from 'components/Form/FormErrorText';
import { OnboardingHeaderView } from 'features/onboarding/components/OnboardingHeaderView';
import { OnboardingFormButton } from 'features/onboarding/components/OnboardingFormButton';
import {
  useOnboardingFormStep1,
  CorporationValidationState,
} from 'features/onboarding/hooks/useOnboardingFormStep1';
import {
  onboardingFormStep1Schema,
  type OnboardingFormStep1Data,
} from 'features/onboarding/validation/onboardingSchemas';
import {
  showSuccessAlert,
  showFailureAlert,
} from 'features/onboarding/utils/onboardingAlerts';
import { filterNameInput } from 'features/onboarding/utils/nameFilter';
import { filterPhoneInput } from 'features/onboarding/utils/phoneFilter';
import { filterCorporationNumberInput } from 'features/onboarding/utils/corporationNumberFilter';
import {
  getAccessoryState,
  getCorporationAccessoryState,
} from 'features/onboarding/utils/accessoryState';

export function OnboardingFormStep1(): React.JSX.Element {
  const { t } = useTranslation();
  const { spacing } = useTheme();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, touchedFields },
  } = useForm<OnboardingFormStep1Data>({
    resolver: zodResolver(onboardingFormStep1Schema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      corporationNumber: '',
    },
  });

  const corporationNumber = watch('corporationNumber');

  const {
    isSubmitting,
    isFormSubmittable,
    hasCorporationError,
    corporationErrorMessage,
    submitForm,
    corporationValidation,
    resetCorporationValidation,
  } = useOnboardingFormStep1({
    isFormValid: isValid,
    corporationNumberFormError: errors.corporationNumber?.message,
    isCorporationNumberTouched: !!touchedFields.corporationNumber,
    corporationNumberValue: corporationNumber,
    onSubmitSuccess: () => {
      showSuccessAlert(() => {
        reset();
        resetCorporationValidation();
      });
    },
    onSubmitFailure: errorMessage => showFailureAlert(errorMessage),
  });

  const onSubmit = (data: OnboardingFormStep1Data) => {
    submitForm(data);
  };

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
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormTextInput
                    value={value}
                    onChangeText={text => onChange(filterNameInput(text))}
                    onBlur={onBlur}
                    placeholder={t('onboarding.placeholder.firstName')}
                    maxLength={50}
                    error={!!errors.firstName && touchedFields.firstName}
                    accessoryState={getAccessoryState(value, !!errors.firstName)}
                    editable={!isSubmitting}
                  />
                )}
              />
              {errors.firstName && touchedFields.firstName && (
                <FormErrorText message={t(errors.firstName.message ?? '')} />
              )}
            </View>

            <View style={{ gap: spacing.xs }}>
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormTextInput
                    value={value}
                    onChangeText={text => onChange(filterNameInput(text))}
                    onBlur={onBlur}
                    placeholder={t('onboarding.placeholder.lastName')}
                    maxLength={50}
                    error={!!errors.lastName && touchedFields.lastName}
                    accessoryState={getAccessoryState(value, !!errors.lastName)}
                    editable={!isSubmitting}
                  />
                )}
              />
              {errors.lastName && touchedFields.lastName && (
                <FormErrorText message={t(errors.lastName.message ?? '')} />
              )}
            </View>

            <View style={{ gap: spacing.xs }}>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormTextInput
                    value={value}
                    onChangeText={text => onChange(filterPhoneInput(text))}
                    onBlur={onBlur}
                    placeholder={t('onboarding.placeholder.phone')}
                    keyboardType="phone-pad"
                    error={!!errors.phone && touchedFields.phone}
                    accessoryState={getAccessoryState(value, !!errors.phone)}
                    editable={!isSubmitting}
                  />
                )}
              />
              {errors.phone && touchedFields.phone && (
                <FormErrorText message={t(errors.phone.message ?? '')} />
              )}
            </View>

            <View style={{ gap: spacing.xs }}>
              <Controller
                control={control}
                name="corporationNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormTextInput
                    value={value}
                    onChangeText={text =>
                      onChange(filterCorporationNumberInput(text))
                    }
                    onBlur={onBlur}
                    placeholder={t('onboarding.placeholder.corporationNumber')}
                    maxLength={9}
                    keyboardType="number-pad"
                    error={hasCorporationError}
                    accessoryState={getCorporationAccessoryState(corporationValidation.state)}
                    editable={!isSubmitting}
                  />
                )}
              />
              {hasCorporationError && (
                <FormErrorText message={t(corporationErrorMessage)} />
              )}
            </View>

            <OnboardingFormButton
              onPress={handleSubmit(onSubmit)}
              disabled={!isFormSubmittable}
              isSubmitting={isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
