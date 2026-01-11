import { useState } from 'react';
import { useProfileService } from 'business_logic/hooks/useProfileService';
import { filterNameInput } from 'features/onboarding/utils/nameFilter';
import { filterPhoneInput } from 'features/onboarding/utils/phoneFilter';
import { filterCorporationNumberInput } from 'features/onboarding/utils/corporationNumberFilter';

type UseOnboardingFormStep1Props = {
  onSubmitSuccess: () => void;
  onSubmitFailure: (errorMessage?: string) => void;
};

type FieldState = {
  value: string;
  onChange: (text: string) => void;
  onBlur: () => void;
  error?: string;
};

export type OnboardingFormStep1State = {
  firstName: FieldState;
  lastName: FieldState;
  phone: FieldState;
  corporationNumber: FieldState;
  isSubmitting: boolean;
  isSubmitDisabled: boolean;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
};

export function useOnboardingFormStep1({
  onSubmitSuccess,
  onSubmitFailure,
}: UseOnboardingFormStep1Props): OnboardingFormStep1State {
  const profileService = useProfileService();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [corporationNumber, setCorporationNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmitDisabled =
    isSubmitting ||
    firstName.trim().length === 0 ||
    lastName.trim().length === 0 ||
    phone.trim().length === 0 ||
    corporationNumber.length !== 9;

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setPhone('');
    setCorporationNumber('');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await profileService.submit({
        firstName,
        lastName,
        corporationNumber,
        phone,
      });
      onSubmitSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : undefined;
      onSubmitFailure(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFirstNameChange = (text: string) => {
    setFirstName(filterNameInput(text));
  };

  const handleLastNameChange = (text: string) => {
    setLastName(filterNameInput(text));
  };

  const handlePhoneChange = (text: string) => {
    setPhone(filterPhoneInput(text));
  };

  const handleCorporationNumberChange = (text: string) => {
    setCorporationNumber(filterCorporationNumberInput(text));
  };

  return {
    firstName: {
      value: firstName,
      onChange: handleFirstNameChange,
      onBlur: () => {},
      error: undefined,
    },
    lastName: {
      value: lastName,
      onChange: handleLastNameChange,
      onBlur: () => {},
      error: undefined,
    },
    phone: {
      value: phone,
      onChange: handlePhoneChange,
      onBlur: () => {},
      error: undefined,
    },
    corporationNumber: {
      value: corporationNumber,
      onChange: handleCorporationNumberChange,
      onBlur: () => {},
      error: undefined,
    },
    isSubmitting,
    isSubmitDisabled,
    handleSubmit,
    resetForm,
  };
}
