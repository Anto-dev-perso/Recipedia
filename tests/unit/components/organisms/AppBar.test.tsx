import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { AppBar, AppBarProps } from '@components/organisms/AppBar';

describe('AppBar Component', () => {
  const mockOnGoBack = jest.fn();
  const mockOnCancel = jest.fn();
  const mockOnValidate = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  const baseProps: AppBarProps = {
    onGoBack: mockOnGoBack,
    testID: 'Test',
  };

  const renderComponent = (props: AppBarProps = baseProps) => {
    return render(<AppBar {...props} />);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('simple mode (just back button)', () => {
    test('renders AppBar header with testID', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('Test::AppBar')).toBeTruthy();
    });

    test('renders back button', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('Test::AppBar::BackButton')).toBeTruthy();
    });

    test('does not render cancel button', () => {
      const { queryByTestId } = renderComponent();
      expect(queryByTestId('Test::AppBar::Cancel')).toBeNull();
    });

    test('does not render delete button', () => {
      const { queryByTestId } = renderComponent();
      expect(queryByTestId('Test::AppBar::Delete')).toBeNull();
    });

    test('does not render edit button', () => {
      const { queryByTestId } = renderComponent();
      expect(queryByTestId('Test::AppBar::Edit')).toBeNull();
    });

    test('does not render validate button', () => {
      const { queryByTestId } = renderComponent();
      expect(queryByTestId('Test::AppBar::Validate')).toBeNull();
    });

    test('back button calls onGoBack', () => {
      const { getByTestId } = renderComponent();
      fireEvent.press(getByTestId('Test::AppBar::BackButton'));
      expect(mockOnGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('with title (settings mode)', () => {
    const settingsProps: AppBarProps = {
      ...baseProps,
      title: 'Test Title',
    };

    test('renders title', () => {
      const { getByText } = renderComponent(settingsProps);
      expect(getByText('Test Title')).toBeTruthy();
    });

    test('renders with custom testID', () => {
      const { getByTestId } = renderComponent({ ...settingsProps, testID: 'Custom' });
      expect(getByTestId('Custom::AppBar')).toBeTruthy();
      expect(getByTestId('Custom::AppBar::BackButton')).toBeTruthy();
    });
  });

  describe('readOnly mode (with onDelete/onEdit)', () => {
    const readOnlyProps: AppBarProps = {
      ...baseProps,
      onDelete: mockOnDelete,
      onEdit: mockOnEdit,
    };

    test('renders back button', () => {
      const { getByTestId } = renderComponent(readOnlyProps);
      expect(getByTestId('Test::AppBar::BackButton')).toBeTruthy();
    });

    test('renders delete button', () => {
      const { getByTestId } = renderComponent(readOnlyProps);
      expect(getByTestId('Test::AppBar::Delete')).toBeTruthy();
    });

    test('renders edit button', () => {
      const { getByTestId } = renderComponent(readOnlyProps);
      expect(getByTestId('Test::AppBar::Edit')).toBeTruthy();
    });

    test('does not render cancel button', () => {
      const { queryByTestId } = renderComponent(readOnlyProps);
      expect(queryByTestId('Test::AppBar::Cancel')).toBeNull();
    });

    test('does not render validate button', () => {
      const { queryByTestId } = renderComponent(readOnlyProps);
      expect(queryByTestId('Test::AppBar::Validate')).toBeNull();
    });

    test('delete button calls onDelete', () => {
      const { getByTestId } = renderComponent(readOnlyProps);
      fireEvent.press(getByTestId('Test::AppBar::Delete'));
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    test('edit button calls onEdit', () => {
      const { getByTestId } = renderComponent(readOnlyProps);
      fireEvent.press(getByTestId('Test::AppBar::Edit'));
      expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });
  });

  describe('edit mode (isEditing=true)', () => {
    const editProps: AppBarProps = {
      ...baseProps,
      isEditing: true,
      onCancel: mockOnCancel,
      onValidate: mockOnValidate,
    };

    test('renders cancel button', () => {
      const { getByTestId } = renderComponent(editProps);
      expect(getByTestId('Test::AppBar::Cancel')).toBeTruthy();
    });

    test('renders validate button', () => {
      const { getByTestId } = renderComponent(editProps);
      expect(getByTestId('Test::AppBar::Validate')).toBeTruthy();
    });

    test('does not render back button', () => {
      const { queryByTestId } = renderComponent(editProps);
      expect(queryByTestId('Test::AppBar::BackButton')).toBeNull();
    });

    test('does not render delete button when callback not provided', () => {
      const { queryByTestId } = renderComponent(editProps);
      expect(queryByTestId('Test::AppBar::Delete')).toBeNull();
    });

    test('does not render edit button when callback not provided', () => {
      const { queryByTestId } = renderComponent(editProps);
      expect(queryByTestId('Test::AppBar::Edit')).toBeNull();
    });

    test('renders delete button when callback provided', () => {
      const propsWithDelete: AppBarProps = { ...editProps, onDelete: mockOnDelete };
      const { getByTestId } = renderComponent(propsWithDelete);
      expect(getByTestId('Test::AppBar::Delete')).toBeTruthy();
    });

    test('renders edit button when callback provided', () => {
      const propsWithEdit: AppBarProps = { ...editProps, onEdit: mockOnEdit };
      const { getByTestId } = renderComponent(propsWithEdit);
      expect(getByTestId('Test::AppBar::Edit')).toBeTruthy();
    });

    test('cancel button calls onCancel', () => {
      const { getByTestId } = renderComponent(editProps);
      fireEvent.press(getByTestId('Test::AppBar::Cancel'));
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    test('validate button calls onValidate', () => {
      const { getByTestId } = renderComponent(editProps);
      fireEvent.press(getByTestId('Test::AppBar::Validate'));
      expect(mockOnValidate).toHaveBeenCalledTimes(1);
    });
  });

  describe('callbacks not called on render', () => {
    test('no callbacks called on initial render', () => {
      renderComponent({
        ...baseProps,
        onCancel: mockOnCancel,
        onValidate: mockOnValidate,
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
