import {fireEvent, render, waitFor} from "@testing-library/react-native";
import RecipeTags, {RecipeTagProps} from "@components/organisms/RecipeTags";
import React from "react";
import {tagsDataset} from "@test-data/tagsDataset";
import {ingredientsDataset} from "@test-data/ingredientsDataset";
import {recipesDataset} from "@test-data/recipesDataset";
import RecipeDatabase from "@utils/RecipeDatabase";

jest.mock('expo-sqlite', () => require('@mocks/deps/expo-sqlite-mock').expoSqliteMock());
jest.mock('@utils/FileGestion', () => require('@mocks/utils/FileGestion-mock.tsx').fileGestionMock());

jest.mock('@components/atomic/RoundButton', () => require('@mocks/components/atomic/RoundButton-mock').roundButtonMock);
jest.mock('@components/molecules/TextInputWithDropDown', () => require('@mocks/components/molecules/TextInputWithDropDown-mock.tsx').textInputWithDropdownMock);
jest.mock('@components/molecules/HorizontalList', () => require('@mocks/components/molecules/HorizontalList-mock').horizontalListMock);
jest.mock('@expo/vector-icons', () => require('@mocks/deps/expo-vector-icons-mock'));

jest.mock('@shopify/flash-list', () => require('@mocks/deps/flashlist-mock').flashListMock());

describe('RecipeTags Component', () => {
    const sampleTags = tagsDataset.map(tag => tag.tagName).sort();

    describe('readOnly mode', () => {
        it('renders a HorizontalList showing the provided tags', () => {
            const {getByTestId} = render(
                <RecipeTags type="readOnly" tagsList={sampleTags} testID="RecipeTags"/>
            );

            expect(getByTestId('HorizontalList::PropType').props.children).toEqual('"Tag"');
            expect(getByTestId('HorizontalList::Item').props.children).toEqual(JSON.stringify(sampleTags));
            expect(getByTestId('HorizontalList::Icon').props.children).toBeUndefined();
            expect(getByTestId('HorizontalList::OnTagPress')).toBeTruthy();
        });
    });

    describe('addOrEdit mode', () => {
        const randomTags = `${sampleTags[6]}, ${sampleTags[1]}, ${sampleTags[11]}`;
        const addNewTagMock = jest.fn();
        const removeTagMock = jest.fn();

        const defaultProps: RecipeTagProps = {
            type: 'addOrEdit',
            tagsList: new Array<string>(sampleTags[sampleTags.length - 1], sampleTags[sampleTags.length - 2], sampleTags[sampleTags.length - 3]),
            randomTags,
            addNewTag: addNewTagMock,
            removeTag: removeTagMock,
            testID: "RecipeTags"
        };

        const dbInstance = RecipeDatabase.getInstance();
        beforeEach(async () => {
            jest.clearAllMocks();
            jest.clearAllMocks();

            await dbInstance.init();
            await dbInstance.addMultipleIngredients(ingredientsDataset);
            await dbInstance.addMultipleTags(tagsDataset);
            await dbInstance.addMultipleRecipes(recipesDataset);
        });
        afterEach(async () => {
            await dbInstance.reset();
        });
        it('renders header and description texts with the add button', () => {
            const {getByTestId} = render(<RecipeTags {...defaultProps} />);

            // Verify that the header and element texts are rendered using testIDs.
            expect(getByTestId("RecipeTags::AddOrEdit::HeaderText")).toBeTruthy();
            expect(getByTestId("RecipeTags::AddOrEdit::ElementText").props.children).toContain(randomTags);

            expect(getByTestId('HorizontalList::PropType').props.children).toEqual('"Tag"');
            expect(getByTestId('HorizontalList::Item').props.children).toEqual(JSON.stringify(defaultProps.tagsList));
            expect(getByTestId('HorizontalList::Icon').props.children).toEqual('"close"');
            expect(getByTestId('HorizontalList::OnTagPress')).toBeTruthy();

            expect(getByTestId("RoundButton::Text").props.children).toBeUndefined();
            expect(getByTestId("RoundButton::Icon").props.children).toEqual('{"type":0,"name":"plus","size":38.46153846153846,"color":"#414a4c"}');
            expect(getByTestId("RoundButton::OnPressFunction")).toBeTruthy();
        });

        it('does not show a new tag input initially', () => {
            const {queryByTestId} = render(<RecipeTags {...defaultProps} />);
            // No new tag input should be rendered at the start.
            expect(queryByTestId("RecipeTags::AddOrEdit::List::0")).toBeNull();
        });

        it('adds a new tag input field when the RoundButton is pressed', async () => {
            const {getByTestId} = render(<RecipeTags {...defaultProps} />);

            // Press the RoundButton (using its testID).
            fireEvent.press(getByTestId("RoundButton::OnPressFunction"));

            // After pressing, a new tag input should appear with testID "RecipeTags::AddOrEdit::List::0".
            await waitFor(() => expect(getByTestId("RecipeTags::AddOrEdit::List::0::TextInputWithDropdown::AbsoluteDropDown").props.children).toEqual(false));
            expect(getByTestId("RecipeTags::AddOrEdit::List::0::TextInputWithDropdown::ReferenceTextArray").props.children).toEqual(JSON.stringify(sampleTags.filter(name => !defaultProps.tagsList.includes(name))));
            expect(getByTestId("RecipeTags::AddOrEdit::List::0::TextInputWithDropdown::Value").props.children).toBeUndefined();
            expect(getByTestId("RecipeTags::AddOrEdit::List::0::TextInputWithDropdown::Outline").props.children).toBeUndefined();
            expect(getByTestId("RecipeTags::AddOrEdit::List::0::TextInputWithDropdown::OnValidate")).toBeTruthy();
        });

        it('calls addNewTag callback when a new tag is validated and removes the input', async () => {
            const {getByTestId, queryByTestId} = render(<RecipeTags {...defaultProps} />);

            // Simulate adding a new tag input by pressing the RoundButton.
            fireEvent.press(getByTestId("RoundButton::OnPressFunction"));
            fireEvent.press(getByTestId("RoundButton::OnPressFunction"));

            await waitFor(() => expect(getByTestId("RecipeTags::AddOrEdit::List::1::TextInputWithDropdown::AbsoluteDropDown").props.children).toEqual(false));
            await waitFor(() => expect(getByTestId("RecipeTags::AddOrEdit::List::2::TextInputWithDropdown::AbsoluteDropDown").props.children).toEqual(false));

            for (let i = 1; i <= 2; i++) {
                expect(getByTestId("RecipeTags::AddOrEdit::List::" + i + "::TextInputWithDropdown::ReferenceTextArray").props.children).toEqual(JSON.stringify(sampleTags.filter(name => !defaultProps.tagsList.includes(name))));
                expect(getByTestId("RecipeTags::AddOrEdit::List::" + i + "::TextInputWithDropdown::Value").props.children).toBeUndefined();
                expect(getByTestId("RecipeTags::AddOrEdit::List::" + i + "::TextInputWithDropdown::Outline").props.children).toBeUndefined();
                expect(getByTestId("RecipeTags::AddOrEdit::List::" + i + "::TextInputWithDropdown::OnValidate")).toBeTruthy();
            }

            // Simulate the onValidate event (user finishes entering a new tag).
            fireEvent.press(getByTestId("RecipeTags::AddOrEdit::List::1::TextInputWithDropdown::OnValidate"));

            // Verify that the addNewTag callback was called with the correct argument.
            expect(addNewTagMock).toHaveBeenCalledWith('Test string');

            // After validation, the new tag input should be removed.
            expect(queryByTestId("RecipeTags::AddOrEdit::List::1::TextInputWithDropdown::AbsoluteDropDown")).toBeNull();
            expect(queryByTestId("RecipeTags::AddOrEdit::List::1::TextInputWithDropdown::ReferenceTextArray")).toBeNull();
            expect(queryByTestId("RecipeTags::AddOrEdit::List::1::TextInputWithDropdown::Value")).toBeNull();
            expect(queryByTestId("RecipeTags::AddOrEdit::List::1::TextInputWithDropdown::Outline")).toBeNull();
            expect(queryByTestId("RecipeTags::AddOrEdit::List::1::TextInputWithDropdown::OnValidate")).toBeNull();

            expect(getByTestId("RecipeTags::AddOrEdit::List::2::TextInputWithDropdown::AbsoluteDropDown").props.children).toEqual(false);
            expect(getByTestId("RecipeTags::AddOrEdit::List::2::TextInputWithDropdown::ReferenceTextArray").props.children).toEqual(JSON.stringify(sampleTags.filter(name => !defaultProps.tagsList.includes(name))));
            expect(getByTestId("RecipeTags::AddOrEdit::List::2::TextInputWithDropdown::Value").props.children).toBeUndefined();
            expect(getByTestId("RecipeTags::AddOrEdit::List::2::TextInputWithDropdown::Outline").props.children).toBeUndefined();
            expect(getByTestId("RecipeTags::AddOrEdit::List::2::TextInputWithDropdown::OnValidate")).toBeTruthy();
        });
    });
});
