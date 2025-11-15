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
  <TouchableOpacity
    testID={props.testID}
    onPress={props.onPress}
    style={props.style}
    {...{ disabled: props.disabled }}
  >
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

export const Modal: React.FC<any> = props => {
  if (!props.visible) {
    return null;
  }
  return (
    <View testID={props.testID} style={props.contentContainerStyle}>
      {props.children}
    </View>
  );
};

export const Text: React.FC<any> = props => (
  <RNText
    testID={props.testID}
    style={props.style}
    numberOfLines={props.numberOfLines}
    {...{ variant: props.variant }}
  >
    {props.children}
  </RNText>
);

const TextInputComponent = React.forwardRef<any, any>((props, ref) => {
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

  return (
    <View>
      {props.label && <RNText testID={props.testID + '::Label'}>{props.label}</RNText>}
      <RNTextInput
        {...textInputProps}
        {...{
          label: props.label,
          mode: props.mode,
          dense: props.dense,
          right: props.right,
        }}
      />
      {props.right && <View testID={props.testID + '::Right'}>{props.right}</View>}
    </View>
  );
}) as any;

TextInputComponent.Affix = (props: any) => <RNText testID={props.testID}>{props.text}</RNText>;

export const TextInput = TextInputComponent;

export const Chip: React.FC<any> = props => (
  <TouchableOpacity testID={props.testID} onPress={props.onPress} style={props.style}>
    <RNText testID={props.testID + '::Children'}>{props.children}</RNText>
  </TouchableOpacity>
);

export const Card: React.FC<any> & {
  Content: React.FC<any>;
  Actions: React.FC<any>;
  Cover: React.FC<any>;
  Title: React.FC<any>;
} = props => (
  <TouchableOpacity
    testID={props.testID}
    style={props.style}
    onPress={props.onPress}
    accessible={true}
  >
    <View>{props.children}</View>
  </TouchableOpacity>
);

Card.Content = props => (
  <View testID={props.testID} style={props.style}>
    {props.children}
  </View>
);

Card.Actions = props => (
  <View testID={props.testID} style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
    {props.children}
  </View>
);

Card.Cover = props => (
  <View testID={props.testID} style={props.style}>
    <RNText testID={props.testID + '::Source'}>{props.source?.uri || 'no-image'}</RNText>
  </View>
);

Card.Title = props => (
  <View testID={props.testID}>
    <RNText testID={props.testID + '::TitleText'} numberOfLines={props.titleNumberOfLines}>
      {props.title}
    </RNText>
    <RNText testID={props.testID + '::TitleVariant'}>{props.titleVariant}</RNText>
  </View>
);

export const Divider: React.FC<any> = props => (
  <View testID={props.testID || 'divider'} {...props} />
);

export const Checkbox: React.FC<any> = props => (
  <TouchableOpacity testID={props.testID} onPress={props.onPress}>
    <RNText testID={props.testID + '::Status'}>{props.status}</RNText>
  </TouchableOpacity>
);

export const IconButton: React.FC<any> = props => (
  <TouchableOpacity testID={props.testID} onPress={props.onPress} style={props.style}>
    <RNText testID={props.testID + '::Icon'}>{props.icon}</RNText>
  </TouchableOpacity>
);

export const Searchbar: React.FC<any> = props => (
  <View testID={props.testID} style={props.style}>
    <RNText testID={props.testID + '::Mode'}>{props.mode}</RNText>
    <RNTextInput
      testID={props.testID + '::TextInput'}
      placeholder={props.placeholder}
      onChangeText={props.onChangeText}
      value={props.value}
      onFocus={props.onFocus}
      onSubmitEditing={props.onSubmitEditing}
    />
    <RNText testID={props.testID + '::Placeholder'}>{props.placeholder}</RNText>
    <View testID={props.testID + '::RightContainer'}>
      {props.right && props.right({ testID: props.testID + '::Right' })}
    </View>
  </View>
);

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
    tertiary: '#7c5800',
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
    outline: '#79767d',
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

export const Switch: React.FC<any> = props => (
  <TouchableOpacity
    testID={props.testID}
    onPress={() => props.onValueChange && props.onValueChange(!props.value)}
    {...{ value: props.value, onValueChange: props.onValueChange }}
  >
    <RNText testID={props.testID + '::Value'}>{props.value ? 'ON' : 'OFF'}</RNText>
  </TouchableOpacity>
);

export const SegmentedButtons: React.FC<any> = props => (
  <View testID={props.testID} style={props.style}>
    {props.buttons?.map((button: any, index: number) => (
      <TouchableOpacity
        key={button.value || index}
        testID={props.testID + '::Button::' + (button.value || index)}
        onPress={() => props.onValueChange && props.onValueChange(button.value)}
        {...{ value: props.value, onValueChange: props.onValueChange }}
      >
        <RNText testID={props.testID + '::Button::' + (button.value || index) + '::Label'}>
          {button.label}
        </RNText>
      </TouchableOpacity>
    ))}
  </View>
);

export const List = {
  Section: (props: any) => (
    <View testID='list-section' {...props}>
      <RNText testID='list-section-title'>{props.title}</RNText>
      <View testID='list-section-content'>{props.children}</View>
    </View>
  ),
  Subheader: (props: any) => <RNText testID={props.testID}>{props.children}</RNText>,
  Item: (props: any) => (
    <TouchableOpacity testID={props.testID} onPress={props.onPress} style={props.style}>
      {props.left && (
        <View testID={props.testID + '::Left'}>
          {typeof props.left === 'function' ? props.left() : props.left}
        </View>
      )}
      <View testID={props.testID + '::Content'}>
        <RNText testID={props.testID + '::Title'} numberOfLines={props.titleNumberOfLines}>
          {props.title}
        </RNText>
        {props.description && (
          <RNText testID={props.testID + '::Description'}>{props.description}</RNText>
        )}
      </View>
      {props.right && (
        <View testID={props.testID + '::Right'}>
          {typeof props.right === 'function' ? props.right() : props.right}
        </View>
      )}
    </TouchableOpacity>
  ),
  Icon: (props: any) => <RNText testID='list-icon'>{props.icon}</RNText>,
  Accordion: (props: any) => (
    <View testID={props.testID} style={props.style}>
      <TouchableOpacity testID={props.testID + '::Header'} onPress={() => {}}>
        <RNText testID={props.testID + '::Title'}>{props.title}</RNText>
      </TouchableOpacity>
      <View testID={props.testID + '::Content'}>{props.children}</View>
    </View>
  ),
  AccordionGroup: (props: any) => <View testID={props.testID}>{props.children}</View>,
};

export const ActivityIndicator: React.FC<any> = props => (
  <View testID={props.testID}>
    <RNText testID={props.testID + '::Size'}>{props.size}</RNText>
  </View>
);

export const ProgressBar: React.FC<any> = props => (
  <View
    testID={props.testID}
    style={props.style}
    {...{ progress: props.progress, color: props.color }}
  >
    <RNText testID={props.testID + '::Progress'}>{props.progress}</RNText>
  </View>
);

export const DataTable: React.FC<any> & {
  Header: React.FC<any>;
  Title: React.FC<any>;
  Row: React.FC<any>;
  Cell: React.FC<any>;
} = props => (
  <View testID={props.testID} style={props.style}>
    {props.children}
  </View>
);

DataTable.Header = props => (
  <View testID={props.testID} style={props.style}>
    {props.children}
  </View>
);

DataTable.Title = props => (
  <View testID={props.testID} style={props.style}>
    <RNText testID={props.testID + '::Text'} style={props.textStyle}>
      {props.children}
    </RNText>
  </View>
);

DataTable.Row = props => (
  <View testID={props.testID} style={props.style}>
    {props.children}
  </View>
);

DataTable.Cell = props => (
  <View testID={props.testID} style={props.style}>
    {props.children}
  </View>
);
