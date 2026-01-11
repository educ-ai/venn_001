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

    it('has empty lastName value', () => {
      const { result } = renderTestHook();
      expect(result.current.lastName.value).toBe('');
    });

    it('has empty phone value', () => {
      const { result } = renderTestHook();
      expect(result.current.phone.value).toBe('');
    });

    it('has empty corporationNumber value', () => {
      const { result } = renderTestHook();
      expect(result.current.corporationNumber.value).toBe('');
    });

    it('has isSubmitting as false', () => {
      const { result } = renderTestHook();
      expect(result.current.isSubmitting).toBe(false);
    });

    it('has isSubmitDisabled as true when fields are empty', () => {
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

  describe('lastName.onChange', () => {
    it('updates lastName value', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.lastName.onChange('Doe');
      });
      expect(result.current.lastName.value).toBe('Doe');
    });

    it('filters out numbers from input', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.lastName.onChange('Doe123');
      });
      expect(result.current.lastName.value).toBe('Doe');
    });

    it('allows apostrophes in names', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.lastName.onChange("O'Connor");
      });
      expect(result.current.lastName.value).toBe("O'Connor");
    });

    it('allows hyphens in names', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.lastName.onChange('Smith-Jones');
      });
      expect(result.current.lastName.value).toBe('Smith-Jones');
    });

    it('allows Unicode letters', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.lastName.onChange('Müller');
      });
      expect(result.current.lastName.value).toBe('Müller');
    });
  });

  describe('phone.onChange', () => {
    it('updates phone value', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.phone.onChange('+13062776103');
      });
      expect(result.current.phone.value).toBe('+13062776103');
    });

    it('allows + only at the beginning', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.phone.onChange('+1306+2776103');
      });
      expect(result.current.phone.value).toBe('+13062776103');
    });

    it('filters out letters', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.phone.onChange('+1abc3062776103');
      });
      expect(result.current.phone.value).toBe('+13062776103');
    });

    it('filters out special characters except + at start', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.phone.onChange('+1-306-277-6103');
      });
      expect(result.current.phone.value).toBe('+13062776103');
    });

    it('allows digit as first character', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.phone.onChange('13062776103');
      });
      expect(result.current.phone.value).toBe('13062776103');
    });
  });

  describe('corporationNumber.onChange', () => {
    it('updates corporationNumber value', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.corporationNumber.onChange('123456789');
      });
      expect(result.current.corporationNumber.value).toBe('123456789');
    });

    it('filters out non-digit characters', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.corporationNumber.onChange('12a34b56c789');
      });
      expect(result.current.corporationNumber.value).toBe('123456789');
    });

    it('limits to 9 characters', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.corporationNumber.onChange('1234567890123');
      });
      expect(result.current.corporationNumber.value).toBe('123456789');
    });

    it('filters out special characters', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.corporationNumber.onChange('123-456-789');
      });
      expect(result.current.corporationNumber.value).toBe('123456789');
    });
  });

  describe('isSubmitDisabled', () => {
    const fillAllFields = (result: any) => {
      act(() => {
        result.current.firstName.onChange('John');
        result.current.lastName.onChange('Doe');
        result.current.phone.onChange('+13062776103');
        result.current.corporationNumber.onChange('123456789');
      });
    };

    it('is true when all fields are empty', () => {
      const { result } = renderTestHook();
      expect(result.current.isSubmitDisabled).toBe(true);
    });

    it('is true when firstName is empty', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.lastName.onChange('Doe');
        result.current.phone.onChange('+13062776103');
        result.current.corporationNumber.onChange('123456789');
      });
      expect(result.current.isSubmitDisabled).toBe(true);
    });

    it('is true when lastName is empty', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.firstName.onChange('John');
        result.current.phone.onChange('+13062776103');
        result.current.corporationNumber.onChange('123456789');
      });
      expect(result.current.isSubmitDisabled).toBe(true);
    });

    it('is true when phone is empty', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.firstName.onChange('John');
        result.current.lastName.onChange('Doe');
        result.current.corporationNumber.onChange('123456789');
      });
      expect(result.current.isSubmitDisabled).toBe(true);
    });

    it('is true when corporationNumber is less than 9 digits', () => {
      const { result } = renderTestHook();
      act(() => {
        result.current.firstName.onChange('John');
        result.current.lastName.onChange('Doe');
        result.current.phone.onChange('+13062776103');
        result.current.corporationNumber.onChange('12345678');
      });
      expect(result.current.isSubmitDisabled).toBe(true);
    });

    it('is true when firstName is only whitespace', () => {
      const { result } = renderTestHook();
      fillAllFields(result);
      act(() => {
        result.current.firstName.onChange('   ');
      });
      expect(result.current.isSubmitDisabled).toBe(true);
    });

    it('is true when lastName is only whitespace', () => {
      const { result } = renderTestHook();
      fillAllFields(result);
      act(() => {
        result.current.lastName.onChange('   ');
      });
      expect(result.current.isSubmitDisabled).toBe(true);
    });

    it('is false when all fields have valid values', () => {
      const { result } = renderTestHook();
      fillAllFields(result);
      expect(result.current.isSubmitDisabled).toBe(false);
    });
  });

  describe('handleSubmit', () => {
    const fillAllFields = (result: any) => {
      act(() => {
        result.current.firstName.onChange('John');
        result.current.lastName.onChange('Doe');
        result.current.phone.onChange('+13062776103');
        result.current.corporationNumber.onChange('123456789');
      });
    };

    it('calls profileService.submit with all fields', async () => {
      mockSubmit.mockResolvedValue({});
      const { result } = renderTestHook();

      fillAllFields(result);

      await act(() => result.current.handleSubmit());

      expect(mockSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        corporationNumber: '123456789',
        phone: '+13062776103',
      });
    });

    it('calls onSubmitSuccess when submission succeeds', async () => {
      mockSubmit.mockResolvedValue({});
      const { result } = renderTestHook();

      fillAllFields(result);

      await act(() => result.current.handleSubmit());

      expect(mockOnSubmitSuccess).toHaveBeenCalled();
      expect(mockOnSubmitFailure).not.toHaveBeenCalled();
    });

    it('calls onSubmitFailure with error message when submission fails', async () => {
      mockSubmit.mockRejectedValue(new Error('Network error'));
      const { result } = renderTestHook();

      fillAllFields(result);

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

      fillAllFields(result);

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
    it('clears all field values', () => {
      const { result } = renderTestHook();

      act(() => {
        result.current.firstName.onChange('John');
        result.current.lastName.onChange('Doe');
        result.current.phone.onChange('+13062776103');
        result.current.corporationNumber.onChange('123456789');
      });
      expect(result.current.firstName.value).toBe('John');
      expect(result.current.lastName.value).toBe('Doe');
      expect(result.current.phone.value).toBe('+13062776103');
      expect(result.current.corporationNumber.value).toBe('123456789');

      act(() => {
        result.current.resetForm();
      });
      expect(result.current.firstName.value).toBe('');
      expect(result.current.lastName.value).toBe('');
      expect(result.current.phone.value).toBe('');
      expect(result.current.corporationNumber.value).toBe('');
    });
  });
});
