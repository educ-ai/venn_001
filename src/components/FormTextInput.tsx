import React from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from 'react-native';
import { useTheme } from 'theme/ThemeContext';

type AccessoryState = 'none' | 'verifying' | 'correct' | 'wrong';

type FormTextInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  error?: boolean;
  accessoryState?: AccessoryState;
};

export function FormTextInput({
  value,
  onChangeText,
  onBlur,
  placeholder,
  keyboardType = 'default',
  maxLength,
  error = false,
  accessoryState = 'none',
}: FormTextInputProps): React.JSX.Element {
  const { colors, typography } = useTheme();

  const renderAccessory = () => {
    switch (accessoryState) {
      case 'verifying':
        return <ActivityIndicator size="small" color={colors.foregroundMuted} />;
      case 'correct':
        return (
          <Text style={{ fontSize: typography.medium, color: '#22C55E' }}>✓</Text>
        );
      case 'wrong':
        return (
          <Text style={{ fontSize: typography.medium, color: colors.foregroundDestructive }}>✗</Text>
        );
      default:
        return null;
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderColor: error ? colors.backgroundDestructive : colors.backgroundMuted,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
      }}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        keyboardType={keyboardType}
        {...(maxLength !== undefined && { maxLength })}
        style={{
          flex: 1,
          color: colors.foreground,
          fontSize: typography.medium,
          fontFamily: typography.fontFamily,
          paddingVertical: 12,
        }}
        placeholderTextColor={colors.foregroundMuted}
      />
      {accessoryState !== 'none' && (
        <View style={{ marginLeft: 8 }}>{renderAccessory()}</View>
      )}
    </View>
  );
}
