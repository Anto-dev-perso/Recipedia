/**
 * TODO fill this part
 * @format
*/

import { Alert } from "react-native";

const AsyncAlert = async (title: string, msg: string, ok : string, neutral: string, cancel: string, initialValue: string) : Promise<string> => {

    
    return new Promise(async (resolve, reject) => {
        Alert.alert(title, msg, [
            {
                text: cancel,
                onPress: () => {
                    console.warn("Cancel pressed");
                    reject(Error("Canceled by user"));
                }
                
            },
            {text: neutral, onPress: async () => {
                // Let user edit the message
                resolve("Something");
            }},
            {text: ok, onPress: async () => resolve(initialValue)}
        ]);

    })
}

export { AsyncAlert };