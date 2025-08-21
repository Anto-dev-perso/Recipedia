import React from 'react';
import {
  Text as RNText,
  TextInput as RNTextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

// Mock components with proper TypeScript types
export const Button: React.FC<any> = props => (
  <TouchableOpacity testID={props.testID} onPress={props.onPress} style={props.style}>
    <RNText>{props.children}</RNText>
  </TouchableOpacity>
);

export const RadioButton: React.FC<any> & { Group: React.FC<any> } = props => (
  <TouchableOpacity testID={props.testID} onPress={props.onPress}>
    <RNText>RadioButton</RNText>
  </TouchableOpacity>
);

RadioButton.Group = props => (
  <View testID={props.testID} {...{ value: props.value, onValueChange: props.onValueChange }}>
    {props.children}
  </View>
);

export const Dialog: React.FC<any> & {
  Title: React.FC<any>;
  Content: React.FC<any>;
  Actions: React.FC<any>;
} = props => {
  // Only render children when visible is true (matches real react-native-paper behavior)
  if (!props.visible) {
    return null;
  }
  
  return (
    <View testID={props.testID} {...{ visible: props.visible, onDismiss: props.onDismiss }}>
      {props.children}
    </View>
  );
};

Dialog.Title = props => <RNText testID={props.testID}>{props.children}</RNText>;

Dialog.Content = props => <View testID={props.testID}>{props.children}</View>;

Dialog.Actions = props => <View testID={props.testID}>{props.children}</View>;

export const Menu: React.FC<any> & { Item: React.FC<any> } = props => (
  <View testID={props.testID} {...{ visible: props.visible, onDismiss: props.onDismiss }}>
    {props.children}
  </View>
);

Menu.Item = props => (
  <TouchableOpacity testID={props.testID} onPress={props.onPress}>
    <RNText>{props.title || props.children}</RNText>
  </TouchableOpacity>
);

export const Portal: React.FC<any> = props => <View testID={props.testID}>{props.children}</View>;

export const Text: React.FC<any> = props => (
  <RNText testID={props.testID} style={props.style}>
    {props.children}
  </RNText>
);

export const TextInput = React.forwardRef<any, any>((props, ref) => {
  const textInputProps: TextInputProps = {
    testID: props.testID,
    style: props.style,
    value: props.value,
    onChangeText: props.onChangeText,
    onFocus: props.onFocus,
    onBlur: props.onBlur,
    onEndEditing: props.onEndEditing,
    onContentSizeChange: props.onContentSizeChange,
    placeholder: props.placeholder,
    editable: props.editable,
    multiline: props.multiline,
    keyboardType: props.keyboardType,
  };

  // If there's a label, render it as Text above the TextInput
  if (props.label) {
    return (
      <View>
        <RNText testID={props.testID + '::Label'}>{props.label}</RNText>
        <RNTextInput {...textInputProps} />
      </View>
    );
  }

  return <RNTextInput {...textInputProps} />;
});

export const Chip: React.FC<any> = props => (
  <TouchableOpacity testID={props.testID} onPress={props.onPress} style={props.style}>
    <RNText testID={props.testID + '::Children'}>{props.children}</RNText>
  </TouchableOpacity>
);

export const Card: React.FC<any> & {
  Content: React.FC<any>;
  Actions: React.FC<any>;
} = props => (
  <View testID={props.testID} style={props.style}>
    {props.children}
  </View>
);

Card.Content = props => <View testID={props.testID}>{props.children}</View>;

Card.Actions = props => (
  <View testID={props.testID} style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
    {props.children}
  </View>
);

export const Divider: React.FC<any> = props => <View testID={props.testID} />;

export const configureFonts = jest.fn((config?: any) => {
  return (
    config?.config || {
      titleLarge: { fontFamily: 'System', fontWeight: '400' },
      titleMedium: { fontFamily: 'System', fontWeight: '400' },
      titleSmall: { fontFamily: 'System', fontWeight: '400' },
      bodyLarge: { fontFamily: 'System', fontWeight: '400' },
      bodyMedium: { fontFamily: 'System', fontWeight: '400' },
      bodySmall: { fontFamily: 'System', fontWeight: '400' },
      labelLarge: { fontFamily: 'System', fontWeight: '400' },
      labelMedium: { fontFamily: 'System', fontWeight: '400' },
      labelSmall: { fontFamily: 'System', fontWeight: '400' },
    }
  );
});

export const useTheme = jest.fn(() => ({
  colors: {
    primary: '#6200ee',
    primaryContainer: '#e8def8',
    secondary: '#03dac6',
    secondaryContainer: '#cefaf8',
    background: '#f6f6f6',
    surface: '#ffffff',
    error: '#b00020',
    onPrimary: '#ffffff',
    onSecondary: '#000000',
    onBackground: '#000000',
    onSurface: '#000000',
    onError: '#ffffff',
    text: '#000000',
    disabled: '#9e9e9e',
    placeholder: '#9e9e9e',
    backdrop: 'rgba(0,0,0,0.5)',
    notification: '#f50057',
  },
  fonts: {
    bodySmall: { fontSize: 12 },
    bodyMedium: { fontSize: 14 },
    bodyLarge: { fontSize: 16 },
    headlineSmall: { fontSize: 18 },
    headlineMedium: { fontSize: 20 },
    headlineLarge: { fontSize: 24 },
    titleSmall: { fontSize: 16 },
    titleMedium: { fontSize: 18 },
    titleLarge: { fontSize: 20 },
    labelSmall: { fontSize: 10 },
    labelMedium: { fontSize: 12 },
    labelLarge: { fontSize: 14 },
  },
}));

export const List = {
  Section: (props: any) => <View testID={props.testID}>{props.children}</View>,
  Item: (props: any) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <RNText testID={props.testID + '::Title'}>{props.title}</RNText>
    </TouchableOpacity>
  ),
};
