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


export type StackScreenParamList = {
    Root: React.JSX.Element;
    Recipe: recipeTableElement;
    Search: undefined;
}

export type TabScreenParamList = {
    Home: undefined;
    Shopping: undefined;
    Plannification: undefined;
    Parameters: undefined;
  };
  

  
  export const StackScreenProp = createNativeStackNavigator<StackScreenParamList>();
  export const TabScreenProp = createNativeStackNavigator<TabScreenParamList>();

  export type HomeScreenProp = NativeStackNavigationProp<TabScreenParamList, 'Home'>;
  export type ShoppingScreenProp = NativeStackNavigationProp<TabScreenParamList, 'Shopping'>;
  export type PlannificationScreenProp = NativeStackNavigationProp<TabScreenParamList, 'Plannification'>;
  export type ParametersScreenProp = NativeStackNavigationProp<TabScreenParamList, 'Parameters'>;

  export type RecipeScreenProp = NativeStackNavigationProp<StackScreenParamList, 'Recipe'>;
  export type SearchScreenProp = NativeStackNavigationProp<StackScreenParamList, 'Search'>;
  
export type toggleActivationFunctions = {
    onActivation:(item? : listFilter) => void,
    onDeActivation:(item? : listFilter) => void,
}