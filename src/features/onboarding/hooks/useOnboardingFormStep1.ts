import { useState, useEffect, useRef, useCallback } from 'react';
import { useProfileService } from 'business_logic/hooks/useProfileService';
import { useCorporationService } from 'business_logic/hooks/useCorporationService';

const VALIDATION_DEBOUNCE_MS = 300;

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  corporationNumber: string;
};

export enum CorporationValidationState {
  Idle,
  Verifying,
  Valid,
  Invalid,
}

type UseOnboardingFormStep1Props = {
  isFormValid: boolean;
  corporationNumberFormError?: string;
  isCorporationNumberTouched: boolean;
  corporationNumberValue: string;
  onSubmitSuccess: () => void;
  onSubmitFailure: (errorMessage?: string) => void;
};

export type OnboardingFormStep1State = {
  isSubmitting: boolean;
  isFormSubmittable: boolean;
  hasCorporationError: boolean;
  corporationErrorMessage: string;
  submitForm: (data: FormData) => Promise<void>;
  corporationValidation: {
    state: CorporationValidationState;
    error?: string;
  };
  resetCorporationValidation: () => void;
};

export function useOnboardingFormStep1({
  isFormValid,
  corporationNumberFormError,
  isCorporationNumberTouched,
  corporationNumberValue,
  onSubmitSuccess,
  onSubmitFailure,
}: UseOnboardingFormStep1Props): OnboardingFormStep1State {
  const profileService = useProfileService();
  const corporationService = useCorporationService();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [corporationValidation, setCorporationValidation] = useState<{
    state: CorporationValidationState;
    error?: string;
  }>({ state: CorporationValidationState.Idle, error: undefined });

  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetCorporationValidation = useCallback(() => {
    setCorporationValidation({ state: CorporationValidationState.Idle, error: undefined });
  }, []);

  const performValidation = useCallback(
    async (value: string) => {
      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setCorporationValidation({ state: CorporationValidationState.Verifying, error: undefined });

      try {
        await corporationService.validate(value, {
          signal: abortControllerRef.current.signal,
        });
        setCorporationValidation({ state: CorporationValidationState.Valid, error: undefined });
      } catch (error) {
        // Ignore aborted requests
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'validation.invalidCorporationNumber';
        setCorporationValidation({ state: CorporationValidationState.Invalid, error: errorMessage });
      }
    },
    [corporationService],
  );

  // Validate corporation number when value changes
  useEffect(() => {
    // Clear any pending debounce
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Reset to idle immediately on any change
    setCorporationValidation({ state: CorporationValidationState.Idle, error: undefined });

    // Only validate if exactly 9 digits
    if (corporationNumberValue.length !== 9) {
      return;
    }

    // Debounce the validation
    debounceTimeoutRef.current = setTimeout(() => {
      performValidation(corporationNumberValue);
    }, VALIDATION_DEBOUNCE_MS);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [corporationNumberValue]);

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

  const isFormSubmittable =
    isFormValid &&
    !isSubmitting &&
    corporationValidation.state === CorporationValidationState.Valid;

  const hasCorporationError =
    (!!corporationNumberFormError && isCorporationNumberTouched) ||
    corporationValidation.state === CorporationValidationState.Invalid;

  const corporationErrorMessage =
    corporationValidation.error || corporationNumberFormError || '';

  return {
    isSubmitting,
    isFormSubmittable,
    hasCorporationError,
    corporationErrorMessage,
    submitForm,
    corporationValidation,
    resetCorporationValidation,
  };
}
