import RecipeRecommendation from "@components/organisms/RecipeRecommendation";

import {recipeTableElement} from "@customTypes/DatabaseElementTypes";
import React, {useCallback, useEffect, useState} from "react";
import {RefreshControl, SafeAreaView, ScrollView, StatusBar} from "react-native";
import {screenViews} from "@styles/spacing";
import BottomTopButton from "@components/molecules/BottomTopButton";
import RoundButton from "@components/atomic/RoundButton";
import {bottomTopPosition, LargeButtonDiameter} from "@styles/buttons";
import {enumIconTypes, iconsSize, searchIcon} from "@assets/images/Icons";
import {palette} from "@styles/colors";
import RecipeDatabase from "@utils/RecipeDatabase";
import {HomeScreenProp} from "@customTypes/ScreenTypes";
import VerticalBottomButtons from "@components/organisms/VerticalBottomButtons";
import FileGestion from "@utils/FileGestion";
import {tagsDataset} from "@test-data/tagsDataset";
import {recipesDataset} from "@test-data/recipesDataset";
import {ingredientsDataset} from "@test-data/ingredientsDataset";


export default function Home({route, navigation}: HomeScreenProp) {

    const [refreshing, setRefreshing] = useState<boolean>(false);

    // TODO name these recommendation (and maybe add more ?)
    const [elementsForRecommendation1, setElementsForRecommendation1] = useState(new Array<recipeTableElement>());
    const [elementsForRecommendation2, setElementsForRecommendation2
    ] = useState(new Array<recipeTableElement>());
    const [elementsForRecommendation3, setElementsForRecommendation3] = useState(new Array<recipeTableElement>());
    const [elementsForRecommendation4, setElementsForRecommendation4] = useState(new Array<recipeTableElement>());

    function randomlySearchElements(databaseInstance: RecipeDatabase) {
        setElementsForRecommendation1(databaseInstance.searchRandomlyRecipes(3));
        setElementsForRecommendation2(databaseInstance.searchRandomlyRecipes(3));
        setElementsForRecommendation3(databaseInstance.searchRandomlyRecipes(3));
        setElementsForRecommendation4(databaseInstance.searchRandomlyRecipes(3));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        randomlySearchElements(RecipeDatabase.getInstance());
        setRefreshing(false);
    }, []);

    useEffect(() => {
        // TODO this part should be at initialization of the App but when we hot reload, it don't get re-init again
        // So keep it here so that it is indeed call at each hot reload

        const recipeDb = RecipeDatabase.getInstance();
        FileGestion.getInstance().init().then(async () => {
            // TODO temporary for test
            await recipeDb.reset();
            await recipeDb.init();
            await recipeDb.addMultipleIngredients(ingredientsDataset);
            await recipeDb.addMultipleTags(tagsDataset);
            await recipeDb.addMultipleRecipes(recipesDataset);

            randomlySearchElements(recipeDb);
        });
    }, []);

    return (
        <SafeAreaView style={screenViews.screenView}>
            <StatusBar animated={true} backgroundColor={palette.primary}/>
            <ScrollView testID={'HomeScrollView'}
                        refreshControl={<RefreshControl colors={[palette.primary]} refreshing={refreshing}
                                                        onRefresh={onRefresh}/>}>
                <RecipeRecommendation testID={'RecipeRecommendation1'} carouselProps={elementsForRecommendation1}
                                      titleRecommendation="Recommendation 1"/>
                <RecipeRecommendation testID={'RecipeRecommendation2'} carouselProps={elementsForRecommendation2}
                                      titleRecommendation="Recommendation 2"/>
                <RecipeRecommendation testID={'RecipeRecommendation3'} carouselProps={elementsForRecommendation3}
                                      titleRecommendation="Recommendation 3"/>
                <RecipeRecommendation testID={'RecipeRecommendation4'} carouselProps={elementsForRecommendation4}
                                      titleRecommendation="Recommendation 4"/>
            </ScrollView>
            <BottomTopButton testID={'SearchButton'} as={RoundButton} position={bottomTopPosition.bottom_left}
                             diameter={LargeButtonDiameter}
                             icon={{
                                 type: enumIconTypes.fontAwesome,
                                 name: searchIcon,
                                 size: iconsSize.medium,
                                 color: "#414a4c"
                             }} onPressFunction={() => navigation.navigate('Search')}/>
            <VerticalBottomButtons navigation={navigation} route={route}/>
        </SafeAreaView>
    )
}
