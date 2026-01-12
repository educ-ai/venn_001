import React from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from 'react-native';
import { useTheme } from 'theme/ThemeContext';

export type AccessoryState = 'none' | 'verifying' | 'correct';

type FormTextInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  error?: boolean;
  accessoryState?: AccessoryState;
  editable?: boolean;
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
  editable = true,
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
        editable={editable}
        {...(maxLength !== undefined && { maxLength })}
        style={{
          flex: 1,
          color: editable ? colors.foreground : colors.foregroundMuted,
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
