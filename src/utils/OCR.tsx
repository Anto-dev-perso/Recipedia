/**
 * TODO fill this part
 * @format
*/

import { recipeColumnsNames } from '@customTypes/DatabaseElementTypes';
import { numberAtFirstIndex as numberAtFirstIndex, findAllNumbers, replaceAllBackToLine, textSeparator, letterRegExp, exceptLettersRegExp, exceptLettersAndSpacesRegExp, extractBetweenParenthesis, unitySeparator} from '@styles/typography';
import * as FileSystem from 'expo-file-system';

//  Inspired by https://ninza7.medium.com/lets-integrate-google-cloud-vision-api-to-react-native-expo-apps-2b09ff29c88b

const apiResponse = {responses: [{
    fullTextAnnotation: 
    // Quitoque

    // Preparation
    // {"pages": [{"blocks": [Array], "confidence": 0.8202112, "height": 3468, "property": [Object], "width": 4624}], "text": "IS\n1 Uh\n9\n<\nà\n) 1\n||\n1. LE RIZ\nPortez à ébullition une casserole d'eau salée.\nFaites cuire le riz selon les indications du paquet.\nPendant ce temps, préparez les filets de poulet à la sauce satay.\n}\n2. LA SAUCE SATAY\nDans le bol d'un mixeur, déposez les ingrédients suivants :\nÉpluchez et hachez le gingembre.\nAjoutez les cacahuètes, le sucre et le lait de coco.\nSalez, poivrez. Mixez jusqu'à obtenir une texture homogène.\n3. LA CUISSON DU POULET\nCoupez les filets de poulet en lanières.\nÉmincez l'oignon.\nPressez ou hachez l'ail.\nDans une poêle, faites chauffer un filet d'huile de cuisson à feu moyen à vif.\nFaites revenir l'oignon et l'ail 5 min.\nAu bout des 5 min, ajoutez le poulet et faites-le revenir 5 min environ.\nSalez légèrement, poivrez.\nQUITOQUE\nAjoutez la sauce satay dans la sauteuse et poursuivez la cuisson 2 min\nen remuant régulièrement. Goûtez et rectifiez l'assaisonnement si nécessaire.\nEn parallèle, ciselez la coriandre (en entier, les tiges se consomment).\nCoupez le citron en quartiers.\nDégustez sans attendre vos aiguillettes de poulet sauce satay accompagnées\ndu riz! Parsemez le tout de coriandre et arrosez d'un filet de jus de citron!\n[RI18]"}
    // {"pages": [{"blocks": [Array], "height": 3616, "property": [Object], "width": 3113}], "text": "1. LE RIZ\nPortez à ébullition une casserole d'eau salée.\nFaites cuire le riz selon les indications du paquet.\nPendant ce temps, préparez les filets de poulet à la sauce satay.\n2. LA SAUCE SATAY\nDans le bol d'un mixeur, déposez les ingrédients suivants :\nÉpluchez et hachez le gingembre.\nAjoutez les cacahuètes, le sucre et le lait de coco.\nSalez, poivrez. Mixez jusqu'à obtenir une texture homogène.\n3. LA CUISSON DU POULET\nCoupez les filets de poulet en lanières.\nÉmincez l'oignon.\nPressez ou hachez l'ail.\nDans une poêle, faites chauffer un filet d'huile de cuisson à feu moyen à vif.\nFaites revenir l'oignon et l'ail 5 min.\nAu bout des 5 min, ajoutez le poulet et faites-le revenir 5 min environ.\nSalez légèrement, poivrez.\nAjoutez la sauce satay dans la sauteuse et poursuivez la cuisson 2 min\nen remuant régulièrement. Goûtez et rectifiez l'assaisonnement si nécessaire.\nEn parallèle, ciselez la coriandre (en entier, les tiges se consomment).\nCoupez le citron en quartiers.\nDégustez sans attendre vos aiguillettes de poulet sauce satay accompagnées\ndu riz! Parsemez le tout de coriandre et arrosez d'un filet de jus de citron!"}

    // Ingredient
    // {"pages": [{"blocks": [Array], "height": 4329, "property": [Object], "width": 2628}], "text": "INGRÉDIENTS\nDANS VOTRE PLACARD: SEL, POIVRE, HUILE DE CUISSON, SUCRE\nfilet de poulet\ncacahuètes grillées (g)\ncitron vert *\ncoriandre\ngingembre (cm) @\ngousse d'ail\nlait de coco (mL)\noignon jaune\nriz basmati (g) bio\nsucre (cc)\n2p\n2\n25\n0.5\nqq brins qq brins\n1 à 3\n1 à 3\n0.5\n0.5\n100\n100\n1\n1\n150\n225\n0.5\n0.5\n3p 4p\n3\n4\n25\n50\n0.5\n1\nLES ÉTAPES TECHNIQUES\nUSTENSILES\nCASSEROLE (X1), PASSOIRE (X1), POÊLE (X1), MIXEUR (X1)\nScannez ce QR code\nCOMMENT CISELER DE LA CORIANDRE?\n5p\n5\n50\n1\nqq brins qq brins qq brins\n1 à 3\n1 à 3\n1\n200\n1 à 3\n1\n1\n200\n200\n2\n2\n3\n300\n375\n450\n1\n1\n1\nбр\n6\n50\n1\n1. LE RIZ\nPortez à ébullition une casserole d'eau salée.\nFaites cuire le riz selon les indications du paquet.\nPendant ce temps, préparez les filets de poulet à la sauce satay.\n2. LA SAUCE SATAY\nDans le bol d'un mixeur, déposez les ingrédients suivants :\nÉpluchez et hachez le gingembre.\nAjoutez les cacahuètes, le sucre et le lait de coco.\nSalez, poivrez. Mixez jusqu'à obtenir une texture homogène.\n3. LA CUISSON DU POULET\nCoupez les filets de poulet en lanières.\nÉmincez l'oignon.\nPressez ou hachez l'ail.\nDans une poêle, faites chauffer un filet d'huile de cuisson à feu moyen à vif.\nFaites revenir l'oignon et l'ail 5 min.\nAu bout des 5 min, ajoutez le poulet et faites-le revenir 5 min environ.\nSalez légèrement, poivrez.\nAjoutez la sauce satay dans la sauteuse et poursuivez la cuisson 2 min\nen remuant régulièrement. Goûtez et rectifiez l'assaisonnement si nécessaire.\nEn parallèle, ciselez la coriandre (en entier, les tiges se consomment).\nCoupez le citron en quartiers.\nDégustez sans attendre vos aiguillettes de poulet sauce satay accompagnées\ndu riz ! Parsemez le tout de coriandre et arrosez d'un filet de jus de citron!"}
    // {"pages": [{"blocks": [Array], "height": 1432, "property": [Object], "width": 3168}], "text": "filet de poulet\ncacahuètes grillées (g)\ncitron vert *\ncoriandre Ⓡ\ngingembre (cm) *\ngousse d'ail\nlait de coco (mL)\noignon jaune\nriz basmati (g) bio\nsucre (cc)\n2p\n2\n25\n0.5\nqq brins\n1 à 3\n0.5\n100\n1\n150\n0.5\n3p\n3\n25\n0.5\n4p\n4\n50\n1\n5p\n5\n50\n1\nqq brins qq brins qq brins\n1 à 3\n1 à 3\n1 à 3\n0.5\n1\n1\n100\n200\n200\n1\n2\n2\n225\n300\n375\n0.5\n1\n1\n6p\n6\n50\n1\nqq brins\n1 à 3\n1\n200\n3\n450\n1"}

    // Title and description 
    {"pages": [{"blocks": [Array], "height": 2557, "property": [Object], "width": 1791}], "text": "AIGUILLETTE DE\nPOULET À LA\nSAUCE SATAY\nCuisinez nos filets de poulet français avec\ndu riz basmati bio et une sauce satay maison:\nun condiment asiatique à base de\ncacahuètes et gingembre !\n\"Ö\n2 pers. ► 25 min\n3 pers. 30 min\n4 pers. ► 35 min\n5 pers. ► 40 min\n6 pers. ► 45 min\n10\n576 kcal\npar pers. environ"}
    

    // HelloFresh

    // Title
    // {"pages": [{"blocks": [Array], "height": 2969, "property": [Object], "width": 491}], "text": "Aiguillettes de poulet façon teriyaki\navec des légumes poêlés & du riz basmati"}

    // Ingredients
    // {"pages": [{"blocks": [Array], "height": 1644, "property": [Object], "width": 2712}], "text": "Ingrédients pour 2 personnes\nRiz basmati\nOignon jaune\nCarotte*\nPoireau*\nCiboulette*\nGousse d'ail\nGingembre frais*\nSauce soja 11) 13) 15)\nHuile de sésame 3)\nFilet de poulet*\nGomasio 3)\n140 g\n1 pièce\n1 pièce\n1 pièce\n3 g\n1 pièce\n2 cm\n40 ml\n10 ml\n2 pièce\n2 cc"}

    // Preparation
    // {"pages": [{"blocks": [Array], "height": 2796, "property": [Object], "width": 2942}], "text": "●\n1\nCuire le riz\nVeillez à bien respecter les quantités indiquées à gauche pour\npréparer votre recette !\n0\nPortez une casserole d'eau salée à ébullition et faites-y cuire le riz\n12-14 min.\nÉgouttez-le et réservez-le à couvert.\n3\nFaire la sauce\nPendant ce temps, ciselez la ciboulette et l'ail séparément.\nRâpez le gingembre (si vous le souhaitez avec la peau).\nDans un bol, mélangez l'ail et le gingembre avec la sauce soja\n(voir CONSEIL), l'huile de sésame et, par personne : 1 cs de sucre et\n30 ml d'eau.\nCoupez le poulet en 3 aiguillettes.\nCuire les légumes\nPendant ce temps, coupez l'oignon en fines demi-lunes. Épluchez\net râpez la carotte. Coupez le poireau en quatre dans l'épaisseur,\nlavez-le bien, puis ciselez-le finement.\n●\n.\n2\nCONSEIL: Vous pouvez faire cuire les légumes plus longtemps si vous\nles préférez fondants.\n●\nFaites chauffer un filet d'huile d'olive à feu moyen-vif dans un wok\nou une sauteuse. Faites-y revenir les légumes 4-6 min à couvert.\nRemuez régulièrement.\nFinir et servir\nFaites chauffer un filet d'huile d'olive dans une poêle à feu moyen-\nvif et faites-y cuire le poulet 2-4 min.\n●\n4\nAjoutez la sauce et laissez-la réduire 1-2 min à feu vif, ou jusqu'à ce\nqu'elle soit légèrement nappante (ajoutez un peu d'eau si besoin).\nServez le riz dans des assiettes creuses et disposez les légumes et le\npoulet par-dessus avec la sauce.\nSaupoudrez de ciboulette et de gomasio."}
}]}

export async function recognizeText<T extends number | string | Array<string>>(imageUri: string, fieldName: recipeColumnsNames): Promise<T> {
  return new Promise( async (resolve, reject) => {
    try {
      const ocrText = await requestOCR(imageUri);

      let textToReturn;
      switch (fieldName) {
        case recipeColumnsNames.persons:
        case recipeColumnsNames.time:
            textToReturn = tranformOCRInOneNumber(ocrText); 
            // console.log("OCR text transfrom to => type ", typeof textToReturn," value = ", textToReturn as T);
            resolve(textToReturn as T);
            break;

        case recipeColumnsNames.title:
        case recipeColumnsNames.description:
          textToReturn = tranformOCRInOneString(ocrText); 
          // console.log("OCR text transfrom to => type ", typeof textToReturn," value = ", textToReturn as T);
          resolve(textToReturn as T);
          break;

        case recipeColumnsNames.preparation:
          textToReturn = tranformOCRInPreparation(ocrText);
          console.log("OCR text transfrom to => type ", typeof textToReturn," value = ", textToReturn as T);
          resolve(textToReturn as T);
          break;
        case recipeColumnsNames.ingredients:
          textToReturn = tranformOCRInIngredients(ocrText);
          console.log("OCR text transfrom to => type ", typeof textToReturn," value = ", textToReturn as T);
          resolve(textToReturn as T);
          break;
          
        case recipeColumnsNames.tags:
          break;
        case recipeColumnsNames.image:
          throw new Error("Image filed shouldn't go through OCR");
        default:
          throw new Error("Unrecognized type");
      }
    } catch (error) {
      reject(`Error in recognizeText : ${error}`)
    }
  })
}

export async function requestOCR(imageUri: string): Promise<string> {
    return new Promise( async (resolve, reject) => {

      try{
        // Replace 'YOUR_GOOGLE_CLOUD_VISION_API_KEY' with your actual API key
        const apiKey = 'AIzaSyB6nNnOZulVpHOd6ExfHG7RGMEim0O8Iio';
        const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
        
        // Read the umage file from local URI and convert it to base64
        const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {encoding: FileSystem.EncodingType.Base64});
        
        const requestData = { requests: [{image: {content: base64ImageData}, features: [{ type: 'TEXT_DETECTION'}]}]};
        
        // const response = await fetch(apiUrl, {method: 'POST', body: JSON.stringify(requestData)});
        // const apiResponse = await response.json();
        // const testString = apiResponse.responses[0].fullTextAnnotation;

        // const testString = "AIGUILLETTE DE\nPOULET À LA\nSAUCE SATAY"
        // const testString = "Cuisinez nos filets de poulet français avec\ndu riz basmati bio et une sauce satay maison:\nun condiment asiatique à base de\ncacahuètes et gingembre !"
        const testString = "12 pers."
        // const testString = "20 min"
        // const testString = "1. LE RIZ\nPortez à ébullition une casserole d'eau salée.\nFaites cuire le riz selon les indications du paquet.\nPendant ce temps, préparez les filets de poulet à la sauce satay.\n2. LA SAUCE SATAY\nDans le bol d'un mixeur, déposez les ingrédients suivants :\nÉpluchez et hachez le gingembre.\nAjoutez les cacahuètes, le sucre et le lait de coco.\nSalez, poivrez. Mixez jusqu'à obtenir une texture homogène.\n3. LA CUISSON DU POULET\nCoupez les filets de poulet en lanières.\nÉmincez l'oignon.\nPressez ou hachez l'ail.\nDans une poêle, faites chauffer un filet d'huile de cuisson à feu moyen à vif.\nFaites revenir l'oignon et l'ail 5 min.\nAu bout des 5 min, ajoutez le poulet et faites-le revenir 5 min environ.\nSalez légèrement, poivrez.\nAjoutez la sauce satay dans la sauteuse et poursuivez la cuisson 2 min\nen remuant régulièrement. Goûtez et rectifiez l'assaisonnement si nécessaire.\nEn parallèle, ciselez la coriandre (en entier, les tiges se consomment).\nCoupez le citron en quartiers.\nDégustez sans attendre vos aiguillettes de poulet sauce satay accompagnées\ndu riz! Parsemez le tout de coriandre et arrosez d'un filet de jus de citron!"
        // const testString = "●\n1\nCuire le riz\nVeillez à bien respecter les quantités indiquées à gauche pour\npréparer votre recette !\n0\nPortez une casserole d'eau salée à ébullition et faites-y cuire le riz\n12-14 min.\nÉgouttez-le et réservez-le à couvert.\n3\nFaire la sauce\nPendant ce temps, ciselez la ciboulette et l'ail séparément.\nRâpez le gingembre (si vous le souhaitez avec la peau).\nDans un bol, mélangez l'ail et le gingembre avec la sauce soja\n(voir CONSEIL), l'huile de sésame et, par personne : 1 cs de sucre et\n30 ml d'eau.\nCoupez le poulet en 3 aiguillettes.\n2\nCuire les légumes\nPendant ce temps, coupez l'oignon en fines demi-lunes. Épluchez\net râpez la carotte. Coupez le poireau en quatre dans l'épaisseur,\nlavez-le bien, puis ciselez-le finement.\n●\n.\n●\nFaites chauffer un filet d'huile d'olive à feu moyen-vif dans un wok\nou une sauteuse. Faites-y revenir les légumes 4-6 min à couvert.\nRemuez régulièrement.\nCONSEIL: Vous pouvez faire cuire les légumes plus longtemps si vous\nles préférez fondants.\n●\n4\nFinir et servir\nFaites chauffer un filet d'huile d'olive dans une poêle à feu moyen-\nvif et faites-y cuire le poulet 2-4 min.\nAjoutez la sauce et laissez-la réduire 1-2 min à feu vif, ou jusqu'à ce\nqu'elle soit légèrement nappante (ajoutez un peu d'eau si besoin).\nServez le riz dans des assiettes creuses et disposez les légumes et le\npoulet par-dessus avec la sauce.\nSaupoudrez de ciboulette et de gomasio."
        // const testString = "Ingrédients pour 2 personnes\nRiz basmati\nOignon jaune\nCarotte*\nPoireau*\nCiboulette*\nGousse d'ail\nGingembre frais*\nSauce soja 11) 13) 15)\nHuile de sésame 3)\nFilet de poulet*\nGomasio 3)\n140 g\n1 pièce\n1 pièce\n1 pièce\n3 g\n1 pièce\n2 cm\n40 ml\n10 ml\n2 pièce\n2 cc"
        // const testString = "filet de poulet\ncacahuètes grillées (g)\ncitron vert *\ncoriandre Ⓡ\ngingembre (cm) *\ngousse d'ail\nlait de coco (mL)\noignon jaune\nriz basmati (g) bio\nsucre (cc)\n2p\n2\n25\n0.5\nqq brins\n1 à 3\n0.5\n100\n1\n150\n0.5\n3p\n3\n25\n0.5\n4p\n4\n50\n1\n5p\n5\n50\n1\nqq brins qq brins qq brins\n1 à 3\n1 à 3\n1 à 3\n0.5\n1\n1\n100\n200\n200\n1\n2\n2\n225\n300\n375\n0.5\n1\n1\n6p\n6\n50\n1\nqq brins\n1 à 3\n1\n200\n3\n450\n1"
        
        
        
        console.log("Response from API : ", testString);
        // resolve(testString.text);
        resolve(testString);
      }catch(error: any){
       reject(`Error in requestOCR : ${error}`);
      }
      })

}

function tranformOCRInOneString(ocrText: string): string {

  // Replace all \n by spaces, convert in lower case except the first letter wich will be keep in upper case
  const result = ocrText.replace(replaceAllBackToLine, " ").toLowerCase().replace(/^(.)/, $1 => $1.toUpperCase());
  return result;
}

function tranformOCRInOneNumber(ocrText: string): number {

  const result = ocrText.match(findAllNumbers);
  if(result){
    // Always return the first found number (in case there are multiple numbers)
    return Number(result[0]);
  }else{
    throw new Error("No number in this string");
    
  }
}

function tranformOCRInPreparation(ocrText: string): Array<string> {

  const splitOcr = ocrText.split("\n");

  // Different conversion in case the step number is not at the same place as the step title
  // Let a little margin in case the OCR returns strange string
  if(splitOcr.filter(str => str.length <= 2).length > 3){
    return stepsSperatedFromNumbers(splitOcr);
  }else{
    return stepsWithNumbers(splitOcr);
  }
}

function tranformOCRInIngredients(ocrText: string): Array<string> {
  let result = new Array<string>();
  const splitOcr = ocrText.split("\n");
  let cpt = -1;
  let allNameFill = false;
  let passElement = true;

  console.log("splitOcr = ", splitOcr);
  

  splitOcr.forEach(element => {
    // First element of OCR can contain ingredient. We pass it
    if(!element.toLowerCase().includes("ingrédient") && !element.toLowerCase().includes("ingredient")){
      // No number at first index => ingredient name
      if(!allNameFill && !numberAtFirstIndex.test(element)){
        // Can be empty
        let searchRes = element.match(extractBetweenParenthesis);
        let unity: string;
        let ingClear: string;
        if(searchRes){
          unity = unitySeparator + searchRes[1];
          ingClear = element.replace(`(${searchRes[1]})`, "").replace(exceptLettersAndSpacesRegExp, '');
        }else{
          ingClear = element.replace(exceptLettersAndSpacesRegExp, '');
          unity = "";
        }
        result.push(unity + textSeparator + convertToLowerCaseExceptFirstLetter(ingClear));

      }else{
        // Ingredients names are always retrieve before quantity. Once we finish to fill all the names, we want to fill the quantity even if its don't contain numbers
        allNameFill = true;

        if(cpt == -1){
          cpt++
          if(passElement){
            return;
          }
        }

        if(result.length >= cpt + 1){
          // In case quantity is a string (ex: coriander is usually count in sprigs)
          if(!element.match(exceptLettersRegExp) && !result[cpt].search(unitySeparator)){
            result[cpt] = element + result[cpt];
          }else{
            let quantity = retrieveNumberInStr(element).toString();
            let unity = (result[cpt].search(unitySeparator) != -1 ) ? "" : (unitySeparator + deleteNumberInStr(element));

            console.log("QUantity = ", quantity);
            

            if(Number(quantity) == -1){
              quantity = element
              unity = unitySeparator
            }

            result[cpt] = quantity + unity + result[cpt];
          }
          cpt++;
        }
      }
    }else{
      passElement = false;
    }
  });

  return result;
}

function convertToLowerCaseExceptFirstLetter(str: string) {

  const firstLetterIndex = str.search(letterRegExp);
      
  return str.charAt(firstLetterIndex).toUpperCase() + str.slice(firstLetterIndex + 1).toLowerCase() ;
}

function retrieveNumberInStr(str: string) {
  let ret = -1;
  let workingStr = str;
  const firstLetterIndex = str.search(letterRegExp);
  if(firstLetterIndex != -1){
    workingStr = str.slice(0, firstLetterIndex)
  }

  const allNum = workingStr.match(findAllNumbers);
  
  if(allNum){
    if(workingStr.includes(".")){
      ret = Number(allNum[0] + "." + allNum[1])
    }else if(workingStr.includes(",")){
      ret = Number(allNum[0] + "," + allNum[1])
    }else{
      ret = Number(allNum[0])
    }
  }
  return ret;
} 

function deleteNumberInStr(str: string) {
  let ret = "";
  const firstLetterIndex = str.search(letterRegExp);
  if(firstLetterIndex != -1){
    ret = str.slice(firstLetterIndex)
  }

  return ret;
} 

function stepsWithNumbers(ocrTextSplitted: Array<string>): Array<string> {
  const result = new Array<string>()
  let cpt = 0;

  ocrTextSplitted.forEach(element => {
    if(numberAtFirstIndex.test(element)){
      cpt = retrieveNumberInStr(element) -1;
      result.push(convertToLowerCaseExceptFirstLetter(element));
    }else{
      if(result.length < cpt + 1){
        for (let i = result.length; i <= cpt; i++) {
          result.push("");
        } 
      }
      const separator = result[cpt].endsWith(textSeparator) ? "" : "\n" ;
      result[cpt] = result[cpt] + separator + element;
    }
  });
  return result;
}

function stepsSperatedFromNumbers(ocrTextSplitted: Array<string>): Array<string> {
  const result = new Array<string>()
  let cpt = 0;

  ocrTextSplitted.forEach(element => {
    // OCR returns steps (and other characters like bullet points) alone. This means that we must ignore everything that is not a number and retrieve the number in cpt  for later
    if(element.length <= 2){ // A recipe can't go to 100 steps
      if(numberAtFirstIndex.test(element) && element !== "0") {
        cpt = tranformOCRInOneNumber(element) - 1;
      }
    }else{
      if(result.length < cpt + 1){
        for (let i = result.length; i <= cpt; i++) {
          result.push("");
        } 
      }

      // If nothing was there, it means that we are decoding the step title 
      if(result[cpt].length == 0){
        result[cpt] = convertToLowerCaseExceptFirstLetter(element) + textSeparator
      }else {
        const separator = result[cpt].endsWith(textSeparator) ? "" : "\n" ;
        result[cpt] = result[cpt] + separator + element;
      }

    }
    
  });

    return result
}