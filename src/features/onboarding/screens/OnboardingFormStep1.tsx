import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from 'theme/ThemeContext';
import { ControlledFormField } from 'components/Form/ControlledFormField';
import { OnboardingHeaderView } from 'features/onboarding/components/OnboardingHeaderView';
import { OnboardingFormButton } from 'features/onboarding/components/OnboardingFormButton';
import { useOnboardingFormStep1 } from 'features/onboarding/hooks/useOnboardingFormStep1';
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

  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const phone = watch('phone');
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

  const getErrorMessage = (
    error: { message?: string } | undefined,
    isTouched: boolean | undefined,
  ): string | undefined => {
    if (error && isTouched) {
      return t(error.message ?? '');
    }
    return undefined;
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
            <ControlledFormField
              control={control}
              name="firstName"
              placeholder={t('onboarding.placeholder.firstName')}
              filter={filterNameInput}
              maxLength={50}
              errorMessage={getErrorMessage(errors.firstName, touchedFields.firstName)}
              hasError={!!errors.firstName && touchedFields.firstName}
              accessoryState={getAccessoryState(firstName, !!errors.firstName)}
              editable={!isSubmitting}
            />

            <ControlledFormField
              control={control}
              name="lastName"
              placeholder={t('onboarding.placeholder.lastName')}
              filter={filterNameInput}
              maxLength={50}
              errorMessage={getErrorMessage(errors.lastName, touchedFields.lastName)}
              hasError={!!errors.lastName && touchedFields.lastName}
              accessoryState={getAccessoryState(lastName, !!errors.lastName)}
              editable={!isSubmitting}
            />

            <ControlledFormField
              control={control}
              name="phone"
              placeholder={t('onboarding.placeholder.phone')}
              filter={filterPhoneInput}
              keyboardType="phone-pad"
              errorMessage={getErrorMessage(errors.phone, touchedFields.phone)}
              hasError={!!errors.phone && touchedFields.phone}
              accessoryState={getAccessoryState(phone, !!errors.phone)}
              editable={!isSubmitting}
            />

            <ControlledFormField
              control={control}
              name="corporationNumber"
              placeholder={t('onboarding.placeholder.corporationNumber')}
              filter={filterCorporationNumberInput}
              maxLength={9}
              keyboardType="number-pad"
              errorMessage={hasCorporationError ? t(corporationErrorMessage) : undefined}
              hasError={hasCorporationError}
              accessoryState={getCorporationAccessoryState(corporationValidation.state)}
              editable={!isSubmitting}
            />

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
