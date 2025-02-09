import {palette} from "@styles/colors";
import {screenViews} from "@styles/spacing";
import {typoStyles} from "@styles/typography";
import React from "react";
import {SafeAreaView, StatusBar, Text} from "react-native";

// TODO to implement
export default function Plannification() {
    return (
        <SafeAreaView style={screenViews.screenView}>
            <StatusBar animated={true} backgroundColor={palette.primary}/>
            {/* <ScrollView style={scrollView(0).view}> */}
            <Text style={typoStyles.title}>Plannification</Text>
            {/* </ScrollView> */}
        </SafeAreaView>
    )
}
