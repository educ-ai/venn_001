import { useState } from 'react';
import { useProfileService } from 'business_logic/hooks/useProfileService';
import { filterNameInput } from 'features/onboarding/utils/nameFilter';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmitDisabled =
    isSubmitting ||
    firstName.trim().length === 0 ||
    lastName.trim().length === 0;

  const resetForm = () => {
    setFirstName('');
    setLastName('');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await profileService.submit({
        firstName,
        lastName,
        corporationNumber: '',
        phone: '',
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
    isSubmitting,
    isSubmitDisabled,
    handleSubmit,
    resetForm,
  };
}
