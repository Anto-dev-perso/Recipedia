/**
 * TODO fill this part
 * @format
*/

// import TextRecognition from '@react-native-ml-kit/text-recognition'
// import MLKit from "react-native-mlkit-ocr";
// import TextRecognition from 'react-native-text-recognition';
// import TextRecognition from '@react-native-ml-kit/text-recognition';


export default async function recognizeText(uri: string) {
    console.log("Detect from : ", uri);
    
    try{
        // const result = await MLKit.detectFromUri(uri);
        
        // const result2 = await MLKit.detectFromFile(uri);
        // console.log("\n\nResult of OCR : ", result2, "\n\n");
        
        // const result = await TextRecognition.recognize('/var/mobile/...');
        // const result = await TextRecognition.recognize(uri);
        // console.log("\n\nResult of OCR : ", result, "\n\n");

    }catch(error: any){
        console.warn("ERROR on OCR : ", error);
        
    }

}