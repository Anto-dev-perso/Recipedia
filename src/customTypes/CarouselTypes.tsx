/**
 * TODO fill this part
 * @format
 */


import { ImageRequireSource, ImageSourcePropType } from "react-native";
import { debugRecipeColNames, recipeTableElement } from "./DatabaseElementTypes";

type cardOfCarouselProps = {
    title: string,
    // image: ImageRequireSource,
    image: ImageSourcePropType,
    // image: string,
  }

const columnsFromTable: Array<string> =  [
  debugRecipeColNames[0].name, // IMAGE_SOURCE
  debugRecipeColNames[1].name // TITLE
]

export { cardOfCarouselProps, columnsFromTable };