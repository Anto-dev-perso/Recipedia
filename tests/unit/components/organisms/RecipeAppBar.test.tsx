import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import RecipeAppBar, { RecipeAppBarProps } from '@components/organisms/RecipeAppBar';

describe('RecipeAppBar Component', () => {
  const mockOnGoBack = jest.fn();
  const mockOnCancel = jest.fn();
  const mockOnValidate = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  const baseProps: RecipeAppBarProps = {
    isEditing: false,
    onGoBack: mockOnGoBack,
    onCancel: mockOnCancel,
    onValidate: mockOnValidate,
  };

  const renderComponent = (props: RecipeAppBarProps = baseProps) => {
    return render(<RecipeAppBar {...props} />);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('add mode (isEditing=false, no optional callbacks)', () => {
    test('renders back button', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('BackButton')).toBeTruthy();
    });

    test('does not render cancel button', () => {
      const { queryByTestId } = renderComponent();
      expect(queryByTestId('RecipeCancel')).toBeNull();
    });

    test('does not render delete button', () => {
      const { queryByTestId } = renderComponent();
      expect(queryByTestId('RecipeDelete')).toBeNull();
    });

    test('does not render edit button', () => {
      const { queryByTestId } = renderComponent();
      expect(queryByTestId('RecipeEdit')).toBeNull();
    });

    test('does not render validate button', () => {
      const { queryByTestId } = renderComponent();
      expect(queryByTestId('RecipeValidate')).toBeNull();
    });

    test('back button calls onGoBack', () => {
      const { getByTestId } = renderComponent();
      fireEvent.press(getByTestId('BackButton'));
      expect(mockOnGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('readOnly mode (isEditing=false, with onDelete/onEdit)', () => {
    const readOnlyProps: RecipeAppBarProps = {
      ...baseProps,
      onDelete: mockOnDelete,
      onEdit: mockOnEdit,
    };

    test('renders back button', () => {
      const { getByTestId } = renderComponent(readOnlyProps);
      expect(getByTestId('BackButton')).toBeTruthy();
    });

    test('renders delete button', () => {
      const { getByTestId } = renderComponent(readOnlyProps);
      expect(getByTestId('RecipeDelete')).toBeTruthy();
    });

    test('renders edit button', () => {
      const { getByTestId } = renderComponent(readOnlyProps);
      expect(getByTestId('RecipeEdit')).toBeTruthy();
    });

    test('does not render cancel button', () => {
      const { queryByTestId } = renderComponent(readOnlyProps);
      expect(queryByTestId('RecipeCancel')).toBeNull();
    });

    test('does not render validate button', () => {
      const { queryByTestId } = renderComponent(readOnlyProps);
      expect(queryByTestId('RecipeValidate')).toBeNull();
    });

    test('delete button calls onDelete', () => {
      const { getByTestId } = renderComponent(readOnlyProps);
      fireEvent.press(getByTestId('RecipeDelete'));
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    test('edit button calls onEdit', () => {
      const { getByTestId } = renderComponent(readOnlyProps);
      fireEvent.press(getByTestId('RecipeEdit'));
      expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });
  });

  describe('edit mode (isEditing=true)', () => {
    const editProps: RecipeAppBarProps = {
      ...baseProps,
      isEditing: true,
    };

    test('renders cancel button', () => {
      const { getByTestId } = renderComponent(editProps);
      expect(getByTestId('RecipeCancel')).toBeTruthy();
    });

    test('renders validate button', () => {
      const { getByTestId } = renderComponent(editProps);
      expect(getByTestId('RecipeValidate')).toBeTruthy();
    });

    test('does not render back button', () => {
      const { queryByTestId } = renderComponent(editProps);
      expect(queryByTestId('BackButton')).toBeNull();
    });

    test('does not render delete button when callback not provided', () => {
      const { queryByTestId } = renderComponent(editProps);
      expect(queryByTestId('RecipeDelete')).toBeNull();
    });

    test('does not render edit button when callback not provided', () => {
      const { queryByTestId } = renderComponent(editProps);
      expect(queryByTestId('RecipeEdit')).toBeNull();
    });

    test('renders delete button when callback provided', () => {
      const propsWithDelete: RecipeAppBarProps = { ...editProps, onDelete: mockOnDelete };
      const { getByTestId } = renderComponent(propsWithDelete);
      expect(getByTestId('RecipeDelete')).toBeTruthy();
    });

    test('renders edit button when callback provided', () => {
      const propsWithEdit: RecipeAppBarProps = { ...editProps, onEdit: mockOnEdit };
      const { getByTestId } = renderComponent(propsWithEdit);
      expect(getByTestId('RecipeEdit')).toBeTruthy();
    });

    test('cancel button calls onCancel', () => {
      const { getByTestId } = renderComponent(editProps);
      fireEvent.press(getByTestId('RecipeCancel'));
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    test('validate button calls onValidate', () => {
      const { getByTestId } = renderComponent(editProps);
      fireEvent.press(getByTestId('RecipeValidate'));
      expect(mockOnValidate).toHaveBeenCalledTimes(1);
    });
  });

  describe('callbacks not called on render', () => {
    test('no callbacks called on initial render', () => {
      renderComponent({
        ...baseProps,
        onDelete: mockOnDelete,
        onEdit: mockOnEdit,
      });

      expect(mockOnGoBack).not.toHaveBeenCalled();
      expect(mockOnCancel).not.toHaveBeenCalled();
      expect(mockOnValidate).not.toHaveBeenCalled();
      expect(mockOnDelete).not.toHaveBeenCalled();
      expect(mockOnEdit).not.toHaveBeenCalled();
    });
  });
});
