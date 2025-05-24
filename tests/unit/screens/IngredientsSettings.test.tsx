import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import IngredientsSettings from '@screens/IngredientsSettings';
import {ingredientTableElement} from '@customTypes/DatabaseElementTypes';
import {mockNavigationFunctions} from "@mocks/deps/react-navigation-mock";
import RecipeDatabase from "@utils/RecipeDatabase";
import {ingredientsDataset} from "@test-data/ingredientsDataset";
import {tagsDataset} from "@test-data/tagsDataset";
import {recipesDataset} from "@test-data/recipesDataset";
import {QueryByQuery} from "@testing-library/react-native/build/queries/make-queries";
import {CommonQueryOptions, TextMatchOptions} from '@testing-library/react-native/build/queries/options';
import {TextMatch} from "@testing-library/react-native/build/matches";
import {DialogMode} from "@components/dialogs/ItemDialog";


jest.mock('expo-sqlite', () => require('@mocks/deps/expo-sqlite-mock').expoSqliteMock());
jest.mock('@utils/FileGestion', () => require('@mocks/utils/FileGestion-mock.tsx').fileGestionMock());
jest.mock('@utils/i18n', () => require('@mocks/utils/i18n-mock').i18nMock());
jest.mock('@components/organisms/SettingsItemList', () => require('@mocks/components/organisms/SettingsItemList-mock').settingsItemListMock);
jest.mock('@components/dialogs/ItemDialog', () => require('@mocks/components/dialogs/ItemDialog-mock').itemDialogMock);

const mockRoute = {
    key: 'IngredientsSettings',
    name: 'IngredientsSettings',
    params: {}
};

const defaultProps = {
    navigation: mockNavigationFunctions,
    route: mockRoute
} as any;

type QueryByIdType = QueryByQuery<TextMatch, CommonQueryOptions & TextMatchOptions>;

function dialogIsNotOpen(queryByTestId: QueryByIdType) {
    expect(queryByTestId('IngredientsSettings::ItemDialog::Mode')).toBeNull();
    expect(queryByTestId('IngredientsSettings::ItemDialog::OnClose')).toBeNull();
    expect(queryByTestId('IngredientsSettings::ItemDialog::Item')).toBeNull();
}

function dialogIsOpen(item: ingredientTableElement, mode: DialogMode, getByTestId: QueryByIdType) {
    expect(getByTestId('IngredientsSettings::ItemDialog::Mode').props.children).toEqual(["   ", mode, "        "]);
    expect(getByTestId('IngredientsSettings::ItemDialog::OnClose')).toBeTruthy();

    expect(getByTestId('IngredientsSettings::ItemDialog::Item::Type').props.children).toEqual('ingredient');
    expect(getByTestId('IngredientsSettings::ItemDialog::Item::Value').props.children).toEqual(JSON.stringify(item));
    expect(getByTestId('IngredientsSettings::ItemDialog::Item::OnConfirm')).toBeTruthy();
}

describe('IngredientsSettings Screen', () => {

    const db = RecipeDatabase.getInstance();

    let sortedDataset = ingredientsDataset;

    beforeEach(async () => {
        jest.clearAllMocks();

        await db.init();
        await db.addMultipleIngredients(ingredientsDataset);
        await db.addMultipleTags(tagsDataset);
        await db.addMultipleRecipes(recipesDataset);
        await db.addMultipleShopping(recipesDataset);

        sortedDataset = db.get_ingredients().sort((a, b) => a.ingName.localeCompare(b.ingName));
    });

    test('renders correctly with initial tags', () => {
        const {getByTestId, queryByTestId} = render(
            <IngredientsSettings {...defaultProps} />
        );

        expect(getByTestId('IngredientsSettings::SettingsItemList::Type').props.children).toEqual(["   ", "ingredient", "        "]);
        expect(getByTestId('IngredientsSettings::SettingsItemList::Items').props.children).toEqual(JSON.stringify(sortedDataset));
        expect(getByTestId('IngredientsSettings::SettingsItemList::OnAddPress')).toBeTruthy();
        expect(getByTestId('IngredientsSettings::SettingsItemList::OnEdit')).toBeTruthy();
        expect(getByTestId('IngredientsSettings::SettingsItemList::OnDelete')).toBeTruthy();

        dialogIsNotOpen(queryByTestId);
    });

    test('opens add dialog when add button is pressed and save value', async () => {
        const {getByTestId} = render(
            <IngredientsSettings {...defaultProps} />
        );
        fireEvent.press(getByTestId('IngredientsSettings::SettingsItemList::OnAddPress'));

        await waitFor(() => {
            expect(getByTestId('IngredientsSettings::ItemDialog::Item')).toBeTruthy();
        });

        dialogIsOpen(sortedDataset[0], 'add', getByTestId);

        fireEvent.press(getByTestId('IngredientsSettings::ItemDialog::Item::OnConfirm'));

        // TODO check that database has been updated
    });

    test('opens edit dialog when edit button is pressed and save value', async () => {
        const {getByTestId,} = render(
            <IngredientsSettings {...defaultProps} />
        );
        fireEvent.press(getByTestId('IngredientsSettings::SettingsItemList::OnEdit'));

        await waitFor(() => {
            expect(getByTestId('IngredientsSettings::ItemDialog::Item')).toBeTruthy();
        });

        dialogIsOpen(sortedDataset[0], 'edit', getByTestId,);

        fireEvent.press(getByTestId('IngredientsSettings::ItemDialog::Item::OnConfirm'));

        // TODO check that database has been updated
    });

    test('opens delete dialog when delete button is pressed and save value', async () => {
        const {getByTestId} = render(
            <IngredientsSettings {...defaultProps} />
        );
        fireEvent.press(getByTestId('IngredientsSettings::SettingsItemList::OnDelete'));

        await waitFor(() => {
            expect(getByTestId('IngredientsSettings::ItemDialog::Item')).toBeTruthy();
        });

        dialogIsOpen(sortedDataset[0], 'delete', getByTestId);

        fireEvent.press(getByTestId('IngredientsSettings::ItemDialog::Item::OnConfirm'));

        // TODO check that database has been updated
    });

});
