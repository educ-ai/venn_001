import { renderHook } from '@testing-library/react-native';
import {
  NetworkingService,
  ContentType,
} from 'business_logic/Networking/NetworkingService';
import { useProfileService } from 'business_logic/hooks/useProfileService';

jest.mock('business_logic/Networking/NetworkingContext');

import { useNetworking } from 'business_logic/Networking/NetworkingContext';

const VALID_PROFILE = {
  firstName: 'Hello',
  lastName: 'World',
  corporationNumber: '826417395',
  phone: '+13062776103',
};

describe('useProfileService', () => {
  let mockNetworking: jest.Mocked<NetworkingService>;
  let profileService: ReturnType<typeof useProfileService>;
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
    profileService = renderHook(() => useProfileService()).result.current;
  });

  describe('submit', () => {
    it('calls networking with correct endpoint and body', async () => {
      mockNetworking.post.mockResolvedValue({});
      await profileService.submit(VALID_PROFILE);
      expect(mockNetworking.post).toHaveBeenCalledWith(
        'profile-details',
        VALID_PROFILE,
        { expectedResponseType: ContentType.PlainText },
      );
    });

    it('resolves when submission succeeds', async () => {
      mockNetworking.post.mockResolvedValue({});
      await expect(profileService.submit(VALID_PROFILE)).resolves.not.toThrow();
    });

    it('propagates server errors', async () => {
      mockNetworking.post.mockRejectedValue(new Error('Invalid phone number'));
      await expect(profileService.submit(VALID_PROFILE)).rejects.toThrow('Invalid phone number');
    });
  });
});
