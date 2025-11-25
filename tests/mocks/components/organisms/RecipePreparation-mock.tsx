import { Button, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RecipePreparationProps } from '@components/organisms/RecipePreparation';

const testID = 'RecipePreparation';

export function recipePreparationMock(props: RecipePreparationProps) {
  const { steps, mode } = props;

  return (
    <View testID={testID}>
      <Text testID={`${testID}::Mode`}>{mode}</Text>
      <Text testID={`${testID}::Steps`}>{JSON.stringify(steps)}</Text>
      {'prefixText' in props && <Text testID={`${testID}::PrefixText`}>{props.prefixText}</Text>}
      {steps.map((step, index) => {
        const [localTitle, setLocalTitle] = useState(step.title);
        const [localDescription, setLocalDescription] = useState(step.description);

        useEffect(() => {
          setLocalTitle(step.title);
          setLocalDescription(step.description);
        }, [step.title, step.description]);

        return (
          <View key={index}>
            {mode === 'readOnly' ? (
              <>
                <Text testID={`${testID}::ReadOnlyStep::${index}::SectionTitle`}>
                  {index + 1}) {step.title}
                </Text>
                <Text testID={`${testID}::ReadOnlyStep::${index}::SectionParagraph`}>
                  {step.description}
                </Text>
              </>
            ) : (
              <>
                <Text testID={`${testID}::EditableStep::${index}::Step`}>Step {index + 1}</Text>
                <Text testID={`${testID}::EditableStep::${index}::Title`}>
                  Title of step {index + 1} :{' '}
                </Text>
                <TextInput
                  testID={`${testID}::EditableStep::${index}::TextInputTitle::CustomTextInput`}
                  value={localTitle}
                  onChangeText={setLocalTitle}
                  onEndEditing={() => {
                    if ('onStepChange' in props && localTitle !== step.title) {
                      props.onStepChange(index, localTitle, step.description);
                    }
                  }}
                />
                <Text testID={`${testID}::EditableStep::${index}::Content`}>
                  Content of step {index + 1} :{' '}
                </Text>
                <TextInput
                  testID={`${testID}::EditableStep::${index}::TextInputContent::CustomTextInput`}
                  value={localDescription}
                  onChangeText={setLocalDescription}
                  onEndEditing={() => {
                    if ('onStepChange' in props && localDescription !== step.description) {
                      props.onStepChange(index, step.title, localDescription);
                    }
                  }}
                />
              </>
            )}
          </View>
        );
      })}
      {'openModal' in props && steps.length === 0 && (
        <>
          <Button
            testID={`${testID}::OpenModal::RoundButton::OnPressFunction`}
            onPress={props.openModal}
            title='Open Modal'
          />
          <Text testID={`${testID}::OpenModal::RoundButton::Icon`}>line-scan</Text>
        </>
      )}
      {'onAddStep' in props && (
        <>
          <Button
            testID={`${testID}::AddButton::RoundButton::OnPressFunction`}
            onPress={props.onAddStep}
            title='Add Step'
          />
          <Text testID={`${testID}::AddButton::RoundButton::Icon`}>
            {mode === 'add' && steps.length === 0 ? 'pencil' : 'plus'}
          </Text>
        </>
      )}
    </View>
  );
}
