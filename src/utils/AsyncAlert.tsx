/**
 * TODO fill this part
 * @format
*/

import { Alert, AlertButton } from "react-native";
import { typoStyles } from '@styles/typography';

const AsyncAlert = async (title: string, msg: string, ok?: string, cancel?: string,neutral?: string,  initialValue?: string) : Promise<string> => {

    return new Promise(async (resolve, reject) => {
        
        let buttons = new Array<AlertButton>();

        let valueToEdit: string = "";

        if(initialValue){
            valueToEdit = initialValue;
        }

        if(cancel){
            buttons.push({text: cancel, onPress: () => {
                console.warn("Cancel pressed");
                reject(Error("Canceled by user"));
            }, style: typoStyles.paragraph})
        }

        if(neutral){
            buttons.push({text: neutral, onPress:  () => {
                // Let user edit the message
                resolve(valueToEdit + " edited");
            }, style: typoStyles.paragraph})
        }

        if(ok){
            buttons.push({text: ok, onPress: async () => resolve(valueToEdit), style: typoStyles.paragraph})
        }


        Alert.alert(title, msg, buttons, {cancelable: true});

    })
}

export { AsyncAlert };