import { useState } from 'react';
import { useProfileService } from 'business_logic/hooks/useProfileService';
import { filterNameInput } from 'features/onboarding/utils/nameFilter';

type UseOnboardingFormStep1Props = {
  onSubmitSuccess: () => void;
  onSubmitFailure: (errorMessage?: string) => void;
};

export type OnboardingFormStep1State = {
  firstName: {
    value: string;
    onChange: (text: string) => void;
    onBlur: () => void;
    error?: string;
  };
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmitDisabled = isSubmitting || firstName.trim().length === 0;

  const resetForm = () => {
    setFirstName('');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await profileService.submit({
        firstName,
        lastName: '',
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

  return {
    firstName: {
      value: firstName,
      onChange: handleFirstNameChange,
      onBlur: () => {},
      error: undefined,
    },
    isSubmitting,
    isSubmitDisabled,
    handleSubmit,
    resetForm,
  };
}
