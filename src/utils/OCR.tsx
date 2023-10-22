/**
 * TODO fill this part
 * @format
*/

import * as FileSystem from 'expo-file-system';

//  Inspired by https://ninza7.medium.com/lets-integrate-google-cloud-vision-api-to-react-native-expo-apps-2b09ff29c88b

const apiResponse = {responses: [{
    fullTextAnnotation: 
    // {"pages": [{"blocks": [Array], "confidence": 0.8202112, "height": 3468, "property": [Object], "width": 4624}], "text": "IS\n1 Uh\n9\n<\nà\n) 1\n||\n1. LE RIZ\nPortez à ébullition une casserole d'eau salée.\nFaites cuire le riz selon les indications du paquet.\nPendant ce temps, préparez les filets de poulet à la sauce satay.\n}\n2. LA SAUCE SATAY\nDans le bol d'un mixeur, déposez les ingrédients suivants :\nÉpluchez et hachez le gingembre.\nAjoutez les cacahuètes, le sucre et le lait de coco.\nSalez, poivrez. Mixez jusqu'à obtenir une texture homogène.\n3. LA CUISSON DU POULET\nCoupez les filets de poulet en lanières.\nÉmincez l'oignon.\nPressez ou hachez l'ail.\nDans une poêle, faites chauffer un filet d'huile de cuisson à feu moyen à vif.\nFaites revenir l'oignon et l'ail 5 min.\nAu bout des 5 min, ajoutez le poulet et faites-le revenir 5 min environ.\nSalez légèrement, poivrez.\nQUITOQUE\nAjoutez la sauce satay dans la sauteuse et poursuivez la cuisson 2 min\nen remuant régulièrement. Goûtez et rectifiez l'assaisonnement si nécessaire.\nEn parallèle, ciselez la coriandre (en entier, les tiges se consomment).\nCoupez le citron en quartiers.\nDégustez sans attendre vos aiguillettes de poulet sauce satay accompagnées\ndu riz! Parsemez le tout de coriandre et arrosez d'un filet de jus de citron!\n[RI18]"}
    // {"pages": [{"blocks": [Array], "height": 3616, "property": [Object], "width": 3113}], "text": "1. LE RIZ\nPortez à ébullition une casserole d'eau salée.\nFaites cuire le riz selon les indications du paquet.\nPendant ce temps, préparez les filets de poulet à la sauce satay.\n2. LA SAUCE SATAY\nDans le bol d'un mixeur, déposez les ingrédients suivants :\nÉpluchez et hachez le gingembre.\nAjoutez les cacahuètes, le sucre et le lait de coco.\nSalez, poivrez. Mixez jusqu'à obtenir une texture homogène.\n3. LA CUISSON DU POULET\nCoupez les filets de poulet en lanières.\nÉmincez l'oignon.\nPressez ou hachez l'ail.\nDans une poêle, faites chauffer un filet d'huile de cuisson à feu moyen à vif.\nFaites revenir l'oignon et l'ail 5 min.\nAu bout des 5 min, ajoutez le poulet et faites-le revenir 5 min environ.\nSalez légèrement, poivrez.\nAjoutez la sauce satay dans la sauteuse et poursuivez la cuisson 2 min\nen remuant régulièrement. Goûtez et rectifiez l'assaisonnement si nécessaire.\nEn parallèle, ciselez la coriandre (en entier, les tiges se consomment).\nCoupez le citron en quartiers.\nDégustez sans attendre vos aiguillettes de poulet sauce satay accompagnées\ndu riz! Parsemez le tout de coriandre et arrosez d'un filet de jus de citron!"}
    // {"pages": [{"blocks": [Array], "height": 4329, "property": [Object], "width": 2628}], "text": "INGRÉDIENTS\nDANS VOTRE PLACARD: SEL, POIVRE, HUILE DE CUISSON, SUCRE\nfilet de poulet\ncacahuètes grillées (g)\ncitron vert *\ncoriandre\ngingembre (cm) @\ngousse d'ail\nlait de coco (mL)\noignon jaune\nriz basmati (g) bio\nsucre (cc)\n2p\n2\n25\n0.5\nqq brins qq brins\n1 à 3\n1 à 3\n0.5\n0.5\n100\n100\n1\n1\n150\n225\n0.5\n0.5\n3p 4p\n3\n4\n25\n50\n0.5\n1\nLES ÉTAPES TECHNIQUES\nUSTENSILES\nCASSEROLE (X1), PASSOIRE (X1), POÊLE (X1), MIXEUR (X1)\nScannez ce QR code\nCOMMENT CISELER DE LA CORIANDRE?\n5p\n5\n50\n1\nqq brins qq brins qq brins\n1 à 3\n1 à 3\n1\n200\n1 à 3\n1\n1\n200\n200\n2\n2\n3\n300\n375\n450\n1\n1\n1\nбр\n6\n50\n1\n1. LE RIZ\nPortez à ébullition une casserole d'eau salée.\nFaites cuire le riz selon les indications du paquet.\nPendant ce temps, préparez les filets de poulet à la sauce satay.\n2. LA SAUCE SATAY\nDans le bol d'un mixeur, déposez les ingrédients suivants :\nÉpluchez et hachez le gingembre.\nAjoutez les cacahuètes, le sucre et le lait de coco.\nSalez, poivrez. Mixez jusqu'à obtenir une texture homogène.\n3. LA CUISSON DU POULET\nCoupez les filets de poulet en lanières.\nÉmincez l'oignon.\nPressez ou hachez l'ail.\nDans une poêle, faites chauffer un filet d'huile de cuisson à feu moyen à vif.\nFaites revenir l'oignon et l'ail 5 min.\nAu bout des 5 min, ajoutez le poulet et faites-le revenir 5 min environ.\nSalez légèrement, poivrez.\nAjoutez la sauce satay dans la sauteuse et poursuivez la cuisson 2 min\nen remuant régulièrement. Goûtez et rectifiez l'assaisonnement si nécessaire.\nEn parallèle, ciselez la coriandre (en entier, les tiges se consomment).\nCoupez le citron en quartiers.\nDégustez sans attendre vos aiguillettes de poulet sauce satay accompagnées\ndu riz ! Parsemez le tout de coriandre et arrosez d'un filet de jus de citron!"}
    // {"pages": [{"blocks": [Array], "height": 1432, "property": [Object], "width": 3168}], "text": "filet de poulet\ncacahuètes grillées (g)\ncitron vert *\ncoriandre Ⓡ\ngingembre (cm) *\ngousse d'ail\nlait de coco (mL)\noignon jaune\nriz basmati (g) bio\nsucre (cc)\n2p\n2\n25\n0.5\nqq brins\n1 à 3\n0.5\n100\n1\n150\n0.5\n3p\n3\n25\n0.5\n4p\n4\n50\n1\n5p\n5\n50\n1\nqq brins qq brins qq brins\n1 à 3\n1 à 3\n1 à 3\n0.5\n1\n1\n100\n200\n200\n1\n2\n2\n225\n300\n375\n0.5\n1\n1\n6p\n6\n50\n1\nqq brins\n1 à 3\n1\n200\n3\n450\n1"}
    // {"pages": [{"blocks": [Array], "height": 2557, "property": [Object], "width": 1791}], "text": "AIGUILLETTE DE\nPOULET À LA\nSAUCE SATAY\nCuisinez nos filets de poulet français avec\ndu riz basmati bio et une sauce satay maison:\nun condiment asiatique à base de\ncacahuètes et gingembre !\n\"Ö\n2 pers. ► 25 min\n3 pers. 30 min\n4 pers. ► 35 min\n5 pers. ► 40 min\n6 pers. ► 45 min\n10\n576 kcal\npar pers. environ"}
    
    // HelloFresh
    // {"pages": [{"blocks": [Array], "height": 2969, "property": [Object], "width": 491}], "text": "Aiguillettes de poulet façon teriyaki\navec des légumes poêlés & du riz basmati"}
    // {"pages": [{"blocks": [Array], "height": 1644, "property": [Object], "width": 2712}], "text": "Ingrédients pour 2 personnes\nRiz basmati\nOignon jaune\nCarotte*\nPoireau*\nCiboulette*\nGousse d'ail\nGingembre frais*\nSauce soja 11) 13) 15)\nHuile de sésame 3)\nFilet de poulet*\nGomasio 3)\n140 g\n1 pièce\n1 pièce\n1 pièce\n3 g\n1 pièce\n2 cm\n40 ml\n10 ml\n2 pièce\n2 cc"}
    // {"pages": [{"blocks": [Array], "height": 2796, "property": [Object], "width": 2942}], "text": "●\n1\nCuire le riz\nVeillez à bien respecter les quantités indiquées à gauche pour\npréparer votre recette !\n0\nPortez une casserole d'eau salée à ébullition et faites-y cuire le riz\n12-14 min.\nÉgouttez-le et réservez-le à couvert.\n3\nFaire la sauce\nPendant ce temps, ciselez la ciboulette et l'ail séparément.\nRâpez le gingembre (si vous le souhaitez avec la peau).\nDans un bol, mélangez l'ail et le gingembre avec la sauce soja\n(voir CONSEIL), l'huile de sésame et, par personne : 1 cs de sucre et\n30 ml d'eau.\nCoupez le poulet en 3 aiguillettes.\nCuire les légumes\nPendant ce temps, coupez l'oignon en fines demi-lunes. Épluchez\net râpez la carotte. Coupez le poireau en quatre dans l'épaisseur,\nlavez-le bien, puis ciselez-le finement.\n●\n.\n2\nCONSEIL: Vous pouvez faire cuire les légumes plus longtemps si vous\nles préférez fondants.\n●\nFaites chauffer un filet d'huile d'olive à feu moyen-vif dans un wok\nou une sauteuse. Faites-y revenir les légumes 4-6 min à couvert.\nRemuez régulièrement.\nFinir et servir\nFaites chauffer un filet d'huile d'olive dans une poêle à feu moyen-\nvif et faites-y cuire le poulet 2-4 min.\n●\n4\nAjoutez la sauce et laissez-la réduire 1-2 min à feu vif, ou jusqu'à ce\nqu'elle soit légèrement nappante (ajoutez un peu d'eau si besoin).\nServez le riz dans des assiettes creuses et disposez les légumes et le\npoulet par-dessus avec la sauce.\nSaupoudrez de ciboulette et de gomasio."}
}]}


export default async function recognizeText(imageUri: string) {
    // console.log("Detect from : ", imageUri);
    
    try{
        // const result = await MLKit.detectFromUri(uri);
        
        // const result2 = await MLKit.detectFromFile(uri);
        // console.log("\n\nResult of OCR : ", result2, "\n\n");
        
        // const result = await TextRecognition.recognize('/var/mobile/...');
        // const result = await TextRecognition.recognize(uri);
        // console.log("\n\nResult of OCR : ", result, "\n\n");


        // Replace 'YOUR_GOOGLE_CLOUD_VISION_API_KEY' with your actual API key
        const apiKey = 'AIzaSyB6nNnOZulVpHOd6ExfHG7RGMEim0O8Iio';
        const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

        // Read the umage file from local URI and convert it to base64
        const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {encoding: FileSystem.EncodingType.Base64});
        // const base64ImageData = imageUri;


        const requestData = {
            requests: [
              {
                image: {
                  content: base64ImageData,
                },
                features: [{ type: 'TEXT_DETECTION'}],
              },
            ],
          };

        // const response = await fetch(apiUrl, {method: 'POST', body: JSON.stringify(requestData)});

        // const apiResponse = await response.json();

        const testString = apiResponse.responses[0].fullTextAnnotation;

        console.log("Response from API : ", testString);
    }catch(error: any){
        console.warn("ERROR on OCR : ", error);
        
    }

}