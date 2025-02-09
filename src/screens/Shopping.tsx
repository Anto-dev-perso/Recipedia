import SectionClickableList from "@components/molecules/SectionClickableList";
import {shoppingListTableElement} from "@customTypes/DatabaseElementTypes";
import {useFocusEffect} from "@react-navigation/native";
import {palette} from "@styles/colors";
import {screenViews, scrollView} from "@styles/spacing";
import {typoStyles} from "@styles/typography";
import React, {useState} from "react";
import {ScrollView, StatusBar, Text} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {ShoppingScreenProp} from '@customTypes/ScreenTypes';
import RecipeDatabase from "@utils/RecipeDatabase";


export default function Shopping({navigation}: ShoppingScreenProp) {

    const [shoppingList, setShoppingList] = useState(new Array<shoppingListTableElement>());

    useFocusEffect(() => {
        navigation.addListener('focus', () => {
            setShoppingList([...RecipeDatabase.getInstance().get_shopping()]);
        });
    });

    function updateShoppingList(ingredientName: string) {
        const newShoppingList = shoppingList.map(item => item);

        const ingToEdit = shoppingList.find(item => item.name === ingredientName);
        if (ingToEdit !== undefined) {
            ingToEdit.purchased = !ingToEdit.purchased;
            if (ingToEdit.id !== undefined) {
                RecipeDatabase.getInstance().purchaseIngredientOfShoppingList(ingToEdit.id, ingToEdit.purchased).then(() => setShoppingList(newShoppingList));
            } else {
                console.warn(`updateShoppingList:: Shopping list ingredient named ${ingredientName} doesn't have an id`);
            }
        } else {
            console.warn(`updateShoppingList::Shopping list not found for ${ingredientName}`);
        }
    }

    return (
        <SafeAreaView style={screenViews.screenView}>
            <StatusBar animated={true} backgroundColor={palette.primary}/>
            <ScrollView style={scrollView(0).view} showsVerticalScrollIndicator={false}>
                <Text testID={'ShoppingScreenTitle'} style={typoStyles.title}>Shopping list</Text>
                <SectionClickableList
                    screen={"shopping"} ingList={shoppingList} updateIngredientFromShopping={updateShoppingList}/>
                {/* TODO to implement */}
                {/* <BottomTopButton as={RoundButton} position={bottomPosition.right} diameter={BottomButtonDiameter} icon={{type: enumIconTypes.entypo, name: exportIcon, size: iconsSize.medium, color: "#414a4c"}} onPressFunction={() => null}/> */}
            </ScrollView>
        </SafeAreaView>
    )
}
