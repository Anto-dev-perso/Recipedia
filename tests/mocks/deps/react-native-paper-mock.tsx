import React from 'react';

export const reactNativePaperMock = {
    // @ts-ignore input type missing some attributes but nevermind for the mock
    TextInput: (props: React.ComponentProps<typeof import('react-native-paper').TextInput>) => <input {...props}/>,
    List: {
        Item: (props: { title: string }) => <div {...props}>{props.title}</div>
    }
};
