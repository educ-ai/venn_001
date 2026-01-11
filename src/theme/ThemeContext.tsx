import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import { colors, type ThemeColors } from 'theme/colors';
import { typography, type Typography } from 'theme/typography';
import { spacing, type Spacing } from 'theme/spacing';

type ThemeContextValue = {
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({
  children,
}: ThemeProviderProps): React.JSX.Element {
  const systemColorScheme = useColorScheme();
  const [overrideDark, setOverrideDark] = useState<boolean | null>(null);

  const isDark = overrideDark ?? systemColorScheme === 'dark';

  const toggleTheme = () => {
    setOverrideDark(prev => (prev === null ? !isDark : !prev));
  };

  const value: ThemeContextValue = {
    colors: isDark ? colors.dark : colors.light,
    typography,
    spacing,
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
