import SquareButton from "@components/atomic/SquareButton";
import {mediumCardWidth, viewButtonStyles} from "@styles/buttons";
import {carouselStyle} from "@styles/typography";
import React from "react";
import {FlatList, ListRenderItemInfo, Text, View} from "react-native";
import {recipeTableElement} from "@customTypes/DatabaseElementTypes";
import {StackScreenNavigation} from "@customTypes/ScreenTypes";
import {useNavigation} from "@react-navigation/native";

type CarouselItemProps = {
    items: Array<recipeTableElement>,
    testID: string,
}

let titleLength = mediumCardWidth / 5.5;

export default function CarouselItem(props: CarouselItemProps) {

    const {navigate} = useNavigation<StackScreenNavigation>();

    function renderMyItem({item, index}: ListRenderItemInfo<recipeTableElement>) {


        const goToRecipe = () => {
            navigate('Recipe', {mode: 'readOnly', recipe: item});
        };

        return (
            <View>
                <SquareButton testID={props.testID + `CarouselItem::${index}`} side={mediumCardWidth} type={'recipe'}
                              recipe={item}
                              onPressFunction={goToRecipe}/>
                <Text style={carouselStyle(titleLength).carouselTitle} onPress={goToRecipe}>
                    {((item.title).length > titleLength) ?
                        (((item.title).substring(0, titleLength - 3)) + '...') :
                        item.title}
                </Text>
            </View>
        )
    }

    return (
        <View style={viewButtonStyles.viewContainingButton}>
            <FlatList data={props.items} renderItem={renderMyItem} horizontal={true}
                      showsHorizontalScrollIndicator={false}/>
        </View>
    )
} 
