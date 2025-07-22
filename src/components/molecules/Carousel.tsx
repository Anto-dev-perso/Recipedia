import React from "react";
import {FlatList, ListRenderItemInfo, View} from "react-native";
import {Card, useTheme} from "react-native-paper";
import {recipeTableElement} from "@customTypes/DatabaseElementTypes";
import {StackScreenNavigation} from "@customTypes/ScreenTypes";
import {useNavigation} from "@react-navigation/native";
import {padding, screenWidth} from "@styles/spacing";

export type CarouselItemProps = {
    items: Array<recipeTableElement>,
    testID: string,
};

export default function Carousel(props: CarouselItemProps) {
    const {colors} = useTheme();
    const {navigate} = useNavigation<StackScreenNavigation>();

    const cardId = props.testID + "::Card";

    function renderMyItem({item, index}: ListRenderItemInfo<recipeTableElement>) {

        const itemSize = 0.35 * screenWidth;

        const goToRecipe = () => {
            navigate('Recipe', {mode: 'readOnly', recipe: item});
        };

        return (
            <Card mode={"outlined"}
                  style={{
                      margin: padding.small,
                      width: itemSize,
                      justifyContent: 'flex-start',
                      backgroundColor: colors.surface,
                  }}
                  onPress={goToRecipe}
                  testID={cardId + `::${index}`}
            >
                <Card.Cover source={{uri: item.image_Source}}
                            style={{height: itemSize, width: itemSize, backgroundColor: colors.tertiary}}/>

                <Card.Title
                    title={item.title}
                    titleNumberOfLines={2}
                    titleVariant={"labelLarge"}
                />
            </Card>
        );
    }

    return (
        <View>
            <FlatList
                data={props.items}
                renderItem={renderMyItem}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, idx) => item.title + idx}
                contentContainerStyle={{paddingHorizontal: padding.small}}
            />
        </View>
    );
}
