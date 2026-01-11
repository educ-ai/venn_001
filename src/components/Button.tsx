import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'theme/ThemeContext';

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export function Button({
  title,
  onPress,
  disabled = false,
  icon,
}: ButtonProps): React.JSX.Element {
  const { colors, typography } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={{
        backgroundColor: disabled ? colors.backgroundMuted : colors.backgroundPrimary,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: disabled ? colors.foregroundMuted : colors.foregroundPrimary,
          fontSize: typography.medium,
          fontFamily: typography.fontFamily,
        }}>
        {title}
      </Text>
      {icon && <View style={{ marginLeft: 8 }}>{icon}</View>}
    </TouchableOpacity>
  );
}
