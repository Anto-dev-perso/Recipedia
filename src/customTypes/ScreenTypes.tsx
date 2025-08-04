import {NavigationProp} from "@react-navigation/native";
import {createNativeStackNavigator, NativeStackScreenProps} from '@react-navigation/native-stack';
import React from "react";
import {RecipePropType} from "@screens/Recipe";
import {BottomTabScreenProps, createBottomTabNavigator} from "@react-navigation/bottom-tabs";


export type StackScreenParamList = {
    Tabs: React.JSX.Element;
    Recipe: RecipePropType;
    LanguageSettings: undefined;
    DefaultPersonsSettings: undefined;
    IngredientsSettings: undefined;
    TagsSettings: undefined;
}

export type TabScreenParamList = {
    Home: undefined;
    Search: undefined;
    Shopping: undefined;
    Parameters: undefined;
};

export const Stack = createNativeStackNavigator<StackScreenParamList>();
export const Tab = createBottomTabNavigator<TabScreenParamList>();


export type StackScreenNavigation = NavigationProp<StackScreenParamList>;

export type HomeScreenProp = BottomTabScreenProps<TabScreenParamList, 'Home'>;
export type SearchScreenProp = BottomTabScreenProps<TabScreenParamList, 'Search'>;
export type ShoppingScreenProp = BottomTabScreenProps<TabScreenParamList, 'Shopping'>;
export type ParametersScreenProp = BottomTabScreenProps<TabScreenParamList, 'Parameters'>;


export type RecipeScreenProp = NativeStackScreenProps<StackScreenParamList, 'Recipe'>;
export type LanguageSettingsProp = NativeStackScreenProps<StackScreenParamList, 'LanguageSettings'>;
export type DefaultPersonsSettingsProp = NativeStackScreenProps<StackScreenParamList, 'DefaultPersonsSettings'>;
export type IngredientsSettingProp = NativeStackScreenProps<StackScreenParamList, 'IngredientsSettings'>;
export type TagsSettingsProp = NativeStackScreenProps<StackScreenParamList, 'TagsSettings'>;
