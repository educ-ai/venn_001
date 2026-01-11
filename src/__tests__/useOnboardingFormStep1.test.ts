import { renderHook, act } from '@testing-library/react-native';
import { useOnboardingFormStep1 } from 'features/onboarding/hooks/useOnboardingFormStep1';

jest.mock('business_logic/Networking/NetworkingContext');
jest.mock('business_logic/hooks/useProfileService');

import { useProfileService } from 'business_logic/hooks/useProfileService';

describe('useOnboardingFormStep1', () => {
  let mockSubmit: jest.Mock;
  let mockOnSubmitSuccess: jest.Mock;
  let mockOnSubmitFailure: jest.Mock;

  beforeEach(() => {
    mockSubmit = jest.fn();
    mockOnSubmitSuccess = jest.fn();
    mockOnSubmitFailure = jest.fn();

    (useProfileService as jest.Mock).mockReturnValue({
      submit: mockSubmit,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderTestHook = () =>
    renderHook(() =>
      useOnboardingFormStep1({
        onSubmitSuccess: mockOnSubmitSuccess,
        onSubmitFailure: mockOnSubmitFailure,
      }),
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

    it('calls onSubmitFailure with undefined when error has no message', async () => {
      mockSubmit.mockRejectedValue('Unknown error');
      const { result } = renderTestHook();

      await act(() => result.current.submitForm(validFormData));

      expect(mockOnSubmitFailure).toHaveBeenCalledWith(undefined);
    });

    it('sets isSubmitting to true during submission', async () => {
      let resolveSubmit: (value: unknown) => void;
      mockSubmit.mockReturnValue(
        new Promise(resolve => {
          resolveSubmit = resolve;
        }),
      );

      const { result } = renderTestHook();

      act(() => {
        result.current.submitForm(validFormData);
      });

      expect(result.current.isSubmitting).toBe(true);

      await act(async () => {
        resolveSubmit!({});
      });

      expect(result.current.isSubmitting).toBe(false);
    });

    it('sets isSubmitting to false after failed submission', async () => {
      mockSubmit.mockRejectedValue(new Error('Network error'));
      const { result } = renderTestHook();

      await act(() => result.current.submitForm(validFormData));

      expect(result.current.isSubmitting).toBe(false);
    });
  });
});
