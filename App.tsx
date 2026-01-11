import React from 'react';
import { ThemeProvider } from 'theme/ThemeContext';
import { NetworkingProvider } from 'business_logic/Networking/NetworkingContext';
import NetworkingServiceImpl from 'business_logic/Networking/NetworkingServiceImpl';
import { HomeScreen } from 'features/home/HomeScreen';
import { API_BASE_URL } from 'business_logic/constants';

function App(): React.JSX.Element {
  const networkingService = new NetworkingServiceImpl(API_BASE_URL);
  return (
    <NetworkingProvider service={networkingService}>
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    </NetworkingProvider>
  );
}

export default App;
