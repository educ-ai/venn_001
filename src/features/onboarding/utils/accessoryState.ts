import { CorporationValidationState } from 'features/onboarding/hooks/useOnboardingFormStep1';

export type AccessoryState = 'none' | 'verifying' | 'correct';

export function getAccessoryState(
  value: string,
  hasError: boolean,
): AccessoryState {
  if (value.length === 0 || hasError) {
    return 'none';
  }
  return 'correct';
}

export function getCorporationAccessoryState(
  state: CorporationValidationState,
): AccessoryState {
  if (state === CorporationValidationState.Verifying) {
    return 'verifying';
  }
  if (state === CorporationValidationState.Valid) {
    return 'correct';
  }
  return 'none';
}
