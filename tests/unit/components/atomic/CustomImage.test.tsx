// CustomImage.test.tsx
import React from 'react';
import {act, render} from '@testing-library/react-native';
import CustomImage from '@components/atomic/CustomImage';
import {ImageErrorEventData, ImageLoadEventData} from "expo-image";

describe('CustomImage component behavior', () => {
    const dummyUri = 'dummy://test-uri';
    const ID = "Test";

    it('calls onLoadSuccess when expo image onLoad is triggered', () => {
        const onLoadMock = jest.fn();
        const dummyEvent: ImageLoadEventData = {
            cacheType: 'none',
            source: {url: "dummyEventUrl", width: 100, height: 100, mediaType: "unitTest", isAnimated: true}
        };
        const {getByTestId} = render(
            <CustomImage uri={dummyUri} onLoadSuccess={onLoadMock} testID={ID}/>
        );

        const expoImage = getByTestId('Test::Image');
        act(() => {
            expoImage.props.onLoad({nativeEvent: dummyEvent});
        });
        expect(onLoadMock).toHaveBeenCalledWith(dummyEvent);
    });

    it('calls onError when expo image onError is triggered', () => {
        const onErrorMock = jest.fn();
        const dummyError: ImageErrorEventData = {error: "error string for the test"};

        const {getByTestId} = render(
            <CustomImage uri={dummyUri} onLoadError={onErrorMock} testID={ID}/>
        );

        const expoImage = getByTestId("Test::Image");
        act(() => {
            expoImage.props.onError({nativeEvent: dummyError});
        });

        expect(onErrorMock).toHaveBeenCalledWith(dummyError);
    });
});
