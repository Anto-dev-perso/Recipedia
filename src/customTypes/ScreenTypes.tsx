import {NavigationProp} from "@react-navigation/native";
import {createNativeStackNavigator, NativeStackScreenProps} from '@react-navigation/native-stack';
import React from "react";
import {RecipePropType} from "@screens/Recipe";
import {BottomTabScreenProps, createBottomTabNavigator} from "@react-navigation/bottom-tabs";


export type StackScreenParamList = {
    Root: React.JSX.Element;
    Recipe: RecipePropType;
    Search: undefined;
    LanguageSettings: undefined;
    DefaultPersonsSettings: undefined;
    IngredientsSettings: undefined;
    TagsSettings: undefined;
}

export type TabScreenParamList = {
    Home: undefined;
    Shopping: undefined;
    Plannification: undefined;
    Parameters: undefined;
};

export const Stack = createNativeStackNavigator<StackScreenParamList>();
export const Tab = createBottomTabNavigator<TabScreenParamList>();


export type StackScreenNavigation = NavigationProp<StackScreenParamList>;
export type TabNavigation = NavigationProp<TabScreenParamList>;

export type HomeScreenProp = BottomTabScreenProps<TabScreenParamList, 'Home'>;
export type ShoppingScreenProp = BottomTabScreenProps<TabScreenParamList, 'Shopping'>;
export type PlannificationScreenProp = BottomTabScreenProps<TabScreenParamList, 'Plannification'>;

export type ParametersScreenProp = BottomTabScreenProps<TabScreenParamList, 'Parameters'>;


export type RecipeScreenProp = NativeStackScreenProps<StackScreenParamList, 'Recipe'>;
export type SearchScreenProp = NativeStackScreenProps<StackScreenParamList, 'Search'>;
export type LanguageSettingsProp = NativeStackScreenProps<StackScreenParamList, 'LanguageSettings'>;
export type DefaultPersonsSettingsProp = NativeStackScreenProps<StackScreenParamList, 'DefaultPersonsSettings'>;
export type IngredientsSettingProp = NativeStackScreenProps<StackScreenParamList, 'IngredientsSettings'>;
export type TagsSettingsProp = NativeStackScreenProps<StackScreenParamList, 'TagsSettings'>;

export type toggleActivationFunctions = {
    onActivation: () => void;
    onDeActivation: () => void;
}
