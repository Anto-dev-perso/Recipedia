/**
 * TODO fill this part
 * @format
 */

import RecipeRecommandation from "@components/organisms/RecipeRecommandation";

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Recipe from "@screens/Recipe";

import { recipeTableElement } from "@customTypes/DatabaseElementTypes";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { screenViews } from "@styles/spacing";
import RecipeDatabase, { recipeDb } from "@utils/RecipeDatabase";
import { pickImage, takePhoto } from "@utils/ImagePicker";
import { hashString } from "@utils/Hash";
import BottomButton from "@components/molecules/BottomButton";
import RoundButton from "@components/atomic/RoundButton";
import { BottomButtonDiameter, bottomPosition } from "@styles/buttons";
import { RecipeScreenProp } from "@customTypes/ScreenTypes";
import { useNavigation } from "@react-navigation/native";
import VerticalBottomButtons from "@components/organisms/VerticalBottomButtons";
import { openSearchScreen } from "@navigation/NavigationFunctions";
import { cameraIcon, enumIconTypes, iconsSize, searchIcon } from "@assets/images/Icons";


export default function Home () {
  
  const navigation = useNavigation<RecipeScreenProp>();
  
  const [elementsForCarousel, setElementsForCarousel] = useState<recipeTableElement[]>([]);


  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  const randomlySearchElements = async () => {

  //   const _image = await launchImageLibrary({ mediaType: 'mixed'},     async (response) => {
  //     console.log('Response = ', response.assets);

  //     if (response.didCancel) {
  //       alert('User cancelled camera picker');
  //       return;
  //     } else if (response.errorCode == 'camera_unavailable') {
  //       alert('Camera not available on device');
  //       return;
  //     } else if (response.errorCode == 'permission') {
  //       alert('Permission not satisfied');
  //       return;
  //     } else if (response.errorCode == 'others') {
  //       alert(response.errorMessage);
  //       return;
  //     }
  //     console.log('base64 -> ', response.assets[0].base64);
  //     console.log('uri -> ', response.assets[0].uri);
  //     console.log('width -> ', response.assets[0].width);
  //     console.log('height -> ', response.assets[0].height);
  //     console.log('fileSize -> ', response.assets[0].fileSize);
  //     console.log('type -> ', response.assets[0].type);
  //     console.log('fileName -> ', response.assets[0].fileName);
  // });
  
  // console.log('uri -> ', _image.assets[0].uri);


  //   let image2: string;
//   const dir = RNFS.PicturesDirectoryPath;
//   const dirContent = await RNFS.readDir(dir)
//   console.log("DEBUG : dir =  ", dir, " and read = ", dirContent);
// const image = dirContent.find((file) => file.name === 'child.jpg');
// console.log("Image : ", image);


  // let img = '/storage/emulated/0/Pictures/child.jpg';
  // RNFS.exists(img)
  // .then((exists) => {
  //   if (exists) {
  //     console.log("Find image");
      
  //   } else {
  //     console.log("L'image n'existe pas.");
  //   }
  // })
  // .catch((error) => {
  //   console.log('Erreur lors de la vérification de l\'existence de l\'image:', error);
  // });

    try {
      let elementsReturned = await recipeDb.searchRandomlyElement(4);
      await setElementsForCarousel(elementsReturned);
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    recipeDb.init().then(async () => {
      await randomlySearchElements();
    })
  }, [])

    return (
        <SafeAreaView style={screenViews.screenView}>
          {(elementsForCarousel.length > 0) ? 
            <ScrollView>
              <RecipeRecommandation carouselProps={elementsForCarousel} titleRecommandation="Recommandation 1"/>
              <RecipeRecommandation carouselProps={elementsForCarousel} titleRecommandation="Recommandation 2"/>
              <RecipeRecommandation carouselProps={elementsForCarousel} titleRecommandation="Recommandation 3"/>
              <RecipeRecommandation carouselProps={elementsForCarousel} titleRecommandation="Recommandation 4"/>
            </ScrollView>
          : null}
          <BottomButton as={RoundButton} position={bottomPosition.left} diameter={BottomButtonDiameter} icon={{type: enumIconTypes.fontAwesome, name: searchIcon, size: iconsSize.medium, color: "#414a4c"}} onPressFunction={() => openSearchScreen(navigation)}/>
          <VerticalBottomButtons/>
        </SafeAreaView>
    )
}