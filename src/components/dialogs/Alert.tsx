import React from 'react';
import {Button, Dialog, Portal, Text} from 'react-native-paper';
import {StyleProp, View, ViewStyle} from "react-native";


export type AlertProps =
    {
        testId: string,
        isVisible: boolean,
        title: string,
        content: string,
        confirmText: string,
        cancelText?: string,
        onClose: () => void,
        onConfirm?: () => void,
    };

export default function Alert({
                                  testId,
                                  isVisible,
                                  title,
                                  content,
                                  confirmText,
                                  cancelText,
                                  onClose,
                                  onConfirm
                              }: AlertProps) {

    const handleDismiss = () => {
        onClose();
    };

    const handleConfirm = () => {
        handleDismiss();
        onConfirm?.();
    };

    const dialogTestId = testId + "::Dialog";

    // Let style by default if cancel not there. Otherwise, put cancel on the left and confirm on the right
    const actionStyle: StyleProp<ViewStyle> = cancelText ? {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    } : {};

    return (
        <Portal>
            <Dialog visible={isVisible} onDismiss={handleDismiss}>
                <Dialog.Title testID={dialogTestId + "::Title"}>{title}</Dialog.Title>
                <Dialog.Content>
                    <Text testID={dialogTestId + "::Content"} variant={"bodyMedium"}>{content}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <View style={actionStyle}>
                        {cancelText &&
                            <Button testID={dialogTestId + "::Cancel"} mode={"outlined"}
                                    onPress={handleDismiss}>{cancelText}</Button>}
                        <Button testID={dialogTestId + "::Confirm"} mode={"contained"}
                                onPress={handleConfirm}>{confirmText}</Button>
                    </View>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}
