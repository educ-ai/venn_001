import { useState } from 'react';
import { useProfileService } from 'business_logic/hooks/useProfileService';

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  corporationNumber: string;
};

type UseOnboardingFormStep1Props = {
  onSubmitSuccess: () => void;
  onSubmitFailure: (errorMessage?: string) => void;
};

export type OnboardingFormStep1State = {
  isSubmitting: boolean;
  submitForm: (data: FormData) => Promise<void>;
};

export function useOnboardingFormStep1({
  onSubmitSuccess,
  onSubmitFailure,
}: UseOnboardingFormStep1Props): OnboardingFormStep1State {
  const profileService = useProfileService();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await profileService.submit(data);
      onSubmitSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : undefined;
      onSubmitFailure(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitForm,
  };
}
