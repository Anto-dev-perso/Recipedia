import React from 'react';
import {Text as RNText, TextInput as RNTextInput, TouchableOpacity, View} from "react-native";
// Create simple mock components using React Native base components
const Button = ({testID, onPress, children}: any) => (
    <TouchableOpacity testID={testID} onPress={() => onPress()}>
        <RNText>{children}</RNText>
    </TouchableOpacity>
);

const RadioButton = ({testID, onPress, children}: any) => (
    <TouchableOpacity testID={testID} onPress={() => onPress()}>
        <RNText>{children}</RNText>
    </TouchableOpacity>
);
RadioButton.Group = ({testID, onValueChange, value, children}: any) => (
    <View testID={testID}>{children}</View>
);

const Dialog = ({testID, onDismiss, children}: any) => (
    <View testID={testID} onTouchEnd={onDismiss}>
        {children}
    </View>
);

Dialog.Title = ({testID, children}: any) => (
    <RNText testID={testID}>{children}</RNText>
);

Dialog.Content = ({children}: any) => <View>{children}</View>;
Dialog.Actions = ({children}: any) => <View>{children}</View>;

const Menu = ({testID, visible, onDismiss, children}: any) => (
    <View testID={testID} style={{display: visible ? 'flex' : 'none'}} onTouchEnd={onDismiss}>
        {children}
    </View>
);

Menu.Item = ({testID, onPress, children}: any) => (
    <TouchableOpacity testID={testID} onPress={onPress}>
        <RNText>{children}</RNText>
    </TouchableOpacity>
);

const Portal = ({children}: any) => <View>{children}</View>;

const Text = ({testID, style, children}: any) => (
    <RNText testID={testID} style={style}>{children}</RNText>
);

const TextInput = ({testID, style, children}: any) => (
    <RNTextInput testID={testID} style={style}>{children}</RNTextInput>
);

const Chip = ({testID, style, onPress, children}: any) => (
    <TouchableOpacity testID={testID} style={style} onPress={() => onPress()
    }>
        <RNText testID={testID + "::Children"}>{children}</RNText>
    </TouchableOpacity>
);

const Card = ({style, children}: any) => (
    <View style={style}>{children}</View>
);

Card.Content = ({children}: any) => (
    <View>{children}</View>
);

Card.Actions = ({children}: any) => (
    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>{children}</View>
);

const Divider = ({children}: any) => {
    <View>{children}  </View>

};

const useTheme = () => ({
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
});

export const reactNativePaperMock = {
    Button,
    RadioButton,
    Card,
    Dialog,
    Menu,
    Portal,
    Text,
    Chip,
    useTheme,
    TextInput,
    Divider,
    List: {
        Section: ({testID, children}: any) => <View testID={testID}>{children}</View>,
        Item: ({testID, title, onPress}: any) => <TouchableOpacity testID={testID} onPress={() => onPress()}>
            <Text testID={testID + "::Title"}>{title}</Text>
        </TouchableOpacity>
    }
};
