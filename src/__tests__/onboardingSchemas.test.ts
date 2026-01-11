import { onboardingFormStep1Schema } from 'features/onboarding/validation/onboardingSchemas';

describe('onboardingFormStep1Schema', () => {
  const validData = {
    firstName: 'John',
    lastName: 'Doe',
    phone: '+13062776103',
    corporationNumber: '123456789',
  };

  describe('valid data', () => {
    it('passes with valid form data', () => {
      const result = onboardingFormStep1Schema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('firstName', () => {
    it('fails when empty', () => {
      const result = onboardingFormStep1Schema.safeParse({
        ...validData,
        firstName: '',
      });
      expect(result.success).toBe(false);
    });

    it('fails when exceeds 50 characters', () => {
      const result = onboardingFormStep1Schema.safeParse({
        ...validData,
        firstName: 'a'.repeat(51),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('lastName', () => {
    it('fails when empty', () => {
      const result = onboardingFormStep1Schema.safeParse({
        ...validData,
        lastName: '',
      });
      expect(result.success).toBe(false);
    });

    it('fails when exceeds 50 characters', () => {
      const result = onboardingFormStep1Schema.safeParse({
        ...validData,
        lastName: 'a'.repeat(51),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('phone', () => {
    it('fails when empty', () => {
      const result = onboardingFormStep1Schema.safeParse({
        ...validData,
        phone: '',
      });
      expect(result.success).toBe(false);
    });

    it('fails when not starting with +1', () => {
      const result = onboardingFormStep1Schema.safeParse({
        ...validData,
        phone: '+23062776103',
      });
      expect(result.success).toBe(false);
    });

    it('fails when too short', () => {
      const result = onboardingFormStep1Schema.safeParse({
        ...validData,
        phone: '+1306277',
      });
      expect(result.success).toBe(false);
    });

    it('fails when too long', () => {
      const result = onboardingFormStep1Schema.safeParse({
        ...validData,
        phone: '+130627761031234',
      });
      expect(result.success).toBe(false);
    });

    it('passes with valid Canadian phone', () => {
      const result = onboardingFormStep1Schema.safeParse({
        ...validData,
        phone: '+13062776103',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('corporationNumber', () => {
    it('fails when empty', () => {
      const result = onboardingFormStep1Schema.safeParse({
        ...validData,
        corporationNumber: '',
      });
      expect(result.success).toBe(false);
    });

    it('fails when less than 9 digits', () => {
      const result = onboardingFormStep1Schema.safeParse({
        ...validData,
        corporationNumber: '12345678',
      });
      expect(result.success).toBe(false);
    });

    it('fails when more than 9 digits', () => {
      const result = onboardingFormStep1Schema.safeParse({
        ...validData,
        corporationNumber: '1234567890',
      });
      expect(result.success).toBe(false);
    });

    it('fails when contains non-digits', () => {
      const result = onboardingFormStep1Schema.safeParse({
        ...validData,
        corporationNumber: '12345678a',
      });
      expect(result.success).toBe(false);
    });

    it('passes with valid 9 digit number', () => {
      const result = onboardingFormStep1Schema.safeParse({
        ...validData,
        corporationNumber: '123456789',
      });
      expect(result.success).toBe(true);
    });
  });
});
