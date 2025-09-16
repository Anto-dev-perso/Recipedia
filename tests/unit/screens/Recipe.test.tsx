import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import Recipe, { editRecipeManually, RecipePropType } from '@screens/Recipe';
import { recipesDataset } from '@test-data/recipesDataset';
import RecipeDatabase from '@utils/RecipeDatabase';
import { tagsDataset } from '@test-data/tagsDataset';
import { ingredientsDataset } from '@test-data/ingredientsDataset';
import {
  extractIngredientsNameWithQuantity,
  shoppingListTableElement,
  tagTableElement,
} from '@customTypes/DatabaseElementTypes';
import { StackScreenParamList } from '@customTypes/ScreenTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { GetByQuery, QueryByQuery } from '@testing-library/react-native/build/queries/make-queries';
import { TextMatch, TextMatchOptions } from '@testing-library/react-native/build/matches';
import { CommonQueryOptions } from '@testing-library/react-native/build/queries/options';
import { textSeparator, unitySeparator } from '@styles/typography';
import { defaultValueNumber } from '@utils/Constants';
import { listFilter } from '@customTypes/RecipeFiltersTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('expo-sqlite', () => require('@mocks/deps/expo-sqlite-mock').expoSqliteMock());
jest.mock('@utils/FileGestion', () =>
  require('@mocks/utils/FileGestion-mock.tsx').fileGestionMock()
);
jest.mock('@utils/ImagePicker', () => require('@mocks/utils/ImagePicker-mock').imagePickerMock());
jest.mock('@utils/i18n', () => require('@mocks/utils/i18n-mock').i18nMock());

jest.mock(
  '@components/organisms/RecipeTags',
  () => require('@mocks/components/organisms/RecipeTags-mock').recipeTagsMock
);
jest.mock(
  '@components/organisms/RecipeImage',
  () => require('@mocks/components/organisms/RecipeImage-mock').recipeImageMock
);
jest.mock(
  '@components/organisms/RecipeText',
  () => require('@mocks/components/organisms/RecipeText-mock').recipeTextMock
);
jest.mock(
  '@components/organisms/RecipeNumber',
  () => require('@mocks/components/organisms/RecipeNumber-mock').recipeNumberMock
);
jest.mock(
  '@components/organisms/RecipeTextRender',
  () => require('@mocks/components/organisms/RecipeTextRender-mock').recipeTextRenderMock
);
jest.mock('@components/molecules/NutritionTable', () =>
  require('@mocks/components/molecules/NutritionTable-mock')
);
jest.mock('@components/molecules/NutritionEmptyState', () =>
  require('@mocks/components/molecules/NutritionEmptyState-mock')
);
jest.mock(
  '@components/molecules/BottomTopButton',
  () => require('@mocks/components/molecules/BottomTopButton-mock').bottomTopButtonMock
);

const defaultUri = '';

type GetByIdType = GetByQuery<TextMatch, CommonQueryOptions & TextMatchOptions>;
type QueryByIdType = QueryByQuery<TextMatch, CommonQueryOptions & TextMatchOptions>;

function checkBottomTopButtons(
  prop: RecipePropType,
  getByTestId: GetByIdType,
  queryByTestId: QueryByIdType
) {
  switch (prop.mode) {
    case 'readOnly':
      expect(getByTestId('BackButton::OnPressFunction')).toBeTruthy();
      expect(getByTestId('RecipeDelete::OnPressFunction')).toBeTruthy();
      expect(getByTestId('RecipeEdit::OnPressFunction')).toBeTruthy();
      break;
    case 'edit':
    case 'addManually':
    case 'addFromPic':
      expect(getByTestId('BackButton::OnPressFunction')).toBeTruthy();
      if (queryByTestId) {
        expect(queryByTestId('RecipeDelete::OnPressFunction')).not.toBeTruthy();
        expect(queryByTestId('RecipeEdit::OnPressFunction')).not.toBeTruthy();
      } else {
        expect(false).toBe(true);
      }
      break;
  }
}

function checkImage(prop: RecipePropType, getByTestId: GetByIdType, newValueExpected?: string) {
  expect(getByTestId('RecipeImage::OpenModal').props.children).toBeTruthy();
  switch (prop.mode) {
    case 'readOnly':
      expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual(
        `${prop.recipe.image_Source}`
      );
      expect(getByTestId('RecipeImage::ButtonIcon').props.children).toBeUndefined();
      break;
    case 'edit':
      expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual(prop.recipe.image_Source);
      expect(getByTestId('RecipeImage::ButtonIcon').props.children).toEqual('camera');

      break;
    case 'addManually':
      expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual(newValueExpected);
      expect(getByTestId('RecipeImage::ButtonIcon').props.children).toEqual('camera');
      break;
    case 'addFromPic':
      expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual(prop.imgUri);
      expect(getByTestId('RecipeImage::ButtonIcon').props.children).toEqual('line-scan');
      break;
  }
}

function checkTitle(
  prop: RecipePropType,
  getByTestId: GetByIdType,
  queryByTestId: QueryByIdType,
  newValueExpected?: string
) {
  switch (prop.mode) {
    case 'readOnly':
      expect(getByTestId('RecipeTitle::RootText').props.children).toEqual(prop.recipe.title);
      expect(queryByTestId('RecipeTitle::TextEditable')).toBeNull();
      expect(queryByTestId('RecipeTitle::SetTextToEdit')).toBeNull();
      expect(queryByTestId('RecipeTitle::OpenModal')).toBeNull();
      break;
    case 'edit':
      expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('title:');
      expect(getByTestId('RecipeTitle::TextEditable').props.children).toEqual(prop.recipe.title);
      expect(getByTestId('RecipeTitle::SetTextToEdit').props.children).toBeTruthy();
      expect(queryByTestId('RecipeTitle::OpenModal')).toBeNull();
      break;
    case 'addManually':
      expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('title:');
      expect(getByTestId('RecipeTitle::TextEditable').props.children).toEqual(newValueExpected);
      expect(getByTestId('RecipeTitle::SetTextToEdit').props.children).toBeTruthy();
      expect(queryByTestId('RecipeTitle::OpenModal')).toBeNull();
      break;
    case 'addFromPic':
      expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('title:');
      expect(queryByTestId('RecipeTitle::TextEditable')).toBeNull();
      expect(queryByTestId('RecipeTitle::SetTextToEdit')).toBeNull();
      if (prop.imgUri === defaultUri) {
        expect(getByTestId('RecipeTitle::OpenModal').props.children).toBeTruthy();
      } else {
        expect(queryByTestId('RecipeTitle::OpenModal')).toBeNull();
      }
      break;
  }
}

function checkDescription(
  prop: RecipePropType,
  getByTestId: GetByIdType,
  queryByTestId: QueryByIdType,
  newValueExpected?: string
) {
  switch (prop.mode) {
    case 'readOnly':
      expect(getByTestId('RecipeDescription::RootText').props.children).toEqual(
        prop.recipe.description
      );
      expect(queryByTestId('RecipeDescription::TextEditable')).toBeNull();
      expect(queryByTestId('RecipeDescription::SetTextToEdit')).toBeNull();
      expect(queryByTestId('RecipeDescription::OpenModal')).toBeNull();
      break;
    case 'edit':
      expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('Description:');
      expect(getByTestId('RecipeDescription::TextEditable').props.children).toEqual(
        prop.recipe.description
      );
      expect(getByTestId('RecipeDescription::SetTextToEdit').props.children).toBeTruthy();
      expect(queryByTestId('RecipeDescription::OpenModal')).toBeNull();
      break;
    case 'addManually':
      expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('Description:');
      expect(getByTestId('RecipeDescription::TextEditable').props.children).toEqual(
        newValueExpected
      );
      expect(getByTestId('RecipeDescription::SetTextToEdit').props.children).toBeTruthy();
      expect(queryByTestId('RecipeDescription::OpenModal')).toBeNull();
      break;
    case 'addFromPic':
      expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('Description:');
      expect(queryByTestId('RecipeDescription::TextEditable')).toBeNull();
      expect(queryByTestId('RecipeDescription::SetTextToEdit')).toBeNull();
      if (prop.imgUri === defaultUri) {
        expect(getByTestId('RecipeDescription::OpenModal').props.children).toBeTruthy();
      } else {
        expect(queryByTestId('RecipeDescription::OpenModal')).toBeNull();
      }
      break;
  }
}

function checkTags(
  prop: RecipePropType,
  getByTestId: GetByIdType,
  queryByTestId: QueryByIdType,
  newValueExpected?: Array<tagTableElement>
) {
  switch (prop.mode) {
    case 'readOnly':
      expect(getByTestId('RecipeTags::TagsList').props.children).toEqual(
        JSON.stringify(prop.recipe.tags.map(tag => tag.name))
      );
      expect(queryByTestId('RecipeTags::RandomTags')).toBeNull();
      expect(queryByTestId('RecipeTags::AddNewTag')).toBeNull();
      expect(queryByTestId('RecipeTags::RemoveTag')).toBeNull();
      break;
    case 'edit':
      expect(getByTestId('RecipeTags::TagsList').props.children).toEqual(
        JSON.stringify(prop.recipe.tags.map(tag => tag.name))
      );
      expect(getByTestId('RecipeTags::RandomTags').props.children).not.toEqual(
        recipesDataset[6].tags.map(tag => tag.name)
      );
      expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
      expect(getByTestId('RecipeTags::RemoveTag').props.children).toBeTruthy();
      break;
    case 'addManually':
      expect(getByTestId('RecipeTags::TagsList').props.children).toEqual(
        JSON.stringify(newValueExpected?.map(tag => tag.name))
      );
      expect(getByTestId('RecipeTags::RandomTags').props.children).not.toEqual(
        recipesDataset[6].tags.map(tag => tag.name)
      );
      expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
      expect(getByTestId('RecipeTags::RemoveTag').props.children).toBeTruthy();
      break;
    case 'addFromPic':
      expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('[]');
      expect(
        getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ').length
      ).toEqual(3);
      expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
      expect(getByTestId('RecipeTags::RemoveTag').props.children).toBeTruthy();
      break;
  }
}

function checkIngredients(
  prop: RecipePropType,
  getByTestId: GetByIdType,
  queryByTestId: QueryByIdType
) {
  switch (prop.mode) {
    case 'readOnly':
      expect(getByTestId('RecipeIngredients::Text').props.children).toEqual(
        JSON.stringify(
          prop.recipe.ingredients.map(
            ing => ing.quantity + unitySeparator + ing.unit + textSeparator + ing.name
          )
        )
      );
      expect(getByTestId('RecipeIngredients::Title').props.children).toBeUndefined();
      expect(getByTestId('RecipeIngredients::Render').props.children).toEqual('"ARRAY"');
      expect(getByTestId('RecipeIngredients::WithBorder').props.children).toBeUndefined();
      expect(getByTestId('RecipeIngredients::OnClick')).toBeTruthy();
      expect(getByTestId('RecipeIngredients::OnChangeFunction')).toBeTruthy();

      expect(queryByTestId('RecipeIngredients::PrefixText')).toBeNull();
      expect(queryByTestId('RecipeIngredients::OpenModal')).toBeNull();

      expect(queryByTestId('RecipeIngredients::TextEditable')).toBeNull();
      expect(queryByTestId('RecipeIngredients::RenderType')).toBeNull();
      expect(queryByTestId('RecipeIngredients::TextEdited')).toBeNull();
      expect(queryByTestId('RecipeIngredients::AddNewText')).toBeNull();
      expect(queryByTestId('RecipeIngredients::Column1')).toBeNull();
      expect(queryByTestId('RecipeIngredients::Column2')).toBeNull();
      expect(queryByTestId('RecipeIngredients::Column3')).toBeNull();
      break;
    case 'edit':
      expect(queryByTestId('RecipeIngredients::Text')).toBeNull();
      expect(queryByTestId('RecipeIngredients::Title')).toBeNull();
      expect(queryByTestId('RecipeIngredients::Render')).toBeNull();
      expect(queryByTestId('RecipeIngredients::WithBorder')).toBeNull();
      expect(queryByTestId('RecipeIngredients::OnClick')).toBeNull();
      expect(queryByTestId('RecipeIngredients::OnChangeFunction')).toBeNull();

      expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('ingredients: ');
      expect(queryByTestId('RecipeIngredients::OpenModal')).toBeNull();

      expect(getByTestId('RecipeIngredients::TextEditable').props.children).toEqual(
        JSON.stringify(extractIngredientsNameWithQuantity(prop.recipe.ingredients))
      );
      expect(getByTestId('RecipeIngredients::RenderType').props.children).toEqual('"ARRAY"');
      expect(getByTestId('RecipeIngredients::TextEdited').props.children).toBeTruthy();
      expect(getByTestId('RecipeIngredients::AddNewText').props.children).toBeTruthy();
      expect(getByTestId('RecipeIngredients::Column1').props.children).toEqual('quantity');
      expect(getByTestId('RecipeIngredients::Column2').props.children).toEqual('unit');
      expect(getByTestId('RecipeIngredients::Column3').props.children).toEqual('ingredientName');
      break;
    case 'addManually':
      expect(queryByTestId('RecipeIngredients::Text')).toBeNull();
      expect(queryByTestId('RecipeIngredients::Title')).toBeNull();
      expect(queryByTestId('RecipeIngredients::Render')).toBeNull();
      expect(queryByTestId('RecipeIngredients::WithBorder')).toBeNull();
      expect(queryByTestId('RecipeIngredients::OnClick')).toBeNull();
      expect(queryByTestId('RecipeIngredients::OnChangeFunction')).toBeNull();

      expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('ingredients: ');
      expect(queryByTestId('RecipeIngredients::OpenModal')).toBeNull();

      expect(getByTestId('RecipeIngredients::TextEditable').props.children).toEqual(
        JSON.stringify([])
      );
      expect(getByTestId('RecipeIngredients::RenderType').props.children).toEqual('"ARRAY"');
      expect(getByTestId('RecipeIngredients::TextEdited').props.children).toBeTruthy();
      expect(getByTestId('RecipeIngredients::AddNewText').props.children).toBeTruthy();
      expect(getByTestId('RecipeIngredients::Column1').props.children).toEqual('quantity');
      expect(getByTestId('RecipeIngredients::Column2').props.children).toEqual('unit');
      expect(getByTestId('RecipeIngredients::Column3').props.children).toEqual('ingredientName');
      break;
    case 'addFromPic':
      expect(queryByTestId('RecipeIngredients::Text')).toBeNull();
      expect(queryByTestId('RecipeIngredients::Title')).toBeNull();
      expect(queryByTestId('RecipeIngredients::Render')).toBeNull();
      expect(queryByTestId('RecipeIngredients::WithBorder')).toBeNull();
      expect(queryByTestId('RecipeIngredients::OnClick')).toBeNull();
      expect(queryByTestId('RecipeIngredients::OnChangeFunction')).toBeNull();

      expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('ingredients: ');
      if (prop.imgUri.length === 0) {
        expect(getByTestId('RecipeIngredients::OpenModal').props.children).toBeTruthy();
      } else {
        expect(queryByTestId('RecipeIngredients::OpenModal')).toBeNull();
      }

      expect(queryByTestId('RecipeIngredients::TextEditable')).toBeNull();
      expect(queryByTestId('RecipeIngredients::RenderType')).toBeNull();
      expect(queryByTestId('RecipeIngredients::TextEdited')).toBeNull();
      expect(queryByTestId('RecipeIngredients::AddNewText')).toBeNull();
      expect(queryByTestId('RecipeIngredients::Column1')).toBeNull();
      expect(queryByTestId('RecipeIngredients::Column2')).toBeNull();
      expect(queryByTestId('RecipeIngredients::Column3')).toBeNull();
      break;
  }
}

function checkPersons(
  prop: RecipePropType,
  getByTestId: GetByIdType,
  queryByTestId: QueryByIdType,
  newValueExpected?: number
) {
  switch (prop.mode) {
    case 'readOnly':
      expect(getByTestId('RecipePersons::Text').props.children).toEqual(
        `ingredientReadOnlyBeforePerson${prop.recipe.persons}ingredientReadOnlyAfterPerson`
      );
      expect(queryByTestId('RecipePersons::PrefixText')).toBeNull();
      expect(queryByTestId('RecipePersons::SuffixText')).toBeNull();
      expect(queryByTestId('RecipePersons::TextEditable')).toBeNull();
      expect(queryByTestId('RecipePersons::SetTextToEdit')).toBeNull();
      expect(queryByTestId('RecipePersons::OpenModal')).toBeNull();
      break;
    case 'edit':
      expect(queryByTestId('RecipePersons::Text')).toBeNull();
      expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('personPrefixEdit');
      expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('personSuffixEdit');
      expect(getByTestId('RecipePersons::TextEditable').props.children).toEqual(
        prop.recipe.persons
      );
      expect(getByTestId('RecipePersons::SetTextToEdit').props.children).toBeTruthy();
      expect(queryByTestId('RecipePersons::OpenModal')).toBeNull();
      break;
    case 'addManually':
      expect(queryByTestId('RecipePersons::Text')).toBeNull();
      expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('personPrefixEdit');
      expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('personSuffixEdit');
      expect(getByTestId('RecipePersons::TextEditable').props.children).toEqual(newValueExpected);
      expect(getByTestId('RecipePersons::SetTextToEdit').props.children).toBeTruthy();
      expect(queryByTestId('RecipePersons::OpenModal')).toBeNull();
      break;
    case 'addFromPic':
      expect(queryByTestId('RecipePersons::Text')).toBeNull();
      expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('personPrefixOCR');
      expect(getByTestId('RecipePersons::SuffixText').props.children).toBeUndefined();
      if (prop.imgUri === defaultUri) {
        expect(getByTestId('RecipePersons::OpenModal').props.children).toBeTruthy();
      } else {
        expect(queryByTestId('RecipePersons::OpenModal')).toBeNull();
      }
      break;
  }
}

function checkTime(
  prop: RecipePropType,
  getByTestId: GetByIdType,
  queryByTestId: QueryByIdType,
  newValueExpected?: number
) {
  switch (prop.mode) {
    case 'readOnly':
      expect(getByTestId('RecipeTime::Text').props.children).toEqual(
        `timeReadOnlyBeforePerson${prop.recipe.time}timeReadOnlyAfterPerson`
      );
      expect(queryByTestId('RecipeTime::PrefixText')).toBeNull();
      expect(queryByTestId('RecipeTime::SuffixText')).toBeNull();
      expect(queryByTestId('RecipeTime::TextEditable')).toBeNull();
      expect(queryByTestId('RecipeTime::SetTextToEdit')).toBeNull();
      expect(queryByTestId('RecipeTime::OpenModal')).toBeNull();
      break;
    case 'edit':
      expect(queryByTestId('RecipeTime::Text')).toBeNull();
      expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('timePrefixEdit');
      expect(getByTestId('RecipeTime::SuffixText').props.children).toEqual('min');
      expect(getByTestId('RecipeTime::TextEditable').props.children).toEqual(prop.recipe.time);
      expect(getByTestId('RecipeTime::SetTextToEdit').props.children).toBeTruthy();
      expect(queryByTestId('RecipeTime::OpenModal')).toBeNull();
      break;
    case 'addManually':
      expect(queryByTestId('RecipeTime::Text')).toBeNull();
      expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('timePrefixEdit');
      expect(getByTestId('RecipeTime::SuffixText').props.children).toEqual('min');
      expect(getByTestId('RecipeTime::TextEditable').props.children).toEqual(newValueExpected);
      expect(getByTestId('RecipeTime::SetTextToEdit').props.children).toBeTruthy();
      expect(queryByTestId('RecipeTime::OpenModal')).toBeNull();
      break;
    case 'addFromPic':
      expect(queryByTestId('RecipeTime::Text')).toBeNull();
      if (prop.imgUri === defaultUri) {
        expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('timePrefixOCR');
        expect(getByTestId('RecipeTime::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::OpenModal').props.children).toBeTruthy();
      } else {
        expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('timePrefixEdit ');
        expect(getByTestId('RecipeTime::SuffixText').props.children).toEqual(' min');
        expect(queryByTestId('RecipeTime::OpenModal')).toBeNull();
      }
      break;
  }
}

function checkPreparation(
  prop: RecipePropType,
  getByTestId: GetByIdType,
  queryByTestId: QueryByIdType
) {
  switch (prop.mode) {
    case 'readOnly':
      expect(getByTestId('RecipePreparation::Text').props.children).toEqual(
        JSON.stringify(prop.recipe.preparation)
      );
      expect(getByTestId('RecipePreparation::Title').props.children).toBeUndefined();
      expect(getByTestId('RecipePreparation::Render').props.children).toEqual('"SECTION"');
      expect(getByTestId('RecipePreparation::WithBorder').props.children).toBeUndefined();
      expect(getByTestId('RecipePreparation::OnClick')).toBeTruthy();
      expect(getByTestId('RecipePreparation::OnChangeFunction')).toBeTruthy();

      expect(queryByTestId('RecipePreparation::PrefixText')).toBeNull();
      expect(queryByTestId('RecipePreparation::OpenModal')).toBeNull();

      expect(queryByTestId('RecipePreparation::TextEditable')).toBeNull();
      expect(queryByTestId('RecipePreparation::RenderType')).toBeNull();
      expect(queryByTestId('RecipePreparation::TextEdited')).toBeNull();
      expect(queryByTestId('RecipePreparation::AddNewText')).toBeNull();
      expect(queryByTestId('RecipePreparation::Column1')).toBeNull();
      expect(queryByTestId('RecipePreparation::Column2')).toBeNull();
      expect(queryByTestId('RecipePreparation::Column3')).toBeNull();
      break;
    case 'edit':
      expect(queryByTestId('RecipePreparation::Text')).toBeNull();
      expect(queryByTestId('RecipePreparation::Title')).toBeNull();
      expect(queryByTestId('RecipePreparation::Render')).toBeNull();
      expect(queryByTestId('RecipePreparation::WithBorder')).toBeNull();
      expect(queryByTestId('RecipePreparation::OnClick')).toBeNull();
      expect(queryByTestId('RecipePreparation::OnChangeFunction')).toBeNull();

      expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
      expect(queryByTestId('RecipePreparation::OpenModal')).toBeNull();

      expect(getByTestId('RecipePreparation::TextEditable').props.children).toEqual(
        JSON.stringify(prop.recipe.preparation)
      );
      expect(getByTestId('RecipePreparation::RenderType').props.children).toEqual('"SECTION"');
      expect(getByTestId('RecipePreparation::TextEdited').props.children).toBeTruthy();
      expect(getByTestId('RecipePreparation::AddNewText').props.children).toBeTruthy();
      expect(queryByTestId('RecipePreparation::Column1')).toBeNull();
      expect(queryByTestId('RecipePreparation::Column2')).toBeNull();
      expect(queryByTestId('RecipePreparation::Column3')).toBeNull();
      break;
    case 'addManually':
      expect(queryByTestId('RecipePreparation::Text')).toBeNull();
      expect(queryByTestId('RecipePreparation::Title')).toBeNull();
      expect(queryByTestId('RecipePreparation::Render')).toBeNull();
      expect(queryByTestId('RecipePreparation::WithBorder')).toBeNull();
      expect(queryByTestId('RecipePreparation::OnClick')).toBeNull();
      expect(queryByTestId('RecipePreparation::OnChangeFunction')).toBeNull();

      expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
      expect(queryByTestId('RecipePreparation::OpenModal')).toBeNull();

      expect(getByTestId('RecipePreparation::TextEditable').props.children).toEqual(
        JSON.stringify([])
      );
      expect(getByTestId('RecipePreparation::RenderType').props.children).toEqual('"SECTION"');
      expect(getByTestId('RecipePreparation::TextEdited').props.children).toBeTruthy();
      expect(getByTestId('RecipePreparation::AddNewText').props.children).toBeTruthy();
      expect(queryByTestId('RecipePreparation::Column1')).toBeNull();
      expect(queryByTestId('RecipePreparation::Column2')).toBeNull();
      expect(queryByTestId('RecipePreparation::Column3')).toBeNull();
      break;
    case 'addFromPic':
      expect(queryByTestId('RecipePreparation::Text')).toBeNull();
      expect(queryByTestId('RecipePreparation::Title')).toBeNull();
      expect(queryByTestId('RecipePreparation::Render')).toBeNull();
      expect(queryByTestId('RecipePreparation::WithBorder')).toBeNull();
      expect(queryByTestId('RecipePreparation::OnClick')).toBeNull();
      expect(queryByTestId('RecipePreparation::OnChangeFunction')).toBeNull();

      expect(getByTestId('RecipePreparation::PrefixText').props.children).toEqual(
        'preparationReadOnly'
      );
      if (prop.imgUri.length === 0) {
        expect(getByTestId('RecipePreparation::OpenModal').props.children).toBeTruthy();
      } else {
        expect(queryByTestId('RecipePreparation::OpenModal')).toBeNull();
      }
      expect(queryByTestId('RecipePreparation::RenderType')).toBeNull();
      expect(queryByTestId('RecipePreparation::TextEdited')).toBeNull();
      expect(queryByTestId('RecipePreparation::AddNewText')).toBeNull();
      expect(queryByTestId('RecipePreparation::TextEditable')).toBeNull();
      expect(queryByTestId('RecipePreparation::Column1')).toBeNull();
      expect(queryByTestId('RecipePreparation::Column2')).toBeNull();
      expect(queryByTestId('RecipePreparation::Column3')).toBeNull();
      break;
  }
}

function checkNutrition(
  prop: RecipePropType,
  getByTestId: GetByIdType,
  queryByTestId: QueryByIdType
) {
  const nutritionTestId = 'Recipe::RecipeNutrition';
  const nutritionTableTestId = nutritionTestId + '::NutritionTable';
  const nutritionEmptyStateTestId = nutritionTestId + '::NutritionEmptyState';

  switch (prop.mode) {
    case 'readOnly':
      if (prop.recipe.nutrition) {
        expect(getByTestId(nutritionTableTestId)).toBeTruthy();
        expect(getByTestId(nutritionTableTestId + '::IsEditable').props.children).toEqual(false);
        expect(getByTestId(nutritionTableTestId + '::ShowRemoveButton').props.children).toEqual(
          false
        );
        expect(queryByTestId(nutritionEmptyStateTestId)).toBeNull();
      } else {
        expect(queryByTestId(nutritionTableTestId)).toBeNull();
        expect(queryByTestId(nutritionEmptyStateTestId)).toBeNull();
      }
      break;
    case 'edit':
      if (prop.recipe.nutrition) {
        expect(getByTestId(nutritionTableTestId)).toBeTruthy();
        expect(getByTestId(nutritionTableTestId + '::IsEditable').props.children).toEqual(true);
        expect(getByTestId(nutritionTableTestId + '::ShowRemoveButton').props.children).toEqual(
          true
        );
        expect(queryByTestId(nutritionEmptyStateTestId)).toBeNull();
      } else {
        expect(queryByTestId(nutritionTableTestId)).toBeNull();
        expect(queryByTestId(nutritionEmptyStateTestId)).toBeNull();
      }
      break;
    case 'addManually':
      expect(getByTestId(nutritionEmptyStateTestId)).toBeTruthy();
      expect(getByTestId(nutritionEmptyStateTestId + '::Mode').props.children).toEqual('add');
      expect(queryByTestId(nutritionTableTestId)).toBeNull();
      break;
    case 'addFromPic':
      expect(getByTestId(nutritionEmptyStateTestId)).toBeTruthy();
      expect(getByTestId(nutritionEmptyStateTestId + '::Mode').props.children).toEqual('ocr');
      expect(queryByTestId(nutritionTableTestId)).toBeNull();
      break;
  }
}

describe('Recipe Component tests', () => {
  const mockNavigation = {
    goBack: jest.fn(),
    navigate: jest.fn(),
    setOptions: jest.fn(),
    dispatch: jest.fn(),
    canGoBack: jest.fn(),
    getId: jest.fn(),
    getParent: jest.fn(),
    isFocused: jest.fn(),
    reset: jest.fn(),
    setParams: jest.fn(),
    replace: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    popToTop: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    getState: jest.fn(),
  } as NativeStackNavigationProp<StackScreenParamList, 'Recipe'>;
  const mockRouteReadOnly: RecipePropType = {
    mode: 'readOnly',
    recipe: recipesDataset[1],
  };

  const mockRouteEdit: RecipePropType = {
    mode: 'edit',
    recipe: { ...recipesDataset[6] } as const,
  } as const;

  const mockRouteAddOCR: RecipePropType = { mode: 'addFromPic', imgUri: defaultUri };
  const mockRouteAddManually: RecipePropType = { mode: 'addManually' };

  const createMockRoute = (params: RecipePropType): RouteProp<StackScreenParamList, 'Recipe'> => ({
    key: 'Recipe-test',
    name: 'Recipe',
    params,
  });

  const dbInstance = RecipeDatabase.getInstance();
  beforeEach(async () => {
    jest.clearAllMocks();

    await dbInstance.init();
    await dbInstance.addMultipleIngredients(ingredientsDataset);
    await dbInstance.addMultipleTags(tagsDataset);
    await dbInstance.addMultipleRecipes(recipesDataset);

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('4');
  });
  afterEach(async () => {
    await dbInstance.reset();
    mockRouteEdit.recipe = { ...recipesDataset[6] };
  });

  // -------- INIT CASES --------
  test('Initial state is correctly set in readOnly mode', () => {
    const { getByTestId, queryByTestId } = render(
      <Recipe route={createMockRoute(mockRouteReadOnly)} navigation={mockNavigation} />
    );

    checkBottomTopButtons(mockRouteReadOnly, getByTestId, queryByTestId);

    checkImage(mockRouteReadOnly, getByTestId);
    checkTitle(mockRouteReadOnly, getByTestId, queryByTestId);
    checkDescription(mockRouteReadOnly, getByTestId, queryByTestId);
    checkTags(mockRouteReadOnly, getByTestId, queryByTestId);
    checkIngredients(mockRouteReadOnly, getByTestId, queryByTestId);
    checkPersons(mockRouteReadOnly, getByTestId, queryByTestId);
    checkTime(mockRouteReadOnly, getByTestId, queryByTestId);
    checkPreparation(mockRouteReadOnly, getByTestId, queryByTestId);
    checkNutrition(mockRouteReadOnly, getByTestId, queryByTestId);
  });

  test('Initial state is correctly set in edit mode', () => {
    const { getByTestId, queryByTestId } = render(
      <Recipe route={createMockRoute(mockRouteEdit)} navigation={mockNavigation} />
    );

    checkBottomTopButtons(mockRouteEdit, getByTestId, queryByTestId);

    checkImage(mockRouteEdit, getByTestId);
    checkTitle(mockRouteEdit, getByTestId, queryByTestId);
    checkDescription(mockRouteEdit, getByTestId, queryByTestId);
    checkTags(mockRouteEdit, getByTestId, queryByTestId, []);
    checkIngredients(mockRouteEdit, getByTestId, queryByTestId);
    checkPersons(mockRouteEdit, getByTestId, queryByTestId);
    checkTime(mockRouteEdit, getByTestId, queryByTestId);
    checkPreparation(mockRouteEdit, getByTestId, queryByTestId);
    checkNutrition(mockRouteEdit, getByTestId, queryByTestId);
  });

  test('Initial state is correctly set in add manually mode', () => {
    const { getByTestId, queryByTestId } = render(
      <Recipe route={createMockRoute(mockRouteAddManually)} navigation={mockNavigation} />
    );

    checkBottomTopButtons(mockRouteAddManually, getByTestId, queryByTestId);

    checkImage(mockRouteAddManually, getByTestId, '');
    checkTitle(mockRouteAddManually, getByTestId, queryByTestId, '');
    checkDescription(mockRouteAddManually, getByTestId, queryByTestId, '');
    checkTags(mockRouteAddManually, getByTestId, queryByTestId, []);
    checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
    checkPersons(mockRouteAddManually, getByTestId, queryByTestId, defaultValueNumber);
    checkTime(mockRouteAddManually, getByTestId, queryByTestId, defaultValueNumber);
    checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
    checkNutrition(mockRouteAddManually, getByTestId, queryByTestId);
  });

  test('Initial state is correctly set in add ocr mode', () => {
    const { getByTestId, queryByTestId } = render(
      <Recipe route={createMockRoute(mockRouteAddOCR)} navigation={mockNavigation} />
    );

    checkBottomTopButtons(mockRouteAddOCR, getByTestId, queryByTestId);

    checkImage(mockRouteAddOCR, getByTestId);
    checkTitle(mockRouteAddOCR, getByTestId, queryByTestId);
    checkDescription(mockRouteAddOCR, getByTestId, queryByTestId);
    checkTags(mockRouteAddOCR, getByTestId, queryByTestId);
    checkIngredients(mockRouteAddOCR, getByTestId, queryByTestId);
    checkPersons(mockRouteAddOCR, getByTestId, queryByTestId);
    checkTime(mockRouteAddOCR, getByTestId, queryByTestId);
    checkPreparation(mockRouteAddOCR, getByTestId, queryByTestId);
    checkNutrition(mockRouteAddOCR, getByTestId, queryByTestId);
  });

  // -------- CHANGE ON TITLE CASES --------
  test('updates recipeTitle and reflects in RecipeText only', () => {
    const { getByTestId, queryByTestId } = render(
      <Recipe route={createMockRoute(mockRouteEdit)} navigation={mockNavigation} />
    );

    const newTitle = 'New Recipe Title';
    fireEvent.press(getByTestId('RecipeTitle::SetTextToEdit'), newTitle);
    const newEditProp: editRecipeManually = { ...mockRouteEdit };
    newEditProp.recipe.title = newTitle;

    checkImage(newEditProp, getByTestId);
    checkTitle(newEditProp, getByTestId, queryByTestId);
    checkDescription(newEditProp, getByTestId, queryByTestId);
    checkTags(newEditProp, getByTestId, queryByTestId);
    checkIngredients(newEditProp, getByTestId, queryByTestId);
    checkPersons(newEditProp, getByTestId, queryByTestId);
    checkTime(newEditProp, getByTestId, queryByTestId);
    checkPreparation(newEditProp, getByTestId, queryByTestId);
  });

  test('fill recipeTitle and reflects in RecipeText only', () => {
    const { getByTestId, queryByTestId } = render(
      <Recipe route={createMockRoute(mockRouteAddManually)} navigation={mockNavigation} />
    );

    const newTitle = 'New Recipe Title';
    fireEvent.press(getByTestId('RecipeTitle::SetTextToEdit'), newTitle);

    checkImage(mockRouteAddManually, getByTestId, '');
    checkTitle(mockRouteAddManually, getByTestId, queryByTestId, newTitle);
    checkDescription(mockRouteAddManually, getByTestId, queryByTestId, '');
    checkTags(mockRouteAddManually, getByTestId, queryByTestId, []);
    checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
    checkPersons(mockRouteAddManually, getByTestId, queryByTestId, defaultValueNumber);
    checkTime(mockRouteAddManually, getByTestId, queryByTestId, defaultValueNumber);
    checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
  });

  // -------- CHANGE ON DESCRIPTION CASES --------
  test('updates recipeDescription and reflects in RecipeDescription only', () => {
    const { getByTestId, queryByTestId } = render(
      <Recipe route={createMockRoute(mockRouteEdit)} navigation={mockNavigation} />
    );

    const newDescription = 'New Recipe Description';
    fireEvent.press(getByTestId('RecipeDescription::SetTextToEdit'), newDescription);
    const newEditProp: editRecipeManually = { ...mockRouteEdit };
    newEditProp.recipe.description = newDescription;

    checkImage(newEditProp, getByTestId);
    checkTitle(newEditProp, getByTestId, queryByTestId);
    checkDescription(newEditProp, getByTestId, queryByTestId);
    checkTags(newEditProp, getByTestId, queryByTestId);
    checkIngredients(newEditProp, getByTestId, queryByTestId);
    checkPersons(newEditProp, getByTestId, queryByTestId);
    checkTime(newEditProp, getByTestId, queryByTestId);
    checkPreparation(newEditProp, getByTestId, queryByTestId);
  });

  test('fill recipeDescription and reflects in RecipeText only', () => {
    const { getByTestId, queryByTestId } = render(
      <Recipe route={createMockRoute(mockRouteAddManually)} navigation={mockNavigation} />
    );

    const newDescription = 'New Recipe Description';
    fireEvent.press(getByTestId('RecipeDescription::SetTextToEdit'), newDescription);

    checkImage(mockRouteAddManually, getByTestId, '');
    checkTitle(mockRouteAddManually, getByTestId, queryByTestId, '');
    checkDescription(mockRouteAddManually, getByTestId, queryByTestId, newDescription);
    checkTags(mockRouteAddManually, getByTestId, queryByTestId, []);
    checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
    checkPersons(mockRouteAddManually, getByTestId, queryByTestId, defaultValueNumber);
    checkTime(mockRouteAddManually, getByTestId, queryByTestId, defaultValueNumber);
    checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
  });

  // -------- CHANGE ON TAGS CASES --------
  test('remove recipeTags and reflects in RecipeTags only', () => {
    const { getByTestId, queryByTestId } = render(
      <Recipe route={createMockRoute(mockRouteEdit)} navigation={mockNavigation} />
    );

    fireEvent.press(getByTestId('RecipeTags::RemoveTag'));
    const newEditProp: editRecipeManually = {
      mode: mockRouteEdit.mode,
      recipe: {
        ...mockRouteEdit.recipe,
        tags: mockRouteEdit.recipe.tags.map(tag => ({ ...tag })),
      },
    };
    newEditProp.recipe.tags.splice(0, 1);

    checkImage(newEditProp, getByTestId);
    checkTitle(newEditProp, getByTestId, queryByTestId);
    checkDescription(newEditProp, getByTestId, queryByTestId);
    checkTags(newEditProp, getByTestId, queryByTestId);
    checkIngredients(newEditProp, getByTestId, queryByTestId);
    checkPersons(newEditProp, getByTestId, queryByTestId);
    checkTime(newEditProp, getByTestId, queryByTestId);
    checkPreparation(newEditProp, getByTestId, queryByTestId);
  });

  // -------- CHANGE ON PERSONS CASES --------
  test('updates recipePersons and scales ingredients accordingly', () => {
    const { getByTestId, queryByTestId } = render(
      <Recipe route={createMockRoute(mockRouteEdit)} navigation={mockNavigation} />
    );

    const newPerson = '23';
    fireEvent.press(getByTestId('RecipePersons::SetTextToEdit'), newPerson);
    const newEditProp: editRecipeManually = { ...mockRouteEdit };
    newEditProp.recipe.persons = Number(newPerson);

    // Scale ingredients from 6 persons to 23 persons using the same logic as scaleQuantityForPersons
    newEditProp.recipe.ingredients = newEditProp.recipe.ingredients.map(ingredient => ({
      ...ingredient,
      quantity: ingredient.quantity
        ? (() => {
            const scaledValue = (parseFloat(ingredient.quantity) * 23) / 6;
            const rounded = Math.round(scaledValue * 100) / 100;
            return rounded.toString().replace('.', ',');
          })()
        : ingredient.quantity,
    }));

    checkImage(newEditProp, getByTestId);
    checkTitle(newEditProp, getByTestId, queryByTestId);
    checkDescription(newEditProp, getByTestId, queryByTestId);
    checkTags(newEditProp, getByTestId, queryByTestId);
    checkIngredients(newEditProp, getByTestId, queryByTestId);
    checkPersons(newEditProp, getByTestId, queryByTestId);
    checkTime(newEditProp, getByTestId, queryByTestId);
    checkPreparation(newEditProp, getByTestId, queryByTestId);
  });

  test('fill recipePersons and reflects in RecipeText only', () => {
    const { getByTestId, queryByTestId } = render(
      <Recipe route={createMockRoute(mockRouteAddManually)} navigation={mockNavigation} />
    );

    const newPerson = 23;
    fireEvent.press(getByTestId('RecipePersons::SetTextToEdit'), newPerson.toString());

    checkImage(mockRouteAddManually, getByTestId, '');
    checkTitle(mockRouteAddManually, getByTestId, queryByTestId, '');
    checkDescription(mockRouteAddManually, getByTestId, queryByTestId, '');
    checkTags(mockRouteAddManually, getByTestId, queryByTestId, []);
    checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
    checkPersons(mockRouteAddManually, getByTestId, queryByTestId, newPerson);
    checkTime(mockRouteAddManually, getByTestId, queryByTestId, defaultValueNumber);
    checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
  });

  // -------- CHANGE ON INGREDIENTS CASES --------
  test('updates recipeIngredients and reflects in RecipeIngredients only', () => {
    const { getByTestId, queryByTestId } = render(
      <Recipe route={createMockRoute(mockRouteEdit)} navigation={mockNavigation} />
    );

    fireEvent.press(getByTestId('RecipeIngredients::TextEdited'));
    const newEditProp: editRecipeManually = { ...mockRouteEdit };
    // Mock changes Flour to Milk (existing ingredient to avoid validation dialog)
    newEditProp.recipe.ingredients[0].name = 'Milk';
    newEditProp.recipe.ingredients[0].unit = 'ml'; // Milk has unit 'ml' in database

    checkImage(newEditProp, getByTestId);
    checkTitle(newEditProp, getByTestId, queryByTestId);
    checkDescription(newEditProp, getByTestId, queryByTestId);
    checkTags(newEditProp, getByTestId, queryByTestId);
    checkIngredients(newEditProp, getByTestId, queryByTestId);
    checkPersons(newEditProp, getByTestId, queryByTestId);
    checkTime(newEditProp, getByTestId, queryByTestId);
    checkPreparation(newEditProp, getByTestId, queryByTestId);
  });

  // -------- CHANGE ON TIME CASES --------
  test('updates recipeTime and reflects in RecipeTime only', () => {
    const { getByTestId, queryByTestId } = render(
      <Recipe route={createMockRoute(mockRouteEdit)} navigation={mockNavigation} />
    );

    const newTime = '71';
    fireEvent.press(getByTestId('RecipeTime::SetTextToEdit'), newTime);
    const newEditProp: editRecipeManually = { ...mockRouteEdit };
    newEditProp.recipe.time = Number(newTime);

    checkImage(newEditProp, getByTestId);
    checkTitle(newEditProp, getByTestId, queryByTestId);
    checkDescription(newEditProp, getByTestId, queryByTestId);
    checkTags(newEditProp, getByTestId, queryByTestId);
    checkIngredients(newEditProp, getByTestId, queryByTestId);
    checkPersons(newEditProp, getByTestId, queryByTestId);
    checkTime(newEditProp, getByTestId, queryByTestId);
    checkPreparation(newEditProp, getByTestId, queryByTestId);
  });

  test('fill recipeTime and reflects in RecipeText only', () => {
    const { getByTestId, queryByTestId } = render(
      <Recipe route={createMockRoute(mockRouteAddManually)} navigation={mockNavigation} />
    );

    const newTime = 71;
    fireEvent.press(getByTestId('RecipeTime::SetTextToEdit'), newTime.toString());

    checkImage(mockRouteAddManually, getByTestId, '');
    checkTitle(mockRouteAddManually, getByTestId, queryByTestId, '');
    checkDescription(mockRouteAddManually, getByTestId, queryByTestId, '');
    checkTags(mockRouteAddManually, getByTestId, queryByTestId, []);
    checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
    checkPersons(mockRouteAddManually, getByTestId, queryByTestId, defaultValueNumber);
    checkTime(mockRouteAddManually, getByTestId, queryByTestId, newTime);
    checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
  });

  // -------- CHANGE ON PREPARATION CASES --------
  test('updates recipePreparation and reflects in RecipePreparation only', () => {
    const { getByTestId, queryByTestId } = render(
      <Recipe route={createMockRoute(mockRouteEdit)} navigation={mockNavigation} />
    );

    fireEvent.press(getByTestId('RecipePreparation::TextEdited'));
    const newEditProp: editRecipeManually = {
      ...mockRouteEdit,
      recipe: {
        ...mockRouteEdit.recipe,
        preparation: [...mockRouteEdit.recipe.preparation],
      },
    };
    newEditProp.recipe.preparation[0].description += '.New part of a paragraph';

    checkImage(newEditProp, getByTestId);
    checkTitle(newEditProp, getByTestId, queryByTestId);
    checkDescription(newEditProp, getByTestId, queryByTestId);
    checkTags(newEditProp, getByTestId, queryByTestId);
    checkIngredients(newEditProp, getByTestId, queryByTestId);
    checkPersons(newEditProp, getByTestId, queryByTestId);
    checkTime(newEditProp, getByTestId, queryByTestId);
    checkPreparation(newEditProp, getByTestId, queryByTestId);
  });

  test('validates button on read only mode', async () => {
    const { getByTestId } = render(
      <Recipe route={createMockRoute(mockRouteReadOnly)} navigation={mockNavigation} />
    );

    expect(RecipeDatabase.getInstance().get_shopping()).toEqual([]);

    fireEvent.press(getByTestId('RecipeValidate::OnPressFunction'));

    // Wait for shopping list to be populated (validation dialog is shown but navigation doesn't happen immediately)
    await waitFor(() => {
      expect(RecipeDatabase.getInstance().get_shopping()).toHaveLength(4);
    });
    expect(RecipeDatabase.getInstance().get_shopping()).toEqual(
      new Array<Array<shoppingListTableElement>>(
        {
          //@ts-ignore id is always set at this point
          id: 1,
          name: 'Taco Shells',
          purchased: false,
          quantity: '6',
          recipesTitle: ['Chicken Tacos'],
          type: listFilter.grainOrCereal,
          unit: 'pieces',
        },
        {
          id: 2,
          name: 'Chicken Breast',
          purchased: false,
          quantity: '300',
          recipesTitle: ['Chicken Tacos'],
          type: listFilter.poultry,
          unit: 'g',
        },
        {
          id: 3,
          name: 'Lettuce',
          purchased: false,
          quantity: '50',
          recipesTitle: ['Chicken Tacos'],
          type: listFilter.vegetable,
          unit: 'g',
        },
        {
          id: 4,
          name: 'Cheddar',
          purchased: false,
          quantity: '50',
          recipesTitle: ['Chicken Tacos'],
          type: listFilter.cheese,
          unit: 'g',
        }
      )
    );
  });

  test('validates button on edit mode', async () => {
    const { getByTestId, queryByTestId } = render(
      <Recipe route={createMockRoute(mockRouteEdit)} navigation={mockNavigation} />
    );

    const newProp: RecipePropType = {
      mode: 'readOnly',
      recipe: {
        image_Source: mockRouteEdit.recipe.image_Source,
        title: 'New Recipe Title',
        description: 'New Recipe Description',
        tags: new Array(mockRouteEdit.recipe.tags[1]),
        persons: 23,
        ingredients: mockRouteEdit.recipe.ingredients.map(ingredient => ({ ...ingredient })),
        time: 71,
        preparation: [...mockRouteEdit.recipe.preparation],
        season: ['*'],
      },
    };
    // Mock changes Flour to Milk (existing ingredient), and person scaling affects ALL quantities
    newProp.recipe.ingredients[0].name = 'Milk';
    newProp.recipe.ingredients[0].unit = 'ml'; // Milk has unit ml in database

    // Scale all ingredients from 6 to 23 persons (multiplier = 23/6)
    newProp.recipe.ingredients = newProp.recipe.ingredients.map((ingredient, index) => ({
      ...ingredient,
      quantity:
        index === 0
          ? '766,67' // First ingredient: 200 * (23/6) = 766.67
          : (() => {
              const originalQty = parseFloat(ingredient.quantity as string);
              const scaledQty = Math.round(((originalQty * 23) / 6) * 100) / 100;
              return scaledQty.toString().replace('.', ',');
            })(),
    }));

    const updatePreparationWith = '.New part of a paragraph';

    fireEvent.press(getByTestId('RecipeTitle::SetTextToEdit'), newProp.recipe.title);
    fireEvent.press(getByTestId('RecipeDescription::SetTextToEdit'), newProp.recipe.description);
    fireEvent.press(getByTestId('RecipeTags::RemoveTag'));
    fireEvent.press(getByTestId('RecipePersons::SetTextToEdit'), newProp.recipe.persons);
    fireEvent.press(getByTestId('RecipeIngredients::TextEdited'));
    fireEvent.press(getByTestId('RecipeTime::SetTextToEdit'), newProp.recipe.time);
    fireEvent.press(getByTestId('RecipePreparation::TextEdited'), updatePreparationWith);
    newProp.recipe.preparation[0].description += updatePreparationWith;

    fireEvent.press(getByTestId('RecipeValidate::OnPressFunction'));

    await waitFor(() => {
      checkTitle(newProp, getByTestId, queryByTestId);
    });
    checkImage(newProp, getByTestId);
    checkDescription(newProp, getByTestId, queryByTestId);
    checkTags(newProp, getByTestId, queryByTestId);
    checkIngredients(newProp, getByTestId, queryByTestId);
    checkPersons(newProp, getByTestId, queryByTestId);
    checkTime(newProp, getByTestId, queryByTestId);
    checkPreparation(newProp, getByTestId, queryByTestId);
  });
  //TODO change expected results when recipe edition will be implemented
  // TODO  a validation that new recipe is well inserted in the database

  test('validates button on add manually mode', () => {
    const { getByTestId, queryByTestId } = render(
      <Recipe route={createMockRoute(mockRouteAddManually)} navigation={mockNavigation} />
    );

    const newTitle = 'New Recipe Title';
    const newDescription = 'New Recipe Description';
    const newPersons = 23;
    const newTime = 71;

    fireEvent.press(getByTestId('RecipeTitle::SetTextToEdit'), newTitle);
    fireEvent.press(getByTestId('RecipeDescription::SetTextToEdit'), newDescription);
    fireEvent.press(getByTestId('RecipePersons::SetTextToEdit'), newPersons.toString());
    fireEvent.press(getByTestId('RecipeTime::SetTextToEdit'), newTime.toString());
    // TODO missing ingredients, preparation and tags

    fireEvent.press(getByTestId('RecipeValidate::OnPressFunction'));

    checkImage(mockRouteAddManually, getByTestId, '');
    checkTitle(mockRouteAddManually, getByTestId, queryByTestId, newTitle);
    checkDescription(mockRouteAddManually, getByTestId, queryByTestId, newDescription);
    checkTags(mockRouteAddManually, getByTestId, queryByTestId, []);
    checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
    checkPersons(mockRouteAddManually, getByTestId, queryByTestId, newPersons);
    checkTime(mockRouteAddManually, getByTestId, queryByTestId, newTime);
    checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
  });

  test('shows validation error if recipe is incomplete', () => {
    const { getByTestId } = render(
      <Recipe route={createMockRoute(mockRouteAddOCR)} navigation={mockNavigation} />
    );

    fireEvent.press(getByTestId('RecipeValidate::OnPressFunction'));
    // TODO what to expect here ?
  });

  test('toggles stackMode between readOnly and edit', () => {
    const { getByTestId, queryByTestId } = render(
      <Recipe route={createMockRoute(mockRouteReadOnly)} navigation={mockNavigation} />
    );
    const paramEdit: editRecipeManually = { ...mockRouteReadOnly, mode: 'edit' };
    fireEvent.press(getByTestId('RecipeEdit::OnPressFunction'));

    checkBottomTopButtons(paramEdit, getByTestId, queryByTestId);

    checkImage(paramEdit, getByTestId);
    checkTitle(paramEdit, getByTestId, queryByTestId);
    checkDescription(paramEdit, getByTestId, queryByTestId);
    checkTags(paramEdit, getByTestId, queryByTestId);
    checkIngredients(paramEdit, getByTestId, queryByTestId);
    checkPersons(paramEdit, getByTestId, queryByTestId);
    checkTime(paramEdit, getByTestId, queryByTestId);
    checkPreparation(paramEdit, getByTestId, queryByTestId);
    checkNutrition(paramEdit, getByTestId, queryByTestId);
  });

  // -------- NUTRITION OCR TESTS --------
  test('shows OCR nutrition empty state in addOCR mode', () => {
    const { getByTestId, queryByTestId } = render(
      <Recipe route={createMockRoute(mockRouteAddOCR)} navigation={mockNavigation} />
    );

    checkNutrition(mockRouteAddOCR, getByTestId, queryByTestId);
  });

  test('shows manual nutrition empty state in addManual mode', () => {
    const { getByTestId, queryByTestId } = render(
      <Recipe route={createMockRoute(mockRouteAddManually)} navigation={mockNavigation} />
    );

    checkNutrition(mockRouteAddManually, getByTestId, queryByTestId);
  });

  // TODO add delete test
});
