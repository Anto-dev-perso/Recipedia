import React, {useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Image as ExpoImage, ImageErrorEventData, ImageLoadEventData} from 'expo-image';
import {ActivityIndicator, useTheme} from 'react-native-paper';
import {defaultDuration} from "@utils/Constants";

// Define the prop types using a type alias for clarity and flexibility.
export type CustomImageProps = {
    uri?: string;
    style?: StyleProp<ViewStyle>;
    contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    transitionDuration?: number;
    onLoadStart?: () => void;
    onLoad?: (event: ImageLoadEventData) => void;
    onError?: (error: any) => void;
    propsTestID?: string;
};

export default function CustomImage({
                                        uri,
                                        style,
                                        contentFit = 'cover',
                                        transitionDuration = defaultDuration,
                                        onLoadStart,
                                        onLoad,
                                        onError, propsTestID
                                    }: CustomImageProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const theme = useTheme();

    return (
        <View style={[styles.container, style]}>
            <ExpoImage testID={propsTestID + "::Image"}
                       source={uri}
                       style={StyleSheet.absoluteFill}
                       contentFit={contentFit}
                       transition={transitionDuration}
                       onLoadStart={() => {
                           setLoading(true);
                           onLoadStart?.();
                       }}
                       onLoad={(event: ImageLoadEventData) => {
                           setLoading(false);
                           onLoad?.(event);
                       }}
                       onError={(err: ImageErrorEventData) => {
                           setLoading(false);
                           setError(true);
                           onError?.(err);
                       }}
            />
            {loading && (
                <ActivityIndicator
                    animating={true}
                    size="small"
                    style={styles.indicator}
                />
            )}
            {error && (
                <ActivityIndicator
                    animating={true}
                    size="small"
                    color={theme.colors.error}
                    style={styles.indicator}
                />
            )}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        position: 'relative',
    },
    indicator: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
