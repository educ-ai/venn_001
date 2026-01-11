import React from 'react';
import {ThemeProvider} from 'theme/ThemeContext';
import {HomeScreen} from 'features/home/HomeScreen';

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <HomeScreen />
    </ThemeProvider>
  );
}

export default App;
