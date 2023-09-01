/**
 * TODO fill this part
 * @format
 */

import React, { useState } from "react";
import { Button, Keyboard, TextInput, View } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import EStyleSheet from "react-native-extended-stylesheet";
import { searchBarStyle, typoStyles } from "@styles/typography";
import { remValue } from "@styles/spacing";
import { iconsSize } from "@assets/images/Icons";

type SearchBarProps = {
    clicked: boolean,
    searchPhrase: string,
    setClicked: React.Dispatch<React.SetStateAction<boolean>>,
    setSearchPhrase: React.Dispatch<React.SetStateAction<string>>
}

export default function SearchBar ( props: SearchBarProps) {

    return (
        <View style={searchBarStyle.searchBarView}>
            <View style={searchBarStyle.searchBarComponent}>
          {/* search Icon */}
            <Feather name="search" size={iconsSize.small} color="black" style={{ marginLeft: 10*remValue }}/>
            {/* Input field */}
            <TextInput style={typoStyles.searchBar} placeholder="Title of recipe" value={props.searchPhrase} onChangeText={props.setSearchPhrase} onFocus={() => props.setClicked(true)} onSubmitEditing={() => {
              props.setClicked(false);
            }}/>
            {/* cross Icon, depending on whether the search bar is clicked or not */}
            {props.clicked && (
              <Entypo name="cross" size={iconsSize.medium} color="#414a4c" style={{paddingRight: 10}} onPress={() => {
                  Keyboard.dismiss();
                  props.setClicked(false);
                  props.setSearchPhrase("");
              }}/>
            )}
        </View>
      </View>
    )}

    // styles
const styles = EStyleSheet.create({
    input: {
      fontSize: 20,
      marginLeft: 0,
      width: "90%",
    },
  });
  