import { z } from 'zod';
import { useNetworking } from 'business_logic/Networking/NetworkingContext';

export class ValidationError extends Error {
  constructor(message: string = 'Invalid response') {
    super(message);
    this.name = 'ValidationError';
  }
}

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

type ValidateOptions = {
  signal?: AbortSignal;
};

export function useCorporationService() {
  const networking = useNetworking();

  return {
    validate: async (number: string, options?: ValidateOptions): Promise<void> => {
      const response = await networking.get(`corporation-number/${number}`, {
        signal: options?.signal,
      });
      const parsed = responseSchema.safeParse(response);

      if (!parsed.success) {
        throw new ValidationError();
      }

      if (!parsed.data.valid) {
        throw new Error(parsed.data.message);
      }
    },
  };
}
