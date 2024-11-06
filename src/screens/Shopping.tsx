

import { enumIconTypes, searchIcon, iconsSize, exportIcon } from "@assets/images/Icons";
import RoundButton from "@components/atomic/RoundButton";
import SectionClickableList from "@components/molecules/SectionClickableList";
import { shoppingListTableElement } from "@customTypes/DatabaseElementTypes";
import { useFocusEffect } from "@react-navigation/native";
import { bottomTopPosition, LargeButtonDiameter } from "@styles/buttons";
import { palette } from "@styles/colors";
import { screenViews, scrollView } from "@styles/spacing";
import { typoStyles } from "@styles/typography";
import { extractFilteredRecipeDatas } from "@utils/FilterFunctions";
import { recipeDb } from "@utils/RecipeDatabase";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StatusBar, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShoppingScreenProp } from '../customTypes/ScreenTypes';


export default function Shopping ({ route, navigation } : ShoppingScreenProp) {
    
    const [shoppingList, setShoppingList] = useState<Array<shoppingListTableElement>>([]);
    
        useFocusEffect(() => {
        navigation.addListener('focus', () => {
            setShoppingList([...recipeDb.get_shopping()]);
        });
    
        });
            
    return (
        <SafeAreaView style={screenViews.screenView}>
            <StatusBar animated={true} backgroundColor={palette.primary}/>
            <ScrollView style={scrollView(0).view} showsVerticalScrollIndicator={false}>
                <Text style={typoStyles.title}>Shopping list</Text>


                <SectionClickableList route={{screen: "shopping", shoppingProps: {ingList: shoppingList, setterIngList: setShoppingList} } } />
                {/* TODO */}
                {/* <BottomTopButton as={RoundButton} position={bottomPosition.right} diameter={BottomButtonDiameter} icon={{type: enumIconTypes.entypo, name: exportIcon, size: iconsSize.medium, color: "#414a4c"}} onPressFunction={() => null}/> */}
            </ScrollView>
        </SafeAreaView>
    )
}