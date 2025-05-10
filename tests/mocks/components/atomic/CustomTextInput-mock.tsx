import {TextInput, TextStyle} from "react-native";
import React from "react";
import {CustomTextInputProps} from "@components/atomic/CustomTextInput";

export function customTextInputMock({
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

    return (
        <TextInput testID={testID + "::TextInput"} style={style as TextStyle} editable={editable} value={value}
                   multiline={multiline}
                   onFocus={onFocus} onChangeText={onChangeText} onEndEditing={onEndEditing} onBlur={onBlur}
                   onLayout={onLayout}>{label}</TextInput>
    );
}
