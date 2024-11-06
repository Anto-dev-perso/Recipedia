

import RecipeRecommandation from "@components/organisms/RecipeRecommandation";

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { recipeTableElement } from "@customTypes/DatabaseElementTypes";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, SafeAreaView, ScrollView, StatusBar } from "react-native";
import { screenViews } from "@styles/spacing";
import RecipeDatabase, { recipeDb } from "@utils/RecipeDatabase";
import { hashString } from "@utils/Hash";
import BottomTopButton from "@components/molecules/BottomTopButton";
import RoundButton from "@components/atomic/RoundButton";
import { LargeButtonDiameter, bottomTopPosition } from "@styles/buttons";
import { RecipeScreenProp, StackScreenNavigation } from "@customTypes/ScreenTypes";
import { useNavigation } from "@react-navigation/native";
import VerticalBottomButtons from "@components/organisms/VerticalBottomButtons";
import { cameraIcon, enumIconTypes, iconsSize, searchIcon } from "@assets/images/Icons";
import { palette } from "@styles/colors";
import { CropRectangle } from "@components/molecules/CropRectangle";


export default function Home () {
  
  const { navigate } = useNavigation<StackScreenNavigation>();

  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  const [elementsForRecommandation1, setElementsForRecommandation1] = useState<recipeTableElement[]>([]);
  const [elementsForRecommandation2, setElementsForRecommandation2] = useState<recipeTableElement[]>([]);
  const [elementsForRecommandation3, setElementsForRecommandation3] = useState<recipeTableElement[]>([]);
  const [elementsForRecommandation4, setElementsForRecommandation4] = useState<recipeTableElement[]>([]);

  const randomlySearchElements = async () => {

    try {
      recipeDb.searchRandomlyRecipes(3).then(elementsReturned => setElementsForRecommandation1(elementsReturned));
      recipeDb.searchRandomlyRecipes(3).then(elementsReturned => setElementsForRecommandation2(elementsReturned));
      recipeDb.searchRandomlyRecipes(3).then(elementsReturned => setElementsForRecommandation3(elementsReturned));
      recipeDb.searchRandomlyRecipes(3).then(elementsReturned => setElementsForRecommandation4(elementsReturned));
    } catch (error) {
      console.log(error);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await randomlySearchElements();
    setRefreshing(false);
  }, [])
  
  useEffect(() => {
    // This condition is here mainly for coding. Because hot reload occurs, we ensure that we don't init again (make some troubles with the database)
    if(recipeDb.get_recipes().length == 0){
      recipeDb.init().then(async () => {
        await randomlySearchElements();
      })
    }else{
      randomlySearchElements();
    }
  }, [])

    return (
        <SafeAreaView style={screenViews.screenView}>
          <StatusBar animated={true} backgroundColor={palette.primary}/>
          {(elementsForRecommandation1.length > 0) ? 
            <ScrollView refreshControl={<RefreshControl colors={[palette.primary]} refreshing={refreshing} onRefresh={onRefresh}/>}>
              <RecipeRecommandation carouselProps={elementsForRecommandation1} titleRecommandation="Recommandation 1"/>
              <RecipeRecommandation carouselProps={elementsForRecommandation2} titleRecommandation="Recommandation 2"/>
              <RecipeRecommandation carouselProps={elementsForRecommandation3} titleRecommandation="Recommandation 3"/>
              <RecipeRecommandation carouselProps={elementsForRecommandation4} titleRecommandation="Recommandation 4"/>
            </ScrollView>
          : null}
          <BottomTopButton as={RoundButton} position={bottomTopPosition.bottom_left} diameter={LargeButtonDiameter} icon={{type: enumIconTypes.fontAwesome, name: searchIcon, size: iconsSize.medium, color: "#414a4c"}} onPressFunction={() => navigate('Search')}/>
          <VerticalBottomButtons/>
        </SafeAreaView>
    )
}