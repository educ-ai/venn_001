import React from 'react';
import { Text } from 'react-native';
import { useTheme } from 'theme/ThemeContext';

type FormErrorTextProps = {
  message: string;
};

export function FormErrorText({ message }: FormErrorTextProps): React.JSX.Element {
  const { colors, typography } = useTheme();

  return (
    <Text
      style={{
        color: colors.foregroundDestructive,
        fontSize: typography.small,
        fontFamily: typography.fontFamily,
        marginTop: 4,
        textAlign: 'left',
        alignSelf: 'flex-start',
      }}>
      {message}
    </Text>
  );
}
