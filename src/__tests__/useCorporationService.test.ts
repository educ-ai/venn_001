import { renderHook } from '@testing-library/react-native';
import { NetworkingService } from 'business_logic/Networking/NetworkingService';
import {
  useCorporationService,
  ValidationError,
} from 'business_logic/hooks/useCorporationService';

jest.mock('business_logic/Networking/NetworkingContext');

import { useNetworking } from 'business_logic/Networking/NetworkingContext';

describe('useCorporationService', () => {
  let mockNetworking: jest.Mocked<NetworkingService>;
  let corporationService: ReturnType<typeof useCorporationService>;
  let mockUseNetworking: jest.MockedFunction<typeof useNetworking>;

  beforeAll(() => {
    mockUseNetworking = useNetworking as jest.MockedFunction<typeof useNetworking>;
  });

  beforeEach(() => {
    mockNetworking = {
      get: jest.fn() as jest.MockedFunction<NetworkingService['get']>,
      post: jest.fn() as jest.MockedFunction<NetworkingService['post']>,
    };
    mockUseNetworking.mockReturnValue(mockNetworking);
    corporationService = renderHook(() => useCorporationService()).result.current;
  });

  describe('validate', () => {
    it('calls networking with correct endpoint', async () => {
      mockNetworking.get.mockResolvedValue({ corporationNumber: '123456789', valid: true });
      await corporationService.validate('123456789');
      expect(mockNetworking.get).toHaveBeenCalledWith('corporation-number/123456789');
    });

    it('resolves when corporation number is valid', async () => {
      mockNetworking.get.mockResolvedValue({ corporationNumber: '826417395', valid: true });
      await expect(corporationService.validate('826417395')).resolves.not.toThrow();
    });

    it('throws when corporation number is invalid', async () => {
      mockNetworking.get.mockResolvedValue({ valid: false, message: 'Invalid corporation number' });
      await expect(corporationService.validate('000000000')).rejects.toThrow('Invalid corporation number');
    });

    it('throws ValidationError when server returns malformed response', async () => {
      mockNetworking.get.mockResolvedValue({ unexpected: 'garbage' });
      await expect(corporationService.validate('123456789')).rejects.toThrow(ValidationError);
    });

    it('propagates network errors', async () => {
      mockNetworking.get.mockRejectedValue(new Error('Network failure'));
      await expect(corporationService.validate('123456789')).rejects.toThrow('Network failure');
    });
  });
});
