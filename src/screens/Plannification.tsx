

import { CropRectangle } from "@components/molecules/CropRectangle";
import { palette } from "@styles/colors";
import { screenViews, scrollView } from "@styles/spacing";
import { typoStyles } from "@styles/typography";
import { fileGestion } from "@utils/FileGestion";
import React from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";

export default function Plannification () {
    return (
        <SafeAreaView style={screenViews.screenView}>
            <StatusBar animated={true} backgroundColor={palette.primary}/>
            {/* <ScrollView style={scrollView(0).view}> */}
            <Text style={typoStyles.title}>Plannification</Text>
            {/* </ScrollView> */}
        </SafeAreaView>
    )
}