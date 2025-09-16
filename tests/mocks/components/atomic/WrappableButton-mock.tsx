import React from 'react';
import { Button, Text, View } from 'react-native';
import { WrappableButtonProps } from '@components/atomic/WrappableButton';

export function WrappableButton({
  onPress,
  children,
  testID,
  buttonColor,
  textColor,
  style,
}: WrappableButtonProps) {
  return (
    <View testID={testID}>
      <Text testID={testID + '::Children'}>{children}</Text>
      <Text testID={testID + '::ButtonColor'}>{buttonColor || 'undefined'}</Text>
      <Text testID={testID + '::TextColor'}>{textColor || 'undefined'}</Text>
      <Text testID={testID + '::Style'}>{JSON.stringify(style) || 'undefined'}</Text>
      {onPress && <Button testID={testID + '::OnPress'} onPress={onPress} title='Mock Press' />}
    </View>
  );
}

export default WrappableButton;
