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

  describe('initial state', () => {
    it('has empty firstName value', () => {
      const { result } = renderTestHook();
      expect(result.current.firstName.value).toBe('');
    });

    it('has isSubmitting as false', () => {
      const { result } = renderTestHook();
      expect(result.current.isSubmitting).toBe(false);
    });

    it('has isSubmitDisabled as true when firstName is empty', () => {
      const { result } = renderTestHook();
      expect(result.current.isSubmitDisabled).toBe(true);
    });
  });

  describe('firstName.onChange', () => {
    it('updates firstName value', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.firstName.onChange('John');
      });
      expect(result.current.firstName.value).toBe('John');
    });

    it('filters out numbers from input', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.firstName.onChange('John123');
      });
      expect(result.current.firstName.value).toBe('John');
    });

    it('allows apostrophes in names', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.firstName.onChange("O'Brien");
      });
      expect(result.current.firstName.value).toBe("O'Brien");
    });

    it('allows hyphens in names', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.firstName.onChange('Mary-Jane');
      });
      expect(result.current.firstName.value).toBe('Mary-Jane');
    });

    it('allows Unicode letters', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.firstName.onChange('Čéšar');
      });
      expect(result.current.firstName.value).toBe('Čéšar');
    });
  });

  describe('isSubmitDisabled', () => {
    it('is true when firstName is empty', () => {
      const { result } = renderTestHook();
      expect(result.current.isSubmitDisabled).toBe(true);
    });

    it('is true when firstName is only whitespace', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.firstName.onChange('   ');
      });
      expect(result.current.isSubmitDisabled).toBe(true);
    });

    it('is false when firstName has value', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.firstName.onChange('John');
      });
      expect(result.current.isSubmitDisabled).toBe(false);
    });
  });

  describe('handleSubmit', () => {
    it('calls profileService.submit with firstName', async () => {
      mockSubmit.mockResolvedValue({});
      const { result } = renderTestHook();

      act(() => {
        result.current.firstName.onChange('John');
      });

      await act(() => result.current.handleSubmit());

      expect(mockSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: '',
        corporationNumber: '',
        phone: '',
      });
    });

    it('calls onSubmitSuccess when submission succeeds', async () => {
      mockSubmit.mockResolvedValue({});
      const { result } = renderTestHook();

      act(() => {
        result.current.firstName.onChange('John');
      });

      await act(() => result.current.handleSubmit());

      expect(mockOnSubmitSuccess).toHaveBeenCalled();
      expect(mockOnSubmitFailure).not.toHaveBeenCalled();
    });

    it('calls onSubmitFailure with error message when submission fails', async () => {
      mockSubmit.mockRejectedValue(new Error('Network error'));
      const { result } = renderTestHook();

      act(() => {
        result.current.firstName.onChange('John');
      });

      await act(() => result.current.handleSubmit());

      expect(mockOnSubmitFailure).toHaveBeenCalledWith('Network error');
      expect(mockOnSubmitSuccess).not.toHaveBeenCalled();
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
        result.current.firstName.onChange('John');
      });

      act(() => {
        result.current.handleSubmit();
      });

      expect(result.current.isSubmitting).toBe(true);

      await act(async () => {
        resolveSubmit!({});
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('resetForm', () => {
    it('clears firstName value', () => {
      const { result } = renderTestHook();

      act(() => {
        result.current.firstName.onChange('John');
      });
      expect(result.current.firstName.value).toBe('John');

      act(() => {
        result.current.resetForm();
      });
      expect(result.current.firstName.value).toBe('');
    });
  });
});
