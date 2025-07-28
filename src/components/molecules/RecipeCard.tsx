import React from "react";
import {Card, Text, useTheme} from "react-native-paper";
import {padding, screenWidth} from "@styles/spacing";
import {View} from "react-native";
import {recipeTableElement} from "@customTypes/DatabaseElementTypes";
import {StackScreenNavigation} from "@customTypes/ScreenTypes";
import {useNavigation} from "@react-navigation/native";

export type RecipeCardProps = {
    testId: string,
    size: 'small' | 'medium',
    recipe: recipeTableElement,
};


export default function RecipeCard({testId, size, recipe}: RecipeCardProps) {
    const {navigate} = useNavigation<StackScreenNavigation>();
    const {colors} = useTheme();

    const cardWidth = screenWidth * (size == 'small' ? 0.35 : 0.45);
    const radius = cardWidth / 12;

    return (
        <Card testID={testId} mode={"outlined"}
              style={{
                  flex: 1,
                  margin: padding.small,
                  width: cardWidth,
                  justifyContent: 'flex-start',
                  backgroundColor: colors.surface, borderRadius: radius
              }}
              onPress={() => {
                  navigate('Recipe', {mode: 'readOnly', recipe: recipe})
              }}
        >
            <Card.Cover testID={testId + "::Cover"} source={{uri: recipe.image_Source}}
                        style={{
                            height: cardWidth,
                            backgroundColor: colors.tertiary, borderTopLeftRadius: radius, borderTopRightRadius: radius
                        }}/>
            <Card.Title testID={testId + "::Title"}
                        title={recipe.title}
                        titleNumberOfLines={2}
                        titleVariant={size == 'small' ? "labelLarge" : "titleMedium"}
            />
            {size == 'medium' && (
                <View>
                    <Card.Content testID={testId + "::Content"} style={{padding: padding.medium}}>
                        <Text style={{color: colors.primary}} numberOfLines={1}>
                            {recipe.tags.map(tag => tag.name).join(', ')}
                        </Text>
                    </Card.Content>
                    <Card.Actions>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text testID={testId + "::PrepTime"} variant={"bodySmall"}
                                  style={{marginLeft: -padding.verySmall}}>Prep. {recipe.time} min</Text>
                            <Text testID={testId + "::PrepTime"} variant={"bodySmall"}
                                  style={{marginRight: -padding.verySmall}}>{recipe.persons} p.</Text>
                        </View>
                    </Card.Actions>
                </View>
            )
            }

        </Card>
    )
}
