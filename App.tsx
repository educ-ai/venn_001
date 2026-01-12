import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'theme/ThemeContext';
import { NetworkingProvider } from 'business_logic/Networking/NetworkingContext';
import NetworkingServiceImpl from 'business_logic/Networking/NetworkingServiceImpl';
import { HomeScreen } from 'features/home/HomeScreen';
import { API_BASE_URL } from 'business_logic/constants';
import i18n from 'localization/i18n';

function App(): React.JSX.Element {
    const networkingService = new NetworkingServiceImpl(API_BASE_URL);

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <NetworkingProvider service={networkingService}>
          <ThemeProvider>
            <HomeScreen />
          </ThemeProvider>
        </NetworkingProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}

export default App;
