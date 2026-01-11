import { z } from 'zod';
import { useNetworking } from 'business_logic/Networking/NetworkingContext';

export class ValidationError extends Error {
  constructor(message: string = 'Invalid response') {
    super(message);
    this.name = 'ValidationError';
  }
}

export type CorporationValidationResult = {
  valid: boolean;
  message?: string;
};

const responseSchema = z.union([
  z.object({
    corporationNumber: z.string(),
    valid: z.literal(true),
  }),
  z.object({
    valid: z.literal(false),
    message: z.string(),
  }),
]);

export function useCorporationService() {
  const networking = useNetworking();

  return {
    validate: async (number: string): Promise<CorporationValidationResult> => {
      const response = await networking.get(`corporation-number/${number}`);
      const parsed = responseSchema.safeParse(response);

      if (!parsed.success) {
        throw new ValidationError();
      }

      if (parsed.data.valid) {
        return { valid: true };
      }

      return {
        valid: false,
        message: parsed.data.message
      };
    },
  };
}
