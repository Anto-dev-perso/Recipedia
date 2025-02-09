import {palette} from "@styles/colors";
import {screenViews, scrollView} from "@styles/spacing";
import {typoStyles} from "@styles/typography";
import React from "react";
import {SafeAreaView, ScrollView, StatusBar, Text} from "react-native";

// TODO to implement
export default function Parameters() {
    return (
        <SafeAreaView style={screenViews.screenView}>
            <StatusBar animated={true} backgroundColor={palette.primary}/>
            <ScrollView style={scrollView(0).view}>
                <Text style={typoStyles.title}>Parameters</Text>
            </ScrollView>
        </SafeAreaView>
    )
}
