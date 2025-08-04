import {Icon, useTheme} from "react-native-paper";
import {Icons, iconsSize} from "@assets/Icons";
import React from "react";
import {StatusBar, View} from "react-native";
import Home from "@screens/Home";
import Shopping from "@screens/Shopping";
import Parameters from "@screens/Parameters";
import {padding, screenHeight} from "@styles/spacing";
import {useI18n} from "@utils/i18n";
import Search from "@screens/Search";
import {Tab} from "@customTypes/ScreenTypes";


export default function BottomTabs() {
    const {colors, fonts} = useTheme();
    const {t} = useI18n();


    function getActiveIconName(routeName: string): string {
        switch (routeName) {
            case 'Home':
                return Icons.homeUnselectedIcon;
            case 'Search':
                return Icons.searchIcon;
            case 'Shopping':
                return Icons.shoppingUnselectedIcon;
            case 'Plannification':
                return Icons.plannerUnselectedIcon;
            case 'Parameters':
                return Icons.parametersUnselectedIcon;
            default:
                return Icons.crossIcon;
        }
    }

    function getInactiveIconName(routeName: string): string {
        switch (routeName) {
            case 'Home':
                return Icons.homeSelectedIcon;
            case 'Search':
                return Icons.searchIcon;
            case 'Shopping':
                return Icons.shoppingSelectedIcon;
            case 'Plannification':
                return Icons.plannerSelectedIcon;
            case 'Parameters':
                return Icons.parametersSelectedIcon;
            default:
                return Icons.crossIcon;
        }
    }

    return (
        <>
            <StatusBar
                backgroundColor={colors.primaryContainer}
            />
            <Tab.Navigator initialRouteName='Home'
                           screenOptions={({route}) => ({
                               headerShown: false,
                               tabBarIcon: ({focused, color}) => {
                                   // Use different icon variants for focused/unfocused states (MD3 pattern)
                                   const iconName = focused ?
                                       getActiveIconName(route.name) :
                                       getInactiveIconName(route.name);
                                   const iconSize = iconsSize.medium;

                                   return (
                                       <View style={[{
                                           paddingHorizontal: padding.medium,
                                           paddingVertical: padding.verySmall
                                       },
                                           focused ? {
                                               borderRadius: iconSize * 0.6,
                                               backgroundColor: colors.primaryContainer
                                           } : {}]}>
                                           <Icon source={iconName} size={iconSize} color={color}/>
                                       </View>
                                   )
                               },
                               tabBarActiveTintColor: colors.onPrimaryContainer,
                               tabBarInactiveTintColor: colors.onPrimaryContainer,
                               tabBarStyle: {
                                   height: screenHeight / 9,
                                   backgroundColor: colors.surface,
                                   elevation: 2,
                                   shadowOpacity: 0.1,
                                   borderTopWidth: 0
                               },
                               tabBarItemStyle: {
                                   paddingVertical: padding.small,
                               },
                               tabBarLabelStyle: fonts.bodyMedium,
                           })}
            >
                <Tab.Screen name="Home" component={Home} options={{tabBarLabel: t('home')}}/>
                <Tab.Screen name="Search" component={Search}/>
                <Tab.Screen name="Shopping" component={Shopping} options={{tabBarLabel: t('shopping')}}/>
                <Tab.Screen
                    name="Parameters"
                    component={Parameters}
                    options={{tabBarLabel: t('parameters')}}
                />
            </Tab.Navigator>
        </>
    );

}
