import { TextInput } from 'react-native';
import React from 'react';
import { NumericTextInputProps } from '@components/atomic/NumericTextInput';

export function numericTextInputMock({
  testID,
  value,
  onChangeValue,
  keyboardType,
  mode,
  label,
  dense,
  right,
  style,
}: NumericTextInputProps) {
  const [currentText, setCurrentText] = React.useState(value.toString());

  const handleChangeText = (text: string) => {
    setCurrentText(text);
  };

  const handleBlur = () => {
    if (onChangeValue) {
      const parsed = parseFloat(currentText);
      const finalValue = isNaN(parsed) ? 0 : parsed;
      onChangeValue(finalValue);
    }
  };

  return (
    <TextInput
      testID={testID}
      value={value.toString()}
      keyboardType={keyboardType}
      onChangeText={handleChangeText}
      onBlur={handleBlur}
      style={style}
    />
  );
}
