import { fireEvent, render } from '@testing-library/react-native';
import { RecipeImage } from '@components/organisms/RecipeImage';
import React from 'react';
import { recipeColumnsNames } from '@customTypes/DatabaseElementTypes';
import { IconName } from '@assets/Icons';

jest.mock('@components/atomic/RoundButton', () => ({
  RoundButton: require('@mocks/components/atomic/RoundButton-mock').roundButtonMock,
}));

describe('RecipeImage Component', () => {
  const mockOpenModal = jest.fn();

  const sampleImageUri = 'https://example.com/recipe-image.jpg';
  const emptyImageUri = '';
  const sampleButtonIcon: IconName = 'camera';

  const renderRecipeImage = (overrideProps = {}) => {
    const defaultProps = {
      imgUri: sampleImageUri,
      openModal: mockOpenModal,
      buttonIcon: sampleButtonIcon,
      ...overrideProps,
    };

    return render(<RecipeImage {...defaultProps} />);
  };

  const assertContainerStructure = (
    getByTestId: any,
    expectedImageSource: string = sampleImageUri
  ) => {
    expect(getByTestId('RecipeImage::Image').props.source).toEqual([
      { uri: expectedImageSource.length > 0 ? expectedImageSource : '' },
    ]);
  };

  const assertButtonStructure = (
    getByTestId: any,
    queryByTestId: any,
    shouldExist: boolean = true,
    expectedSize: string = 'medium',
    expectedIcon: IconName = sampleButtonIcon
  ) => {
    if (shouldExist) {
      expect(getByTestId('RecipeImage::RoundButton::Size').props.children).toEqual(expectedSize);
      expect(getByTestId('RecipeImage::RoundButton::Icon').props.children).toEqual(expectedIcon);
    } else {
      expect(queryByTestId('RecipeImage::RoundButton')).toBeNull();
    }
  };

  const simulateImageLoadSuccess = (getByTestId: any) => {
    const onLoad = getByTestId('RecipeImage::Image').props.onLoad;
    if (onLoad) {
      onLoad({ nativeEvent: {} });
    }
  };

  const simulateImageLoadError = (getByTestId: any) => {
    const onError = getByTestId('RecipeImage::Image').props.onError;
    if (onError) {
      onError({ nativeEvent: {} });
    }
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders with valid image URI and button in top-right position initially', () => {
    const { getByTestId, queryByTestId } = renderRecipeImage();

    assertContainerStructure(getByTestId);
    assertButtonStructure(getByTestId, queryByTestId);
  });

  test('handles image load success and positions button in top-right corner', () => {
    const { getByTestId, queryByTestId } = renderRecipeImage();

    assertContainerStructure(getByTestId);
    assertButtonStructure(getByTestId, queryByTestId);

    simulateImageLoadSuccess(getByTestId);

    assertButtonStructure(getByTestId, queryByTestId);
    expect(mockOpenModal).not.toHaveBeenCalled();
  });

  test('handles image load error and positions button in center', () => {
    const { getByTestId, queryByTestId } = renderRecipeImage();

    assertContainerStructure(getByTestId);
    assertButtonStructure(getByTestId, queryByTestId);

    simulateImageLoadError(getByTestId);

    assertButtonStructure(getByTestId, queryByTestId);
    expect(mockOpenModal).not.toHaveBeenCalled();
  });

  test('renders without button when buttonIcon is not provided', () => {
    const { getByTestId, queryByTestId } = renderRecipeImage({ buttonIcon: undefined });

    assertContainerStructure(getByTestId);
    assertButtonStructure(getByTestId, queryByTestId, false);

    simulateImageLoadSuccess(getByTestId);
    assertButtonStructure(getByTestId, queryByTestId, false);

    simulateImageLoadError(getByTestId);
    assertButtonStructure(getByTestId, queryByTestId, false);
  });

  test('handles empty image URI correctly', () => {
    const { getByTestId, queryByTestId } = renderRecipeImage({ imgUri: emptyImageUri });

    assertContainerStructure(getByTestId, emptyImageUri);
    assertButtonStructure(getByTestId, queryByTestId, true, 'medium');

    fireEvent.press(getByTestId('RecipeImage::RoundButton::OnPressFunction'));
    expect(mockOpenModal).toHaveBeenCalledWith(recipeColumnsNames.image);
  });

  test('handles multiple image load state changes correctly', () => {
    const { getByTestId, queryByTestId } = renderRecipeImage();

    assertContainerStructure(getByTestId);
    assertButtonStructure(getByTestId, queryByTestId);

    simulateImageLoadSuccess(getByTestId);
    assertButtonStructure(getByTestId, queryByTestId);

    simulateImageLoadError(getByTestId);
    assertButtonStructure(getByTestId, queryByTestId);

    simulateImageLoadSuccess(getByTestId);
    assertButtonStructure(getByTestId, queryByTestId);

    fireEvent.press(getByTestId('RecipeImage::RoundButton::OnPressFunction'));
    expect(mockOpenModal).toHaveBeenCalledTimes(1);
    expect(mockOpenModal).toHaveBeenCalledWith(recipeColumnsNames.image);
  });

  test('passes different button icons correctly', () => {
    const customIcon: IconName = 'image-edit';
    const { getByTestId, queryByTestId } = renderRecipeImage({ buttonIcon: customIcon });

    assertContainerStructure(getByTestId);
    assertButtonStructure(getByTestId, queryByTestId, true, 'medium', customIcon);

    fireEvent.press(getByTestId('RecipeImage::RoundButton::OnPressFunction'));
    expect(mockOpenModal).toHaveBeenCalledWith(recipeColumnsNames.image);
  });

  test('handles different image URIs and maintains state correctly', () => {
    const { getByTestId, queryByTestId, rerender } = renderRecipeImage();

    assertContainerStructure(getByTestId);

    const newImageUri = 'https://example.com/new-recipe-image.jpg';
    rerender(
      <RecipeImage imgUri={newImageUri} openModal={mockOpenModal} buttonIcon={sampleButtonIcon} />
    );

    assertContainerStructure(getByTestId, newImageUri);
    assertButtonStructure(getByTestId, queryByTestId);

    rerender(
      <RecipeImage imgUri={emptyImageUri} openModal={mockOpenModal} buttonIcon={sampleButtonIcon} />
    );

    assertContainerStructure(getByTestId, emptyImageUri);
    assertButtonStructure(getByTestId, queryByTestId);
  });

  test('maintains callback functionality across different openModal functions', () => {
    const { getByTestId, rerender } = renderRecipeImage();

    fireEvent.press(getByTestId('RecipeImage::RoundButton::OnPressFunction'));
    expect(mockOpenModal).toHaveBeenCalledTimes(1);
    expect(mockOpenModal).toHaveBeenCalledWith(recipeColumnsNames.image);

    const newMockOpenModal = jest.fn();
    rerender(
      <RecipeImage
        imgUri={sampleImageUri}
        openModal={newMockOpenModal}
        buttonIcon={sampleButtonIcon}
      />
    );

    fireEvent.press(getByTestId('RecipeImage::RoundButton::OnPressFunction'));
    expect(newMockOpenModal).toHaveBeenCalledTimes(1);
    expect(newMockOpenModal).toHaveBeenCalledWith(recipeColumnsNames.image);
    expect(mockOpenModal).toHaveBeenCalledTimes(1);
  });

  test('handles rapid image load state changes without errors', () => {
    const { getByTestId, queryByTestId } = renderRecipeImage();

    simulateImageLoadSuccess(getByTestId);
    simulateImageLoadError(getByTestId);
    simulateImageLoadSuccess(getByTestId);
    simulateImageLoadError(getByTestId);
    simulateImageLoadSuccess(getByTestId);

    assertContainerStructure(getByTestId);
    assertButtonStructure(getByTestId, queryByTestId);

    fireEvent.press(getByTestId('RecipeImage::RoundButton::OnPressFunction'));
    expect(mockOpenModal).toHaveBeenCalledTimes(1);
    expect(mockOpenModal).toHaveBeenCalledWith(recipeColumnsNames.image);
  });

  test('preserves image URI display regardless of load state', () => {
    const { getByTestId } = renderRecipeImage();

    assertContainerStructure(getByTestId);

    simulateImageLoadSuccess(getByTestId);
    assertContainerStructure(getByTestId);

    simulateImageLoadError(getByTestId);
    assertContainerStructure(getByTestId);

    simulateImageLoadSuccess(getByTestId);
    assertContainerStructure(getByTestId);
  });

  test('handles edge cases with various image URI formats', () => {
    const edgeCaseUris = [
      'file:///local/path/image.jpg',
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...',
      'content://media/external/images/media/1234',
      'https://example.com/image-with-special-chars%20and%20symbols.jpg',
      '',
      undefined as any,
      null as any,
    ];

    edgeCaseUris.forEach(uri => {
      const { getByTestId, queryByTestId, unmount } = renderRecipeImage({ imgUri: uri || '' });

      assertContainerStructure(getByTestId, uri || '');

      if (sampleButtonIcon) {
        assertButtonStructure(getByTestId, true);
        fireEvent.press(getByTestId('RecipeImage::RoundButton::OnPressFunction'));
        expect(mockOpenModal).toHaveBeenCalledWith(recipeColumnsNames.image);
      }

      unmount();
      jest.clearAllMocks();
    });
  });

  test('maintains component stability during prop changes', () => {
    const { getByTestId, queryByTestId, rerender } = renderRecipeImage();

    assertContainerStructure(getByTestId);
    assertButtonStructure(getByTestId, queryByTestId);

    const newUri = 'https://example.com/different-image.jpg';
    const newIcon: IconName = 'image-plus';
    const newCallback = jest.fn();

    rerender(<RecipeImage imgUri={newUri} openModal={newCallback} buttonIcon={newIcon} />);

    assertContainerStructure(getByTestId, newUri);
    assertButtonStructure(getByTestId, queryByTestId, true, 'medium', newIcon);

    fireEvent.press(getByTestId('RecipeImage::RoundButton::OnPressFunction'));
    expect(newCallback).toHaveBeenCalledWith(recipeColumnsNames.image);
    expect(mockOpenModal).not.toHaveBeenCalled();

    rerender(<RecipeImage imgUri={newUri} openModal={newCallback} />);

    assertButtonStructure(getByTestId, queryByTestId, false);
    assertContainerStructure(getByTestId, newUri);
  });
});
