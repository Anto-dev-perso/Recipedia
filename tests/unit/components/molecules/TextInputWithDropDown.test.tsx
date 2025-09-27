import React, { act } from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import TextInputWithDropDown, {
  TextInputWithDropDownType,
} from '@components/molecules/TextInputWithDropDown';
import RecipeDatabase from '@utils/RecipeDatabase';
import { testIngredients } from '@test-data/ingredientsDataset';
import { testTags } from '@test-data/tagsDataset';
import { testRecipes } from '@test-data/recipesDataset';

jest.mock('expo-sqlite', () => require('@mocks/deps/expo-sqlite-mock').expoSqliteMock());
jest.mock('@utils/FileGestion', () =>
  require('@mocks/utils/FileGestion-mock.tsx').fileGestionMock()
);
jest.mock(
  '@components/atomic/CustomTextInput',
  () => require('@mocks/components/atomic/CustomTextInput-mock').customTextInputMock
);
jest.mock('@utils/i18n', () => require('@mocks/utils/i18n-mock').i18nMock());

describe('TextInputWithDropDown Component', () => {
  const mockOnChangeText = jest.fn();

  const dbInstance = RecipeDatabase.getInstance();

  const defaultProps: TextInputWithDropDownType = {
    testID: 'TextInputWithDropDown',
    absoluteDropDown: true,
    referenceTextArray: new Array<string>(),
    label: 'Ingredient',
    onValidate: mockOnChangeText,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    await dbInstance.init();
    await dbInstance.addMultipleIngredients(testIngredients);
    await dbInstance.addMultipleTags(testTags);
    await dbInstance.addMultipleRecipes(testRecipes);
    defaultProps.referenceTextArray = dbInstance
      .get_ingredients()
      .map(ingredient => ingredient.name)
      .sort();
  });
  afterEach(async () => {
    jest.clearAllMocks();
    await dbInstance.reset();
  });

  test('renders correctly with default props', () => {
    const { getByTestId, queryByTestId } = render(<TextInputWithDropDown {...defaultProps} />);

    expect(getByTestId('TextInputWithDropDown::TextInput')).toBeTruthy();
    expect(queryByTestId('TextInputWithDropDown::DropdownContainer')).not.toBeTruthy();
    for (const ingredient of dbInstance.get_ingredients()) {
      expect(
        queryByTestId('TextInputWithDropDown::TouchableOpacity::' + ingredient.name)
      ).not.toBeTruthy();
      expect(
        queryByTestId('TextInputWithDropDown::List::' + ingredient.name + '::Title')
      ).not.toBeTruthy();
    }
  });

  test('renders correctly with value in props', async () => {
    const props: TextInputWithDropDownType = { ...defaultProps, value: 'Salm' };
    const { getByTestId, queryByTestId } = render(<TextInputWithDropDown {...props} />);

    await waitFor(() =>
      expect(getByTestId('TextInputWithDropDown::TextInput').props.value).toEqual('Salm')
    );
    expect(mockOnChangeText).not.toHaveBeenCalled();
    expect(queryByTestId('TextInputWithDropDown::DropdownContainer')).not.toBeTruthy();
    for (const ingredient of dbInstance.get_ingredients()) {
      expect(
        queryByTestId('TextInputWithDropDown::TouchableOpacity::' + ingredient.name)
      ).not.toBeTruthy();
      expect(
        queryByTestId('TextInputWithDropDown::List::' + ingredient.name + '::Title')
      ).not.toBeTruthy();
    }

    await act(async () => {
      fireEvent(getByTestId('TextInputWithDropDown::TextInput'), 'focus');
    });
    await waitFor(() =>
      expect(getByTestId('TextInputWithDropDown::DropdownContainer')).toBeTruthy()
    );
    expect(getByTestId('TextInputWithDropDown::TextInput').props.value).toEqual('Salm');
    expect(mockOnChangeText).not.toHaveBeenCalled();

    for (const ingredient of dbInstance.get_ingredients()) {
      if (ingredient.name == 'Salmon') {
        expect(
          getByTestId('TextInputWithDropDown::TouchableOpacity::' + ingredient.name)
        ).toBeTruthy();
        expect(
          getByTestId('TextInputWithDropDown::List::' + ingredient.name + '::Title')
        ).toBeTruthy();
        expect(
          getByTestId('TextInputWithDropDown::List::' + ingredient.name + '::Title').props.children
        ).toEqual(ingredient.name);
      } else {
        expect(
          queryByTestId('TextInputWithDropDown::TouchableOpacity::' + ingredient.name)
        ).not.toBeTruthy();
        expect(queryByTestId('TextInputWithDropDown::List::' + ingredient.name)).not.toBeTruthy();
      }
    }
  });

  test('shows dropdown when text input is on focus and hiding when input no more having elements in the array', async () => {
    const { getByTestId, queryByTestId } = render(<TextInputWithDropDown {...defaultProps} />);

    const input = getByTestId('TextInputWithDropDown::TextInput');
    await act(async () => {
      fireEvent(input, 'focus');
    });

    await waitFor(() =>
      expect(getByTestId('TextInputWithDropDown::DropdownContainer')).toBeTruthy()
    );
    expect(getByTestId('TextInputWithDropDown::TextInput').props.value).toEqual('');
    expect(mockOnChangeText).not.toHaveBeenCalled();
    for (const ingredient of dbInstance.get_ingredients()) {
      expect(
        getByTestId('TextInputWithDropDown::TouchableOpacity::' + ingredient.name)
      ).toBeTruthy();
      expect(
        getByTestId('TextInputWithDropDown::List::' + ingredient.name + '::Title')
      ).toBeTruthy();
      expect(
        getByTestId('TextInputWithDropDown::List::' + ingredient.name + '::Title').props.children
      ).toEqual(ingredient.name);
    }

    const textInput = 'notexistingrecipe';
    await act(async () => {
      fireEvent.changeText(input, textInput);
    });

    await waitFor(() =>
      expect(queryByTestId('TextInputWithDropDown::DropdownContainer')).not.toBeTruthy()
    );
    expect(getByTestId('TextInputWithDropDown::TextInput').props.value).toEqual(textInput);
    expect(mockOnChangeText).not.toHaveBeenCalled();
    for (const ingredient of dbInstance.get_ingredients()) {
      expect(
        queryByTestId('TextInputWithDropDown::TouchableOpacity::' + ingredient.name)
      ).not.toBeTruthy();
      expect(
        queryByTestId('TextInputWithDropDown::List::' + ingredient.name + '::Title')
      ).not.toBeTruthy();
    }
  });

  test('shows dropdown when typing and hides when selecting an item', async () => {
    const { getByTestId, queryByTestId } = render(<TextInputWithDropDown {...defaultProps} />);

    const input = getByTestId('TextInputWithDropDown::TextInput');
    const textInput = 'past';
    await act(async () => {
      fireEvent.changeText(input, textInput);
    });

    await waitFor(() =>
      expect(getByTestId('TextInputWithDropDown::DropdownContainer')).toBeTruthy()
    );
    expect(getByTestId('TextInputWithDropDown::TextInput').props.value).toEqual(textInput);
    expect(mockOnChangeText).not.toHaveBeenCalled();
    for (const ingredient of dbInstance.get_ingredients()) {
      if (ingredient.name.toLowerCase().includes('past')) {
        expect(
          getByTestId('TextInputWithDropDown::TouchableOpacity::' + ingredient.name)
        ).toBeTruthy();
        expect(
          getByTestId('TextInputWithDropDown::List::' + ingredient.name + '::Title')
        ).toBeTruthy();
        expect(
          getByTestId('TextInputWithDropDown::List::' + ingredient.name + '::Title').props.children
        ).toEqual(ingredient.name);
      } else {
        expect(
          queryByTestId('TextInputWithDropDown::TouchableOpacity::' + ingredient.name)
        ).not.toBeTruthy();
        expect(
          queryByTestId('TextInputWithDropDown::List::' + ingredient.name + '::Title')
        ).not.toBeTruthy();
      }
    }

    await act(async () => {
      fireEvent.press(getByTestId('TextInputWithDropDown::TouchableOpacity::Pasta'));
    });
    await waitFor(() =>
      expect(getByTestId('TextInputWithDropDown::TextInput').props.value).toEqual('Pasta')
    );
    expect(mockOnChangeText).toHaveBeenCalledWith('Pasta');
    expect(queryByTestId('TextInputWithDropDown::DropdownContainer')).not.toBeTruthy();
  });

  test('hides dropdown on submit', async () => {
    const { getByTestId, queryByTestId } = render(<TextInputWithDropDown {...defaultProps} />);

    const input = getByTestId('TextInputWithDropDown::TextInput');
    const textInput = 'banana';
    await act(async () => {
      fireEvent.changeText(input, textInput);
    });

    await waitFor(() =>
      expect(getByTestId('TextInputWithDropDown::TextInput').props.value).toEqual(textInput)
    );
    expect(queryByTestId('TextInputWithDropDown::DropdownContainer')).not.toBeTruthy();
    expect(mockOnChangeText).not.toHaveBeenCalled();
    for (const ingredient of dbInstance.get_ingredients()) {
      expect(
        queryByTestId('TextInputWithDropDown::TouchableOpacity::' + ingredient.name)
      ).not.toBeTruthy();
      expect(
        queryByTestId('TextInputWithDropDown::List::' + ingredient.name + '::Title')
      ).not.toBeTruthy();
    }

    await act(async () => {
      fireEvent(input, 'endEditing');
    });
    await waitFor(() => {
      expect(mockOnChangeText).toHaveBeenCalledTimes(1);
    });
    expect(mockOnChangeText).toHaveBeenCalledWith(textInput);
  });
});
