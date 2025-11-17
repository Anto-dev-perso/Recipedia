import React from 'react';
import { Button, Text, View } from 'react-native';
import type { ValidationQueueProps } from '@components/dialogs/ValidationQueue';
import { ingredientType } from '@customTypes/DatabaseElementTypes';

export function ValidationQueue(props: ValidationQueueProps) {
  const mockTestId = `${props.testId}::ValidationQueue::Mock`;

  return (
    <View testID={mockTestId}>
      <Text testID={`${mockTestId}::type`}>{props.type}</Text>
      <Text testID={`${mockTestId}::items`}>{JSON.stringify(props.items)}</Text>
      <Button testID={`${mockTestId}::onComplete`} title='onComplete' onPress={props.onComplete} />
      <Button
        testID={`${mockTestId}::onItemValidated`}
        title='onItemValidated'
        onPress={() =>
          props.type === 'Tag'
            ? props.onItemValidated({ id: 1, name: 'mockTag' })
            : props.onItemValidated({
                id: 1,
                name: 'mockIngredient',
                type: ingredientType.undefined,
                unit: 'g',
                quantity: '100',
                season: [],
              })
        }
      />
    </View>
  );
}

export default ValidationQueue;
