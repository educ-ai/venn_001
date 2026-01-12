import React from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { KeyboardTypeOptions } from 'react-native';
import { FormField } from 'components/Form/FormField';
import { FormTextInput, AccessoryState } from 'components/Form/FormTextInput';

type ControlledFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  placeholder: string;
  errorMessage?: string;
  hasError?: boolean;
  editable?: boolean;
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions;
  filter?: (text: string) => string;
  accessoryState?: AccessoryState;
};

/**
 * Combines react-hook-form Controller with FormTextInput and error display.
 * Supports input filtering before value updates reach the form state.
 */
export function ControlledFormField<T extends FieldValues>({
  control,
  name,
  placeholder,
  errorMessage,
  hasError = false,
  editable = true,
  maxLength,
  keyboardType,
  filter,
  accessoryState = 'none',
}: ControlledFormFieldProps<T>): React.JSX.Element {
  return (
    <FormField errorMessage={errorMessage}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormTextInput
            value={value}
            onChangeText={text => onChange(filter ? filter(text) : text)}
            onBlur={onBlur}
            placeholder={placeholder}
            maxLength={maxLength}
            keyboardType={keyboardType}
            error={hasError}
            accessoryState={accessoryState}
            editable={editable}
          />
        )}
      />
    </FormField>
  );
}
