import React from 'react';
import {View} from 'react-native';
import {Image} from 'expo-image';
import {useTheme} from 'react-native-paper';

export type CustomImageProps = {
    uri?: string;
    contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    onLoadSuccess?: () => void;
    onLoadError?: () => void;
    propsTestID?: string;
};

export default function CustomImage({
                                        uri,
                                        contentFit = 'cover',
                                        onLoadSuccess, onLoadError,
                                        propsTestID
                                    }: CustomImageProps) {

    const {colors} = useTheme();

    return (
        <View style={{flex: 1}}>
            <Image
                style={[{flex: 1, backgroundColor: colors.tertiary}]}
                testID={propsTestID + "::Image"}
                source={uri}
                contentFit={contentFit}
                onError={onLoadError}
                onLoad={onLoadSuccess}

            />
        </View>
    );
};
