import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import Recipe, { editRecipeManually, RecipePropType } from '@screens/Recipe';
import { testRecipes } from '@test-data/recipesDataset';
import RecipeDatabase from '@utils/RecipeDatabase';
import { testTags } from '@test-data/tagsDataset';
import { testIngredients } from '@test-data/ingredientsDataset';
import { RecipeDatabaseProvider } from '@context/RecipeDatabaseContext';
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
jest.mock(
  '@components/dialogs/Alert',
  () => require('@mocks/components/dialogs/Alert-mock').alertMock
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
      expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('description:');
      expect(getByTestId('RecipeDescription::TextEditable').props.children).toEqual(
        prop.recipe.description
      );
      expect(getByTestId('RecipeDescription::SetTextToEdit').props.children).toBeTruthy();
      expect(queryByTestId('RecipeDescription::OpenModal')).toBeNull();
      break;
    case 'addManually':
      expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('description:');
      expect(getByTestId('RecipeDescription::TextEditable').props.children).toEqual(
        newValueExpected
      );
      expect(getByTestId('RecipeDescription::SetTextToEdit').props.children).toBeTruthy();
      expect(queryByTestId('RecipeDescription::OpenModal')).toBeNull();
      break;
    case 'addFromPic':
      expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('description:');
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
        testRecipes[6].tags.map(tag => tag.name)
      );
      expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
      expect(getByTestId('RecipeTags::RemoveTag').props.children).toBeTruthy();
      break;
    case 'addManually':
      expect(getByTestId('RecipeTags::TagsList').props.children).toEqual(
        JSON.stringify(newValueExpected?.map(tag => tag.name))
      );
      expect(getByTestId('RecipeTags::RandomTags').props.children).not.toEqual(
        testRecipes[6].tags.map(tag => tag.name)
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
      // When default persons is loaded (4), it falls through to edit mode
      // Only shows OCR mode when recipePersons === defaultValueNumber (-1)
      if (newValueExpected === defaultValueNumber) {
        expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('personPrefixOCR');
        expect(getByTestId('RecipePersons::SuffixText').props.children).toBeUndefined();
        if (prop.imgUri === defaultUri) {
          expect(getByTestId('RecipePersons::OpenModal').props.children).toBeTruthy();
        } else {
          expect(queryByTestId('RecipePersons::OpenModal')).toBeNull();
        }
      } else {
        // Falls through to edit mode when default persons is loaded
        expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('personPrefixEdit');
        expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('personSuffixEdit');
        expect(getByTestId('RecipePersons::TextEditable').props.children).toEqual(newValueExpected);
        expect(getByTestId('RecipePersons::SetTextToEdit').props.children).toBeTruthy();
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
    recipe: testRecipes[1],
  };

  const mockRouteEdit: RecipePropType = {
    mode: 'edit',
    recipe: { ...testRecipes[6] } as const,
  } as const;

  const mockRouteAddOCR: RecipePropType = { mode: 'addFromPic', imgUri: defaultUri };
  const mockRouteAddManually: RecipePropType = { mode: 'addManually' };

  const createMockRoute = (params: RecipePropType): RouteProp<StackScreenParamList, 'Recipe'> => ({
    key: 'Recipe-test',
    name: 'Recipe',
    params,
  });

  const renderRecipe = async (route: RouteProp<StackScreenParamList, 'Recipe'>) => {
    const result = render(
      <RecipeDatabaseProvider>
        <Recipe route={route} navigation={mockNavigation} />
      </RecipeDatabaseProvider>
    );

    await waitFor(() => {
      expect(result.getByTestId('BackButton::OnPressFunction')).toBeTruthy();
      if (route.params.mode === 'addManually') {
        const personsValue = result.queryByTestId('RecipePersons::TextEditable')?.props.children;
        if (personsValue !== undefined) {
          expect(personsValue).toEqual(4);
        }
      }
    });

    return result;
  };

  const dbInstance = RecipeDatabase.getInstance();
  beforeEach(async () => {
    jest.clearAllMocks();

    await dbInstance.init();
    await dbInstance.addMultipleIngredients(testIngredients);
    await dbInstance.addMultipleTags(testTags);
    await dbInstance.addMultipleRecipes(testRecipes);

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('4');
  });
  afterEach(async () => {
    await dbInstance.reset();
    mockRouteEdit.recipe = { ...testRecipes[6] };
  });

  // -------- INIT CASES --------
  test('Initial state is correctly set in readOnly mode', async () => {
    const { getByTestId, queryByTestId } = await renderRecipe(createMockRoute(mockRouteReadOnly));

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

  test('Initial state is correctly set in edit mode', async () => {
    const { getByTestId, queryByTestId } = await renderRecipe(createMockRoute(mockRouteEdit));

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

  test('Initial state is correctly set in add manually mode', async () => {
    const { getByTestId, queryByTestId } = await renderRecipe(
      createMockRoute(mockRouteAddManually)
    );

    checkBottomTopButtons(mockRouteAddManually, getByTestId, queryByTestId);

    checkImage(mockRouteAddManually, getByTestId, '');
    checkTitle(mockRouteAddManually, getByTestId, queryByTestId, '');
    checkDescription(mockRouteAddManually, getByTestId, queryByTestId, '');
    checkTags(mockRouteAddManually, getByTestId, queryByTestId, []);
    checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
    checkPersons(mockRouteAddManually, getByTestId, queryByTestId, 4);
    checkTime(mockRouteAddManually, getByTestId, queryByTestId, defaultValueNumber);
    checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
    checkNutrition(mockRouteAddManually, getByTestId, queryByTestId);
  });

  test('Initial state is correctly set in add ocr mode', async () => {
    const { getByTestId, queryByTestId } = await renderRecipe(createMockRoute(mockRouteAddOCR));

    checkBottomTopButtons(mockRouteAddOCR, getByTestId, queryByTestId);

    checkImage(mockRouteAddOCR, getByTestId);
    checkTitle(mockRouteAddOCR, getByTestId, queryByTestId);
    checkDescription(mockRouteAddOCR, getByTestId, queryByTestId);
    checkTags(mockRouteAddOCR, getByTestId, queryByTestId);
    checkIngredients(mockRouteAddOCR, getByTestId, queryByTestId);
    checkPersons(mockRouteAddOCR, getByTestId, queryByTestId, defaultValueNumber);
    checkTime(mockRouteAddOCR, getByTestId, queryByTestId);
    checkPreparation(mockRouteAddOCR, getByTestId, queryByTestId);
    checkNutrition(mockRouteAddOCR, getByTestId, queryByTestId);
  });

  // -------- CHANGE ON TITLE CASES --------
  test('updates recipeTitle and reflects in RecipeText only', async () => {
    const { getByTestId, queryByTestId } = await renderRecipe(createMockRoute(mockRouteEdit));

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

  test('fill recipeTitle and reflects in RecipeText only', async () => {
    const { getByTestId, queryByTestId } = await renderRecipe(
      createMockRoute(mockRouteAddManually)
    );

    const newTitle = 'New Recipe Title';
    fireEvent.press(getByTestId('RecipeTitle::SetTextToEdit'), newTitle);

    checkImage(mockRouteAddManually, getByTestId, '');
    checkTitle(mockRouteAddManually, getByTestId, queryByTestId, newTitle);
    checkDescription(mockRouteAddManually, getByTestId, queryByTestId, '');
    checkTags(mockRouteAddManually, getByTestId, queryByTestId, []);
    checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
    checkPersons(mockRouteAddManually, getByTestId, queryByTestId, 4);
    checkTime(mockRouteAddManually, getByTestId, queryByTestId, defaultValueNumber);
    checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
  });

  // -------- CHANGE ON DESCRIPTION CASES --------
  test('updates recipeDescription and reflects in RecipeDescription only', async () => {
    const { getByTestId, queryByTestId } = await renderRecipe(createMockRoute(mockRouteEdit));

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

  test('fill recipeDescription and reflects in RecipeText only', async () => {
    const { getByTestId, queryByTestId } = await renderRecipe(
      createMockRoute(mockRouteAddManually)
    );

    const newDescription = 'New Recipe Description';
    fireEvent.press(getByTestId('RecipeDescription::SetTextToEdit'), newDescription);

    checkImage(mockRouteAddManually, getByTestId, '');
    checkTitle(mockRouteAddManually, getByTestId, queryByTestId, '');
    checkDescription(mockRouteAddManually, getByTestId, queryByTestId, newDescription);
    checkTags(mockRouteAddManually, getByTestId, queryByTestId, []);
    checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
    checkPersons(mockRouteAddManually, getByTestId, queryByTestId, 4);
    checkTime(mockRouteAddManually, getByTestId, queryByTestId, defaultValueNumber);
    checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
  });

  // -------- CHANGE ON TAGS CASES --------
  test('remove recipeTags and reflects in RecipeTags only', async () => {
    const { getByTestId, queryByTestId } = await renderRecipe(createMockRoute(mockRouteEdit));

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
  test('updates recipePersons and scales ingredients accordingly', async () => {
    const { getByTestId, queryByTestId } = await renderRecipe(createMockRoute(mockRouteEdit));

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

  test('fill recipePersons and reflects in RecipeText only', async () => {
    const { getByTestId, queryByTestId } = await renderRecipe(
      createMockRoute(mockRouteAddManually)
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
  test('updates recipeIngredients and reflects in RecipeIngredients only', async () => {
    const { getByTestId, queryByTestId } = await renderRecipe(createMockRoute(mockRouteEdit));

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
  test('updates recipeTime and reflects in RecipeTime only', async () => {
    const { getByTestId, queryByTestId } = await renderRecipe(createMockRoute(mockRouteEdit));

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

  test('fill recipeTime and reflects in RecipeText only', async () => {
    const { getByTestId, queryByTestId } = await renderRecipe(
      createMockRoute(mockRouteAddManually)
    );

    const newTime = 71;
    fireEvent.press(getByTestId('RecipeTime::SetTextToEdit'), newTime.toString());

    checkImage(mockRouteAddManually, getByTestId, '');
    checkTitle(mockRouteAddManually, getByTestId, queryByTestId, '');
    checkDescription(mockRouteAddManually, getByTestId, queryByTestId, '');
    checkTags(mockRouteAddManually, getByTestId, queryByTestId, []);
    checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
    checkPersons(mockRouteAddManually, getByTestId, queryByTestId, 4);
    checkTime(mockRouteAddManually, getByTestId, queryByTestId, newTime);
    checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
  });

  // -------- CHANGE ON PREPARATION CASES --------
  test('updates recipePreparation and reflects in RecipePreparation only', async () => {
    const { getByTestId, queryByTestId } = await renderRecipe(createMockRoute(mockRouteEdit));

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
    const { getByTestId } = await renderRecipe(createMockRoute(mockRouteReadOnly));

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
    const { getByTestId, queryByTestId } = await renderRecipe(createMockRoute(mockRouteEdit));

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

  test('validates button on add manually mode', async () => {
    const { getByTestId, queryByTestId } = await renderRecipe(
      createMockRoute(mockRouteAddManually)
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

  test('shows validation error when image is missing in add mode', async () => {
    const { getByTestId } = await renderRecipe(createMockRoute(mockRouteAddManually));

    // Add all required fields except image
    fireEvent.press(getByTestId('RecipeTitle::SetTextToEdit'), 'Test Recipe');
    fireEvent.press(getByTestId('RecipeIngredients::AddNewText'));
    fireEvent.press(getByTestId('RecipePersons::SetTextToEdit'), '4');
    fireEvent.press(getByTestId('RecipePreparation::AddNewText'));

    fireEvent.press(getByTestId('RecipeValidate::OnPressFunction'));

    expect(getByTestId('Recipe::Alert::IsVisible').props.children).toBe(true);
    expect(getByTestId('Recipe::Alert::Title').props.children).toBe(
      'alerts.missingElements.titlePlural'
    );
    expect(getByTestId('Recipe::Alert::Content').props.children).toContain(
      'alerts.missingElements.image'
    );
  });

  test('shows validation error when nutrition has zero values in add mode', async () => {
    const mockRecipeWithNutrition = {
      mode: 'edit' as const,
      recipe: {
        ...testRecipes[1], // Start with complete recipe
        nutrition: {
          energyKcal: defaultValueNumber, // defaultValueNumber should trigger validation error
          energyKj: 200,
          fat: 5,
          saturatedFat: 1,
          carbohydrates: 20,
          sugars: 5,
          fiber: 3,
          protein: 10,
          salt: 1,
          portionWeight: 100,
        },
      },
    };

    const { getByTestId } = await renderRecipe(createMockRoute(mockRecipeWithNutrition));

    fireEvent.press(getByTestId('RecipeValidate::OnPressFunction'));

    expect(getByTestId('Recipe::Alert::IsVisible').props.children).toBe(true);
    expect(getByTestId('Recipe::Alert::Title').props.children).toBe(
      'alerts.missingElements.titleSingular'
    );
    expect(getByTestId('Recipe::Alert::Content').props.children).toContain(
      'alerts.missingElements.messageSingularNutrition'
    );
  });

  test('edit mode validates comprehensively like add mode', async () => {
    const mockRouteEditWithoutImage = {
      mode: 'edit' as const,
      recipe: {
        ...testRecipes[1],
        image_Source: '',
      },
    };

    const { getByTestId } = await renderRecipe(createMockRoute(mockRouteEditWithoutImage));

    fireEvent.press(getByTestId('RecipeValidate::OnPressFunction'));

    expect(getByTestId('Recipe::Alert::IsVisible').props.children).toBe(true);
    expect(getByTestId('Recipe::Alert::Title').props.children).toBe(
      'alerts.missingElements.titleSingular'
    );
    expect(getByTestId('Recipe::Alert::Content').props.children).toContain(
      'alerts.missingElements.image'
    );
  });

  test('shows special nutrition message for single missing nutrition', async () => {
    const mockRecipeWithZeroNutrition = {
      mode: 'edit' as const,
      recipe: {
        ...testRecipes[1],
        nutrition: {
          energyKcal: defaultValueNumber,
          energyKj: defaultValueNumber,
          fat: defaultValueNumber,
          saturatedFat: defaultValueNumber,
          carbohydrates: defaultValueNumber,
          sugars: defaultValueNumber,
          fiber: defaultValueNumber,
          protein: defaultValueNumber,
          salt: defaultValueNumber,
          portionWeight: defaultValueNumber,
        },
      },
    };

    const { getByTestId } = await renderRecipe(createMockRoute(mockRecipeWithZeroNutrition));

    fireEvent.press(getByTestId('RecipeValidate::OnPressFunction'));

    expect(getByTestId('Recipe::Alert::IsVisible').props.children).toBe(true);
    expect(getByTestId('Recipe::Alert::Title').props.children).toBe(
      'alerts.missingElements.titleSingular'
    );
    expect(getByTestId('Recipe::Alert::Content').props.children).toBe(
      'alerts.missingElements.messageSingularNutrition'
    );
  });

  test('shows plural validation errors when multiple elements are missing', async () => {
    const { getByTestId } = await renderRecipe(createMockRoute(mockRouteAddManually));

    // Don't add anything - everything should be missing
    fireEvent.press(getByTestId('RecipeValidate::OnPressFunction'));

    expect(getByTestId('Recipe::Alert::IsVisible').props.children).toBe(true);
    expect(getByTestId('Recipe::Alert::Title').props.children).toBe(
      'alerts.missingElements.titlePlural'
    );
    expect(getByTestId('Recipe::Alert::Content').props.children).toContain(
      'alerts.missingElements.messagePlural'
    );
  });

  test('validation passes when all required fields are complete in edit mode', async () => {
    const mockCompleteRecipe = {
      mode: 'edit' as const,
      recipe: {
        ...testRecipes[1],
        nutrition: undefined,
      },
    };

    const { getByTestId } = await renderRecipe(createMockRoute(mockCompleteRecipe as any));

    fireEvent.press(getByTestId('RecipeValidate::OnPressFunction'));

    // Edit mode should switch to read-only mode when validation passes
    // No validation dialog should be shown for successful edit
    expect(getByTestId('Recipe::Alert::IsVisible').props.children).toBe(false);
  });

  test('toggles stackMode between readOnly and edit', async () => {
    const { getByTestId, queryByTestId } = await renderRecipe(createMockRoute(mockRouteReadOnly));
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
  test('shows OCR nutrition empty state in addOCR mode', async () => {
    const { getByTestId, queryByTestId } = await renderRecipe(createMockRoute(mockRouteAddOCR));

    checkNutrition(mockRouteAddOCR, getByTestId, queryByTestId);
  });

  test('shows manual nutrition empty state in addManual mode', async () => {
    const { getByTestId, queryByTestId } = await renderRecipe(
      createMockRoute(mockRouteAddManually)
    );

    checkNutrition(mockRouteAddManually, getByTestId, queryByTestId);
  });

  describe('duplicate prevention', () => {
    test('prevents adding duplicate tag with exact same name', async () => {
      const { getByTestId } = await renderRecipe(createMockRoute(mockRouteEdit));

      const initialTagsJson = getByTestId('RecipeTags::TagsList').props.children;
      const initialTags = JSON.parse(initialTagsJson);
      const initialCount = initialTags.length;

      expect(initialCount).toBeGreaterThan(0);

      fireEvent.press(getByTestId('RecipeTags::AddNewTag'));

      await waitFor(
        () => {
          const finalTagsJson = getByTestId('RecipeTags::TagsList').props.children;
          const finalTags = JSON.parse(finalTagsJson);
          expect(finalTags).toHaveLength(initialCount);
        },
        { timeout: 1000 }
      );
    });

    test('prevents adding duplicate tag with case insensitive match', async () => {
      const mockRouteWithTags: RecipePropType = {
        mode: 'edit',
        recipe: {
          ...testRecipes[6],
          tags: [{ id: 1, name: 'Dessert' }],
        },
      };

      const { getByTestId } = await renderRecipe(createMockRoute(mockRouteWithTags));

      const initialTagsJson = getByTestId('RecipeTags::TagsList').props.children;
      const initialTags = JSON.parse(initialTagsJson);

      expect(initialTags).toEqual(['Dessert']);

      fireEvent.press(getByTestId('RecipeTags::AddNewTag'));

      await waitFor(
        () => {
          const finalTagsJson = getByTestId('RecipeTags::TagsList').props.children;
          const finalTags = JSON.parse(finalTagsJson);
          expect(finalTags).toHaveLength(1);
          expect(finalTags).toEqual(['Dessert']);
        },
        { timeout: 1000 }
      );
    });

    test('prevents adding duplicate ingredient with exact same name', async () => {
      const { getByTestId } = await renderRecipe(createMockRoute(mockRouteEdit));

      const initialIngredientsJson = getByTestId('RecipeIngredients::TextEditable').props.children;
      const initialIngredients = JSON.parse(initialIngredientsJson);
      const initialCount = initialIngredients.length;

      fireEvent.press(getByTestId('RecipeIngredients::TextEdited'));

      await waitFor(() => {
        const updatedIngredientsJson = getByTestId('RecipeIngredients::TextEditable').props
          .children;
        const updatedIngredients = JSON.parse(updatedIngredientsJson);
        expect(updatedIngredients[0]).toBe(`200${unitySeparator}ml${textSeparator}Milk`);
      });

      fireEvent.press(getByTestId('RecipeIngredients::AddNewText'));

      await waitFor(() => {
        const withNewIngredientJson = getByTestId('RecipeIngredients::TextEditable').props.children;
        const withNewIngredient = JSON.parse(withNewIngredientJson);
        expect(withNewIngredient).toHaveLength(initialCount + 1);
        expect(withNewIngredient[withNewIngredient.length - 1]).toBe(
          `${unitySeparator}${textSeparator}`
        );
      });

      fireEvent.press(getByTestId('RecipeIngredients::TextEdited'));

      await waitFor(
        () => {
          const finalIngredientsJson = getByTestId('RecipeIngredients::TextEditable').props
            .children;
          const finalIngredients = JSON.parse(finalIngredientsJson);
          expect(finalIngredients).toHaveLength(initialCount + 1);
          expect(finalIngredients[initialCount]).toBe(`${unitySeparator}${textSeparator}`);
          expect(finalIngredients.filter((ing: string) => ing.includes('Milk'))).toHaveLength(1);
        },
        { timeout: 1000 }
      );
    });

    test('prevents adding duplicate ingredient with case insensitive match', async () => {
      const mockRouteWithIngredient: RecipePropType = {
        mode: 'edit',
        recipe: {
          ...testRecipes[6],
          ingredients: [
            {
              id: 1,
              name: 'Butter',
              quantity: '100',
              unit: 'g',
              type: testIngredients[0].type,
              season: ['*'],
            },
          ],
        },
      };

      const { getByTestId } = await renderRecipe(createMockRoute(mockRouteWithIngredient));

      const initialIngredientsJson = getByTestId('RecipeIngredients::TextEditable').props.children;
      const initialIngredients = JSON.parse(initialIngredientsJson);

      expect(initialIngredients).toHaveLength(1);
      expect(initialIngredients[0]).toContain('Butter');

      fireEvent.press(getByTestId('RecipeIngredients::AddNewText'));

      await waitFor(() => {
        const withNewIngredientJson = getByTestId('RecipeIngredients::TextEditable').props.children;
        const withNewIngredient = JSON.parse(withNewIngredientJson);
        expect(withNewIngredient).toHaveLength(2);
      });

      fireEvent.press(getByTestId('RecipeIngredients::TextEdited'));

      await waitFor(
        () => {
          const finalIngredientsJson = getByTestId('RecipeIngredients::TextEditable').props
            .children;
          const finalIngredients = JSON.parse(finalIngredientsJson);
          expect(finalIngredients).toHaveLength(2);
          expect(finalIngredients[0]).toContain('Butter');
          expect(finalIngredients[1]).toBe(`${unitySeparator}${textSeparator}`);
          expect(finalIngredients.filter((ing: string) => ing.includes('Milk'))).toHaveLength(0);
        },
        { timeout: 1000 }
      );
    });

    test('allows editing ingredient to a different value', async () => {
      const { getByTestId } = await renderRecipe(createMockRoute(mockRouteEdit));

      const initialIngredientsJson = getByTestId('RecipeIngredients::TextEditable').props.children;
      const initialIngredients = JSON.parse(initialIngredientsJson);
      const initialCount = initialIngredients.length;

      fireEvent.press(getByTestId('RecipeIngredients::TextEdited'));

      await waitFor(() => {
        const updatedIngredientsJson = getByTestId('RecipeIngredients::TextEditable').props
          .children;
        const updatedIngredients = JSON.parse(updatedIngredientsJson);
        expect(updatedIngredients[0]).toBe(`200${unitySeparator}ml${textSeparator}Milk`);
        expect(updatedIngredients).toHaveLength(initialCount);
      });
    });
  });

  // TODO add delete test
});
