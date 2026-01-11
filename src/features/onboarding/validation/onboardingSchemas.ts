import { z } from 'zod';

export const onboardingFormStep1Schema = z.object({
  firstName: z
    .string()
    .min(1, 'validation.required')
    .max(50, 'validation.maxLength'),
  lastName: z
    .string()
    .min(1, 'validation.required')
    .max(50, 'validation.maxLength'),
  phone: z
    .string()
    .min(1, 'validation.required')
    .regex(/^\+1\d{10}$/, 'validation.invalidPhone'),
  corporationNumber: z
    .string()
    .min(1, 'validation.required')
    .regex(/^\d{9}$/, 'validation.invalidCorporationNumber'),
});

export type OnboardingFormStep1Data = z.infer<typeof onboardingFormStep1Schema>;
