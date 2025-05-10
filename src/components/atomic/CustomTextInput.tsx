import React, {useRef, useState} from "react";
import {
    LayoutChangeEvent,
    NativeSyntheticEvent,
    StyleProp,
    StyleSheet,
    TextInputContentSizeChangeEventData,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from "react-native";
import {TextInput, useTheme} from "react-native-paper";
import {screenHeight} from "@styles/spacing";

export type CustomTextInputProps = {
    testID: string,
    editable?: boolean,
    label?: string,
    value?: string,
    multiline?: boolean,
    keyboardType?: 'default' | 'number-pad' | 'email-address' | 'phone-pad' | 'numeric' | 'url',
    style?: StyleProp<ViewStyle>,
    contentStyle?: StyleProp<TextStyle>,
    onFocus?: () => void,
    onChangeText?: (text: string) => void,
    onEndEditing?: () => void,
    onBlur?: () => void,
    onLayout?: (event: LayoutChangeEvent) => void,
};

export default function CustomTextInput({
                                            testID,
                                            editable = true,
                                            label,
                                            value,
                                            multiline = false,
                                            keyboardType = 'default',
                                            style,
                                            contentStyle,
                                            onFocus,
                                            onChangeText,
                                            onEndEditing,
                                            onBlur,
                                            onLayout
                                        }: CustomTextInputProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputHeight, setInputHeight] = React.useState(screenHeight * 0.08);

    const inputRef = useRef<any>(null);


    function handlePress() {
        if (editable && !isEditing) {
            setIsEditing(true);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);

        }
    }

    function handleOnFocus() {
        setIsEditing(true);
        onFocus?.();
    }

    function handleOnChangeText(text: string) {
        onChangeText?.(text);
    }

    function handleOnEndEditing() {
        setIsEditing(false);
        onEndEditing?.();
    }

    function handleOnBlur() {
        setIsEditing(false);
        onBlur?.();
    }

    function handleOnLayout(event: LayoutChangeEvent) {
        onLayout?.(event);
    }

    function handleOnContentSizeChange({nativeEvent: {contentSize}}: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) {
        if (multiline) {
            const h = contentSize.height;
            if (inputHeight !== h) {
                setInputHeight(h);
            }
        }
    }

    const {colors} = useTheme();

    const inputStyle = [style as TextStyle, {height: inputHeight}, (editable ? {} : {backgroundColor: colors.backdrop})];
    return (
        <View style={style} testID={testID + "::CustomTextInput"} pointerEvents={'box-none'}>

            <TextInput testID={testID + "::TextInput"} ref={inputRef}
                       label={label}
                       value={value ?? ""}
                       style={inputStyle}
                       contentStyle={contentStyle}
                       onFocus={handleOnFocus}
                       onChangeText={handleOnChangeText}
                       onEndEditing={handleOnEndEditing}
                       mode={"outlined"}
                       multiline={multiline}
                       editable={isEditing}
                       keyboardType={keyboardType}
                       onBlur={handleOnBlur}
                       onLayout={handleOnLayout}
                       onContentSizeChange={handleOnContentSizeChange}
            />
            {!isEditing ? <TouchableOpacity testID={testID + "::TouchableOpacity"} style={StyleSheet.absoluteFill}
                                            activeOpacity={1}
                                            onPress={handlePress}/> : null}
        </View>
    )
};
