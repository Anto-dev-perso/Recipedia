import {palette} from "@styles/colors";
import {screenViews} from "@styles/spacing";
import {typoStyles} from "@styles/typography";
import React from "react";
import {SafeAreaView, StatusBar, Text, View} from "react-native";

// TODO to implement
export default function Parameters() {


    return (
        <SafeAreaView style={screenViews.screenView}>
            <StatusBar animated={true} backgroundColor={palette.primary}/>
            <View>
                <Text style={typoStyles.title}>Parameters</Text>
            </View>
        </SafeAreaView>
    );
}
