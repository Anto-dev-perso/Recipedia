import {
    FlatList,
    Keyboard,
    LayoutChangeEvent,
    LogBox,
    StyleProp,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from "react-native";
import {List, TextInput} from "react-native-paper";
import React, {useEffect, useRef, useState} from "react";
import {palette} from "@styles/colors";
import CustomTextInput from "@components/atomic/CustomTextInput";

export type TextInputWithDropDownType = {
    absoluteDropDown: boolean,
    referenceTextArray: Array<string>,
    value?: string,
    label?: string,
    editable?: boolean,
    onValidate?: (newText: string) => void,
    testID: string,
    style?: StyleProp<ViewStyle>,
    contentStyle?: StyleProp<TextStyle>,
};

export default function TextInputWithDropDown(props: TextInputWithDropDownType) {

    const [textInput, setTextInput] = useState(props.value ?? "");
    const [filteredTextArray, setFilteredTextArray] = useState(
        props.value ? filterArray(props.value) : props.referenceTextArray
    );
    const [showDropdown, setShowDropdown] = useState(false);
    const [inputHeight, setInputHeight] = useState(0);

    const inputRef = useRef<React.ElementRef<typeof TextInput>>(null);

    useEffect(() => {
        if (process.env.NODE_ENV !== 'test') {
            LogBox.ignoreLogs([
                "VirtualizedLists should never be nested inside plain ScrollViews", // Disable only this warning
            ]);
        }
    }, []);

    useEffect(() => {
        const keyboardListener = Keyboard.addListener("keyboardDidHide", () => {
            if (inputRef.current && inputRef.current.isFocused()) {
                handleSubmitEditing();
            }
        });

        return () => {
            keyboardListener.remove();
        };
    }, [textInput, showDropdown]);

    function filterArray(filterText: string): Array<string> {
        return props.referenceTextArray.filter(element =>
            element.toLowerCase().includes(filterText.toLowerCase())
        );
    }

    function handleSelect(text: string) {
        setTextInput(text);
        setFilteredTextArray([]);
        setShowDropdown(false);
        Keyboard.dismiss();
        props.onValidate?.(text);
    }

    function handleSearch(textEntered: string) {
        setTextInput(textEntered);
        setFilteredTextArray(filterArray(textEntered));
        setShowDropdown(true);
    }

    function handleSubmitEditing() {
        // Send validate if user write a new element (length ===0) or if user write manually the only element possible (length===0)
        if (filteredTextArray.length <= 1) {
            setShowDropdown(false);
            props.onValidate?.(textInput);
        }
    }

    function handleOnLayoutTextInput(event: LayoutChangeEvent) {
        setInputHeight(event.nativeEvent.layout.height)
    }

    const dropdownStyle: StyleProp<ViewStyle> = {
        backgroundColor: palette.backgroundColor,
        // TODO do not hard code
        borderRadius: 5,
        elevation: 5,
        marginTop: 4,
        maxHeight: inputHeight * 4,
    };
    return (
        <View style={props.style as ViewStyle}>
            <CustomTextInput label={props.label} testID={props.testID} value={textInput} style={props.style}
                             contentStyle={props.contentStyle}
                             onFocus={() => setShowDropdown(true)} onChangeText={handleSearch}
                             onEndEditing={handleSubmitEditing}
                             onLayout={handleOnLayoutTextInput}/>
            {(showDropdown && filteredTextArray.length > 0 && !(filteredTextArray.length === 1 && filteredTextArray[0].toLowerCase() === textInput.toLowerCase())) && (
                <View testID={props.testID + "::DropdownContainer"}
                      style={props.absoluteDropDown ? {
                          ...dropdownStyle, position: "absolute",
                          top: inputHeight,
                          left: 0,
                          right: 0,
                          zIndex: 1000,  // TODO doesn't seems to work that wells
                      } : dropdownStyle}>
                    <FlatList data={filteredTextArray} keyboardShouldPersistTaps="handled"
                              nestedScrollEnabled={true} renderItem={({item}) => (
                        <TouchableOpacity
                            testID={"TextInputWithDropDown::TouchableOpacity::" + item}
                            key={item}
                            onPress={() => handleSelect(item)}>
                            <List.Item testID={"TextInputWithDropDown::List::" + item} title={item}/>
                        </TouchableOpacity>
                    )}
                              {...(process.env.NODE_ENV === 'test' ? {
                                  initialNumToRender: filteredTextArray.length,
                                  maxToRenderPerBatch: filteredTextArray.length,
                                  windowSize: filteredTextArray.length
                              } : null)}/>
                </View>
            )}
        </View>
    );

}
