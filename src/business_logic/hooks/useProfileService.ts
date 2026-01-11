import { useNetworking } from 'business_logic/Networking/NetworkingContext';

export type ProfileData = {
  firstName: string;
  lastName: string;
  corporationNumber: string;
  phone: string;
};

export function useProfileService() {
  const networking = useNetworking();

  return {
    submit: async (data: ProfileData): Promise<void> => {
      await networking.post('profile-details', data);
    },
  };
}
