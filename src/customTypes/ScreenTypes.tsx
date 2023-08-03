/**
 * TODO fill this part
 * @format
 */

import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { recipeTableElement } from "./DatabaseElementTypes";


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

  // type RecipeScreenProp = RouteProp<StackScreenParamList, 'Recipe'>;
  type RecipeScreenProp = NativeStackNavigationProp<StackScreenParamList, 'Recipe'>;


  export { StackScreenParamList, RecipeScreenProp, StackScreenProp, TabScreenParamList, TabScreenProp }