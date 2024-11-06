

import React, { useState } from "react";
import { Button, Keyboard, TextInput, View } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import EStyleSheet from "react-native-extended-stylesheet";
import { searchBarStyle, typoStyles } from "@styles/typography";
import { remValue } from "@styles/spacing";
import { displayIcon, enumIconTypes, iconsSize, searchIcon } from "@assets/images/Icons";
import { crossIcon } from '../../assets/images/Icons';

type SearchBarProps = {
    clicked: boolean,
    searchPhrase: string,
    setClicked: React.Dispatch<React.SetStateAction<boolean>>,
    setSearchPhrase: React.Dispatch<React.SetStateAction<string>>
}

export default function SearchBar ( props: SearchBarProps) {

  
  const crossGesture = () => {
      Keyboard.dismiss();
      props.setClicked(false);
      props.setSearchPhrase("");
  }
  

    return (
        <View style={searchBarStyle.searchBarView}>
            <View style={searchBarStyle.searchBarComponent}>
          {/* search Icon */}
          {displayIcon(enumIconTypes.fontAwesome, searchIcon, iconsSize.small, "#414a4c", { paddingLeft: 10 * remValue })}

            {/* Input field */}
            <TextInput style={typoStyles.searchBar} placeholder="Title of recipe" value={props.searchPhrase} onChangeText={props.setSearchPhrase} onFocus={() => props.setClicked(true)} onSubmitEditing={() => {
              props.setClicked(false);
            }}/>

            {/* cross Icon, depending on whether the search bar is clicked or not */}
            {props.clicked ? displayIcon(enumIconTypes.entypo, crossIcon, iconsSize.medium, "#414a4c", { paddingRight: 10 * remValue }, crossGesture) : null}
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
  