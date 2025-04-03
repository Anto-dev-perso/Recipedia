jest.mock('expo-sqlite', () => require('@mocks/deps/expo-sqlite-mock').expoSqliteMock());
jest.mock('@utils/FileGestion', () => require('@mocks/utils/FileGestion-mock.tsx').fileGestionMock());
jest.mock('@utils/ImagePicker', () => require('@mocks/utils/ImagePicker-mock').imagePickerMock());

jest.mock('@components/organisms/RecipeTags', () => require('@mocks/components/organisms/RecipeTags-mock').recipeTagsMock);
jest.mock('@components/organisms/RecipeImage', () => require('@mocks/components/organisms/RecipeImage-mock').recipeImageMock);
jest.mock('@components/organisms/RecipeText', () => require('@mocks/components/organisms/RecipeText-mock').recipeTextMock);
jest.mock('@components/organisms/RecipeNumber', () => require('@mocks/components/organisms/RecipeNumber-mock').recipeNumberMock);
jest.mock('@components/organisms/RecipeTextRender', () => require('@mocks/components/organisms/RecipeTextRender-mock').recipeTextRenderMock);
jest.mock('@components/molecules/BottomTopButton', () => require('@mocks/components/molecules/BottomTopButton-mock').bottomTopButtonMock);

import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import Recipe, {editRecipeManually, RecipePropType} from "@screens/Recipe";
import {recipesDataset} from "@test-data/recipesDataset";
import RecipeDatabase from "@utils/RecipeDatabase";
import {tagsDataset} from "@test-data/tagsDataset";
import {ingredientsDataset} from "@test-data/ingredientsDataset";
import {
    ingredientTableElement,
    recipeColumnsNames,
    recipeTableElement,
    shoppingListTableElement,
    tagTableElement
} from "@customTypes/DatabaseElementTypes";
import {StackScreenParamList} from "@customTypes/ScreenTypes";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {listFilter} from "@customTypes/RecipeFiltersTypes";
import {GetByQuery, QueryByQuery} from "@testing-library/react-native/build/queries/make-queries";
import {TextMatch, TextMatchOptions} from "@testing-library/react-native/build/matches";
import {CommonQueryOptions} from "@testing-library/react-native/build/queries/options";
import {textSeparator, unitySeparator} from "@styles/typography";


const newImageOCR = 'New Image URI';
const newTitleOCR = 'New Title';
const newDescriptionOCR = 'New description';
const newTagOCR = 'New tag';
const newPersonOCR = 31;
const newIngredientOCR: ingredientTableElement = {...ingredientsDataset[14], quantity: "4"};
const newPreparationOCR = 'New preparation';
const newTimeOCR = 99;

const defaultUri = '';

// TODO can be put outside of this file (in mock for instance)
const openModalForFieldMock = (recipeInstance: Recipe) => {
    return jest.fn((field: recipeColumnsNames) => {
        switch (field) {
            case recipeColumnsNames.image:
                recipeInstance.setRecipeImage(newImageOCR);
                break;
            case recipeColumnsNames.title:
                recipeInstance.setRecipeTitle(newTitleOCR);
                break;
            case recipeColumnsNames.description:
                recipeInstance.setRecipeDescription(newDescriptionOCR);
                break;
            case recipeColumnsNames.tags:
                recipeInstance.setRecipeTags([...recipeInstance.state.recipeTags, {tagName: newTagOCR}]);
                break;
            case recipeColumnsNames.persons:
                recipeInstance.setRecipePersons(newPersonOCR);
                break;
            case recipeColumnsNames.ingredients:
                recipeInstance.setRecipeIngredients([...recipeInstance.state.recipeIngredients, newIngredientOCR]);
                break;
            case recipeColumnsNames.preparation:
                recipeInstance.setRecipePreparation([...recipeInstance.state.recipePreparation, newPreparationOCR]);
                break;
            case recipeColumnsNames.time:
                recipeInstance.setRecipeTime(newTimeOCR);
                break;
        }
    })
};

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

function checkImage(prop: RecipePropType, getByTestId: GetByIdType, queryByTestId: QueryByIdType, newValueExpected?: string) {
    switch (prop.mode) {
        case "readOnly":
            expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual(`${prop.recipe.image_Source}`);
            expect(queryByTestId('RecipeImage::SetImgUri')).toBeNull();
            expect(queryByTestId('RecipeImage::OpenModal')).toBeNull();
            break;
        case "edit":
            expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual(prop.recipe.image_Source);
            expect(queryByTestId('RecipeImage::SetImgUri')).toBeNull();
            expect(queryByTestId('RecipeImage::OpenModal')).toBeNull();
            break;
        case "addManually":
            expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual(newValueExpected);
            expect(queryByTestId('RecipeImage::SetImgUri')).toBeNull();
            expect(queryByTestId('RecipeImage::OpenModal')).toBeNull();
            break;
        case "addFromPic":
            const imageUri = prop.imgUri;
            expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual(imageUri);
            if (imageUri == defaultUri) {
                expect(getByTestId('RecipeImage::SetImgUri').props.children).toBeTruthy();
                expect(getByTestId('RecipeImage::OpenModal').props.children).toBeTruthy();
            } else {
                expect(queryByTestId('RecipeImage::SetImgUri')).toBeNull();
                expect(queryByTestId('RecipeImage::OpenModal')).toBeNull();
            }
            break;
    }
}

function checkTitle(prop: RecipePropType, getByTestId: GetByIdType, queryByTestId: QueryByIdType, newValueExpected?: string) {
    switch (prop.mode) {
        case "readOnly":
            expect(getByTestId('RecipeTitle::RootText').props.children).toEqual(`{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"${prop.recipe.title}"}`);
            break;
        case  "edit":
            expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');
            expect(getByTestId('RecipeTitle::TextEditable').props.children).toEqual(`{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"${prop.recipe.title}"}`);
            expect(getByTestId('RecipeTitle::SetTextToEdit').props.children).toBeTruthy();
            break;
        case "addManually":
            expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');
            expect(getByTestId('RecipeTitle::TextEditable').props.children).toEqual(`{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"${newValueExpected}"}`);
            expect(getByTestId('RecipeTitle::SetTextToEdit').props.children).toBeTruthy();
            break;
        case "addFromPic":
            expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');
            if (prop.imgUri == defaultUri) {
                expect(getByTestId('RecipeTitle::Flex').props.children).toEqual('1');
                expect(getByTestId('RecipeTitle::OpenModal').props.children).toBeTruthy();
            } else {
                expect(queryByTestId('RecipeTitle::Flex')).toBeNull();
                expect(queryByTestId('RecipeTitle::OpenModal')).toBeNull();
            }
            break;
    }
}

function checkDescription(prop: RecipePropType, getByTestId: GetByIdType, queryByTestId: QueryByIdType, newValueExpected?: string) {
    switch (prop.mode) {
        case "readOnly":
            expect(getByTestId('RecipeDescription::RootText').props.children).toEqual(`{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":26.923076923076923,"fontWeight":"normal","textAlign":"left","paddingHorizontal":38.46153846153846,"paddingVertical":5.769230769230769},"value":"${prop.recipe.description}"}`);
            break;
        case "edit":
            expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');
            expect(getByTestId('RecipeDescription::TextEditable').props.children).toEqual(`{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"${prop.recipe.description}"}`);
            expect(getByTestId('RecipeDescription::SetTextToEdit').props.children).toBeTruthy();
            break;
        case "addManually":
            expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');
            expect(getByTestId('RecipeDescription::TextEditable').props.children).toEqual(`{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"${newValueExpected}"}`);
            expect(getByTestId('RecipeDescription::SetTextToEdit').props.children).toBeTruthy();
            break;
        case "addFromPic":
            expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');
            if (prop.imgUri == defaultUri) {
                expect(getByTestId('RecipeDescription::Flex').props.children).toEqual('1');
                expect(getByTestId('RecipeDescription::OpenModal').props.children).toBeTruthy();
            } else {
                expect(queryByTestId('RecipeDescription::Flex')).toBeNull();
                expect(queryByTestId('RecipeDescription::OpenModal')).toBeNull();
            }
            break;
    }
}

function checkTags(prop: RecipePropType, getByTestId: GetByIdType, newValueExpected?: Array<tagTableElement>) {
    switch (prop.mode) {
        case "readOnly":
            expect(getByTestId('RecipeTags::TagsList').props.children).toEqual(JSON.stringify(prop.recipe.tags.map(tag => tag.tagName)));
            break;
        case "edit":
            expect(getByTestId('RecipeTags::TagsList').props.children).toEqual(JSON.stringify(prop.recipe.tags.map(tag => tag.tagName)));
            expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ')).not.toEqual(recipesDataset[6].tags.map(tag => tag.tagName));
            expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
            expect(getByTestId('RecipeTags::RemoveTag').props.children).toBeTruthy();
            break;
        case "addManually":
            expect(getByTestId('RecipeTags::TagsList').props.children).toEqual(JSON.stringify(newValueExpected?.map(tag => tag.tagName)));
            expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ')).not.toEqual(recipesDataset[6].tags.map(tag => tag.tagName));
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
            break;
        case "edit":
            expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
            // @ts-ignore
            expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
            expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
            expect(getByTestId('RecipeIngredients::Column1').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":2},"value":"Quantity"}');
            expect(getByTestId('RecipeIngredients::Column2').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":1},"value":"Unit"}');
            expect(getByTestId('RecipeIngredients::Column3').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":3,"flexWrap":"wrap"},"value":"Ingredient name"}');
            break;
        case "addManually":
            expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
            // @ts-ignore
            expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
            expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
            expect(getByTestId('RecipeIngredients::Column1').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":2},"value":"Quantity"}');
            expect(getByTestId('RecipeIngredients::Column2').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":1},"value":"Unit"}');
            expect(getByTestId('RecipeIngredients::Column3').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":3,"flexWrap":"wrap"},"value":"Ingredient name"}');
            break;
        case "addFromPic":
            expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
            // @ts-ignore
            expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
            expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
            if (prop.imgUri.length == 0) {
                expect(getByTestId('RecipeIngredients::Flex').props.children).toBeUndefined();
                expect(getByTestId('RecipeIngredients::AlignItems').props.children).toBeUndefined();
                expect(getByTestId('RecipeIngredients::OpenModal').props.children).toBeTruthy();
            } else {
                expect(queryByTestId('RecipeIngredients::Flex')).toBeNull();
                expect(queryByTestId('RecipeIngredients::AlignItems')).toBeNull();
                expect(queryByTestId('RecipeIngredients::OpenModal')).toBeNull();
            }
            break;
    }
}

function checkPersons(prop: RecipePropType, getByTestId: GetByIdType, queryByTestId: QueryByIdType, newValueExpected?: number) {
    switch (prop.mode) {
        case "readOnly":
            expect(getByTestId('RecipePersons::RootText').props.children).toEqual(`{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Ingredients (${prop.recipe.persons} persons)"}`);
            break;
        case "edit":
            expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
            expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual('{"flexDirection":"row"}');
            expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
            expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
            expect(getByTestId('RecipePersons::TextEditable').props.children).toEqual(`{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":${prop.recipe.persons}}`);
            expect(getByTestId('RecipePersons::SetTextToEdit').props.children).toBeTruthy();
            break;
        case "addManually":
            expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
            expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual('{"flexDirection":"row"}');
            expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
            expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
            expect(getByTestId('RecipePersons::TextEditable').props.children).toEqual(`{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":${newValueExpected}}`);
            expect(getByTestId('RecipePersons::SetTextToEdit').props.children).toBeTruthy();
            break;
        case "addFromPic":
            expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
            expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual('{"flexDirection":"row"}');
            expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
            expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
            if (prop.imgUri == defaultUri) {
                expect(getByTestId('RecipePersons::Flex').props.children).toEqual(`6`);
                expect(getByTestId('RecipePersons::AlignItems').props.children).toEqual('"flex-start"');
                expect(getByTestId('RecipePersons::OpenModal').props.children).toBeTruthy();
            } else {
                expect(queryByTestId('RecipePersons::Flex')).toBeNull();
                expect(queryByTestId('RecipePersons::AlignItems')).toBeNull();
                expect(queryByTestId('RecipePersons::OpenModal')).toBeNull();
                break
            }
    }
}

function checkTime(prop: RecipePropType, getByTestId: GetByIdType, queryByTestId: QueryByIdType, newValueExpected?: number) {
    switch (prop.mode) {
        case "readOnly":
            expect(getByTestId('RecipeTime::RootText').props.children).toEqual(`{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Preparation (${prop.recipe.time} min)"}`);
            break;
        case "edit":
            expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
            expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual('{"flexDirection":"row"}');
            expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":7},"value":"Time to prepare the recipe :"}');
            expect(getByTestId('RecipeTime::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":1},"value":"min"}');
            expect(getByTestId('RecipeTime::TextEditable').props.children).toEqual(`{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":${prop.recipe.time}}`);
            expect(getByTestId('RecipeTime::SetTextToEdit').props.children).toBeTruthy();
            break;
        case "addManually":
            expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
            expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual('{"flexDirection":"row"}');
            expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":7},"value":"Time to prepare the recipe :"}');
            expect(getByTestId('RecipeTime::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":1},"value":"min"}');
            expect(getByTestId('RecipeTime::TextEditable').props.children).toEqual(`{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":${newValueExpected}}`);
            expect(getByTestId('RecipeTime::SetTextToEdit').props.children).toBeTruthy();
            break;
        case "addFromPic":
            expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
            expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual('{"flexDirection":"row"}');
            expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":6},"value":"Time to prepare the recipe : "}');

            if (prop.imgUri == defaultUri) {
                expect(getByTestId('RecipeTime::SuffixText').props.children).toBeUndefined();
                expect(getByTestId('RecipeTime::Flex').props.children).toEqual('3');
                expect(getByTestId('RecipeTime::AlignItems').props.children).toEqual('"flex-start"');
                expect(getByTestId('RecipeTime::OpenModal').props.children).toBeTruthy();
            } else {
                expect(getByTestId('RecipeTime::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":1},"value":"min"}');
                expect(queryByTestId('RecipeTime::Flex')).toBeNull();
                expect(queryByTestId('RecipeTime::AlignItems')).toBeNull();
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
            break;
        case "edit":
            expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
            expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
            expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();
            break;
        case "addManually":
            expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
            expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
            expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();
            break;
        case "addFromPic":

            expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
            // @ts-ignore
            expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
            expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();
            if (prop.imgUri.length == 0) {
                expect(getByTestId('RecipePreparation::Flex').props.children).toBeUndefined();
                expect(getByTestId('RecipePreparation::AlignItems').props.children).toBeUndefined();
                expect(getByTestId('RecipePreparation::OpenModal').props.children).toBeTruthy();
            } else {
                expect(queryByTestId('RecipePreparation::Flex')).toBeNull();
                expect(queryByTestId('RecipePreparation::AlignItems')).toBeNull();
                expect(queryByTestId('RecipePreparation::OpenModal')).toBeNull();
            }
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

        checkImage(mockRouteReadOnly, getByTestId, queryByTestId);
        checkTitle(mockRouteReadOnly, getByTestId, queryByTestId);
        checkDescription(mockRouteReadOnly, getByTestId, queryByTestId);
        checkTags(mockRouteReadOnly, getByTestId);
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

        checkImage(mockRouteEdit, getByTestId, queryByTestId);
        checkTitle(mockRouteEdit, getByTestId, queryByTestId);
        checkDescription(mockRouteEdit, getByTestId, queryByTestId);
        checkTags(mockRouteEdit, getByTestId, []);
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

        checkImage(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkTitle(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkDescription(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkTags(mockRouteAddManually, getByTestId, []);
        checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
        checkPersons(mockRouteAddManually, getByTestId, queryByTestId, -1);
        checkTime(mockRouteAddManually, getByTestId, queryByTestId, -1);
        checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
    });


    test('Initial state is correctly set in add ocr mode', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId, queryByTestId} = render(<Recipe route={{params: mockRouteAddOCR}}
                                                            navigation={mockNavigation}/>);

        checkBottomTopButtons(mockRouteAddOCR, getByTestId, queryByTestId);

        checkImage(mockRouteAddOCR, getByTestId, queryByTestId);
        checkTitle(mockRouteAddOCR, getByTestId, queryByTestId);
        checkDescription(mockRouteAddOCR, getByTestId, queryByTestId);
        checkTags(mockRouteAddOCR, getByTestId);
        checkPersons(mockRouteAddOCR, getByTestId, queryByTestId);
        checkIngredients(mockRouteAddOCR, getByTestId, queryByTestId);
        checkTime(mockRouteAddOCR, getByTestId, queryByTestId);
        checkPreparation(mockRouteAddOCR, getByTestId, queryByTestId);
    });

    // -------- CHANGE ON IMAGE CASES --------
    test('add recipeImage and reflects in RecipeImage only', async () => {
        // SetImgUri
        {
            const {getByTestId, queryByTestId} = render(
                //@ts-ignore route and navigation are not useful for UT
                <Recipe route={{params: mockRouteAddOCR}} navigation={mockNavigation}/>);

            const newImageUri = 'Updated URI';
            fireEvent.press(getByTestId('RecipeImage::SetImgUri'), newImageUri);
            const newAddOCRProp: RecipePropType = {...mockRouteAddOCR};


            checkTitle(newAddOCRProp, getByTestId, queryByTestId);
            checkDescription(newAddOCRProp, getByTestId, queryByTestId);
            checkTags(newAddOCRProp, getByTestId);
            checkPersons(newAddOCRProp, getByTestId, queryByTestId);
            checkIngredients(newAddOCRProp, getByTestId, queryByTestId);
            checkTime(newAddOCRProp, getByTestId, queryByTestId);
            checkPreparation(newAddOCRProp, getByTestId, queryByTestId);

            newAddOCRProp.imgUri = newImageUri;
            checkImage(newAddOCRProp, getByTestId, queryByTestId);
        }

        // OpenModal
        {
            const recipeRef = React.createRef<Recipe>();
            const {rerender, getByTestId, queryByTestId} = render(
                //@ts-ignore route and navigation are not useful for UT
                <Recipe route={{params: mockRouteAddOCR}} navigation={mockNavigation} ref={recipeRef}/>);

            const recipeInstance = recipeRef.current;
            expect(recipeInstance).not.toBeNull();

            recipeInstance!.openModalForField = openModalForFieldMock(recipeInstance!);

            // Force rerender to apply mock
            //@ts-ignore route and navigation are not useful for UT
            rerender(<Recipe route={{params: mockRouteAddOCR}} navigation={mockNavigation} ref={recipeRef}/>);

            fireEvent.press(getByTestId('RecipeImage::OpenModal'));
            const newAddOCRProp: RecipePropType = {...mockRouteAddOCR};

            checkTitle(newAddOCRProp, getByTestId, queryByTestId);
            checkDescription(newAddOCRProp, getByTestId, queryByTestId);
            checkTags(newAddOCRProp, getByTestId);
            checkPersons(newAddOCRProp, getByTestId, queryByTestId);
            checkIngredients(newAddOCRProp, getByTestId, queryByTestId);
            checkTime(newAddOCRProp, getByTestId, queryByTestId);
            checkPreparation(newAddOCRProp, getByTestId, queryByTestId);
            newAddOCRProp.imgUri = "New Image URI";

            checkImage(newAddOCRProp, getByTestId, queryByTestId);

        }
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

        checkImage(newEditProp, getByTestId, queryByTestId);
        checkTitle(newEditProp, getByTestId, queryByTestId);
        checkDescription(newEditProp, getByTestId, queryByTestId);
        checkTags(newEditProp, getByTestId);
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

        checkImage(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkTitle(mockRouteAddManually, getByTestId, queryByTestId, newTitle);
        checkDescription(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkTags(mockRouteAddManually, getByTestId, []);
        checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
        checkPersons(mockRouteAddManually, getByTestId, queryByTestId, -1);
        checkTime(mockRouteAddManually, getByTestId, queryByTestId, -1);
        checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
    });

    test('add recipeTitle and reflects in RecipeText only', async () => {

        const recipeRef = React.createRef<Recipe>();
        const {rerender, getByTestId, queryByTestId} = render(
            //@ts-ignore route and navigation are not useful for UT
            <Recipe route={{params: mockRouteAddOCR}} navigation={mockNavigation} ref={recipeRef}/>);

        const recipeInstance = recipeRef.current;
        expect(recipeInstance).not.toBeNull();

        recipeInstance!.openModalForField = openModalForFieldMock(recipeInstance!);

        // Force rerender to apply mock
        //@ts-ignore route and navigation are not useful for UT
        rerender(<Recipe route={{params: mockRouteAddOCR}} navigation={mockNavigation} ref={recipeRef}/>);

        fireEvent.press(getByTestId('RecipeTitle::OpenModal'));
        const newAddOCRProp: RecipePropType = {...mockRouteAddOCR};

        checkImage(newAddOCRProp, getByTestId, queryByTestId);
        checkDescription(newAddOCRProp, getByTestId, queryByTestId);
        checkTags(newAddOCRProp, getByTestId);
        checkPersons(newAddOCRProp, getByTestId, queryByTestId);
        checkIngredients(newAddOCRProp, getByTestId, queryByTestId);
        checkTime(newAddOCRProp, getByTestId, queryByTestId);
        checkPreparation(newAddOCRProp, getByTestId, queryByTestId);

        newAddOCRProp.imgUri = newTitleOCR;
        checkTitle(newAddOCRProp, getByTestId, queryByTestId);
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

        checkImage(newEditProp, getByTestId, queryByTestId);
        checkTitle(newEditProp, getByTestId, queryByTestId);
        checkDescription(newEditProp, getByTestId, queryByTestId);
        checkTags(newEditProp, getByTestId);
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

        checkImage(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkTitle(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkDescription(mockRouteAddManually, getByTestId, queryByTestId, newDescription);
        checkTags(mockRouteAddManually, getByTestId, []);
        checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
        checkPersons(mockRouteAddManually, getByTestId, queryByTestId, -1);
        checkTime(mockRouteAddManually, getByTestId, queryByTestId, -1);
        checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
    });

    test('add recipeDescription and reflects in RecipeDescription only', async () => {
        const recipeRef = React.createRef<Recipe>();
        const {rerender, getByTestId, queryByTestId} = render(
            //@ts-ignore route and navigation are not useful for UT
            <Recipe route={{params: mockRouteAddOCR}} navigation={mockNavigation} ref={recipeRef}/>);

        const recipeInstance = recipeRef.current;
        expect(recipeInstance).not.toBeNull();

        recipeInstance!.openModalForField = openModalForFieldMock(recipeInstance!);

        // Force rerender to apply mock
        //@ts-ignore route and navigation are not useful for UT
        rerender(<Recipe route={{params: mockRouteAddOCR}} navigation={mockNavigation} ref={recipeRef}/>);
        fireEvent.press(getByTestId('RecipeDescription::OpenModal'));

        const newAddOCRProp: RecipePropType = {...mockRouteAddOCR};

        checkImage(newAddOCRProp, getByTestId, queryByTestId);
        checkTitle(newAddOCRProp, getByTestId, queryByTestId);
        checkTags(newAddOCRProp, getByTestId);
        checkPersons(newAddOCRProp, getByTestId, queryByTestId);
        checkIngredients(newAddOCRProp, getByTestId, queryByTestId);
        checkTime(newAddOCRProp, getByTestId, queryByTestId);
        checkPreparation(newAddOCRProp, getByTestId, queryByTestId);

        newAddOCRProp.imgUri = newDescriptionOCR;
        checkDescription(newAddOCRProp, getByTestId, queryByTestId);
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

        checkImage(newEditProp, getByTestId, queryByTestId);
        checkTitle(newEditProp, getByTestId, queryByTestId);
        checkDescription(newEditProp, getByTestId, queryByTestId);
        checkTags(newEditProp, getByTestId);
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

        checkImage(newEditProp, getByTestId, queryByTestId);
        checkTitle(newEditProp, getByTestId, queryByTestId);
        checkDescription(newEditProp, getByTestId, queryByTestId);
        checkTags(newEditProp, getByTestId);
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

        checkImage(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkTitle(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkDescription(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkTags(mockRouteAddManually, getByTestId, []);
        checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
        checkPersons(mockRouteAddManually, getByTestId, queryByTestId, newPerson);
        checkTime(mockRouteAddManually, getByTestId, queryByTestId, -1);
        checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
    });

    test('add recipePersons and reflects in RecipePersons only', async () => {
        const recipeRef = React.createRef<Recipe>();
        const {rerender, getByTestId, queryByTestId} = render(
            //@ts-ignore route and navigation are not useful for UT
            <Recipe route={{params: mockRouteAddOCR}} navigation={mockNavigation} ref={recipeRef}/>);

        const recipeInstance = recipeRef.current;
        expect(recipeInstance).not.toBeNull();

        recipeInstance!.openModalForField = openModalForFieldMock(recipeInstance!);

        // Force rerender to apply mock
        //@ts-ignore route and navigation are not useful for UT
        rerender(<Recipe route={{params: mockRouteAddOCR}} navigation={mockNavigation} ref={recipeRef}/>);

        fireEvent.press(getByTestId('RecipePersons::OpenModal'));

        const newAddOCRProp: RecipePropType = {...mockRouteAddOCR};

        checkImage(newAddOCRProp, getByTestId, queryByTestId);
        checkTitle(newAddOCRProp, getByTestId, queryByTestId);
        checkDescription(newAddOCRProp, getByTestId, queryByTestId);
        checkTags(newAddOCRProp, getByTestId);
        checkIngredients(newAddOCRProp, getByTestId, queryByTestId);
        checkTime(newAddOCRProp, getByTestId, queryByTestId);
        checkPreparation(newAddOCRProp, getByTestId, queryByTestId);

        newAddOCRProp.imgUri = newPersonOCR.toString();
        checkPersons(newAddOCRProp, getByTestId, queryByTestId);
    });

    // -------- CHANGE ON INGREDIENTS CASES --------
    test('updates recipeIngredients and reflects in RecipeIngredients only', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId, queryByTestId} = render(<Recipe route={{params: mockRouteEdit}}
                                                            navigation={mockNavigation}/>);

        const updateValue = ' updated';
        fireEvent.press(getByTestId('RecipeIngredients::TextEdited'), updateValue);
        const newEditProp: editRecipeManually = {...mockRouteEdit};
        newEditProp.recipe.ingredients[0].ingName.concat(updateValue);

        checkImage(newEditProp, getByTestId, queryByTestId);
        checkTitle(newEditProp, getByTestId, queryByTestId);
        checkDescription(newEditProp, getByTestId, queryByTestId);
        checkTags(newEditProp, getByTestId);
        checkIngredients(newEditProp, getByTestId, queryByTestId);
        checkPersons(newEditProp, getByTestId, queryByTestId);
        checkTime(newEditProp, getByTestId, queryByTestId);
        checkPreparation(newEditProp, getByTestId, queryByTestId);
    });
// TODO ingredients missing for add manually

    test('add recipeIngredients and reflects in RecipeIngredients only', async () => {
        const recipeRef = React.createRef<Recipe>();
        const {rerender, getByTestId, queryByTestId} = render(
            //@ts-ignore route and navigation are not useful for UT
            <Recipe route={{params: mockRouteAddOCR}} navigation={mockNavigation} ref={recipeRef}/>);

        const recipeInstance = recipeRef.current;
        expect(recipeInstance).not.toBeNull();

        recipeInstance!.openModalForField = openModalForFieldMock(recipeInstance!);

        // Force rerender to apply mock
        //@ts-ignore route and navigation are not useful for UT
        rerender(<Recipe route={{params: mockRouteAddOCR}} navigation={mockNavigation} ref={recipeRef}/>);

        fireEvent.press(getByTestId('RecipeIngredients::OpenModal'));

        const newAddOCRProp: RecipePropType = {...mockRouteAddOCR};

        checkImage(newAddOCRProp, getByTestId, queryByTestId);
        checkTitle(newAddOCRProp, getByTestId, queryByTestId);
        checkDescription(newAddOCRProp, getByTestId, queryByTestId);
        checkTags(newAddOCRProp, getByTestId);
        checkPersons(newAddOCRProp, getByTestId, queryByTestId);
        checkTime(newAddOCRProp, getByTestId, queryByTestId);
        checkPreparation(newAddOCRProp, getByTestId, queryByTestId);

        newAddOCRProp.imgUri = JSON.stringify(newIngredientOCR);
        checkIngredients(newAddOCRProp, getByTestId, queryByTestId);
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

        checkImage(newEditProp, getByTestId, queryByTestId);
        checkTitle(newEditProp, getByTestId, queryByTestId);
        checkDescription(newEditProp, getByTestId, queryByTestId);
        checkTags(newEditProp, getByTestId);
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

        checkImage(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkTitle(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkDescription(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkTags(mockRouteAddManually, getByTestId, []);
        checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
        checkPersons(mockRouteAddManually, getByTestId, queryByTestId, -1);
        checkTime(mockRouteAddManually, getByTestId, queryByTestId, newTime);
        checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
    });

    test('add recipeTime and reflects in RecipeTime only', async () => {
        const recipeRef = React.createRef<Recipe>();
        const {rerender, getByTestId, queryByTestId} = render(
            //@ts-ignore route and navigation are not useful for UT
            <Recipe route={{params: mockRouteAddOCR}} navigation={mockNavigation} ref={recipeRef}/>);

        const recipeInstance = recipeRef.current;
        expect(recipeInstance).not.toBeNull();

        recipeInstance!.openModalForField = openModalForFieldMock(recipeInstance!);
        // Force rerender to apply mock
        //@ts-ignore route and navigation are not useful for UT
        rerender(<Recipe route={{params: mockRouteAddOCR}} navigation={mockNavigation} ref={recipeRef}/>);

        fireEvent.press(getByTestId('RecipeTime::OpenModal'));

        const newAddOCRProp: RecipePropType = {...mockRouteAddOCR};

        checkImage(newAddOCRProp, getByTestId, queryByTestId);
        checkTitle(newAddOCRProp, getByTestId, queryByTestId);
        checkDescription(newAddOCRProp, getByTestId, queryByTestId);
        checkTags(newAddOCRProp, getByTestId);
        checkPersons(newAddOCRProp, getByTestId, queryByTestId);
        checkIngredients(newAddOCRProp, getByTestId, queryByTestId);
        checkPreparation(newAddOCRProp, getByTestId, queryByTestId);

        newAddOCRProp.imgUri = newTimeOCR.toString();
        checkTime(newAddOCRProp, getByTestId, queryByTestId);

    });

    // -------- CHANGE ON PREPARATION CASES --------
    test('updates recipePreparation and reflects in RecipePreparation only', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId, queryByTestId} = render(<Recipe route={{params: mockRouteEdit}}
                                                            navigation={mockNavigation}/>);

        const newPreparation = ' New part of a paragraph';
        fireEvent.press(getByTestId('RecipePreparation::TextEdited'), newPreparation);
        const newEditProp: editRecipeManually = {...mockRouteEdit};
        newEditProp.recipe.preparation[0] = newPreparation;

        checkImage(newEditProp, getByTestId, queryByTestId);
        checkTitle(newEditProp, getByTestId, queryByTestId);
        checkDescription(newEditProp, getByTestId, queryByTestId);
        checkTags(newEditProp, getByTestId);
        checkIngredients(newEditProp, getByTestId, queryByTestId);
        checkPersons(newEditProp, getByTestId, queryByTestId);
        checkTime(newEditProp, getByTestId, queryByTestId);
        checkPreparation(newEditProp, getByTestId, queryByTestId);
    });

    // TODO preparation missing for add manually

    test('add recipePreparation and reflects in RecipePreparation only', async () => {
        const recipeRef = React.createRef<Recipe>();
        const {rerender, getByTestId, queryByTestId} = render(
            //@ts-ignore route and navigation are not useful for UT
            <Recipe route={{params: mockRouteAddOCR}} navigation={mockNavigation} ref={recipeRef}/>);

        const recipeInstance = recipeRef.current;
        expect(recipeInstance).not.toBeNull();

        recipeInstance!.openModalForField = openModalForFieldMock(recipeInstance!);
        // Force rerender to apply mock
        //@ts-ignore route and navigation are not useful for UT
        rerender(<Recipe route={{params: mockRouteAddOCR}} navigation={mockNavigation} ref={recipeRef}/>);

        fireEvent.press(getByTestId('RecipePreparation::OpenModal'));

        const newAddOCRProp: RecipePropType = {...mockRouteAddOCR};

        checkImage(newAddOCRProp, getByTestId, queryByTestId);
        checkTitle(newAddOCRProp, getByTestId, queryByTestId);
        checkDescription(newAddOCRProp, getByTestId, queryByTestId);
        checkTags(newAddOCRProp, getByTestId);
        checkPersons(newAddOCRProp, getByTestId, queryByTestId);
        checkIngredients(newAddOCRProp, getByTestId, queryByTestId);
        checkTime(newAddOCRProp, getByTestId, queryByTestId);

        newAddOCRProp.imgUri = newPreparationOCR;
        checkPreparation(newAddOCRProp, getByTestId, queryByTestId);

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
            type: "Grain or Cereal",
            unit: "pieces"
        }, {
            id: 2,
            name: "Chicken Breast",
            purchased: false,
            quantity: "300",
            recipesTitle: ["Chicken Tacos"],
            type: "Poultry",
            unit: "g"
        }, {
            id: 3,
            name: "Lettuce",
            purchased: false,
            quantity: "50",
            recipesTitle: ["Chicken Tacos"],
            type: "Vegetable",
            unit: "g"
        }, {
            id: 4,
            name: "Cheddar",
            purchased: false,
            quantity: "50",
            recipesTitle: ["Chicken Tacos"],
            type: "Cheese",
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
        checkImage(newProp, getByTestId, queryByTestId);
        checkDescription(newProp, getByTestId, queryByTestId);
        checkTags(newProp, getByTestId);
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

        checkImage(mockRouteAddManually, getByTestId, queryByTestId, "");
        checkTitle(mockRouteAddManually, getByTestId, queryByTestId, newTitle);
        checkDescription(mockRouteAddManually, getByTestId, queryByTestId, newDescription);
        checkTags(mockRouteAddManually, getByTestId, []);
        checkIngredients(mockRouteAddManually, getByTestId, queryByTestId);
        checkPersons(mockRouteAddManually, getByTestId, queryByTestId, newPersons);
        checkTime(mockRouteAddManually, getByTestId, queryByTestId, newTime);
        checkPreparation(mockRouteAddManually, getByTestId, queryByTestId);
    });

    test('validates button on add mode', async () => {
        const recipeRef = React.createRef<Recipe>();
        const {rerender, getByTestId, queryByTestId} = render(
            //@ts-ignore route and navigation are not useful for UT
            <Recipe route={{params: mockRouteAddOCR}} navigation={mockNavigation} ref={recipeRef}/>);

        const recipeInstance = recipeRef.current;
        expect(recipeInstance).not.toBeNull();

        recipeInstance!.openModalForField = openModalForFieldMock(recipeInstance!);

        // Force rerender to apply mock
        //@ts-ignore route and navigation are not useful for UT
        rerender(<Recipe route={{params: mockRouteAddOCR}} navigation={mockNavigation} ref={recipeRef}/>);

        fireEvent.press(getByTestId('RecipeImage::OpenModal'));
        fireEvent.press(getByTestId('RecipeTitle::OpenModal'));
        fireEvent.press(getByTestId('RecipeDescription::OpenModal'));
        fireEvent.press(getByTestId('RecipeTags::RemoveTag'));
        fireEvent.press(getByTestId('RecipePersons::OpenModal'));
        fireEvent.press(getByTestId('RecipeIngredients::OpenModal'));
        fireEvent.press(getByTestId('RecipeTime::OpenModal'));
        fireEvent.press(getByTestId('RecipePreparation::OpenModal'));
        fireEvent.press(getByTestId('RecipeValidate::OnPressFunction'));


        const newAddOCRProp: RecipePropType = {...mockRouteAddOCR};

        newAddOCRProp.imgUri = newImageOCR;
        checkImage(newAddOCRProp, getByTestId, queryByTestId);

        newAddOCRProp.imgUri = newTitleOCR;
        checkTitle(newAddOCRProp, getByTestId, queryByTestId);

        newAddOCRProp.imgUri = newDescriptionOCR;
        checkDescription(newAddOCRProp, getByTestId, queryByTestId);

        newAddOCRProp.imgUri = newTagOCR;
        checkTags(newAddOCRProp, getByTestId);

        newAddOCRProp.imgUri = newPersonOCR.toString();
        checkPersons(newAddOCRProp, getByTestId, queryByTestId);

        newAddOCRProp.imgUri = JSON.stringify(newIngredientOCR);
        checkIngredients(newAddOCRProp, getByTestId, queryByTestId);

        newAddOCRProp.imgUri = newTimeOCR.toString();
        checkTime(newAddOCRProp, getByTestId, queryByTestId);

        newAddOCRProp.imgUri = newPreparationOCR;
        checkPreparation(newAddOCRProp, getByTestId, queryByTestId);

        // TODO add a validation that new recipe is well inserted in the database
        await waitFor(() => {
            expect(mockNavigation.goBack).toHaveBeenCalled();
        });
        const recipesDb = RecipeDatabase.getInstance().get_recipes();
        expect(recipesDb.length).toEqual(11);
        const expected: recipeTableElement = {
            id: 11,
            image_Source: "",
            title: "New Title",
            description: "New description",
            tags: [],
            persons: 31,
            ingredients: [{
                id: 15,
                ingName: "Basil Leaves",
                unit: "g",
                type: listFilter.spice,
                season: ["5", "6", "7", "8", "9", "10"],
                quantity: "4"
            }],
            season: ["5", "6", "7", "8", "9", "10"],
            preparation: ["New preparation"],
            "time": 99
        };
        expect(recipesDb[recipesDb.length - 1]).toEqual(expected);
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
        const paramEdit: editRecipeManually = {...mockRouteReadOnly, mode: "edit"}
        fireEvent.press(getByTestId('RecipeEdit::OnPressFunction'));

        checkBottomTopButtons(paramEdit, getByTestId, queryByTestId);

        checkImage(paramEdit, getByTestId, queryByTestId);
        checkTitle(paramEdit, getByTestId, queryByTestId);
        checkDescription(paramEdit, getByTestId, queryByTestId);
        checkTags(paramEdit, getByTestId);
        checkIngredients(paramEdit, getByTestId, queryByTestId);
        checkPersons(paramEdit, getByTestId, queryByTestId);
        checkTime(paramEdit, getByTestId, queryByTestId);
        checkPreparation(paramEdit, getByTestId, queryByTestId);
    });

    // TODO add delete test
});
