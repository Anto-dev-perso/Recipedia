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
import {useFocusEffect} from "@react-navigation/native";


export default function Home({route, navigation}: HomeScreenProp) {

    const [refreshing, setRefreshing] = useState<boolean>(false);

    const howManyItemInCarousel = 4;
    // TODO name these recommendation (and maybe add more ?)
    const [elementsForRecommendation1, setElementsForRecommendation1] = useState(new Array<recipeTableElement>());
    const [elementsForRecommendation2, setElementsForRecommendation2
    ] = useState(new Array<recipeTableElement>());
    const [elementsForRecommendation3, setElementsForRecommendation3] = useState(new Array<recipeTableElement>());
    const [elementsForRecommendation4, setElementsForRecommendation4] = useState(new Array<recipeTableElement>());

    function randomlySearchElements(databaseInstance: RecipeDatabase) {
        setElementsForRecommendation1(databaseInstance.searchRandomlyRecipes(howManyItemInCarousel));
        setElementsForRecommendation2(databaseInstance.searchRandomlyRecipes(howManyItemInCarousel));
        setElementsForRecommendation3(databaseInstance.searchRandomlyRecipes(howManyItemInCarousel));
        setElementsForRecommendation4(databaseInstance.searchRandomlyRecipes(howManyItemInCarousel));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        randomlySearchElements(RecipeDatabase.getInstance());
        setRefreshing(false);
    }, []);

    useEffect(() => {
        randomlySearchElements(RecipeDatabase.getInstance());
    }, []);

    useFocusEffect(() => {
        const recipeDb = RecipeDatabase.getInstance();
        const recipeTitleDeleted = new Set<string>;
        const checkIfRecipeExistAndUpdateTitlesToDelete = (recipeArray: Array<recipeTableElement>) => {
            for (const recipe of recipeArray) {
                if (!recipeDb.isRecipeExist(recipe)) {
                    recipeTitleDeleted.add(recipe.title);
                }
            }
        };
        checkIfRecipeExistAndUpdateTitlesToDelete(elementsForRecommendation1);
        checkIfRecipeExistAndUpdateTitlesToDelete(elementsForRecommendation2);
        checkIfRecipeExistAndUpdateTitlesToDelete(elementsForRecommendation3);
        checkIfRecipeExistAndUpdateTitlesToDelete(elementsForRecommendation4);

        if (recipeTitleDeleted.size > 0) {
            const filterArrayAndUpdateState = (recipeArray: Array<recipeTableElement>, setState: React.Dispatch<React.SetStateAction<Array<recipeTableElement>>>,) => {
                const filteredArray = recipeArray.filter(recipe => !recipeTitleDeleted.has(recipe.title));
                if (filteredArray.length < howManyItemInCarousel) {
                    setState([...filteredArray, ...recipeDb.searchRandomlyRecipes(howManyItemInCarousel - filteredArray.length)]);
                }
            };
            filterArrayAndUpdateState(elementsForRecommendation1, setElementsForRecommendation1);
            filterArrayAndUpdateState(elementsForRecommendation2, setElementsForRecommendation2);
            filterArrayAndUpdateState(elementsForRecommendation3, setElementsForRecommendation3);
            filterArrayAndUpdateState(elementsForRecommendation4, setElementsForRecommendation4);
        }

    });

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
