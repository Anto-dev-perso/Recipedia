import {Alert, AlertButton} from "react-native";
import {typoStyles} from '@styles/typography';

export enum alertUserChoice {
    cancel,
    ok,
    neutral
}

// TODO to rework and then to test
export function AsyncAlert(title: string, msg: string, ok?: string, cancel?: string, neutral?: string): Promise<alertUserChoice> {
    return new Promise((resolve) => {

        const buttons = new Array<AlertButton>();

        if (cancel) {
            buttons.push({
                text: cancel, onPress: () => {
                    resolve(alertUserChoice.cancel);
                }, style: typoStyles.paragraph
            })
        }

        if (neutral) {
            buttons.push({
                text: neutral, onPress: () => {
                    // Let user edit the message
                    resolve(alertUserChoice.neutral);
                }, style: typoStyles.paragraph
            })
        }

        if (ok) {
            buttons.push({
                text: ok, onPress: async () => {
                    resolve(alertUserChoice.ok)
                }, style: typoStyles.paragraph
            })
        }
        Alert.alert(title, msg, buttons, {cancelable: true});
    })
}
