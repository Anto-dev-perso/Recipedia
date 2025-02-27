import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import Recipe, {RecipePropType} from "@screens/Recipe";
import {recipesDataset} from "@test-data/recipesDataset";
import RecipeDatabase from "@utils/RecipeDatabase";
import {tagsDataset} from "@test-data/tagsDataset";
import {ingredientsDataset} from "@test-data/ingredientsDataset";
import {recipeColumnsNames, recipeTableElement, shoppingListTableElement} from "@customTypes/DatabaseElementTypes";
import {StackScreenParamList} from "@customTypes/ScreenTypes";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {listFilter} from "@customTypes/RecipeFiltersTypes";


jest.mock('expo-sqlite', () => require('@mocks/expo/expo-sqlite-mock').expoSqliteMock());
jest.mock('@utils/FileGestion', () => require('@mocks/utils/FileGestion-mock.tsx').fileGestionMock());

jest.mock('@components/organisms/RecipeTags', () => require('@mocks/components/organisms/RecipeTags-mock').recipeTagsMock);
jest.mock('@components/organisms/RecipeImage', () => require('@mocks/components/organisms/RecipeImage-mock').recipeImageMock);
jest.mock('@components/organisms/RecipeText', () => require('@mocks/components/organisms/RecipeText-mock').recipeTextMock);
jest.mock('@components/organisms/RecipeTextRender', () => require('@mocks/components/organisms/RecipeTextRender-mock').recipeTextRenderMock);
jest.mock('@components/molecules/BottomTopButton', () => require('@mocks/components/molecules/BottomTopButton-mock').bottomTopButtonMock);

// TODO can be put oustide of this file (in mock for instance)
const openModalForFieldMock = (recipeInstance: Recipe) => {
    return jest.fn((field: recipeColumnsNames) => {
        switch (field) {
            case recipeColumnsNames.image:
                recipeInstance.setRecipeImage('New Image URI');
                break;
            case recipeColumnsNames.title:
                recipeInstance.setRecipeTitle('New Title');
                break;
            case recipeColumnsNames.description:
                recipeInstance.setRecipeDescription('New description');
                break;
            case recipeColumnsNames.tags:
                recipeInstance.setRecipeTags([...recipeInstance.state.recipeTags, {tagName: 'New tag'}]);
                break;
            case recipeColumnsNames.persons:
                recipeInstance.setRecipePersons('31');
                break;
            case recipeColumnsNames.ingredients:
                recipeInstance.setRecipeIngredients([...recipeInstance.state.recipeIngredients, {
                    ...ingredientsDataset[14],
                    quantity: 4
                }]);
                break;
            case recipeColumnsNames.preparation:
                recipeInstance.setRecipePreparation([...recipeInstance.state.recipePreparation, 'New preparation']);
                break;
            case recipeColumnsNames.time:
                recipeInstance.setRecipeTime('99');
                break;
        }
    })
};

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
        mode: 'addManually',
        recipe: recipesDataset[6]
    };

    const mockRouteAdd: RecipePropType = {mode: 'addFromPic', img: {uri: 'not used', height: 100, width: 100}};

    const dbInstance = RecipeDatabase.getInstance();
    beforeEach(async () => {
        jest.clearAllMocks();

        await dbInstance.init();
        await dbInstance.addMultipleIngredients(ingredientsDataset);
        await dbInstance.addMultipleTags(tagsDataset);
        await dbInstance.addMultipleRecipes(recipesDataset);
    });
    afterEach(async () => await dbInstance.reset());

    // -------- INIT CASES --------
    test('Initial state is correctly set in readOnly mode', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId} = render(<Recipe route={{params: mockRouteReadOnly}} navigation={mockNavigation}/>);

        // Image part
        expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual('"tacos.jpg"');

        // Title part
        expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077},"value":"Chicken Tacos"}');

        // Description
        expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":26.923076923076923,"fontWeight":"normal","textAlign":"left","paddingHorizontal":38.46153846153846,"paddingVertical":5.769230769230769},"value":"Mexican-style tacos with chicken."}');

        // Tags
        expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('["Mexican","Lunch"]');
        expect(getByTestId('RecipeTags::OnPress')).toBeTruthy();

        // Persons
        expect(getByTestId('RecipePersons::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077},"value":"Ingredients (2 persons)"}');

        // Ingredients
        expect(getByTestId('RecipeIngredients::Text').props.children).toEqual('["6@@pieces--Taco Shells","300@@g--Chicken Breast","50@@g--Lettuce","50@@g--Cheddar"]');
        expect(getByTestId('RecipeIngredients::Title').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::Render').props.children).toEqual('"ARRAY"');
        expect(getByTestId('RecipeIngredients::WithBorder').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::OnClick')).toBeTruthy();
        expect(getByTestId('RecipeIngredients::OnChangeFunction')).toBeTruthy();

        // Time
        expect(getByTestId('RecipeTime::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077},"value":"Preparation (20 min)"}');

        // Preparation
        expect(getByTestId('RecipePreparation::Text').props.children).toEqual('["Cook the chicken breast and slice it into strips.","Fill each taco shell with chicken, lettuce, and cheddar.","Serve immediately."]');
        expect(getByTestId('RecipePreparation::Title').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::Render').props.children).toEqual('"SECTION"');
        expect(getByTestId('RecipePreparation::WithBorder').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::OnClick')).toBeTruthy();
        expect(getByTestId('RecipePreparation::OnChangeFunction')).toBeTruthy();
    });

    test('Initial state is correctly set in edit mode', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId} = render(<Recipe route={{params: mockRouteEdit}} navigation={mockNavigation}/>);

        // Image part
        expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual('"chocolate_cake.jpg"');

        // Title part
        expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');
        expect(getByTestId('RecipeTitle::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"Chocolate Cake"}');
        expect(getByTestId('RecipeTitle::SetTextToEdit').props.children).toBeTruthy();

        // Description
        expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');
        expect(getByTestId('RecipeDescription::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"Rich and moist chocolate cake."}');
        expect(getByTestId('RecipeDescription::SetTextToEdit').props.children).toBeTruthy();

        // Tags
        expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('["Dessert","Chocolate"]');
        expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ')).not.toEqual(recipesDataset[6].tags.map(tag => tag.tagName));
        expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
        expect(getByTestId('RecipeTags::ChangeTag').props.children).toBeTruthy();

        // Persons
        expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual('{"flexDirection":"row","padding":13.461538461538462}');
        expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
        expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
        expect(getByTestId('RecipePersons::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"6"}');
        expect(getByTestId('RecipePersons::SetTextToEdit').props.children).toBeTruthy();

        // Ingredients
        expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
        // @ts-ignore
        expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"textTransform\":\"uppercase\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
        expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::Column1').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":2},"value":"Quantity"}');
        expect(getByTestId('RecipeIngredients::Column2').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":1},"value":"Unit"}');
        expect(getByTestId('RecipeIngredients::Column3').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":3,"flexWrap":"wrap"},"value":"Ingredient name"}');

        // Time
        expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual('{\"flexDirection\":\"row\",\"padding\":13.461538461538462}');
        expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":7},"value":"Time to prepare the recipe :"}');
        expect(getByTestId('RecipeTime::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":1},"value":"min"}');
        expect(getByTestId('RecipeTime::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"60"}');
        expect(getByTestId('RecipeTime::SetTextToEdit').props.children).toBeTruthy();


        // Preparation
        expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
        expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();
    });

    test('Initial state is correctly set in add mode', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId} = render(<Recipe route={{params: mockRouteAdd}} navigation={mockNavigation}/>);

        // Image part
        expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual('""');
        expect(getByTestId('RecipeImage::SetImgUri').props.children).toBeTruthy();
        expect(getByTestId('RecipeImage::OpenModal').props.children).toBeTruthy();

        // Title part
        expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');
        expect(getByTestId('RecipeTitle::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::Flex').props.children).toEqual('1');
        expect(getByTestId('RecipeTitle::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::OpenModal').props.children).toBeTruthy();

        // Description
        expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');
        expect(getByTestId('RecipeDescription::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::Flex').props.children).toEqual('1');
        expect(getByTestId('RecipeDescription::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::OpenModal').props.children).toBeTruthy();


        // Tags
        expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('[]');
        expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ').length).toEqual(3);
        expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
        expect(getByTestId('RecipeTags::ChangeTag').props.children).toBeTruthy();

        // Persons
        expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual("{\"flexDirection\":\"row\",\"padding\":13.461538461538462}");
        expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
        expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
        expect(getByTestId('RecipePersons::Flex').props.children).toEqual('6');
        expect(getByTestId('RecipePersons::AlignItems').props.children).toEqual('"flex-start"');
        expect(getByTestId('RecipePersons::OpenModal').props.children).toBeTruthy();

        // Ingredients
        expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
        // @ts-ignore
        expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"textTransform\":\"uppercase\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
        expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::Flex').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::OpenModal').props.children).toBeTruthy();


        // Time
        expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual("{\"flexDirection\":\"row\",\"padding\":13.461538461538462}");
        expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":6},"value":"Time to prepare the recipe : "}');
        expect(getByTestId('RecipeTime::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::Flex').props.children).toEqual('3');
        expect(getByTestId('RecipeTime::AlignItems').props.children).toEqual('"flex-start"');
        expect(getByTestId('RecipeTime::OpenModal').props.children).toBeTruthy();

        // Preparation
        expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
        // @ts-ignore
        expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::Flex').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::OpenModal').props.children).toBeTruthy();
    });

    // -------- CHANGE ON IMAGE CASES --------
    test('add recipeImage and reflects in RecipeImage only', async () => {
        // SetImgUri
        {
            const {getByTestId, queryByTestId} = render(
                //@ts-ignore route and navigation are not useful for UT
                <Recipe route={{params: mockRouteAdd}} navigation={mockNavigation}/>);

            fireEvent.press(getByTestId('RecipeImage::SetImgUri'), 'Updated URI');


            // Image part
            expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual('"Updated URI"');
            expect(queryByTestId('RecipeImage::SetImgUri')).toBeNull();
            expect(queryByTestId('RecipeImage::OpenModal')).toBeNull();

            // Title part
            expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');
            expect(getByTestId('RecipeTitle::EditableViewStyle').props.children).toBeUndefined();
            expect(getByTestId('RecipeTitle::PrefixText').props.children).toBeUndefined();
            expect(getByTestId('RecipeTitle::SuffixText').props.children).toBeUndefined();
            expect(getByTestId('RecipeTitle::Flex').props.children).toEqual('1');
            expect(getByTestId('RecipeTitle::AlignItems').props.children).toBeUndefined();
            expect(getByTestId('RecipeTitle::OpenModal').props.children).toBeTruthy();

            // Description
            expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');
            expect(getByTestId('RecipeDescription::EditableViewStyle').props.children).toBeUndefined();
            expect(getByTestId('RecipeDescription::PrefixText').props.children).toBeUndefined();
            expect(getByTestId('RecipeDescription::SuffixText').props.children).toBeUndefined();
            expect(getByTestId('RecipeDescription::Flex').props.children).toEqual('1');
            expect(getByTestId('RecipeDescription::AlignItems').props.children).toBeUndefined();
            expect(getByTestId('RecipeDescription::OpenModal').props.children).toBeTruthy();


            // Tags
            expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('[]');
            expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ').length).toEqual(3);
            expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
            expect(getByTestId('RecipeTags::ChangeTag').props.children).toBeTruthy();

            // Persons
            expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
            expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual("{\"flexDirection\":\"row\",\"padding\":13.461538461538462}");
            expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
            expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
            expect(getByTestId('RecipePersons::Flex').props.children).toEqual('6');
            expect(getByTestId('RecipePersons::AlignItems').props.children).toEqual('"flex-start"');
            expect(getByTestId('RecipePersons::OpenModal').props.children).toBeTruthy();

            // Ingredients
            expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
            // @ts-ignore
            expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"textTransform\":\"uppercase\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
            expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
            expect(getByTestId('RecipeIngredients::Flex').props.children).toBeUndefined();
            expect(getByTestId('RecipeIngredients::AlignItems').props.children).toBeUndefined();
            expect(getByTestId('RecipeIngredients::OpenModal').props.children).toBeTruthy();


            // Time
            expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
            expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual("{\"flexDirection\":\"row\",\"padding\":13.461538461538462}");
            expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":6},"value":"Time to prepare the recipe : "}');
            expect(getByTestId('RecipeTime::SuffixText').props.children).toBeUndefined();
            expect(getByTestId('RecipeTime::Flex').props.children).toEqual('3');
            expect(getByTestId('RecipeTime::AlignItems').props.children).toEqual('"flex-start"');
            expect(getByTestId('RecipeTime::OpenModal').props.children).toBeTruthy();

            // Preparation
            expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
            // @ts-ignore
            expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
            expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();
            expect(getByTestId('RecipePreparation::Flex').props.children).toBeUndefined();
            expect(getByTestId('RecipePreparation::AlignItems').props.children).toBeUndefined();
            expect(getByTestId('RecipePreparation::OpenModal').props.children).toBeTruthy();
        }


        // OpenModal
        {
            const recipeRef = React.createRef<Recipe>();
            const {rerender, getByTestId, queryByTestId} = render(
                //@ts-ignore route and navigation are not useful for UT
                <Recipe route={{params: mockRouteAdd}} navigation={mockNavigation} ref={recipeRef}/>);

            const recipeInstance = recipeRef.current;
            expect(recipeInstance).not.toBeNull();

            recipeInstance!.openModalForField = openModalForFieldMock(recipeInstance!);


            // Force rerender to apply mock
            //@ts-ignore route and navigation are not useful for UT
            rerender(<Recipe route={{params: mockRouteAdd}} navigation={mockNavigation} ref={recipeRef}/>);

            fireEvent.press(getByTestId('RecipeImage::OpenModal'));


            // Image part
            expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual('"New Image URI"');
            expect(queryByTestId('queryByTestId::SetImgUri')).toBeNull();
            expect(queryByTestId('queryByTestId::OpenModal')).toBeNull();

            // Title part
            expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');
            expect(getByTestId('RecipeTitle::EditableViewStyle').props.children).toBeUndefined();
            expect(getByTestId('RecipeTitle::PrefixText').props.children).toBeUndefined();
            expect(getByTestId('RecipeTitle::SuffixText').props.children).toBeUndefined();
            expect(getByTestId('RecipeTitle::Flex').props.children).toEqual('1');
            expect(getByTestId('RecipeTitle::AlignItems').props.children).toBeUndefined();
            expect(getByTestId('RecipeTitle::OpenModal').props.children).toBeTruthy();

            // Description
            expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');
            expect(getByTestId('RecipeDescription::EditableViewStyle').props.children).toBeUndefined();
            expect(getByTestId('RecipeDescription::PrefixText').props.children).toBeUndefined();
            expect(getByTestId('RecipeDescription::SuffixText').props.children).toBeUndefined();
            expect(getByTestId('RecipeDescription::Flex').props.children).toEqual('1');
            expect(getByTestId('RecipeDescription::AlignItems').props.children).toBeUndefined();
            expect(getByTestId('RecipeDescription::OpenModal').props.children).toBeTruthy();


            // Tags
            expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('[]');
            expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ').length).toEqual(3);
            expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
            expect(getByTestId('RecipeTags::ChangeTag').props.children).toBeTruthy();

            // Persons
            expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
            expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual("{\"flexDirection\":\"row\",\"padding\":13.461538461538462}");
            expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
            expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
            expect(getByTestId('RecipePersons::Flex').props.children).toEqual('6');
            expect(getByTestId('RecipePersons::AlignItems').props.children).toEqual('"flex-start"');
            expect(getByTestId('RecipePersons::OpenModal').props.children).toBeTruthy();

            // Ingredients
            expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
            // @ts-ignore
            expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"textTransform\":\"uppercase\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
            expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
            expect(getByTestId('RecipeIngredients::Flex').props.children).toBeUndefined();
            expect(getByTestId('RecipeIngredients::AlignItems').props.children).toBeUndefined();
            expect(getByTestId('RecipeIngredients::OpenModal').props.children).toBeTruthy();


            // Time
            expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
            expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual("{\"flexDirection\":\"row\",\"padding\":13.461538461538462}");
            expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":6},"value":"Time to prepare the recipe : "}');
            expect(getByTestId('RecipeTime::SuffixText').props.children).toBeUndefined();
            expect(getByTestId('RecipeTime::Flex').props.children).toEqual('3');
            expect(getByTestId('RecipeTime::AlignItems').props.children).toEqual('"flex-start"');
            expect(getByTestId('RecipeTime::OpenModal').props.children).toBeTruthy();

            // Preparation
            expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
            // @ts-ignore
            expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
            expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();
            expect(getByTestId('RecipePreparation::Flex').props.children).toBeUndefined();
            expect(getByTestId('RecipePreparation::AlignItems').props.children).toBeUndefined();
            expect(getByTestId('RecipePreparation::OpenModal').props.children).toBeTruthy();
        }
    });

    // -------- CHANGE ON TITLE CASES --------
    test('updates recipeTitle and reflects in RecipeText only', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId} = render(<Recipe route={{params: mockRouteEdit}} navigation={mockNavigation}/>);

        fireEvent.press(getByTestId('RecipeTitle::SetTextToEdit'), 'New Recipe Title');

        // Verify the updated title state is reflected
        // Title part
        expect(getByTestId('RecipeTitle::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"New Recipe Title"}');
        expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');
        expect(getByTestId('RecipeTitle::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::SetTextToEdit').props.children).toBeTruthy();

        /*Verify others component*/

        // Image part
        expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual('"chocolate_cake.jpg"');


        // Description
        expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');
        expect(getByTestId('RecipeDescription::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"Rich and moist chocolate cake."}');
        expect(getByTestId('RecipeDescription::SetTextToEdit').props.children).toBeTruthy();

        // Tags
        expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('["Dessert","Chocolate"]');
        expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ')).not.toEqual(recipesDataset[6].tags.map(tag => tag.tagName));
        expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
        expect(getByTestId('RecipeTags::ChangeTag').props.children).toBeTruthy();

        // Persons
        expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual('{"flexDirection":"row","padding":13.461538461538462}');
        expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
        expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
        expect(getByTestId('RecipePersons::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"6"}');
        expect(getByTestId('RecipePersons::SetTextToEdit').props.children).toBeTruthy();

        // Ingredients
        expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
        // @ts-ignore
        expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"textTransform\":\"uppercase\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
        expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::TextEditable').props.children).toEqual('["200@@g--Flour","50@@g--Cocoa Powder","150@@g--Sugar","100@@g--Butter"]');
        expect(getByTestId('RecipeIngredients::Column1').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":2},"value":"Quantity"}');
        expect(getByTestId('RecipeIngredients::Column2').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":1},"value":"Unit"}');
        expect(getByTestId('RecipeIngredients::Column3').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":3,"flexWrap":"wrap"},"value":"Ingredient name"}');

        // Time
        expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual('{\"flexDirection\":\"row\",\"padding\":13.461538461538462}');
        expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":7},"value":"Time to prepare the recipe :"}');
        expect(getByTestId('RecipeTime::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":1},"value":"min"}');
        expect(getByTestId('RecipeTime::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"60"}');
        expect(getByTestId('RecipeTime::SetTextToEdit').props.children).toBeTruthy();


        // Preparation
        expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
        expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();
    });

    test('add recipeTitle and reflects in RecipeText only', async () => {

        const recipeRef = React.createRef<Recipe>();
        const {rerender, getByTestId} = render(
            //@ts-ignore route and navigation are not useful for UT
            <Recipe route={{params: mockRouteAdd}} navigation={mockNavigation} ref={recipeRef}/>);

        const recipeInstance = recipeRef.current;
        expect(recipeInstance).not.toBeNull();

        recipeInstance!.openModalForField = openModalForFieldMock(recipeInstance!);

        // Force rerender to apply mock
        //@ts-ignore route and navigation are not useful for UT
        rerender(<Recipe route={{params: mockRouteAdd}} navigation={mockNavigation} ref={recipeRef}/>);

        fireEvent.press(getByTestId('RecipeTitle::OpenModal'));

        // Verify the updated title state is reflected
        expect(getByTestId('RecipeTitle::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"New Title"}');
        expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');
        expect(getByTestId('RecipeTitle::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::SetTextToEdit').props.children).toBeTruthy();

        /*Verify others component*/

        // Image part
        expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual('""');
        expect(getByTestId('RecipeImage::SetImgUri').props.children).toBeTruthy();
        expect(getByTestId('RecipeImage::OpenModal').props.children).toBeTruthy();


        // Description
        expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');
        expect(getByTestId('RecipeDescription::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::Flex').props.children).toEqual('1');
        expect(getByTestId('RecipeDescription::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::OpenModal').props.children).toBeTruthy();


        // Tags
        expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('[]');
        expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ').length).toEqual(3);
        expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
        expect(getByTestId('RecipeTags::ChangeTag').props.children).toBeTruthy();

        // Persons
        expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual("{\"flexDirection\":\"row\",\"padding\":13.461538461538462}");
        expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
        expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
        expect(getByTestId('RecipePersons::Flex').props.children).toEqual('6');
        expect(getByTestId('RecipePersons::AlignItems').props.children).toEqual('"flex-start"');
        expect(getByTestId('RecipePersons::OpenModal').props.children).toBeTruthy();

        // Ingredients
        expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
        // @ts-ignore
        expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"textTransform\":\"uppercase\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
        expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::Flex').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::OpenModal').props.children).toBeTruthy();


        // Time
        expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual("{\"flexDirection\":\"row\",\"padding\":13.461538461538462}");
        expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":6},"value":"Time to prepare the recipe : "}');
        expect(getByTestId('RecipeTime::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::Flex').props.children).toEqual('3');
        expect(getByTestId('RecipeTime::AlignItems').props.children).toEqual('"flex-start"');
        expect(getByTestId('RecipeTime::OpenModal').props.children).toBeTruthy();

        // Preparation
        expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
        // @ts-ignore
        expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::Flex').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::OpenModal').props.children).toBeTruthy();
    });

    // -------- CHANGE ON DESCRIPTION CASES --------
    test('updates recipeDescription and reflects in RecipeDescription only', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId} = render(<Recipe route={{params: mockRouteEdit}} navigation={mockNavigation}/>);

        fireEvent.press(getByTestId('RecipeDescription::SetTextToEdit'), 'New Recipe Description');

        // Image part
        expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual('"chocolate_cake.jpg"');

        // Title part
        expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');
        expect(getByTestId('RecipeTitle::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"Chocolate Cake"}');
        expect(getByTestId('RecipeTitle::SetTextToEdit').props.children).toBeTruthy();

        // Description
        expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');
        expect(getByTestId('RecipeDescription::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"New Recipe Description"}');
        expect(getByTestId('RecipeDescription::SetTextToEdit').props.children).toBeTruthy();

        // Tags
        expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('["Dessert","Chocolate"]');
        expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ')).not.toEqual(recipesDataset[6].tags.map(tag => tag.tagName));
        expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
        expect(getByTestId('RecipeTags::ChangeTag').props.children).toBeTruthy();

        // Persons
        expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual('{"flexDirection":"row","padding":13.461538461538462}');
        expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
        expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
        expect(getByTestId('RecipePersons::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"6"}');
        expect(getByTestId('RecipePersons::SetTextToEdit').props.children).toBeTruthy();

        // Ingredients
        expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
        // @ts-ignore
        expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"textTransform\":\"uppercase\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
        expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::TextEditable').props.children).toEqual('["200@@g--Flour","50@@g--Cocoa Powder","150@@g--Sugar","100@@g--Butter"]');
        expect(getByTestId('RecipeIngredients::Column1').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":2},"value":"Quantity"}');
        expect(getByTestId('RecipeIngredients::Column2').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":1},"value":"Unit"}');
        expect(getByTestId('RecipeIngredients::Column3').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":3,"flexWrap":"wrap"},"value":"Ingredient name"}');

        // Time
        expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual('{\"flexDirection\":\"row\",\"padding\":13.461538461538462}');
        expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":7},"value":"Time to prepare the recipe :"}');
        expect(getByTestId('RecipeTime::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":1},"value":"min"}');
        expect(getByTestId('RecipeTime::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"60"}');
        expect(getByTestId('RecipeTime::SetTextToEdit').props.children).toBeTruthy();


        // Preparation
        expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
        expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();

    });
    test('add recipeDescription and reflects in RecipeDescription only', async () => {
        const recipeRef = React.createRef<Recipe>();
        const {rerender, getByTestId, queryByTestId} = render(
            //@ts-ignore route and navigation are not useful for UT
            <Recipe route={{params: mockRouteAdd}} navigation={mockNavigation} ref={recipeRef}/>);

        const recipeInstance = recipeRef.current;
        expect(recipeInstance).not.toBeNull();

        recipeInstance!.openModalForField = openModalForFieldMock(recipeInstance!);

        // Force rerender to apply mock
        //@ts-ignore route and navigation are not useful for UT
        rerender(<Recipe route={{params: mockRouteAdd}} navigation={mockNavigation} ref={recipeRef}/>);
        fireEvent.press(getByTestId('RecipeDescription::OpenModal'));

        // Image part
        expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual('""');
        expect(getByTestId('RecipeImage::SetImgUri').props.children).toBeTruthy();
        expect(getByTestId('RecipeImage::OpenModal').props.children).toBeTruthy();

        // Title part
        expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');
        expect(getByTestId('RecipeTitle::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::Flex').props.children).toEqual('1');
        expect(getByTestId('RecipeTitle::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::OpenModal').props.children).toBeTruthy();

        // Description
        expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');
        expect(getByTestId('RecipeDescription::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::SuffixText').props.children).toBeUndefined();
        expect(queryByTestId('RecipeDescription::Flex')).toBeNull();
        expect(queryByTestId('RecipeDescription::AlignItems')).toBeNull();
        expect(queryByTestId('RecipeDescription::OpenModal')).toBeNull();

        expect(getByTestId('RecipeDescription::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"New description"}');
        expect(getByTestId('RecipeDescription::SetTextToEdit').props.children).toBeTruthy();


        // Tags
        expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('[]');
        expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ').length).toEqual(3);
        expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
        expect(getByTestId('RecipeTags::ChangeTag').props.children).toBeTruthy();

        // Persons
        expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual("{\"flexDirection\":\"row\",\"padding\":13.461538461538462}");
        expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
        expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
        expect(getByTestId('RecipePersons::Flex').props.children).toEqual('6');
        expect(getByTestId('RecipePersons::AlignItems').props.children).toEqual('"flex-start"');
        expect(getByTestId('RecipePersons::OpenModal').props.children).toBeTruthy();

        // Ingredients
        expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
        // @ts-ignore
        expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"textTransform\":\"uppercase\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
        expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::Flex').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::OpenModal').props.children).toBeTruthy();


        // Time
        expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual("{\"flexDirection\":\"row\",\"padding\":13.461538461538462}");
        expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":6},"value":"Time to prepare the recipe : "}');
        expect(getByTestId('RecipeTime::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::Flex').props.children).toEqual('3');
        expect(getByTestId('RecipeTime::AlignItems').props.children).toEqual('"flex-start"');
        expect(getByTestId('RecipeTime::OpenModal').props.children).toBeTruthy();

        // Preparation
        expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
        // @ts-ignore
        expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::Flex').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::OpenModal').props.children).toBeTruthy();
    });

    // -------- CHANGE ON TAGS CASES --------
    test('updates recipeTags and reflects in RecipeTags only', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId} = render(<Recipe route={{params: mockRouteEdit}} navigation={mockNavigation}/>);

        fireEvent.press(getByTestId('RecipeTags::ChangeTag'));


        // Image part
        expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual('"chocolate_cake.jpg"');

        // Title part
        expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');
        expect(getByTestId('RecipeTitle::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"Chocolate Cake"}');
        expect(getByTestId('RecipeTitle::SetTextToEdit').props.children).toBeTruthy();

        // Description
        expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');
        expect(getByTestId('RecipeDescription::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"Rich and moist chocolate cake."}');
        expect(getByTestId('RecipeDescription::SetTextToEdit').props.children).toBeTruthy();

        // Tags
        expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('["Dessert changed","Chocolate"]');
        expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ')).not.toEqual(recipesDataset[6].tags.map(tag => tag.tagName));
        expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
        expect(getByTestId('RecipeTags::ChangeTag').props.children).toBeTruthy();

        // Persons
        expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual('{"flexDirection":"row","padding":13.461538461538462}');
        expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
        expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
        expect(getByTestId('RecipePersons::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"6"}');
        expect(getByTestId('RecipePersons::SetTextToEdit').props.children).toBeTruthy();

        // Ingredients
        expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
        // @ts-ignore
        expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"textTransform\":\"uppercase\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
        expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::TextEditable').props.children).toEqual('["200@@g--Flour","50@@g--Cocoa Powder","150@@g--Sugar","100@@g--Butter"]');
        expect(getByTestId('RecipeIngredients::Column1').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":2},"value":"Quantity"}');
        expect(getByTestId('RecipeIngredients::Column2').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":1},"value":"Unit"}');
        expect(getByTestId('RecipeIngredients::Column3').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":3,"flexWrap":"wrap"},"value":"Ingredient name"}');

        // Time
        expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual('{\"flexDirection\":\"row\",\"padding\":13.461538461538462}');
        expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":7},"value":"Time to prepare the recipe :"}');
        expect(getByTestId('RecipeTime::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":1},"value":"min"}');
        expect(getByTestId('RecipeTime::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"60"}');
        expect(getByTestId('RecipeTime::SetTextToEdit').props.children).toBeTruthy();


        // Preparation
        expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
        expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();

    });

    // -------- CHANGE ON PERSONS CASES --------
    test('updates recipePersons and reflects in RecipePersons only', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId} = render(<Recipe route={{params: mockRouteEdit}} navigation={mockNavigation}/>);

        fireEvent.press(getByTestId('RecipePersons::SetTextToEdit'), '23');

        // Image part
        expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual('"chocolate_cake.jpg"');

        // Title part
        expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');
        expect(getByTestId('RecipeTitle::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"Chocolate Cake"}');
        expect(getByTestId('RecipeTitle::SetTextToEdit').props.children).toBeTruthy();

        // Description
        expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');
        expect(getByTestId('RecipeDescription::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"Rich and moist chocolate cake."}');
        expect(getByTestId('RecipeDescription::SetTextToEdit').props.children).toBeTruthy();

        // Tags
        expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('["Dessert","Chocolate"]');
        expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ')).not.toEqual(recipesDataset[6].tags.map(tag => tag.tagName));
        expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
        expect(getByTestId('RecipeTags::ChangeTag').props.children).toBeTruthy();

        // Persons
        expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual('{"flexDirection":"row","padding":13.461538461538462}');
        expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
        expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
        expect(getByTestId('RecipePersons::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"23"}');
        expect(getByTestId('RecipePersons::SetTextToEdit').props.children).toBeTruthy();

        // Ingredients
        expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
        // @ts-ignore
        expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"textTransform\":\"uppercase\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
        expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::TextEditable').props.children).toEqual('["200@@g--Flour","50@@g--Cocoa Powder","150@@g--Sugar","100@@g--Butter"]');
        expect(getByTestId('RecipeIngredients::Column1').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":2},"value":"Quantity"}');
        expect(getByTestId('RecipeIngredients::Column2').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":1},"value":"Unit"}');
        expect(getByTestId('RecipeIngredients::Column3').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":3,"flexWrap":"wrap"},"value":"Ingredient name"}');

        // Time
        expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual('{\"flexDirection\":\"row\",\"padding\":13.461538461538462}');
        expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":7},"value":"Time to prepare the recipe :"}');
        expect(getByTestId('RecipeTime::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":1},"value":"min"}');
        expect(getByTestId('RecipeTime::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"60"}');
        expect(getByTestId('RecipeTime::SetTextToEdit').props.children).toBeTruthy();


        // Preparation
        expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
        expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();

    });
    test('add recipePersons and reflects in RecipePersons only', async () => {
        const recipeRef = React.createRef<Recipe>();
        const {rerender, getByTestId, queryByTestId} = render(
            //@ts-ignore route and navigation are not useful for UT
            <Recipe route={{params: mockRouteAdd}} navigation={mockNavigation} ref={recipeRef}/>);

        const recipeInstance = recipeRef.current;
        expect(recipeInstance).not.toBeNull();

        recipeInstance!.openModalForField = openModalForFieldMock(recipeInstance!);

        // Force rerender to apply mock
        //@ts-ignore route and navigation are not useful for UT
        rerender(<Recipe route={{params: mockRouteAdd}} navigation={mockNavigation} ref={recipeRef}/>);

        fireEvent.press(getByTestId('RecipePersons::OpenModal'));


        // Image part
        expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual('""');
        expect(getByTestId('RecipeImage::SetImgUri').props.children).toBeTruthy();
        expect(getByTestId('RecipeImage::OpenModal').props.children).toBeTruthy();

        // Title part
        expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');
        expect(getByTestId('RecipeTitle::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::Flex').props.children).toEqual('1');
        expect(getByTestId('RecipeTitle::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::OpenModal').props.children).toBeTruthy();

        // Description
        expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');
        expect(getByTestId('RecipeDescription::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::Flex').props.children).toEqual('1');
        expect(getByTestId('RecipeDescription::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::OpenModal').props.children).toBeTruthy();


        // Tags
        expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('[]');
        expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ').length).toEqual(3);
        expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
        expect(getByTestId('RecipeTags::ChangeTag').props.children).toBeTruthy();

        // Persons
        expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual("{\"flexDirection\":\"row\",\"padding\":13.461538461538462}");
        expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
        expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
        expect(queryByTestId('RecipePersons::Flex')).toBeNull();
        expect(queryByTestId('RecipePersons::AlignItems')).toBeNull();
        expect(queryByTestId('RecipePersons::OpenModal')).toBeNull();
        expect(getByTestId('RecipePersons::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"31"}');
        expect(getByTestId('RecipePersons::SetTextToEdit').props.children).toBeTruthy();

        // Ingredients
        expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
        // @ts-ignore
        expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"textTransform\":\"uppercase\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
        expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::Flex').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::OpenModal').props.children).toBeTruthy();


        // Time
        expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual("{\"flexDirection\":\"row\",\"padding\":13.461538461538462}");
        expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":6},"value":"Time to prepare the recipe : "}');
        expect(getByTestId('RecipeTime::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::Flex').props.children).toEqual('3');
        expect(getByTestId('RecipeTime::AlignItems').props.children).toEqual('"flex-start"');
        expect(getByTestId('RecipeTime::OpenModal').props.children).toBeTruthy();

        // Preparation
        expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
        // @ts-ignore
        expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::Flex').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::OpenModal').props.children).toBeTruthy();
    });

    // -------- CHANGE ON INGREDIENTS CASES --------
    test('updates recipeIngredients and reflects in RecipeIngredients only', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId} = render(<Recipe route={{params: mockRouteEdit}} navigation={mockNavigation}/>);

        fireEvent.press(getByTestId('RecipeIngredients::TextEdited'), ' updated');

        // Image part
        expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual('"chocolate_cake.jpg"');

        // Title part
        expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');
        expect(getByTestId('RecipeTitle::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"Chocolate Cake"}');
        expect(getByTestId('RecipeTitle::SetTextToEdit').props.children).toBeTruthy();

        // Description
        expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');
        expect(getByTestId('RecipeDescription::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"Rich and moist chocolate cake."}');
        expect(getByTestId('RecipeDescription::SetTextToEdit').props.children).toBeTruthy();

        // Tags
        expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('["Dessert","Chocolate"]');
        expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ')).not.toEqual(recipesDataset[6].tags.map(tag => tag.tagName));
        expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
        expect(getByTestId('RecipeTags::ChangeTag').props.children).toBeTruthy();

        // Persons
        expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual('{"flexDirection":"row","padding":13.461538461538462}');
        expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
        expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
        expect(getByTestId('RecipePersons::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"6"}');
        expect(getByTestId('RecipePersons::SetTextToEdit').props.children).toBeTruthy();

        // Ingredients
        expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
        // @ts-ignore
        expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"textTransform\":\"uppercase\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
        expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::TextEditable').props.children).toEqual('["200@@g--Flour updated","50@@g--Cocoa Powder","150@@g--Sugar","100@@g--Butter"]');
        expect(getByTestId('RecipeIngredients::Column1').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":2},"value":"Quantity"}');
        expect(getByTestId('RecipeIngredients::Column2').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":1},"value":"Unit"}');
        expect(getByTestId('RecipeIngredients::Column3').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":3,"flexWrap":"wrap"},"value":"Ingredient name"}');

        // Time
        expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual('{\"flexDirection\":\"row\",\"padding\":13.461538461538462}');
        expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":7},"value":"Time to prepare the recipe :"}');
        expect(getByTestId('RecipeTime::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":1},"value":"min"}');
        expect(getByTestId('RecipeTime::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"60"}');
        expect(getByTestId('RecipeTime::SetTextToEdit').props.children).toBeTruthy();


        // Preparation
        expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
        expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();

    });
    test('add recipeIngredients and reflects in RecipeIngredients only', async () => {
        const recipeRef = React.createRef<Recipe>();
        const {rerender, getByTestId, queryByTestId} = render(
            //@ts-ignore route and navigation are not useful for UT
            <Recipe route={{params: mockRouteAdd}} navigation={mockNavigation} ref={recipeRef}/>);

        const recipeInstance = recipeRef.current;
        expect(recipeInstance).not.toBeNull();

        recipeInstance!.openModalForField = openModalForFieldMock(recipeInstance!);

        // Force rerender to apply mock
        //@ts-ignore route and navigation are not useful for UT
        rerender(<Recipe route={{params: mockRouteAdd}} navigation={mockNavigation} ref={recipeRef}/>);

        fireEvent.press(getByTestId('RecipeIngredients::OpenModal'));

        // Image part
        expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual('""');
        expect(getByTestId('RecipeImage::SetImgUri').props.children).toBeTruthy();
        expect(getByTestId('RecipeImage::OpenModal').props.children).toBeTruthy();

        // Title part
        expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');
        expect(getByTestId('RecipeTitle::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::Flex').props.children).toEqual('1');
        expect(getByTestId('RecipeTitle::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::OpenModal').props.children).toBeTruthy();

        // Description
        expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');
        expect(getByTestId('RecipeDescription::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::Flex').props.children).toEqual('1');
        expect(getByTestId('RecipeDescription::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::OpenModal').props.children).toBeTruthy();


        // Tags
        expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('[]');
        expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ').length).toEqual(3);
        expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
        expect(getByTestId('RecipeTags::ChangeTag').props.children).toBeTruthy();

        // Persons
        expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual("{\"flexDirection\":\"row\",\"padding\":13.461538461538462}");
        expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
        expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
        expect(getByTestId('RecipePersons::Flex').props.children).toEqual('6');
        expect(getByTestId('RecipePersons::AlignItems').props.children).toEqual('"flex-start"');
        expect(getByTestId('RecipePersons::OpenModal').props.children).toBeTruthy();

        // Ingredients
        expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
        // @ts-ignore
        expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"textTransform\":\"uppercase\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
        expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
        expect(queryByTestId('RecipeIngredients::Flex')).toBeNull();
        expect(queryByTestId('RecipeIngredients::AlignItems')).toBeNull();
        expect(queryByTestId('RecipeIngredients::OpenModal')).toBeNull();
        expect(getByTestId('RecipeIngredients::TextEditable').props.children).toEqual('["4@@g--Basil Leaves"]');
        expect(getByTestId('RecipeIngredients::RenderType').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::TextEdited').props.children).toBeTruthy();

        // Time
        expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual("{\"flexDirection\":\"row\",\"padding\":13.461538461538462}");
        expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":6},"value":"Time to prepare the recipe : "}');
        expect(getByTestId('RecipeTime::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::Flex').props.children).toEqual('3');
        expect(getByTestId('RecipeTime::AlignItems').props.children).toEqual('"flex-start"');
        expect(getByTestId('RecipeTime::OpenModal').props.children).toBeTruthy();

        // Preparation
        expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
        // @ts-ignore
        expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::Flex').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::OpenModal').props.children).toBeTruthy();
    });

    // -------- CHANGE ON TIME CASES --------
    test('updates recipeTime and reflects in RecipeTime only', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId} = render(<Recipe route={{params: mockRouteEdit}} navigation={mockNavigation}/>);

        fireEvent.press(getByTestId('RecipeTime::SetTextToEdit'), '71');

        // Image part
        expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual('"chocolate_cake.jpg"');

        // Title part
        expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');
        expect(getByTestId('RecipeTitle::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"Chocolate Cake"}');
        expect(getByTestId('RecipeTitle::SetTextToEdit').props.children).toBeTruthy();

        // Description
        expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');
        expect(getByTestId('RecipeDescription::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"Rich and moist chocolate cake."}');
        expect(getByTestId('RecipeDescription::SetTextToEdit').props.children).toBeTruthy();

        // Tags
        expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('["Dessert","Chocolate"]');
        expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ')).not.toEqual(recipesDataset[6].tags.map(tag => tag.tagName));
        expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
        expect(getByTestId('RecipeTags::ChangeTag').props.children).toBeTruthy();

        // Persons
        expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual('{"flexDirection":"row","padding":13.461538461538462}');
        expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
        expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
        expect(getByTestId('RecipePersons::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"6"}');
        expect(getByTestId('RecipePersons::SetTextToEdit').props.children).toBeTruthy();

        // Ingredients
        expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
        // @ts-ignore
        expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"textTransform\":\"uppercase\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
        expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::TextEditable').props.children).toEqual('["200@@g--Flour","50@@g--Cocoa Powder","150@@g--Sugar","100@@g--Butter"]');
        expect(getByTestId('RecipeIngredients::Column1').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":2},"value":"Quantity"}');
        expect(getByTestId('RecipeIngredients::Column2').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":1},"value":"Unit"}');
        expect(getByTestId('RecipeIngredients::Column3').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":3,"flexWrap":"wrap"},"value":"Ingredient name"}');

        // Time
        expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual('{\"flexDirection\":\"row\",\"padding\":13.461538461538462}');
        expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":7},"value":"Time to prepare the recipe :"}');
        expect(getByTestId('RecipeTime::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":1},"value":"min"}');
        expect(getByTestId('RecipeTime::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"71"}');
        expect(getByTestId('RecipeTime::SetTextToEdit').props.children).toBeTruthy();


        // Preparation
        expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
        expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();

    });
    test('add recipeTime and reflects in RecipeTime only', async () => {
        const recipeRef = React.createRef<Recipe>();
        const {rerender, getByTestId, queryByTestId} = render(
            //@ts-ignore route and navigation are not useful for UT
            <Recipe route={{params: mockRouteAdd}} navigation={mockNavigation} ref={recipeRef}/>);

        const recipeInstance = recipeRef.current;
        expect(recipeInstance).not.toBeNull();

        recipeInstance!.openModalForField = openModalForFieldMock(recipeInstance!);
        // Force rerender to apply mock
        //@ts-ignore route and navigation are not useful for UT
        rerender(<Recipe route={{params: mockRouteAdd}} navigation={mockNavigation} ref={recipeRef}/>);

        fireEvent.press(getByTestId('RecipeTime::OpenModal'));

        // Image part
        expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual('""');
        expect(getByTestId('RecipeImage::SetImgUri').props.children).toBeTruthy();
        expect(getByTestId('RecipeImage::OpenModal').props.children).toBeTruthy();

        // Title part
        expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');
        expect(getByTestId('RecipeTitle::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::Flex').props.children).toEqual('1');
        expect(getByTestId('RecipeTitle::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::OpenModal').props.children).toBeTruthy();

        // Description
        expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');
        expect(getByTestId('RecipeDescription::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::Flex').props.children).toEqual('1');
        expect(getByTestId('RecipeDescription::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::OpenModal').props.children).toBeTruthy();


        // Tags
        expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('[]');
        expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ').length).toEqual(3);
        expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
        expect(getByTestId('RecipeTags::ChangeTag').props.children).toBeTruthy();

        // Persons
        expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual("{\"flexDirection\":\"row\",\"padding\":13.461538461538462}");
        expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
        expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
        expect(getByTestId('RecipePersons::Flex').props.children).toEqual('6');
        expect(getByTestId('RecipePersons::AlignItems').props.children).toEqual('"flex-start"');
        expect(getByTestId('RecipePersons::OpenModal').props.children).toBeTruthy();

        // Ingredients
        expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
        // @ts-ignore
        expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"textTransform\":\"uppercase\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
        expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::Flex').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::OpenModal').props.children).toBeTruthy();


        // Time
        expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual("{\"flexDirection\":\"row\",\"padding\":13.461538461538462}");
        expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":6},"value":"Time to prepare the recipe : "}');
        expect(getByTestId('RecipeTime::SuffixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":34.61538461538461,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"padding\":23.076923076923077,\"flex\":1},\"value\":\"min\"}');
        expect(queryByTestId('RecipeTime::Flex')).toBeNull();
        expect(queryByTestId('RecipeTime::AlignItems')).toBeNull();
        expect(queryByTestId('RecipeTime::OpenModal')).toBeNull();

        expect(getByTestId('RecipeTime::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"99"}');
        expect(getByTestId('RecipeTime::SetTextToEdit').props.children).toBeTruthy();

        // Preparation
        expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
        // @ts-ignore
        expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::Flex').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::OpenModal').props.children).toBeTruthy();
    });

    // -------- CHANGE ON PREPARATION CASES --------
    test('updates recipePreparation and reflects in RecipePreparation only', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId} = render(<Recipe route={{params: mockRouteEdit}} navigation={mockNavigation}/>);

        fireEvent.press(getByTestId('RecipePreparation::TextEdited'), ' New part of a paragraph');

        // Image part
        expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual('"chocolate_cake.jpg"');

        // Title part
        expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');
        expect(getByTestId('RecipeTitle::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"Chocolate Cake"}');
        expect(getByTestId('RecipeTitle::SetTextToEdit').props.children).toBeTruthy();

        // Description
        expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');
        expect(getByTestId('RecipeDescription::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"Rich and moist chocolate cake."}');
        expect(getByTestId('RecipeDescription::SetTextToEdit').props.children).toBeTruthy();

        // Tags
        expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('["Dessert","Chocolate"]');
        expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ')).not.toEqual(recipesDataset[6].tags.map(tag => tag.tagName));
        expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
        expect(getByTestId('RecipeTags::ChangeTag').props.children).toBeTruthy();

        // Persons
        expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual('{"flexDirection":"row","padding":13.461538461538462}');
        expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
        expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
        expect(getByTestId('RecipePersons::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"6"}');
        expect(getByTestId('RecipePersons::SetTextToEdit').props.children).toBeTruthy();

        // Ingredients
        expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
        // @ts-ignore
        expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"textTransform\":\"uppercase\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
        expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::TextEditable').props.children).toEqual('["200@@g--Flour","50@@g--Cocoa Powder","150@@g--Sugar","100@@g--Butter"]');
        expect(getByTestId('RecipeIngredients::Column1').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":2},"value":"Quantity"}');
        expect(getByTestId('RecipeIngredients::Column2').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":1},"value":"Unit"}');
        expect(getByTestId('RecipeIngredients::Column3').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":3,"flexWrap":"wrap"},"value":"Ingredient name"}');

        // Time
        expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual('{\"flexDirection\":\"row\",\"padding\":13.461538461538462}');
        expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":7},"value":"Time to prepare the recipe :"}');
        expect(getByTestId('RecipeTime::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":1},"value":"min"}');
        expect(getByTestId('RecipeTime::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"60"}');
        expect(getByTestId('RecipeTime::SetTextToEdit').props.children).toBeTruthy();


        // Preparation
        expect(getByTestId('RecipePreparation::TextEditable').props.children).toEqual('["Mix the flour, cocoa powder, sugar, and butter. New part of a paragraph","Bake the mixture in a preheated oven at 180°C for 30 minutes."]');
        expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
        expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();

    });
    test('add recipePreparation and reflects in RecipePreparation only', async () => {
        const recipeRef = React.createRef<Recipe>();
        const {rerender, getByTestId, queryByTestId} = render(
            //@ts-ignore route and navigation are not useful for UT
            <Recipe route={{params: mockRouteAdd}} navigation={mockNavigation} ref={recipeRef}/>);

        const recipeInstance = recipeRef.current;
        expect(recipeInstance).not.toBeNull();

        recipeInstance!.openModalForField = openModalForFieldMock(recipeInstance!);
        // Force rerender to apply mock
        //@ts-ignore route and navigation are not useful for UT
        rerender(<Recipe route={{params: mockRouteAdd}} navigation={mockNavigation} ref={recipeRef}/>);

        fireEvent.press(getByTestId('RecipePreparation::OpenModal'));

        // Image part
        expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual('""');
        expect(getByTestId('RecipeImage::SetImgUri').props.children).toBeTruthy();
        expect(getByTestId('RecipeImage::OpenModal').props.children).toBeTruthy();

        // Title part
        expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');
        expect(getByTestId('RecipeTitle::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::Flex').props.children).toEqual('1');
        expect(getByTestId('RecipeTitle::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::OpenModal').props.children).toBeTruthy();

        // Description
        expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');
        expect(getByTestId('RecipeDescription::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::Flex').props.children).toEqual('1');
        expect(getByTestId('RecipeDescription::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::OpenModal').props.children).toBeTruthy();


        // Tags
        expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('[]');
        expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ').length).toEqual(3);
        expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
        expect(getByTestId('RecipeTags::ChangeTag').props.children).toBeTruthy();

        // Persons
        expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual("{\"flexDirection\":\"row\",\"padding\":13.461538461538462}");
        expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
        expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
        expect(getByTestId('RecipePersons::Flex').props.children).toEqual('6');
        expect(getByTestId('RecipePersons::AlignItems').props.children).toEqual('"flex-start"');
        expect(getByTestId('RecipePersons::OpenModal').props.children).toBeTruthy();

        // Ingredients
        expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
        // @ts-ignore
        expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"textTransform\":\"uppercase\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
        expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::Flex').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::AlignItems').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::OpenModal').props.children).toBeTruthy();


        // Time
        expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual("{\"flexDirection\":\"row\",\"padding\":13.461538461538462}");
        expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":6},"value":"Time to prepare the recipe : "}');
        expect(getByTestId('RecipeTime::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::Flex').props.children).toEqual('3');
        expect(getByTestId('RecipeTime::AlignItems').props.children).toEqual('"flex-start"');
        expect(getByTestId('RecipeTime::OpenModal').props.children).toBeTruthy();

        // Preparation
        expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
        expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();
        expect(queryByTestId('RecipePreparation::Flex')).toBeNull();
        expect(queryByTestId('RecipePreparation::AlignItems')).toBeNull();
        expect(queryByTestId('RecipePreparation::OpenModal')).toBeNull();
        expect(getByTestId('RecipePreparation::TextEditable').props.children).toEqual('["New preparation"]');
        expect(getByTestId('RecipePreparation::RenderType').props.children).toEqual('"SECTION"');
        expect(getByTestId('RecipePreparation::TextEdited').props.children).toBeTruthy();
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
            quantity: 6,
            recipesTitle: ["Chicken Tacos"],
            type: "Grain or Cereal",
            unit: "pieces"
        }, {
            id: 2,
            name: "Chicken Breast",
            purchased: false,
            quantity: 300,
            recipesTitle: ["Chicken Tacos"],
            type: "Poultry",
            unit: "g"
        }, {
            id: 3,
            name: "Lettuce",
            purchased: false,
            quantity: 50,
            recipesTitle: ["Chicken Tacos"],
            type: "Vegetable",
            unit: "g"
        }, {
            id: 4,
            name: "Cheddar",
            purchased: false,
            quantity: 50,
            recipesTitle: ["Chicken Tacos"],
            type: "Cheese",
            unit: "g"
        }));

    });

    test('validates button on edit mode', async () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId} = render(<Recipe route={{params: mockRouteEdit}} navigation={mockNavigation}/>);

        fireEvent.press(getByTestId('RecipeTitle::SetTextToEdit'), 'New Recipe Title');
        fireEvent.press(getByTestId('RecipeDescription::SetTextToEdit'), 'New Recipe Description');
        fireEvent.press(getByTestId('RecipeTags::ChangeTag'));
        fireEvent.press(getByTestId('RecipePersons::SetTextToEdit'), '23');
        fireEvent.press(getByTestId('RecipeIngredients::TextEdited'), ' updated');
        fireEvent.press(getByTestId('RecipeTime::SetTextToEdit'), '71');
        fireEvent.press(getByTestId('RecipePreparation::TextEdited'), '.New part of a paragraph');

        fireEvent.press(getByTestId('RecipeValidate::OnPressFunction'));

        await waitFor(() => {
            // Title part
            expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077},"value":"New Recipe Title"}');
        });

        //TODO change expected results when recipe edition will be implemented

        // Image part
        expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual('"chocolate_cake.jpg"');


        // Description
        expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":26.923076923076923,"fontWeight":"normal","textAlign":"left","paddingHorizontal":38.46153846153846,"paddingVertical":5.769230769230769},"value":"New Recipe Description"}');

        // Tags
        expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('["Dessert changed","Chocolate"]');
        expect(getByTestId('RecipeTags::OnPress')).toBeTruthy();

        // Persons
        expect(getByTestId('RecipePersons::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077},"value":"Ingredients (23 persons)"}');

        // Ingredients
        expect(getByTestId('RecipeIngredients::Text').props.children).toEqual('["200@@g--Flour updated","50@@g--Cocoa Powder","150@@g--Sugar","100@@g--Butter"]');
        expect(getByTestId('RecipeIngredients::Title').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::Render').props.children).toEqual('"ARRAY"');
        expect(getByTestId('RecipeIngredients::WithBorder').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::OnClick')).toBeTruthy();
        expect(getByTestId('RecipeIngredients::OnChangeFunction')).toBeTruthy();

        // Time
        expect(getByTestId('RecipeTime::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077},"value":"Preparation (71 min)"}');

        // Preparation
        expect(getByTestId('RecipePreparation::Text').props.children).toEqual('["Mix the flour, cocoa powder, sugar, and butter..New part of a paragraph","Bake the mixture in a preheated oven at 180°C for 30 minutes."]');
        expect(getByTestId('RecipePreparation::Title').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::Render').props.children).toEqual('"SECTION"');
        expect(getByTestId('RecipePreparation::WithBorder').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::OnClick')).toBeTruthy();
        expect(getByTestId('RecipePreparation::OnChangeFunction')).toBeTruthy();

        // TODO add a validation that new recipe is well inserted in the database
    });

    test('validates button on add mode', async () => {
        const recipeRef = React.createRef<Recipe>();
        const {rerender, getByTestId, queryByTestId} = render(
            //@ts-ignore route and navigation are not useful for UT
            <Recipe route={{params: mockRouteAdd}} navigation={mockNavigation} ref={recipeRef}/>);

        const recipeInstance = recipeRef.current;
        expect(recipeInstance).not.toBeNull();

        recipeInstance!.openModalForField = openModalForFieldMock(recipeInstance!);

        // Force rerender to apply mock
        //@ts-ignore route and navigation are not useful for UT
        rerender(<Recipe route={{params: mockRouteAdd}} navigation={mockNavigation} ref={recipeRef}/>);

        fireEvent.press(getByTestId('RecipeImage::OpenModal'));
        fireEvent.press(getByTestId('RecipeTitle::OpenModal'));
        fireEvent.press(getByTestId('RecipeDescription::OpenModal'));
        fireEvent.press(getByTestId('RecipeTags::ChangeTag'));
        fireEvent.press(getByTestId('RecipePersons::OpenModal'));
        fireEvent.press(getByTestId('RecipeIngredients::OpenModal'));
        fireEvent.press(getByTestId('RecipeTime::OpenModal'));
        fireEvent.press(getByTestId('RecipePreparation::OpenModal'));
        fireEvent.press(getByTestId('RecipeValidate::OnPressFunction'));


        // Image part
        expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual('"New Image URI"');

        // Title part
        expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');

        // Description
        expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');

        // Tags
        expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('[]');
        expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ')).not.toEqual(recipesDataset[6].tags.map(tag => tag.tagName));
        expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
        expect(getByTestId('RecipeTags::ChangeTag').props.children).toBeTruthy();


        // Persons
        expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual("{\"flexDirection\":\"row\",\"padding\":13.461538461538462}");
        expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
        expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
        expect(queryByTestId('RecipePersons::Flex')).toBeNull();
        expect(queryByTestId('RecipePersons::AlignItems')).toBeNull();
        expect(queryByTestId('RecipePersons::OpenModal')).toBeNull();
        expect(getByTestId('RecipePersons::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"31"}');
        expect(getByTestId('RecipePersons::SetTextToEdit').props.children).toBeTruthy();

        // Ingredients
        expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
        expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"textTransform\":\"uppercase\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
        expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
        expect(queryByTestId('RecipeIngredients::Flex')).toBeNull();
        expect(queryByTestId('RecipeIngredients::AlignItems')).toBeNull();
        expect(queryByTestId('RecipeIngredients::OpenModal')).toBeNull();
        expect(getByTestId('RecipeIngredients::TextEditable').props.children).toEqual('["4@@g--Basil Leaves"]');
        expect(getByTestId('RecipeIngredients::RenderType').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::TextEdited').props.children).toBeTruthy();

        // Time
        expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual("{\"flexDirection\":\"row\",\"padding\":13.461538461538462}");
        expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":6},"value":"Time to prepare the recipe : "}');
        expect(getByTestId('RecipeTime::SuffixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":34.61538461538461,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"padding\":23.076923076923077,\"flex\":1},\"value\":\"min\"}');
        expect(queryByTestId('RecipeTime::Flex')).toBeNull();
        expect(queryByTestId('RecipeTime::AlignItems')).toBeNull();
        expect(queryByTestId('RecipeTime::OpenModal')).toBeNull();

        expect(getByTestId('RecipeTime::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"99"}');
        expect(getByTestId('RecipeTime::SetTextToEdit').props.children).toBeTruthy();

        // Preparation
        expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
        expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();
        expect(queryByTestId('RecipePreparation::Flex')).toBeNull();
        expect(queryByTestId('RecipePreparation::AlignItems')).toBeNull();
        expect(queryByTestId('RecipePreparation::OpenModal')).toBeNull();
        expect(getByTestId('RecipePreparation::TextEditable').props.children).toEqual('["New preparation"]');
        expect(getByTestId('RecipePreparation::RenderType').props.children).toEqual('"SECTION"');
        expect(getByTestId('RecipePreparation::TextEdited').props.children).toBeTruthy();

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
                quantity: 4
            }],
            season: ["5", "6", "7", "8", "9", "10"],
            preparation: ["New preparation"],
            "time": 99
        };
        expect(recipesDb[recipesDb.length - 1]).toEqual(expected);
    });

    test('shows validation error if recipe is incomplete', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId} = render(<Recipe route={{params: mockRouteAdd}} navigation={mockNavigation}/>);

        fireEvent.press(getByTestId('RecipeValidate::OnPressFunction'));
        // TODO what to expect here ?
    });

    test('toggles stackMode between readOnly and edit', () => {
        //@ts-ignore route and navigation are not useful for UT
        const {getByTestId} = render(<Recipe route={{params: mockRouteReadOnly}} navigation={mockNavigation}/>);

        fireEvent.press(getByTestId('RecipeEdit::OnPressFunction'));

        // Image part
        expect(getByTestId('RecipeImage::ImgUri').props.children).toEqual('"tacos.jpg"');

        // Title part
        expect(getByTestId('RecipeTitle::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Title of the recipe : "}');
        expect(getByTestId('RecipeTitle::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTitle::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"Chicken Tacos"}');
        expect(getByTestId('RecipeTitle::SetTextToEdit').props.children).toBeTruthy();

        // Description
        expect(getByTestId('RecipeDescription::RootText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077},"value":"Description of the recipe : "}');
        expect(getByTestId('RecipeDescription::EditableViewStyle').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeDescription::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":42.30769230769231,"fontWeight":"bold","textAlign":"left","textTransform":"uppercase","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF"},"value":"Mexican-style tacos with chicken."}');
        expect(getByTestId('RecipeDescription::SetTextToEdit').props.children).toBeTruthy();

        // Tags
        expect(getByTestId('RecipeTags::TagsList').props.children).toEqual('["Mexican","Lunch"]');
        expect(getByTestId('RecipeTags::RandomTags').props.children.replaceAll('"', '').split(', ')).not.toEqual(recipesDataset[6].tags.map(tag => tag.tagName));
        expect(getByTestId('RecipeTags::AddNewTag').props.children).toBeTruthy();
        expect(getByTestId('RecipeTags::ChangeTag').props.children).toBeTruthy();

        // Persons
        expect(getByTestId('RecipePersons::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipePersons::EditableViewStyle').props.children).toEqual('{"flexDirection":"row","padding":13.461538461538462}');
        expect(getByTestId('RecipePersons::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":5},"value":"This recipe is for : "}');
        expect(getByTestId('RecipePersons::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":3},"value":" persons"}');
        expect(getByTestId('RecipePersons::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"2"}');
        expect(getByTestId('RecipePersons::SetTextToEdit').props.children).toBeTruthy();

        // Ingredients
        expect(getByTestId('RecipeIngredients::ViewAddButton').props.children).toEqual('{\"justifyContent\":\"center\",\"alignItems\":\"center\"}');
        // @ts-ignore
        expect(getByTestId('RecipeIngredients::PrefixText').props.children).toEqual('{\"style\":{\"color\":\"#0F0A39\",\"fontFamily\":\"Lora-VariableFont_wght\",\"fontSize\":42.30769230769231,\"fontWeight\":\"bold\",\"textAlign\":\"left\",\"textTransform\":\"uppercase\",\"padding\":23.076923076923077},\"value\":\"Ingredients\"}');
        expect(getByTestId('RecipeIngredients::SuffixText').props.children).toBeUndefined();
        expect(getByTestId('RecipeIngredients::Column1').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":2},"value":"Quantity"}');
        expect(getByTestId('RecipeIngredients::Column2').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":1},"value":"Unit"}');
        expect(getByTestId('RecipeIngredients::Column3').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"flex":3,"flexWrap":"wrap"},"value":"Ingredient name"}');

        // Time
        expect(getByTestId('RecipeTime::RootText').props.children).toBeUndefined();
        expect(getByTestId('RecipeTime::EditableViewStyle').props.children).toEqual('{\"flexDirection\":\"row\",\"padding\":13.461538461538462}');
        expect(getByTestId('RecipeTime::PrefixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":7},"value":"Time to prepare the recipe :"}');
        expect(getByTestId('RecipeTime::SuffixText').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"left","padding":23.076923076923077,"flex":1},"value":"min"}');
        expect(getByTestId('RecipeTime::TextEditable').props.children).toEqual('{"style":{"color":"#0F0A39","fontFamily":"Lora-VariableFont_wght","fontSize":34.61538461538461,"fontWeight":"bold","textAlign":"center","padding":23.076923076923077,"borderWidth":2,"borderColor":"#62929E","backgroundColor":"#F8F8FF","flex":1},"value":"20"}');
        expect(getByTestId('RecipeTime::SetTextToEdit').props.children).toBeTruthy();


        // Preparation
        expect(getByTestId('RecipePreparation::ViewAddButton').props.children).toEqual('{"margin":5.769230769230769,"justifyContent":"center","alignItems":"center"}');
        expect(getByTestId('RecipePreparation::PrefixText').props.children).toBeUndefined();
        expect(getByTestId('RecipePreparation::SuffixText').props.children).toBeUndefined();

    });

    // TODo add delete test
});
