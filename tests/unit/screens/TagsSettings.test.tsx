import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import TagsSettings from '@screens/TagsSettings';
import {tagTableElement} from '@customTypes/DatabaseElementTypes';
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
    key: 'TagsSettings',
    name: 'TagsSettings',
    params: {}
};

const defaultProps = {
    navigation: mockNavigationFunctions,
    route: mockRoute
} as any;

type QueryByIdType = QueryByQuery<TextMatch, CommonQueryOptions & TextMatchOptions>;

function dialogIsNotOpen(queryByTestId: QueryByIdType) {
    expect(queryByTestId('TagsSettings::ItemDialog::Mode')).toBeNull();
    expect(queryByTestId('TagsSettings::ItemDialog::OnClose')).toBeNull();
    expect(queryByTestId('TagsSettings::ItemDialog::Item')).toBeNull();
}

function dialogIsOpen(item: tagTableElement, mode: DialogMode, getByTestId: QueryByIdType) {
    expect(getByTestId('TagsSettings::ItemDialog::Mode').props.children).toEqual(["   ", mode, "        "]);
    expect(getByTestId('TagsSettings::ItemDialog::OnClose')).toBeTruthy();

    expect(getByTestId('TagsSettings::ItemDialog::Item::Type').props.children).toEqual('tag');
    expect(getByTestId('TagsSettings::ItemDialog::Item::Value').props.children).toEqual(JSON.stringify(item));
    expect(getByTestId('TagsSettings::ItemDialog::Item::OnConfirm')).toBeTruthy();
}

describe('TagsSettings Screen', () => {

    const db = RecipeDatabase.getInstance();

    let sortedDataset = tagsDataset;

    beforeEach(async () => {
        jest.clearAllMocks();

        await db.init();
        await db.addMultipleIngredients(ingredientsDataset);
        await db.addMultipleTags(tagsDataset);
        await db.addMultipleRecipes(recipesDataset);
        await db.addMultipleShopping(recipesDataset);

        sortedDataset = db.get_tags().sort((a, b) => a.name.localeCompare(b.name));
    });

    test('renders correctly with initial tags', () => {
        const {getByTestId, queryByTestId} = render(
            <TagsSettings {...defaultProps} />
        );

        expect(getByTestId('TagsSettings::SettingsItemList::Type').props.children).toEqual(["   ", "tag", "        "]);
        expect(getByTestId('TagsSettings::SettingsItemList::Items').props.children).toEqual(JSON.stringify(sortedDataset));
        expect(getByTestId('TagsSettings::SettingsItemList::OnAddPress')).toBeTruthy();
        expect(getByTestId('TagsSettings::SettingsItemList::OnEdit')).toBeTruthy();
        expect(getByTestId('TagsSettings::SettingsItemList::OnDelete')).toBeTruthy();

        dialogIsNotOpen(queryByTestId);
    });

    test('opens add dialog when add button is pressed and save value', async () => {
        const {getByTestId} = render(
            <TagsSettings {...defaultProps} />
        );
        fireEvent.press(getByTestId('TagsSettings::SettingsItemList::OnAddPress'));

        await waitFor(() => {
            expect(getByTestId('TagsSettings::ItemDialog::Item')).toBeTruthy();
        });

        dialogIsOpen(sortedDataset[0], 'add', getByTestId);

        fireEvent.press(getByTestId('TagsSettings::ItemDialog::Item::OnConfirm'));

        // TODO check that database has been updated
    });

    test('opens edit dialog when edit button is pressed and save value', async () => {
        const {getByTestId,} = render(
            <TagsSettings {...defaultProps} />
        );
        fireEvent.press(getByTestId('TagsSettings::SettingsItemList::OnEdit'));

        await waitFor(() => {
            expect(getByTestId('TagsSettings::ItemDialog::Item')).toBeTruthy();
        });

        dialogIsOpen(sortedDataset[0], 'edit', getByTestId,);

        fireEvent.press(getByTestId('TagsSettings::ItemDialog::Item::OnConfirm'));

        // TODO check that database has been updated
    });

    test('opens delete dialog when delete button is pressed and save value', async () => {
        const {getByTestId} = render(
            <TagsSettings {...defaultProps} />
        );
        fireEvent.press(getByTestId('TagsSettings::SettingsItemList::OnDelete'));

        await waitFor(() => {
            expect(getByTestId('TagsSettings::ItemDialog::Item')).toBeTruthy();
        });

        dialogIsOpen(sortedDataset[0], 'delete', getByTestId);

        fireEvent.press(getByTestId('TagsSettings::ItemDialog::Item::OnConfirm'));

        // TODO check that database has been updated
    });

});
