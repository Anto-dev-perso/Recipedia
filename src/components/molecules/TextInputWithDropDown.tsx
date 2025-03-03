import {Keyboard, ScrollView, StyleProp, TextStyle, TouchableOpacity, View} from "react-native";
import {List, TextInput} from "react-native-paper";
import RecipeDatabase from "@utils/RecipeDatabase";
import React, {useState} from "react";
import {palette} from "@styles/colors";

export type TextInputWithDropDownType = {
    value?: string;
    style?: StyleProp<TextStyle>;
    label?: string;
    outline?: boolean;
    onChangeText?: (newText: string) => void;
};

export default function TextInputWithDropDown(props: TextInputWithDropDownType) {
    const ingredientsList = RecipeDatabase.getInstance()
        .get_ingredients()
        .map((ingredient) => ingredient.ingName).sort();

    const [textInput, setTextInput] = useState(props.value ?? "");
    const [filteredIngredients, setFilteredIngredients] = useState(
        props.value ? filterArray(props.value) : ingredientsList
    );
    const [showDropdown, setShowDropdown] = useState(false);
    const [inputHeight, setInputHeight] = useState(0);

    function filterArray(filterText: string): Array<string> {
        return ingredientsList.filter((ingredient) =>
            ingredient.toLowerCase().includes(filterText.toLowerCase())
        );
    }

    const handleSelect = (ingredientName: string) => {
        setTextInput(ingredientName);
        setFilteredIngredients([]);
        setShowDropdown(false);
        Keyboard.dismiss();
        props.onChangeText?.(ingredientName);
    };

    const handleSearch = (textEntered: string) => {
        setTextInput(textEntered);
        setFilteredIngredients(filterArray(textEntered));
        setShowDropdown(true);
        props.onChangeText?.(textEntered);
    };

    const handleSubmitEditing = () => {
        setShowDropdown(false);
        Keyboard.dismiss();
        props.onChangeText?.(textInput);
    };

    return (
        <View>
            <TextInput testID={"TextInputWithDropDown::TextInput"}
                       label={props.label}
                       value={textInput}
                       onFocus={() => setShowDropdown(true)}
                       onChangeText={handleSearch}
                       onSubmitEditing={handleSubmitEditing}
                       mode={props.outline === true ? "outlined" : "flat"}
                       style={props.style}
                       onLayout={(event) => setInputHeight(event.nativeEvent.layout.height)}
            />

            {(showDropdown && filteredIngredients.length > 0 && !(filteredIngredients.length === 1 && filteredIngredients[0].toLowerCase() === textInput.toLowerCase())) && (
                <View testID={"TextInputWithDropDown::DropdownContainer"}
                      style={{
                          position: "absolute",
                          top: inputHeight,
                          left: 0,
                          right: 0,
                          zIndex: 1000,
                          backgroundColor: palette.backgroundColor,
                          // TODO do not hard code
                          borderRadius: 5,
                          elevation: 5,
                          maxHeight: inputHeight * 4,
                      }}
                >
                    <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
                        {filteredIngredients.map((item) => (
                            <TouchableOpacity testID={"TextInputWithDropDown::TouchableOpacity::" + item} key={item}
                                              onPress={() => handleSelect(item)}>
                                <List.Item testID={"TextInputWithDropDown::List::" + item} title={item}/>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}
