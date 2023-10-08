/**
 * TODO fill this part
 * @format
 */

import { enumIconTypes, searchIcon, iconsSize, exportIcon } from "@assets/images/Icons";
import RoundButton from "@components/atomic/RoundButton";
import BottomButton from "@components/molecules/BottomButton";
import SectionClickableList from "@components/molecules/SectionClickableList";
import { shoppingListTableElement } from "@customTypes/DatabaseElementTypes";
import { listFilter, recipeFilterType } from "@customTypes/RecipeFiltersTypes";
import { openSearchScreen } from "@navigation/NavigationFunctions";
import { useFocusEffect } from "@react-navigation/native";
import { bottomPosition, BottomButtonDiameter } from "@styles/buttons";
import { screenViews, scrollView } from "@styles/spacing";
import { typoStyles } from "@styles/typography";
import { extractFilteredRecipeDatas } from "@utils/FilterFunctions";
import { recipeDb } from "@utils/RecipeDatabase";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Shopping ({ navigation }) {
    
    const [shoppingList, setShoppingList] = useState<Array<shoppingListTableElement>>([]);
    
        // useEffect(() => {
        //         setShoppingList(recipeDb.get_shopping());
        //       }, [])

        useFocusEffect(() => {
        navigation.addListener('focus', () => {
            setShoppingList([...recipeDb.get_shopping()]);
        });
    
        });
            
    return (
        <SafeAreaView style={screenViews.screenView}>
            <ScrollView style={scrollView(0).view} showsVerticalScrollIndicator={false}>
                <Text style={typoStyles.title}>Shopping list</Text>


                <SectionClickableList route={{screen: "shopping", shoppingProps: {ingList: shoppingList, setterIngList: setShoppingList} } } />
                {/* TODO */}
                {/* <BottomButton as={RoundButton} position={bottomPosition.right} diameter={BottomButtonDiameter} icon={{type: enumIconTypes.entypo, name: exportIcon, size: iconsSize.medium, color: "#414a4c"}} onPressFunction={() => null}/> */}
            </ScrollView>
        </SafeAreaView>
    )
}