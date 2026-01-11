import React from 'react';
import { Switch, Text, View } from 'react-native';
import { useTheme } from 'theme/ThemeContext';

export function ThemeToggle(): React.JSX.Element {
  const { colors, typography, isDark, toggleTheme } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Text
        style={{
          color: colors.foreground,
          fontSize: typography.small,
          fontFamily: typography.fontFamily,
          textAlign: 'center',
        }}>
        ☀️
      </Text>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        trackColor={{
          false: colors.backgroundMuted,
          true: colors.backgroundPrimary,
        }}
        thumbColor={colors.foregroundPrimary}
      />
      <Text
        style={{
          color: colors.foreground,
          fontSize: typography.small,
          fontFamily: typography.fontFamily,
          textAlign: 'center',
        }}>
        🌙
      </Text>
    </View>
  );
}
