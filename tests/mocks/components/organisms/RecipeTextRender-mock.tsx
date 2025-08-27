import React from 'react';
import { Button, Text, View } from 'react-native';
import { RecipeTextRenderProps } from '@components/organisms/RecipeTextRender';
import { textSeparator } from '@styles/typography';

export function recipeTextRenderMock(recipeTextRenderProp: RecipeTextRenderProps) {
  return (
    <View>
      {recipeTextRenderProp.type === 'addOrEdit' ? (
        <View>
          <Text testID={recipeTextRenderProp.testID + '::PrefixText'}>
            {recipeTextRenderProp.prefixText}
          </Text>
          {recipeTextRenderProp.editType === 'add' ? (
            <View>
              <Button
                testID={recipeTextRenderProp.testID + '::OpenModal'}
                onPress={() => {
                  // @ts-ignore always edit here
                  recipeTextRenderProp.openModal();
                }}
                title='Set Text to Edit'
              />
            </View>
          ) : (
            <View>
              <Text testID={recipeTextRenderProp.testID + '::TextEditable'}>
                {JSON.stringify(recipeTextRenderProp.textEditable)}
              </Text>
              <Text testID={recipeTextRenderProp.testID + '::RenderType'}>
                {JSON.stringify(recipeTextRenderProp.renderType)}
              </Text>
              <Button
                testID={recipeTextRenderProp.testID + '::TextEdited'}
                onPress={() => {
                  // For ingredients: change Flour to Milk
                  if (recipeTextRenderProp.testID.includes('Ingredients')) {
                    const currentText = recipeTextRenderProp.textEditable[0] as string;
                    const newText = currentText.replace('Flour', 'Milk').replace('g', 'ml');
                    recipeTextRenderProp.textEdited(0, newText);
                  }
                  // For preparation: append test text
                  else if (recipeTextRenderProp.testID.includes('Preparation')) {
                    const currentItem = recipeTextRenderProp.textEditable[0];
                    if (typeof currentItem === 'string') {
                      const newText = currentItem + '.New part of a paragraph';
                      recipeTextRenderProp.textEdited(0, newText);
                    } else {
                      // preparationStepElement: use new callbacks if available, otherwise fallback to legacy
                      if (recipeTextRenderProp.onDescriptionEdit) {
                        recipeTextRenderProp.onDescriptionEdit(
                          0,
                          currentItem.description + '.New part of a paragraph'
                        );
                      } else {
                        // Legacy fallback: edit using textSeparator format
                        const newText = `${currentItem.title}${textSeparator}${currentItem.description}.New part of a paragraph`;
                        recipeTextRenderProp.textEdited(0, newText);
                      }
                    }
                  }
                  // For other cases: append generic text
                  else {
                    const currentText = recipeTextRenderProp.textEditable[0] as string;
                    recipeTextRenderProp.textEdited(0, currentText + '.edited');
                  }
                }}
                title='Set Text to Edit'
              />
              <Button
                testID={recipeTextRenderProp.testID + '::AddNewText'}
                onPress={() => recipeTextRenderProp.addNewText()}
                title='Add new text'
              />
              {recipeTextRenderProp.columnTitles ? (
                <View>
                  <Text testID={recipeTextRenderProp.testID + '::Column1'}>
                    {recipeTextRenderProp.columnTitles.column1}
                  </Text>
                  <Text testID={recipeTextRenderProp.testID + '::Column2'}>
                    {recipeTextRenderProp.columnTitles.column2}
                  </Text>
                  <Text testID={recipeTextRenderProp.testID + '::Column3'}>
                    {recipeTextRenderProp.columnTitles.column3}
                  </Text>
                </View>
              ) : null}
            </View>
          )}
        </View>
      ) : (
        <View>
          <Text testID={recipeTextRenderProp.testID + '::Text'}>
            {JSON.stringify(recipeTextRenderProp.text)}
          </Text>
          <Text testID={recipeTextRenderProp.testID + '::Title'}>{recipeTextRenderProp.title}</Text>
          <Text testID={recipeTextRenderProp.testID + '::Render'}>
            {JSON.stringify(recipeTextRenderProp.render)}
          </Text>
          <Text testID={recipeTextRenderProp.testID + '::WithBorder'}>
            {recipeTextRenderProp.editText?.withBorder}
          </Text>
          <Button
            testID={recipeTextRenderProp.testID + '::OnClick'}
            onPress={() => {
              // @ts-ignore onClick always define here
              recipeTextRenderProp.onClick();
            }}
            title='On Click'
          />
          <Button
            testID={recipeTextRenderProp.testID + '::OnChangeFunction'}
            onPress={() => {
              // @ts-ignore onCLick always define here
              recipeTextRenderProp.editText.onChangeFunction(
                0,
                recipeTextRenderProp.text[0] + ' edited'
              );
            }}
            title='Edit Text'
          />
        </View>
      )}
    </View>
  );
}
