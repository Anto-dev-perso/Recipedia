/**
 * TODO fill this part
 * @format
 */

import { screenViews, scrollView } from "@styles/spacing";
import { typoStyles } from "@styles/typography";
import React from "react";
import { SafeAreaView, ScrollView, Text } from "react-native";

export default function Plannification () {
    return (
        <SafeAreaView style={screenViews.screenView}>
            <ScrollView style={scrollView(0).view}>
            <Text style={typoStyles.title}>Plannification</Text>
            </ScrollView>
        </SafeAreaView>
    )
}