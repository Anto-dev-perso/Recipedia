

import { CompositeNavigationProp, NavigationProp, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { recipeTableElement } from "./DatabaseElementTypes";
import RecipeDatabase from "@utils/RecipeDatabase";
import { listFilter } from "./RecipeFiltersTypes";
import { CropPropsType } from "@screens/Crop";
import { RecipePropType } from "@screens/Recipe";
import { BottomTabNavigationProp, BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ModalImageSelectProps } from "@screens/ModalImageSelect";


export type StackScreenParamList = {
    Root: React.JSX.Element;
    Modal: ModalImageSelectProps;
    Recipe: RecipePropType;
    Search: any;
    Crop: CropPropsType;
}

export type TabScreenParamList = {
    Home: any;
    Shopping: any;
    Plannification: any;
    Parameters: any;
  };
  
  export const StackScreen = createNativeStackNavigator<StackScreenParamList>();
  export const TabScreen = createBottomTabNavigator<TabScreenParamList>();


  export type StackScreenNavigation = NavigationProp<StackScreenParamList>; 
  export type TabNavigation = NavigationProp<TabScreenParamList>; 

  export type HomeScreenProp = BottomTabScreenProps<TabScreenParamList, 'Home'>;
  export type ShoppingScreenProp = BottomTabScreenProps<TabScreenParamList, 'Shopping'>;
  export type PlannificationScreenProp = BottomTabScreenProps<TabScreenParamList, 'Plannification'>;
  export type ParametersScreenProp = BottomTabScreenProps<TabScreenParamList, 'Parameters'>;

  export type RecipeScreenProp = NativeStackScreenProps<StackScreenParamList, 'Recipe'>;
  export type SearchScreenProp = NativeStackScreenProps<StackScreenParamList, 'Search'>;
  export type CropScreenProp = NativeStackScreenProps<StackScreenParamList, 'Crop'>;
  
  export type ModalScreenProp = NativeStackScreenProps<StackScreenParamList, 'Modal'>;

export type toggleActivationFunctions = {
    onActivation:(item? : listFilter) => void,
    onDeActivation:(item? : listFilter) => void,
}