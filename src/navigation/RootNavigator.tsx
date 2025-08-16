import React from 'react';
import Recipe from "@screens/Recipe";
import LanguageSettings from "@screens/LanguageSettings";
import DefaultPersonsSettings from "@screens/DefaultPersonsSettings";
import IngredientsSettings from "@screens/IngredientsSettings";
import TagsSettings from '@screens/TagsSettings';
import {Stack} from '@customTypes/ScreenTypes';
import BottomTabs from "@navigation/BottomTabs";
import {navigationLogger} from '@utils/logger';

export default function RootNavigator() {
    const screenOptions = {
        headerShown: false,
        // Add navigation logging
        listeners: {
            focus: (e: any) => {
                navigationLogger.debug('Screen focused', { screenName: e.target?.split('-')[0] });
            },
            blur: (e: any) => {
                navigationLogger.debug('Screen blurred', { screenName: e.target?.split('-')[0] });
            },
        },
    };

    return (<Stack.Navigator initialRouteName='Tabs' screenOptions={screenOptions}>
        <Stack.Screen name="Tabs" component={BottomTabs}/>
        <Stack.Screen name="Recipe" component={Recipe}/>
        <Stack.Screen name="LanguageSettings" component={LanguageSettings}/>
        <Stack.Screen name="DefaultPersonsSettings" component={DefaultPersonsSettings}/>
        <Stack.Screen name="IngredientsSettings" component={IngredientsSettings}/>
        <Stack.Screen name="TagsSettings" component={TagsSettings}/>
    </Stack.Navigator>)
}
