/**
 * TextInputWithDropDown - Autocomplete text input with dropdown suggestions
 *
 * An enhanced text input component that provides real-time autocomplete functionality
 * with a dropdown list of filtered suggestions. Features intelligent keyboard handling,
 * customizable positioning (absolute or relative), and comprehensive state management
 * for optimal user experience.
 *
 * Key Features:
 * - Real-time text filtering with case-insensitive search
 * - Configurable dropdown positioning (absolute/relative)
 * - Intelligent keyboard event handling and auto-dismiss
 * - Smart suggestion logic (hides exact matches)
 * - Performance optimizations for testing environments
 * - Customizable styling for input and dropdown
 * - Automatic validation callbacks on selection/submission
 * - Responsive dropdown sizing based on input height
 *
 * @example
 * ```typescript
 * // Basic autocomplete for ingredients
 * <TextInputWithDropDown
 *   referenceTextArray={ingredientNames}
 *   value={selectedIngredient}
 *   label="Ingredient"
 *   absoluteDropDown={false}
 *   onValidate={(ingredient) => addIngredient(ingredient)}
 *   testID="ingredient-input"
 * />
 *
 * // Absolute positioned dropdown for overlay contexts
 * <TextInputWithDropDown
 *   referenceTextArray={tagOptions}
 *   value={currentTag}
 *   label="Add Tag"
 *   absoluteDropDown={true}
 *   onValidate={(tag) => handleTagSelection(tag)}
 *   testID="tag-autocomplete"
 *   style={{margin: 16}}
 * />
 *
 * // Pre-populated with custom styling
 * <TextInputWithDropDown
 *   referenceTextArray={recipeTypes}
 *   value="Dessert"
 *   label="Recipe Type"
 *   absoluteDropDown={false}
 *   onValidate={(type) => updateRecipeType(type)}
 *   testID="recipe-type-input"
 *   contentStyle={{fontSize: 16}}
 * />
 * ```
 */

import {
  FlatList,
  Keyboard,
  LayoutChangeEvent,
  LogBox,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { List, TextInput } from 'react-native-paper';
import React, { useEffect, useRef, useState } from 'react';
import { palette } from '@styles/colors';
import CustomTextInput from '@components/atomic/CustomTextInput';

/**
 * Props for the TextInputWithDropDown component
 */
export type TextInputWithDropDownType = {
  /** Whether dropdown should use absolute positioning (for overlays) */
  absoluteDropDown: boolean;
  /** Array of reference strings to filter and display as suggestions */
  referenceTextArray: Array<string>;
  /** Current value of the text input */
  value?: string;
  /** Label text displayed above the input */
  label?: string;
  /** Whether the input is editable (default: true) */
  editable?: boolean;
  /** Callback fired when text is validated (submitted or selected) */
  onValidate?: (newText: string) => void;
  /** Unique identifier for testing and accessibility */
  testID: string;
  /** Custom styles for the container */
  style?: StyleProp<ViewStyle>;
  /** Custom styles for the text content */
  contentStyle?: StyleProp<TextStyle>;
};

/**
 * TextInputWithDropDown component for autocomplete functionality
 *
 * @param props - The component props
 * @returns JSX element representing an autocomplete text input with dropdown suggestions
 */
export default function TextInputWithDropDown(props: TextInputWithDropDownType) {
  const [textInput, setTextInput] = useState(props.value ?? '');
  const [filteredTextArray, setFilteredTextArray] = useState(
    props.value ? filterArray(props.value) : props.referenceTextArray
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputHeight, setInputHeight] = useState(0);

  const inputRef = useRef<React.ElementRef<typeof TextInput>>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'test') {
      LogBox.ignoreLogs([
        'VirtualizedLists should never be nested inside plain ScrollViews', // Disable only this warning
      ]);
    }
  }, []);

  // Update internal state when props.value changes
  useEffect(() => {
    if (props.value !== undefined && props.value !== textInput) {
      setTextInput(props.value);
      setFilteredTextArray(props.value ? filterArray(props.value) : props.referenceTextArray);
    }
  }, [props.value]);

  useEffect(() => {
    const keyboardListener = Keyboard.addListener('keyboardDidHide', () => {
      if (inputRef.current && inputRef.current.isFocused()) {
        handleSubmitEditing();
      }
    });

    return () => {
      keyboardListener.remove();
    };
  }, [textInput, showDropdown]);

  /**
   * Filters the reference array based on user input with case-insensitive matching
   *
   * This function implements the core autocomplete filtering logic, providing
   * case-insensitive substring matching against the reference text array.
   * It's the foundation of the dropdown suggestion system.
   *
   * @param filterText - The text input to filter against
   * @returns Array<string> - Filtered array of matching suggestions
   *
   * Filtering Logic:
   * - Converts both input and reference text to lowercase for comparison
   * - Uses includes() for substring matching (not just prefix matching)
   * - Returns all items that contain the filter text anywhere in the string
   *
   * Performance:
   * - Efficient array filtering with single pass
   * - Case conversion only when needed
   * - Optimized for real-time filtering during typing
   *
   * Use Cases:
   * - Real-time dropdown suggestion filtering
   * - Supports partial word matching for better UX
   * - Works with any string array reference data
   */
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

  /**
   * Handles submission validation with intelligent logic based on filtered array length
   *
   * This function implements smart validation logic that only triggers when the user
   * has either entered a completely new value or when there's only one possible
   * suggestion remaining. This prevents accidental submissions when multiple
   * suggestions are still available.
   *
   * Validation Logic:
   * - Validates when filteredTextArray.length <= 1
   * - Case 1: Length 0 = user entered new value not in reference array
   * - Case 2: Length 1 = user typed exact match or only one suggestion remains
   * - Prevents submission when multiple suggestions are available (length > 1)
   *
   * Side Effects:
   * - Hides dropdown when validation occurs
   * - Calls onValidate callback with current text input
   * - Provides clear user feedback by closing suggestions
   *
   * User Experience:
   * - Prevents accidental submission with ambiguous input
   * - Allows creation of new values not in reference array
   * - Enables quick submission when intent is clear
   * - Encourages selection from suggestions when multiple matches exist
   */
  function handleSubmitEditing() {
    // Send validate if user write a new element (length ===0) or if user write manually the only element possible (length===0)
    if (filteredTextArray.length <= 1) {
      setShowDropdown(false);
      props.onValidate?.(textInput);
    }
  }

  function handleOnLayoutTextInput(event: LayoutChangeEvent) {
    setInputHeight(event.nativeEvent.layout.height);
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
      <CustomTextInput
        label={props.label}
        testID={props.testID}
        value={textInput}
        style={props.style}
        contentStyle={props.contentStyle}
        onFocus={() => setShowDropdown(true)}
        onChangeText={handleSearch}
        onEndEditing={handleSubmitEditing}
        onLayout={handleOnLayoutTextInput}
      />
      {showDropdown &&
        filteredTextArray.length > 0 &&
        !(
          filteredTextArray.length === 1 &&
          filteredTextArray[0].toLowerCase() === textInput.toLowerCase()
        ) && (
          <View
            testID={props.testID + '::DropdownContainer'}
            style={
              props.absoluteDropDown
                ? {
                    ...dropdownStyle,
                    position: 'absolute',
                    top: inputHeight,
                    left: 0,
                    right: 0,
                    zIndex: 1000, // TODO doesn't seems to work that wells
                  }
                : dropdownStyle
            }
          >
            <FlatList
              data={filteredTextArray}
              keyboardShouldPersistTaps='handled'
              nestedScrollEnabled={true}
              renderItem={({ item }) => (
                <TouchableOpacity
                  testID={'TextInputWithDropDown::TouchableOpacity::' + item}
                  key={item}
                  onPress={() => handleSelect(item)}
                >
                  <List.Item testID={'TextInputWithDropDown::List::' + item} title={item} />
                </TouchableOpacity>
              )}
              {...(process.env.NODE_ENV === 'test'
                ? {
                    initialNumToRender: filteredTextArray.length,
                    maxToRenderPerBatch: filteredTextArray.length,
                    windowSize: filteredTextArray.length,
                  }
                : null)}
            />
          </View>
        )}
    </View>
  );
}
