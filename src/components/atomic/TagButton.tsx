

import React from "react"
import { Pressable, Text, TextInput, View } from "react-native"
import { rectangleRoundedButtonStyles, viewButtonStyles, viewInsideButtonCentered} from "@styles/buttons"
import { editableText, elementBorder, paragraphBorder, typoStyles } from "@styles/typography"
import { padding, remValue, screenViews } from "@styles/spacing"
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons"
import { displayIcon, enumIconTypes, iconProp, iconsSize, materialCommunityIconName } from '@assets/images/Icons';


type TagButtonProps = {
    text: string,
    leftIcon?: iconProp,
    rightIcon?: iconProp,
    onPressFunction?:() => void,
    editText?: editableText,
}

const TagHeight = 30 * remValue;


export default function TagButton (props: TagButtonProps) {
    return(
        <Pressable style={rectangleRoundedButtonStyles(TagHeight).rectangleRoundedButton} onPress={props.onPressFunction}>
            <View style={viewInsideButtonCentered}>
                {props.leftIcon ? displayIcon(props.leftIcon.type, props.leftIcon.name, props.leftIcon.size, props.leftIcon.color, props.leftIcon.style)
                : null}
                {props.editText ? 
                    <View style={screenViews.sectionView}>
                        <TextInput style={{...elementBorder, paddingHorizontal: padding.large}} value={props.text} onChangeText={newTitle => props.editText?.onChangeFunction(newTitle, props.text)} multiline={true}/>
                    </View>
                :
                    <Text style={typoStyles.element}>{props.text}</Text>
                }
                {props.rightIcon ? displayIcon(props.rightIcon.type, props.rightIcon.name, props.rightIcon.size, props.rightIcon.color, props.rightIcon.style) : null}
            </View>
        </Pressable>
    )
}