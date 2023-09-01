/**
 * TODO fill this part
 * @format
 */

import { recipeTableElement } from "@customTypes/DatabaseElementTypes";
import { RecipeScreenProp } from "@customTypes/ScreenTypes";
import { useNavigation } from "@react-navigation/native";


export const openSearchScreen = (navigation: RecipeScreenProp) => {
    navigation.navigate('Search');
  }

export const openRecipeScreen = (recipe: recipeTableElement, navigation: RecipeScreenProp) => {
    navigation.navigate('Recipe', recipe);
}