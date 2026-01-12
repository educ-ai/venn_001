import { renderHook, act, waitFor } from '@testing-library/react-native';
import {
  useOnboardingFormStep1,
  CorporationValidationState,
} from 'features/onboarding/hooks/useOnboardingFormStep1';

jest.mock('business_logic/Networking/NetworkingContext');
jest.mock('business_logic/hooks/useProfileService');
jest.mock('business_logic/hooks/useCorporationService');

import { useProfileService } from 'business_logic/hooks/useProfileService';
import { useCorporationService } from 'business_logic/hooks/useCorporationService';

describe('useOnboardingFormStep1', () => {
  let mockSubmit: jest.Mock;
  let mockValidate: jest.Mock;
  let mockOnSubmitSuccess: jest.Mock;
  let mockOnSubmitFailure: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockSubmit = jest.fn();
    mockValidate = jest.fn();
    mockOnSubmitSuccess = jest.fn();
    mockOnSubmitFailure = jest.fn();

    (useProfileService as jest.Mock).mockReturnValue({
      submit: mockSubmit,
    });

    (useCorporationService as jest.Mock).mockReturnValue({
      validate: mockValidate,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  type HookProps = {
    isFormValid: boolean;
    corporationNumberValue: string;
    isCorporationNumberTouched: boolean;
    corporationNumberFormError?: string;
  };

  const defaultProps: HookProps = {
    isFormValid: true,
    corporationNumberValue: '',
    isCorporationNumberTouched: false,
    corporationNumberFormError: undefined,
  };

  const renderTestHook = (props: Partial<HookProps> = {}) =>
    renderHook<ReturnType<typeof useOnboardingFormStep1>, HookProps>(
      (hookProps) =>
        useOnboardingFormStep1({
          isFormValid: hookProps.isFormValid,
          corporationNumberValue: hookProps.corporationNumberValue,
          isCorporationNumberTouched: hookProps.isCorporationNumberTouched,
          corporationNumberFormError: hookProps.corporationNumberFormError,
          onSubmitSuccess: mockOnSubmitSuccess,
          onSubmitFailure: mockOnSubmitFailure,
        }),
      {
        initialProps: { ...defaultProps, ...props },
      },
    );

  const validFormData = {
    firstName: 'John',
    lastName: 'Doe',
    phone: '+13062776103',
    corporationNumber: '123456789',
  };

  describe('initial state', () => {
    it('has isSubmitting as false', () => {
      const { result } = renderTestHook();
      expect(result.current.isSubmitting).toBe(false);
    });

    it('has corporationValidation state as idle', () => {
      const { result } = renderTestHook();
      expect(result.current.corporationValidation.state).toBe(CorporationValidationState.Idle);
      expect(result.current.corporationValidation.error).toBeUndefined();
    });
  });

  describe('submitForm', () => {
    it('calls profileService.submit with form data', async () => {
      mockSubmit.mockResolvedValue({});
      const { result } = renderTestHook();

      await act(() => result.current.submitForm(validFormData));

      expect(mockSubmit).toHaveBeenCalledWith(validFormData);
    });

    it('calls onSubmitSuccess when submission succeeds', async () => {
      mockSubmit.mockResolvedValue({});
      const { result } = renderTestHook();

      await act(() => result.current.submitForm(validFormData));

      expect(mockOnSubmitSuccess).toHaveBeenCalled();
      expect(mockOnSubmitFailure).not.toHaveBeenCalled();
    });

    it('calls onSubmitFailure with error message when submission fails', async () => {
      mockSubmit.mockRejectedValue(new Error('Network error'));
      const { result } = renderTestHook();

      await act(() => result.current.submitForm(validFormData));

      expect(mockOnSubmitFailure).toHaveBeenCalledWith('Network error');
      expect(mockOnSubmitSuccess).not.toHaveBeenCalled();
    });

    it('sets isSubmitting to false after failed submission', async () => {
      mockSubmit.mockRejectedValue(new Error('Network error'));
      const { result } = renderTestHook();

      await act(() => result.current.submitForm(validFormData));

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('corporation number validation', () => {
    it('stays idle when value is less than 9 digits', () => {
      const { result } = renderTestHook({ corporationNumberValue: '12345678' });

      expect(result.current.corporationValidation.state).toBe(CorporationValidationState.Idle);
      expect(mockValidate).not.toHaveBeenCalled();
    });

    it('validates after debounce when value is 9 digits', async () => {
      mockValidate.mockResolvedValue(undefined);
      const { result } = renderTestHook({ corporationNumberValue: '123456789' });

      // Before debounce - still idle
      expect(result.current.corporationValidation.state).toBe(CorporationValidationState.Idle);

      // After debounce
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.corporationValidation.state).toBe(CorporationValidationState.Verifying);

      await waitFor(() => {
        expect(result.current.corporationValidation.state).toBe(CorporationValidationState.Valid);
      });

      expect(mockValidate).toHaveBeenCalledWith('123456789', expect.any(Object));
    });

    it('sets state to invalid when validation fails', async () => {
      mockValidate.mockRejectedValue(new Error('Invalid corporation number'));
      const { result } = renderTestHook({ corporationNumberValue: '123456789' });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(result.current.corporationValidation.state).toBe(CorporationValidationState.Invalid);
      });

      expect(result.current.corporationValidation.error).toBe(
        'Invalid corporation number',
      );
    });

    it('resets state when resetCorporationValidation is called', async () => {
      mockValidate.mockResolvedValue(undefined);
      const { result } = renderTestHook({ corporationNumberValue: '123456789' });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(result.current.corporationValidation.state).toBe(CorporationValidationState.Valid);
      });

      act(() => {
        result.current.resetCorporationValidation();
      });

      expect(result.current.corporationValidation.state).toBe(CorporationValidationState.Idle);
    });
  });
});
