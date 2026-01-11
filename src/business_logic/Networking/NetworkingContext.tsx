import React, { createContext, useContext } from 'react';
import { NetworkingService } from 'business_logic/Networking/NetworkingService';

const NetworkingContext = createContext<NetworkingService | null>(null);

type NetworkingProviderProps = {
  service: NetworkingService;
  children: React.ReactNode;
};

export function NetworkingProvider({
  service,
  children,
}: NetworkingProviderProps) {
  return (
    <NetworkingContext.Provider value={service}>
      {children}
    </NetworkingContext.Provider>
  );
}

export function useNetworking(): NetworkingService {
  const context = useContext(NetworkingContext);
  if (!context) {
    throw new Error('useNetworking must be used within NetworkingProvider');
  }
  return context;
}
