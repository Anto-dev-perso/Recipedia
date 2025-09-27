// CustomImage.test.tsx
import React from 'react';
import { act, render } from '@testing-library/react-native';
import CustomImage from '@components/atomic/CustomImage';
import { ImageErrorEventData, ImageLoadEventData } from 'expo-image';

describe('CustomImage component behavior', () => {
  const dummyUri = 'dummy://test-uri';
  const ID = 'Test';

  it('calls onLoadSuccess when expo image onLoad is triggered', () => {
    const onLoadMock = jest.fn();
    const dummyEvent: ImageLoadEventData = {
      cacheType: 'none',
      source: {
        url: 'dummyEventUrl',
        width: 100,
        height: 100,
        mediaType: 'unitTest',
        isAnimated: true,
      },
    };
    const { getByTestId } = render(
      <CustomImage uri={dummyUri} onLoadSuccess={onLoadMock} testID={ID} />
    );

    const expoImage = getByTestId('Test::Image');
    act(() => {
      expoImage.props.onLoad({ nativeEvent: dummyEvent });
    });
    expect(onLoadMock).toHaveBeenCalledWith(dummyEvent);
  });

  it('calls onError when expo image onError is triggered', () => {
    const onErrorMock = jest.fn();
    const dummyError: ImageErrorEventData = { error: 'error string for the test' };

    const { getByTestId } = render(
      <CustomImage uri={dummyUri} onLoadError={onErrorMock} testID={ID} />
    );

    const expoImage = getByTestId('Test::Image');
    act(() => {
      expoImage.props.onError({ nativeEvent: dummyError });
    });

    expect(onErrorMock).toHaveBeenCalledWith(dummyError);
  });

  it('applies custom background color when provided', () => {
    const customColor = '#FF0000';
    const { getByTestId } = render(
      <CustomImage uri={dummyUri} backgroundColor={customColor} testID={ID} />
    );

    const expoImage = getByTestId('Test::Image');
    expect(expoImage.props.style.backgroundColor).toBe(customColor);
  });

  it('applies size dimensions when provided', () => {
    const size = 100;
    const { getByTestId } = render(<CustomImage uri={dummyUri} size={size} testID={ID} />);

    const expoImage = getByTestId('Test::Image');
    const style = expoImage.props.style;
    expect(style.width).toBe(size);
    expect(style.height).toBe(size);
  });

  it('applies circular border radius when circular and size are provided', () => {
    const size = 100;
    const { getByTestId } = render(<CustomImage uri={dummyUri} size={size} circular testID={ID} />);

    const expoImage = getByTestId('Test::Image');
    expect(expoImage.props.style.borderRadius).toBe(size / 2);
  });

  it('does not apply border radius when circular but no size provided', () => {
    const { getByTestId } = render(<CustomImage uri={dummyUri} circular testID={ID} />);

    const expoImage = getByTestId('Test::Image');
    expect(expoImage.props.style.borderRadius).toBe(0);
  });

  it('uses default contentFit when not specified', () => {
    const { getByTestId } = render(<CustomImage uri={dummyUri} testID={ID} />);
    expect(getByTestId('Test::Image').props.contentFit).toBe('cover');
  });

  it('applies custom contentFit when provided', () => {
    const { getByTestId } = render(<CustomImage uri={dummyUri} contentFit='contain' testID={ID} />);

    expect(getByTestId('Test::Image').props.contentFit).toBe('contain');
  });

  it('uses theme colors as default background when no backgroundColor provided', () => {
    const { getByTestId } = render(<CustomImage uri={dummyUri} testID={ID} />);

    const expoImage = getByTestId('Test::Image');
    const isArrya = Array.isArray(expoImage.props.style);
    // Should use theme.colors.tertiary as default
    const style = Array.isArray(expoImage.props.style)
      ? expoImage.props.style.find((s: any) => s?.backgroundColor) || expoImage.props.style[0]
      : expoImage.props.style;
    expect(style.backgroundColor).toBe('#7c5800'); // tertiary color from mock
  });
});
