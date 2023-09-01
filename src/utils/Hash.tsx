/**
 * TODO fill this part
 * @format
*/

import * as Crypto from 'expo-crypto';
import CryptoES from 'crypto-es';
import Aes from 'react-native-aes-crypto'

async function hashString() {
    const encodeStr = "Test, toto"
    // const digest1 = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, "Test");
    // const digest2 = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, "Easy to Digest!");
    // console.log("Hash result for Test : ", digest1, "\nHash result for Easy to Digest! : ", digest2);


    // const hashed = await CryptoES.AES.encrypt("TEST", "toto")
    // console.log("Result of encrypt : ", hashed);
    // const initialStr = CryptoES.AES.decrypt(hashed, "toto")
    // console.log("Result of decrypt : ", initialStr);

    // const key = "toto"
    // const str = await Aes.encrypt("Test", key, "10", 'aes-128-cbc')

    // console.log("AES crypto give : ", str);

    let num = ""
    for (let i = 0; i < encodeStr.length; i++) {
        num += encodeStr.charCodeAt(i);
        console.log("Adding : ", encodeStr.charCodeAt(i));
        
    }
    console.log("At the end of the day, num = ", num);
    

}

export { hashString }