import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'theme/ThemeContext';
import { FormErrorText } from 'components/Form/FormErrorText';

type FormFieldProps = {
  children: React.ReactNode;
  errorMessage?: string;
};

export function FormField({
  children,
  errorMessage,
}: FormFieldProps): React.JSX.Element {
  const { spacing } = useTheme();

  return (
    <View style={{ gap: spacing.xs }}>
      {children}
      {errorMessage && <FormErrorText message={errorMessage} />}
    </View>
  );
}
