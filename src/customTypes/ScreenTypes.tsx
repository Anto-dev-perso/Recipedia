/**
 * TODO fill this part
 * @format
 */

import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { recipeTableElement } from "./DatabaseElementTypes";
import RecipeDatabase from "@utils/RecipeDatabase";
import { listFilter } from "./RecipeFiltersTypes";


type StackScreenParamList = {
    Root: React.JSX.Element;
    Recipe: recipeTableElement;
    Search: undefined;
}
type TabScreenParamList = {
    Home: undefined;
    Shopping: undefined;
    Plannification: undefined;
    Parameters: undefined;
  };
  

  
  const StackScreenProp = createNativeStackNavigator<StackScreenParamList>();
  const TabScreenProp = createNativeStackNavigator<TabScreenParamList>();

  type RecipeScreenProp = NativeStackNavigationProp<StackScreenParamList, 'Recipe'>;
  type SearchScreenProp = NativeStackNavigationProp<StackScreenParamList, 'Search'>;
  
export type toggleActivationFunctions = {
    onActivation:(item? : listFilter) => void,
    onDeActivation:(item? : listFilter) => void,
}

  export { StackScreenParamList, RecipeScreenProp, SearchScreenProp,StackScreenProp, TabScreenParamList, TabScreenProp }