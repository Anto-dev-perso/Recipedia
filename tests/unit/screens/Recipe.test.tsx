import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import Recipe, {editRecipeManually, RecipePropType} from "@screens/Recipe";
import {recipesDataset} from "@test-data/recipesDataset";
import RecipeDatabase from "@utils/RecipeDatabase";
import {tagsDataset} from "@test-data/tagsDataset";
import {ingredientsDataset} from "@test-data/ingredientsDataset";
import {
    extractIngredientsNameWithQuantity,
    shoppingListTableElement,
    tagTableElement
} from "@customTypes/DatabaseElementTypes";
import {StackScreenParamList} from "@customTypes/ScreenTypes";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {GetByQuery, QueryByQuery} from "@testing-library/react-native/build/queries/make-queries";
import {TextMatch, TextMatchOptions} from "@testing-library/react-native/build/matches";
import {CommonQueryOptions} from "@testing-library/react-native/build/queries/options";
import {textSeparator, unitySeparator} from "@styles/typography";
import {defaultValueNumber} from '@utils/Constants';
import {listFilter} from "@customTypes/RecipeFiltersTypes";

jest.mock('expo-sqlite', () => require('@mocks/deps/expo-sqlite-mock').expoSqliteMock());
jest.mock('@utils/FileGestion', () => require('@mocks/utils/FileGestion-mock.tsx').fileGestionMock());
jest.mock('@utils/ImagePicker', () => require('@mocks/utils/ImagePicker-mock').imagePickerMock());
jest.mock('@utils/i18n', () => require('@mocks/utils/i18n-mock').i18nMock());

jest.mock('@components/organisms/RecipeTags', () => require('@mocks/components/organisms/RecipeTags-mock').recipeTagsMock);
jest.mock('@components/organisms/RecipeImage', () => require('@mocks/components/organisms/RecipeImage-mock').recipeImageMock);
jest.mock('@components/organisms/RecipeText', () => require('@mocks/components/organisms/RecipeText-mock').recipeTextMock);
jest.mock('@components/organisms/RecipeNumber', () => require('@mocks/components/organisms/RecipeNumber-mock').recipeNumberMock);
jest.mock('@components/organisms/RecipeTextRender', () => require('@mocks/components/organisms/RecipeTextRender-mock').recipeTextRenderMock);
jest.mock('@components/molecules/BottomTopButton', () => require('@mocks/components/molecules/BottomTopButton-mock').bottomTopButtonMock);

const defaultUri = '';

type GetByIdType = GetByQuery<TextMatch, CommonQueryOptions & TextMatchOptions>;
type QueryByIdType = QueryByQuery<TextMatch, CommonQueryOptions & TextMatchOptions>;

function checkBottomTopButtons(prop: RecipePropType, getByTestId: GetByIdType, queryByTestId: QueryByIdType) {
    switch (prop.mode) {
        case "readOnly":
            expect(getByTestId('BackButton::OnPressFunction')).toBeTruthy();
            expect(getByTestId('RecipeDelete::OnPressFunction')).toBeTruthy();
            expect(getByTestId('RecipeEdit::OnPressFunction')).toBeTruthy();
            break;
        case "edit":
        case "addManually":
        case "addFromPic":
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
        case "readOnly":
            expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual(`${prop.recipe.image_Source}`);
            expect(getByTestId('RecipeImage::ButtonIcon').props.children).toBeUndefined();
            break;
        case "edit":
            expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual(prop.recipe.image_Source);
            expect(getByTestId('RecipeImage::ButtonIcon').props.children).toEqual("camera");

            break;
        case "addManually":
            expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual(newValueExpected);
            expect(getByTestId('RecipeImage::ButtonIcon').props.children).toEqual("camera");
            break;
        case "addFromPic":
            const imageUri = prop.imgUri;
            expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual(imageUri);
            expect(getByTestId('RecipeImage::ButtonIcon').props.children).toEqual("line-scan");
            break;
    }
}

function checkTitle(prop: RecipePropType, getByTestId: GetByIdType, queryByTestId: QueryByIdType, newValueExpected?: string) {
    switch (prop.mode) {
        case "readOnly":
            expect(getByTestId('RecipeTitle::RootText').props.children).toEqual(prop.recipe.title);
            expect(queryByTestId('RecipeTitle::TextEditable')).toBeNull();
            expect(queryByTestId('RecipeTitle::SetTextToEdit')).toBeNull();
            expect(queryByTestId('RecipeTitle::OpenModal')).toBeNull();
            break;
        case  "edit":
            expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('title:');
            expect(getByTestId('RecipeTitle::TextEditable').props.children).toEqual(prop.recipe.title);
            expect(getByTestId('RecipeTitle::SetTextToEdit').props.children).toBeTruthy();
            expect(queryByTestId('RecipeTitle::OpenModal')).toBeNull();
            break;
        case "addManually":
            expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('title:');
            expect(getByTestId('RecipeTitle::TextEditable').props.children).toEqual(newValueExpected);
            expect(getByTestId('RecipeTitle::SetTextToEdit').props.children).toBeTruthy();
            expect(queryByTestId('RecipeTitle::OpenModal')).toBeNull();
            break;
        case "addFromPic":
            expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('title:');
            expect(queryByTestId('RecipeTitle::TextEditable')).toBeNull();
            expect(queryByTestId('RecipeTitle::SetTextToEdit')).toBeNull();
            if (prop.imgUri == defaultUri) {
                expect(getByTestId('RecipeTitle::OpenModal').props.children).toBeTruthy();
            } else {
                expect(queryByTestId('RecipeTitle::OpenModal')).toBeNull();
            }
            break;
    }
}

function checkDescription(prop: RecipePropType, getByTestId: GetByIdType, queryByTestId: QueryByIdType, newValueExpected?: string) {
    switch (prop.mode) {
        case "readOnly":
            expect(getByTestId('RecipeDescription::RootText').props.children).toEqual(prop.recipe.description);
            expect(queryByTestId('RecipeDescription::TextEditable')).toBeNull();
            expect(queryByTestId('RecipeDescription::SetTextToEdit')).toBeNull();
            expect(queryByTestId('RecipeDescription::OpenModal')).toBeNull();
            break;
        case "edit":
            expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('Description:');
            expect(getByTestId('RecipeDescription::TextEditable').props.children).toEqual(prop.recipe.description);
            expect(getByTestId('RecipeDescription::SetTextToEdit').props.children).toBeTruthy();
            expect(queryByTestId('RecipeDescription::OpenModal')).toBeNull();
            break;
        case "addManually":
            expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('Description:');
            expect(getByTestId('RecipeDescription::TextEditable').props.children).toEqual(newValueExpected);
            expect(getByTestId('RecipeDescription::SetTextToEdit').props.children).toBeTruthy();
            expect(queryByTestId('RecipeDescription::OpenModal')).toBeNull();
            break;
        case "addFromPic":
            expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('Description:');
            expect(queryByTestId('RecipeDescription::TextEditable')).toBeNull();
            expect(queryByTestId('RecipeDescription::SetTextToEdit')).toBeNull();
            if (prop.imgUri == defaultUri) {
                expect(getByTestId('RecipeDescription::OpenModal').props.children).toBeTruthy();
            } else {
                expect(queryByTestId('RecipeDescription::OpenModal')).toBeNull();
            }
            break;
    }
}

function checkTags(prop: RecipePropType, getByTestId: GetByIdType, queryByTestId: QueryByIdType, newValueExpected?: Array<tagTableElement>) {
    switch (prop.mode) {
        case "readOnly":
            expect(getByTestId('RecipeTags::TagsList').props.children).toEqual(JSON.stringify(prop.recipe.tags.map(tag => tag.tagName)));
            expect(queryByTestId('RecipeTags::RandomTags')).toBeNull();
            expect(queryByTestId('RecipeTags::AddNewTag')).toBeNull();
            expect(queryByTestId('RecipeTags::RemoveTag')).toBeNull();
            break;
        case "edit":
            expect(getByTestId('RecipeTags::TagsList').props.children).toEqual(JSON.stringify(prop.recipe.tags.map(tag => tag.tagName)));
            expect(getByTestId('RecipeTags::RandomTags').props.children).not.toEqual(recipesDataset[6].tags.map(tag => tag.tagName));
            expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
            expect(getByTestId('RecipeTags::RemoveTag').props.children).toBeTruthy();
            break;
        case "addManually":
            expect(getByTestId('RecipeTags::TagsList').props.children).toEqual(JSON.stringify(newValueExpected?.map(tag => tag.tagName)));
            expect(getByTestId('RecipeTags::RandomTags').props.children).not.toEqual(recipesDataset[6].tags.map(tag => tag.tagName));
            expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
            expect(getByTestId('RecipeTags::RemoveTag').props.children).toBeTruthy();
            break;
        case "addFromPic":
            expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('[]');
            expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ').length).toEqual(3);
            expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
            expect(getByTestId('RecipeTags::RemoveTag').props.children).toBeTruthy();
            break;
    }
}

function checkIngredients(prop: RecipePropType, getByTestId: GetByIdType, queryByTestId: QueryByIdType) {
    switch (prop.mode) {
        case "readOnly":
            expect(getByTestId('RecipeIngredients::Text').props.children).toEqual(JSON.stringify(prop.recipe.ingredients.map(ing => ing.quantity + unitySeparator + ing.unit + textSeparator + ing.ingName)));
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
        case "edit":
            expect(queryByTestId('RecipeIngredients::Text')).toBeNull();
            expect(queryByTestId('RecipeIngredients::Title')).toBeNull();
            expect(queryByTestId('RecipeIngredients::Render')).toBeNull();
            expect(queryByTestId('RecipeIngredients::WithBorder')).toBeNull();
            expect(queryByTestId('RecipeIngredients::OnClick')).toBeNull();
            expect(queryByTestId('RecipeIngredients::OnChangeFunction')).toBeNull();

            expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('ingredients: ');
            expect(queryByTestId('RecipeIngredients::OpenModal')).toBeNull();

            expect(getByTestId('RecipeIngredients::TextEditable').props.children).toEqual(JSON.stringify(extractIngredientsNameWithQuantity(prop.recipe.ingredients)));
            expect(getByTestId('RecipeIngredients::RenderType').props.children).toEqual('"ARRAY"');
            expect(getByTestId('RecipeIngredients::TextEdited').props.children).toBeTruthy();
            expect(getByTestId('RecipeIngredients::AddNewText').props.children).toBeTruthy();
            expect(getByTestId('RecipeIngredients::Column1').props.children).toEqual('quantity');
            expect(getByTestId('RecipeIngredients::Column2').props.children).toEqual('unit');
            expect(getByTestId('RecipeIngredients::Column3').props.children).toEqual('ingredientName');
            break;
        case "addManually":
            expect(queryByTestId('RecipeIngredients::Text')).toBeNull();
            expect(queryByTestId('RecipeIngredients::Title')).toBeNull();
            expect(queryByTestId('RecipeIngredients::Render')).toBeNull();
            expect(queryByTestId('RecipeIngredients::WithBorder')).toBeNull();
            expect(queryByTestId('RecipeIngredients::OnClick')).toBeNull();
            expect(queryByTestId('RecipeIngredients::OnChangeFunction')).toBeNull();

            expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('ingredients: ');
            expect(queryByTestId('RecipeIngredients::OpenModal')).toBeNull();

            expect(getByTestId('RecipeIngredients::TextEditable').props.children).toEqual(JSON.stringify([]));
            expect(getByTestId('RecipeIngredients::RenderType').props.children).toEqual('"ARRAY"');
            expect(getByTestId('RecipeIngredients::TextEdited').props.children).toBeTruthy();
            expect(getByTestId('RecipeIngredients::AddNewText').props.children).toBeTruthy();
            expect(getByTestId('RecipeIngredients::Column1').props.children).toEqual('quantity');
            expect(getByTestId('RecipeIngredients::Column2').props.children).toEqual('unit');
            expect(getByTestId('RecipeIngredients::Column3').props.children).toEqual('ingredientName');
            break;
        case "addFromPic":
            expect(queryByTestId('RecipeIngredients::Text')).toBeNull();
            expect(queryByTestId('RecipeIngredients::Title')).toBeNull();
            expect(queryByTestId('RecipeIngredients::Render')).toBeNull();
            expect(queryByTestId('RecipeIngredients::WithBorder')).toBeNull();
            expect(queryByTestId('RecipeIngredients::OnClick')).toBeNull();
            expect(queryByTestId('RecipeIngredients::OnChangeFunction')).toBeNull();

            expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('ingredients: ');
            if (prop.imgUri.length == 0) {
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

function checkPersons(prop: RecipePropType, getByTestId: GetByIdType, queryByTestId: QueryByIdType, newValueExpected?: number) {
    switch (prop.mode) {
        case "readOnly":
            expect(getByTestId('RecipePersons::Text').props.children).toEqual(`ingredientReadOnlyBeforePerson${prop.recipe.persons}ingredientReadOnlyAfterPerson`);
            expect(queryByTestId('RecipePersons::PrefixText')).toBeNull();
            expect(queryByTestId('RecipePersons::SuffixText')).toBeNull();
            expect(queryByTestId('RecipePersons::TextEditable')).toBeNull();
            expect(queryByTestId('RecipePersons::SetTextToEdit')).toBeNull();
            expect(queryByTestId('RecipePersons::OpenModal')).toBeNull();
            break;
        case "edit":
            expect(queryByTestId('RecipePersons::Text')).toBeNull();
            expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('personPrefixEdit');
            expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('personSuffixEdit');
            expect(getByTestId('RecipePersons::TextEditable').props.children).toEqual(prop.recipe.persons);
            expect(getByTestId('RecipePersons::SetTextToEdit').props.children).toBeTruthy();
            expect(queryByTestId('RecipePersons::OpenModal')).toBeNull();
            break;
        case "addManually":
            expect(queryByTestId('RecipePersons::Text')).toBeNull();
            expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('personPrefixEdit');
            expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('personSuffixEdit');
            expect(getByTestId('RecipePersons::TextEditable').props.children).toEqual(newValueExpected);
            expect(getByTestId('RecipePersons::SetTextToEdit').props.children).toBeTruthy();
            expect(queryByTestId('RecipePersons::OpenModal')).toBeNull();
            break;
        case "addFromPic":
            expect(queryByTestId('RecipePersons::Text')).toBeNull();
            expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('personPrefixOCR');
            expect(getByTestId('RecipePersons::SuffixText').props.children).toBeUndefined();
            if (prop.imgUri == defaultUri) {
                expect(getByTestId('RecipePersons::OpenModal').props.children).toBeTruthy();
            } else {
                expect(queryByTestId('RecipePersons::OpenModal')).toBeNull();
            }
            break;
    }
}

function checkTime(prop: RecipePropType, getByTestId: GetByIdType, queryByTestId: QueryByIdType, newValueExpected?: number) {
    switch (prop.mode) {
        case "readOnly":
            expect(getByTestId('RecipeTime::Text').props.children).toEqual(`timeReadOnlyBeforePerson${prop.recipe.time}timeReadOnlyAfterPerson`);
            expect(queryByTestId('RecipeTime::PrefixText')).toBeNull();
            expect(queryByTestId('RecipeTime::SuffixText')).toBeNull();
            expect(queryByTestId('RecipeTime::TextEditable')).toBeNull();
            expect(queryByTestId('RecipeTime::SetTextToEdit')).toBeNull();
            expect(queryByTestId('RecipeTime::OpenModal')).toBeNull();
            break;
        case "edit":
            expect(queryByTestId('RecipeTime::Text')).toBeNull();
            expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('timePrefixEdit');
            expect(getByTestId('RecipeTime::SuffixText').props.children).toEqual('timeSuffixEdit');
            expect(getByTestId('RecipeTime::TextEditable').props.children).toEqual(prop.recipe.time);
            expect(getByTestId('RecipeTime::SetTextToEdit').props.children).toBeTruthy();
            expect(queryByTestId('RecipeTime::OpenModal')).toBeNull();
            break;
        case "addManually":
            expect(queryByTestId('RecipeTime::Text')).toBeNull();
            expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('timePrefixEdit');
            expect(getByTestId('RecipeTime::SuffixText').props.children).toEqual('timeSuffixEdit');
            expect(getByTestId('RecipeTime::TextEditable').props.children).toEqual(newValueExpected);
            expect(getByTestId('RecipeTime::SetTextToEdit').props.children).toBeTruthy();
            expect(queryByTestId('RecipeTime::OpenModal')).toBeNull();
            break;
        case "addFromPic":
            expect(queryByTestId('RecipeTime::Text')).toBeNull();
            if (prop.imgUri == defaultUri) {
                expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('personPrefixOCR');
                expect(getByTestId('RecipeTime::SuffixText').props.children).toBeUndefined();
                expect(getByTestId('RecipeTime::OpenModal').props.children).toBeTruthy();
            } else {
                expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('timePrefixEdit ');
                expect(getByTestId('RecipeTime::SuffixText').props.children).toEqual(' timeSuffixEdit');
                expect(queryByTestId('RecipeTime::OpenModal')).toBeNull();
            }
            break;
    }
}

function checkPreparation(prop: RecipePropType, getByTestId: GetByIdType, queryByTestId: QueryByIdType) {
    switch (prop.mode) {
        case "readOnly":
            expect(getByTestId('RecipePreparation::Text').props.children).toEqual(JSON.stringify(prop.recipe.preparation));
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
        case "edit":
            expect(queryByTestId('RecipePreparation::Text')).toBeNull();
            expect(queryByTestId('RecipePreparation::Title')).toBeNull();
            expect(queryByTestId('RecipePreparation::Render')).toBeNull();
            expect(queryByTestId('RecipePreparation::WithBorder')).toBeNull();
            expect(queryByTestId('RecipePreparation::OnClick')).toBeNull();
            expect(queryByTestId('RecipePreparation::OnChangeFunction')).toBeNull();

            expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
            expect(queryByTestId('RecipePreparation::OpenModal')).toBeNull();

            expect(getByTestId('RecipePreparation::TextEditable').props.children).toEqual(JSON.stringify(prop.recipe.preparation));
            expect(getByTestId('RecipePreparation::RenderType').props.children).toEqual('"SECTION"');
            expect(getByTestId('RecipePreparation::TextEdited').props.children).toBeTruthy();
            expect(getByTestId('RecipePreparation::AddNewText').props.children).toBeTruthy();
            expect(queryByTestId('RecipePreparation::Column1')).toBeNull();
            expect(queryByTestId('RecipePreparation::Column2')).toBeNull();
            expect(queryByTestId('RecipePreparation::Column3')).toBeNull();
            break;
        case "addManually":
            expect(queryByTestId('RecipePreparation::Text')).toBeNull();
            expect(queryByTestId('RecipePreparation::Title')).toBeNull();
            expect(queryByTestId('RecipePreparation::Render')).toBeNull();
            expect(queryByTestId('RecipePreparation::WithBorder')).toBeNull();
            expect(queryByTestId('RecipePreparation::OnClick')).toBeNull();
            expect(queryByTestId('RecipePreparation::OnChangeFunction')).toBeNull();

            expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
            expect(queryByTestId('RecipePreparation::OpenModal')).toBeNull();

            expect(getByTestId('RecipePreparation::TextEditable').props.children).toEqual(JSON.stringify([]));
            expect(getByTestId('RecipePreparation::RenderType').props.children).toEqual('"SECTION"');
            expect(getByTestId('RecipePreparation::TextEdited').props.children).toBeTruthy();
            expect(getByTestId('RecipePreparation::AddNewText').props.children).toBeTruthy();
            expect(queryByTestId('RecipePreparation::Column1')).toBeNull();
            expect(queryByTestId('RecipePreparation::Column2')).toBeNull();
            expect(queryByTestId('RecipePreparation::Column3')).toBeNull();
            break;
        case "addFromPic":
            expect(queryByTestId('RecipePreparation::Text')).toBeNull();
            expect(queryByTestId('RecipePreparation::Title')).toBeNull();
            expect(queryByTestId('RecipePreparation::Render')).toBeNull();
            expect(queryByTestId('RecipePreparation::WithBorder')).toBeNull();
            expect(queryByTestId('RecipePreparation::OnClick')).toBeNull();
            expect(queryByTestId('RecipePreparation::OnChangeFunction')).toBeNull();

            expect(getByTestId('RecipePreparation::PrefixText').props.children).toEqual('preparationReadOnly');
            if (prop.imgUri.length == 0) {
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

describe('Recipe Component tests', () => {
    const mockNavigation: Partial<NativeStackNavigationProp<StackScreenParamList, 'Recipe'>> = {
        goBack: jest.fn(),
        navigate: jest.fn(),
        setOptions: jest.fn(),
        dispatch: jest.fn(),
        canGoBack: jest.fn(),
        getId: jest.fn(),
        getParent: jest.fn(),
        isFocused: jest.fn(),
    };
    const mockRouteReadOnly: RecipePropType = {
        mode: 'readOnly',
        recipe: recipesDataset[1],
    };

    const mockRouteEdit: RecipePropType = {
        mode: 'edit',
        recipe: {...recipesDataset[6]} as const
    } as const;

    const mockRouteAddOCR: RecipePropType = {mode: 'addFromPic', imgUri: defaultUri};
    const mockRouteAddManually: RecipePropType = {mode: 'addManually'};

    const dbInstance = RecipeDatabase.getInstance();
    beforeEach(async () => {
        jest.clearAllMocks();

        await dbInstance.init();
        await dbInstance.addMultipleIngredients(ingredientsDataset);
        await dbInstance.addMultipleTags(tagsDataset);
        await dbInstance.addMultipleRecipes(recipesDataset);
    });
    afterEach(async () => {
        await dbInstance.reset();
        mockRouteEdit.recipe = {...recipesDataset[6]};
    });

    // -------- INIT CASES --------
    test('Initial state is correctly set in readOnly mode', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId, queryByTestId} = render(<Recipe route={{params: mockRouteReadOnly}}
                                                            navigation={mockNavigation}/>);

        checkBottomTopButtons(mockRouteReadOnly, getByTestId, queryByTestId);

        checkImage(mockRouteReadOnly, getByTestId);
        checkTitle(mockRouteReadOnly, getByTestId, queryByTestId);
        checkDescription(mockRouteReadOnly, getByTestId, queryByTestId);
        checkTags(mockRouteReadOnly, getByTestId, queryByTestId);
        checkIngredients(mockRouteReadOnly, getByTestId, queryByTestId);
        checkPersons(mockRouteReadOnly, getByTestId, queryByTestId);
        checkTime(mockRouteReadOnly, getByTestId, queryByTestId);
        checkPreparation(mockRouteReadOnly, getByTestId, queryByTestId);
    });

    test('Initial state is correctly set in edit mode', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId, queryByTestId} = render(<Recipe route={{params: mockRouteEdit}}
                                                            navigation={mockNavigation}/>);

        checkBottomTopButtons(mockRouteEdit, getByTestId, queryByTestId);

        checkImage(mockRouteEdit, getByTestId);
        checkTitle(mockRouteEdit, getByTestId, queryByTestId);
        checkDescription(mockRouteEdit, getByTestId, queryByTestId);
        checkTags(mockRouteEdit, getByTestId, queryByTestId, []);
        checkIngredients(mockRouteEdit, getByTestId, queryByTestId);
        checkPersons(mockRouteEdit, getByTestId, queryByTestId);
        checkTime(mockRouteEdit, getByTestId, queryByTestId);
        checkPreparation(mockRouteEdit, getByTestId, queryByTestId);
    });

    test('Initial state is correctly set in add manually mode', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId, queryByTestId} = render(<Recipe route={{params: mockRouteAddManually}}
                                                            navigation={mockNavigation}/>);

        checkBottomTopButtons(mockRouteAddManually, getByTestId, queryByTestId);

        checkImage(mockRouteAddManually, getByTestId, "");
        checkTitle(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkDescription(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkTags(mockRouteAddManually, getByTestId, queryByTestId, []);
        checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
        checkPersons(mockRouteAddManually, getByTestId, queryByTestId, defaultValueNumber);
        checkTime(mockRouteAddManually, getByTestId, queryByTestId, defaultValueNumber);
        checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
    });


    test('Initial state is correctly set in add ocr mode', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId, queryByTestId} = render(<Recipe route={{params: mockRouteAddOCR}}
                                                            navigation={mockNavigation}/>);

        checkBottomTopButtons(mockRouteAddOCR, getByTestId, queryByTestId);

        checkImage(mockRouteAddOCR, getByTestId);
        checkTitle(mockRouteAddOCR, getByTestId, queryByTestId);
        checkDescription(mockRouteAddOCR, getByTestId, queryByTestId);
        checkTags(mockRouteAddOCR, getByTestId, queryByTestId);
        checkIngredients(mockRouteAddOCR, getByTestId, queryByTestId);
        checkPersons(mockRouteAddOCR, getByTestId, queryByTestId);
        checkTime(mockRouteAddOCR, getByTestId, queryByTestId);
        checkPreparation(mockRouteAddOCR, getByTestId, queryByTestId);
    });


    // -------- CHANGE ON TITLE CASES --------
    test('updates recipeTitle and reflects in RecipeText only', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId, queryByTestId} = render(<Recipe route={{params: mockRouteEdit}}
                                                            navigation={mockNavigation}/>);

        const newTitle = 'New Recipe Title';
        fireEvent.press(getByTestId('RecipeTitle::SetTextToEdit'), newTitle);
        const newEditProp: editRecipeManually = {...mockRouteEdit};
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
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId, queryByTestId} = render(<Recipe route={{params: mockRouteAddManually}}
                                                            navigation={mockNavigation}/>);

        const newTitle = 'New Recipe Title';
        fireEvent.press(getByTestId('RecipeTitle::SetTextToEdit'), newTitle);

        checkImage(mockRouteAddManually, getByTestId, "");
        checkTitle(mockRouteAddManually, getByTestId, queryByTestId, newTitle);
        checkDescription(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkTags(mockRouteAddManually, getByTestId, queryByTestId, []);
        checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
        checkPersons(mockRouteAddManually, getByTestId, queryByTestId, defaultValueNumber);
        checkTime(mockRouteAddManually, getByTestId, queryByTestId, defaultValueNumber);
        checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
    });

    // -------- CHANGE ON DESCRIPTION CASES --------
    test('updates recipeDescription and reflects in RecipeDescription only', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId, queryByTestId} = render(<Recipe route={{params: mockRouteEdit}}
                                                            navigation={mockNavigation}/>);

        const newDescription = 'New Recipe Description';
        fireEvent.press(getByTestId('RecipeDescription::SetTextToEdit'), newDescription);
        const newEditProp: editRecipeManually = {...mockRouteEdit};
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
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId, queryByTestId} = render(<Recipe route={{params: mockRouteAddManually}}
                                                            navigation={mockNavigation}/>);

        const newDescription = 'New Recipe Description';
        fireEvent.press(getByTestId('RecipeDescription::SetTextToEdit'), newDescription);

        checkImage(mockRouteAddManually, getByTestId, "");
        checkTitle(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkDescription(mockRouteAddManually, getByTestId, queryByTestId, newDescription);
        checkTags(mockRouteAddManually, getByTestId, queryByTestId, []);
        checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
        checkPersons(mockRouteAddManually, getByTestId, queryByTestId, defaultValueNumber);
        checkTime(mockRouteAddManually, getByTestId, queryByTestId, defaultValueNumber);
        checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
    });

    // -------- CHANGE ON TAGS CASES --------
    test('remove recipeTags and reflects in RecipeTags only', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId, queryByTestId} = render(<Recipe route={{params: mockRouteEdit}}
                                                            navigation={mockNavigation}/>);

        fireEvent.press(getByTestId('RecipeTags::RemoveTag'));
        const newEditProp: editRecipeManually = {
            mode: mockRouteEdit.mode, recipe: {
                ...mockRouteEdit.recipe, tags: mockRouteEdit.recipe.tags.map(tag => ({...tag})),
            }
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
    test('updates recipePersons and reflects in RecipePersons only', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId, queryByTestId} = render(<Recipe route={{params: mockRouteEdit}}
                                                            navigation={mockNavigation}/>);

        const newPerson = '23';
        fireEvent.press(getByTestId('RecipePersons::SetTextToEdit'), newPerson);
        const newEditProp: editRecipeManually = {...mockRouteEdit};
        newEditProp.recipe.persons = Number(newPerson);

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
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId, queryByTestId} = render(<Recipe route={{params: mockRouteAddManually}}
                                                            navigation={mockNavigation}/>);

        const newPerson = 23;
        fireEvent.press(getByTestId('RecipePersons::SetTextToEdit'), newPerson.toString());

        checkImage(mockRouteAddManually, getByTestId, "");
        checkTitle(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkDescription(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkTags(mockRouteAddManually, getByTestId, queryByTestId, []);
        checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
        checkPersons(mockRouteAddManually, getByTestId, queryByTestId, newPerson);
        checkTime(mockRouteAddManually, getByTestId, queryByTestId, defaultValueNumber);
        checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
    });

    // -------- CHANGE ON INGREDIENTS CASES --------
    test('updates recipeIngredients and reflects in RecipeIngredients only', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId, queryByTestId} = render(<Recipe route={{params: mockRouteEdit}}
                                                            navigation={mockNavigation}/>);

        const updateValue = ' updated';
        fireEvent.press(getByTestId('RecipeIngredients::TextEdited'), updateValue);
        const newEditProp: editRecipeManually = {...mockRouteEdit};
        newEditProp.recipe.ingredients[0].ingName += updateValue;

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
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId, queryByTestId} = render(<Recipe route={{params: mockRouteEdit}}
                                                            navigation={mockNavigation}/>);

        const newTime = '71';
        fireEvent.press(getByTestId('RecipeTime::SetTextToEdit'), newTime);
        const newEditProp: editRecipeManually = {...mockRouteEdit};
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
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId, queryByTestId} = render(<Recipe route={{params: mockRouteAddManually}}
                                                            navigation={mockNavigation}/>);

        const newTime = 71;
        fireEvent.press(getByTestId('RecipeTime::SetTextToEdit'), newTime.toString());

        checkImage(mockRouteAddManually, getByTestId, "");
        checkTitle(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkDescription(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkTags(mockRouteAddManually, getByTestId, queryByTestId, []);
        checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
        checkPersons(mockRouteAddManually, getByTestId, queryByTestId, defaultValueNumber);
        checkTime(mockRouteAddManually, getByTestId, queryByTestId, newTime);
        checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
    });

    // -------- CHANGE ON PREPARATION CASES --------
    test('updates recipePreparation and reflects in RecipePreparation only', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId, queryByTestId} = render(<Recipe route={{params: mockRouteEdit}}
                                                            navigation={mockNavigation}/>);

        const newPreparation = ' New part of a paragraph';
        fireEvent.press(getByTestId('RecipePreparation::TextEdited'), newPreparation);
        const newEditProp: editRecipeManually = {...mockRouteEdit};
        newEditProp.recipe.preparation[0] += newPreparation;

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
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId} = render(<Recipe route={{params: mockRouteReadOnly}} navigation={mockNavigation}/>);

        expect(RecipeDatabase.getInstance().get_shopping()).toEqual([]);

        fireEvent.press(getByTestId('RecipeValidate::OnPressFunction'));

        await waitFor(() => {
            expect(mockNavigation.goBack).toHaveBeenCalled();
        });
        expect(RecipeDatabase.getInstance().get_shopping()).toEqual(new Array<Array<shoppingListTableElement>>({
            //@ts-ignore id is always set at this point
            id: 1,
            name: "Taco Shells",
            purchased: false,
            quantity: "6",
            recipesTitle: ["Chicken Tacos"],
            type: listFilter.grainOrCereal,
            unit: "pieces"
        }, {
            id: 2,
            name: "Chicken Breast",
            purchased: false,
            quantity: "300",
            recipesTitle: ["Chicken Tacos"],
            type: listFilter.poultry,
            unit: "g"
        }, {
            id: 3,
            name: "Lettuce",
            purchased: false,
            quantity: "50",
            recipesTitle: ["Chicken Tacos"],
            type: listFilter.vegetable,
            unit: "g"
        }, {
            id: 4,
            name: "Cheddar",
            purchased: false,
            quantity: "50",
            recipesTitle: ["Chicken Tacos"],
            type: listFilter.cheese,
            unit: "g"
        }));

    });

    test('validates button on edit mode', async () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId, queryByTestId} = render(<Recipe route={{params: mockRouteEdit}}
                                                            navigation={mockNavigation}/>);

        const newProp: RecipePropType = {
            mode: "readOnly", recipe: {
                image_Source: mockRouteEdit.recipe.image_Source,
                title: 'New Recipe Title',
                description: 'New Recipe Description',
                tags: new Array(mockRouteEdit.recipe.tags[1]),
                persons: 23,
                ingredients: mockRouteEdit.recipe.ingredients.map(ingredient => ({...ingredient})),
                time: 71,
                preparation: [...mockRouteEdit.recipe.preparation],
                season: ['*'],
            }
        };
        const updateIngredientWith = ' updated';
        newProp.recipe.ingredients[0].ingName = newProp.recipe.ingredients[0].ingName.concat(updateIngredientWith);

        const updatePreparationWith = '.New part of a paragraph';
        newProp.recipe.preparation[0] = newProp.recipe.preparation[0].concat(updatePreparationWith);


        fireEvent.press(getByTestId('RecipeTitle::SetTextToEdit'), newProp.recipe.title);
        fireEvent.press(getByTestId('RecipeDescription::SetTextToEdit'), newProp.recipe.description);
        fireEvent.press(getByTestId('RecipeTags::RemoveTag'));
        fireEvent.press(getByTestId('RecipePersons::SetTextToEdit'), newProp.recipe.persons);
        fireEvent.press(getByTestId('RecipeIngredients::TextEdited'), updateIngredientWith);
        fireEvent.press(getByTestId('RecipeTime::SetTextToEdit'), newProp.recipe.time);
        fireEvent.press(getByTestId('RecipePreparation::TextEdited'), updatePreparationWith);

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
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId, queryByTestId} = render(<Recipe route={{params: mockRouteAddManually}}
                                                            navigation={mockNavigation}/>);

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

        checkImage(mockRouteAddManually, getByTestId, "");
        checkTitle(mockRouteAddManually, getByTestId, queryByTestId, newTitle);
        checkDescription(mockRouteAddManually, getByTestId, queryByTestId, newDescription);
        checkTags(mockRouteAddManually, getByTestId, queryByTestId, []);
        checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
        checkPersons(mockRouteAddManually, getByTestId, queryByTestId, newPersons);
        checkTime(mockRouteAddManually, getByTestId, queryByTestId, newTime);
        checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
    });

    test('shows validation error if recipe is incomplete', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId} = render(<Recipe route={{params: mockRouteAddOCR}} navigation={mockNavigation}/>);

        fireEvent.press(getByTestId('RecipeValidate::OnPressFunction'));
        // TODO what to expect here ?
    });

    test('toggles stackMode between readOnly and edit', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId, queryByTestId} = render(<Recipe route={{params: mockRouteReadOnly}}
                                                            navigation={mockNavigation}/>);
        const paramEdit: editRecipeManually = {...mockRouteReadOnly, mode: "edit"};
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
    });

    // TODO add delete test
});
