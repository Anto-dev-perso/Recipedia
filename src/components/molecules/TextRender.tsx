import {palette} from "@styles/colors"
import {screenViews} from "@styles/spacing"
import {
    editableText,
    headerBorder,
    paragraphBorder,
    textSeparator,
    typoRender,
    typoStyles,
    unitySeparator
} from "@styles/typography"
import React from "react"
import {Text, TextInput, TouchableOpacity, View} from "react-native"


export type TextRenderProps = {
    title?: string
    text: Array<string>
    render: typoRender,
    onClick?(param: string): void,
    editText?: editableText,
}

// TODO to test
// TODO can't we do better ? Maybe split in 3 atomic ?
export default function TextRender(props: TextRenderProps) {

    function selectRender(renderChoice: typoRender) {
        switch (renderChoice) {
            case typoRender.ARRAY:
                return (props.text.map((item, index) => renderAsTable(item, index)));
            case typoRender.SECTION:
                return (props.text.map((item, index) => renderAsSection(item, index)));
            case typoRender.LIST:
                return (props.text.map((item, index) => renderAsList(item, index)));
            case typoRender.CLICK_LIST:
                return (props.text.map((item, index) => renderAsClickableList(item, index)))
        }
    }

    // TODO split into separate files all these render functions
    function renderAsTable(item: string, index: number) {

        // For now, only 2 columns are render 
        // So far, only ingredients use this
        const [unitAndQuantity, ingName] = item.split(textSeparator);
        const [quantity, unit] = unitAndQuantity.split(unitySeparator);

        return (
            <View key={index}>
                {props.editText ?
                    <View style={screenViews.tabView}>
                        <TextInput style={{...paragraphBorder, flex: 2, textAlign: "center"}} value={quantity}
                                   onChangeText={newQuantity => props.editText?.onChangeFunction(`${newQuantity}${unitySeparator}${unit}${textSeparator}${ingName}`, item)}/>

                        <Text style={{
                            ...paragraphBorder,
                            backgroundColor: palette.backgroundColor,
                            flex: 1,
                            textAlign: "center",
                            textAlignVertical: "center"
                        }}>{unit}</Text>

                        <TextInput style={{...paragraphBorder, flex: 3}} value={ingName}
                                   onChangeText={newIngredientName => props.editText?.onChangeFunction(`${unitAndQuantity}${textSeparator}${newIngredientName}`, item)}
                                   multiline={true}/>
                    </View>
                    :
                    <View style={screenViews.tabView}>
                        <Text style={{...typoStyles.paragraph, flex: 1}}>{quantity} {unit}</Text>
                        <Text style={{...typoStyles.paragraph, flex: 3}}>{ingName}</Text>
                    </View>
                }
            </View>
        )
    }

    function renderAsSection(item: string, index: number) {
        // For now, only 2 columns are render 
        const [sectionTitle, sectionParagraph] = item.split(textSeparator);

        return (
            <View key={index}>
                {props.editText ?
                    <View style={screenViews.sectionView}>
                        <Text style={{...typoStyles.title, textAlign: "center",}}>Preparation : step {index + 1}</Text>

                        <Text style={typoStyles.header}>Title of step {index + 1} : </Text>
                        <TextInput style={headerBorder} value={sectionTitle}
                                   onChangeText={newTitle => props.editText?.onChangeFunction(`${newTitle}${textSeparator}${sectionParagraph}`, item)}
                                   multiline={true}/>

                        <Text style={typoStyles.header}>Content of step {index + 1} : </Text>
                        <TextInput style={paragraphBorder} value={sectionParagraph}
                                   onChangeText={newParagraph => props.editText?.onChangeFunction(`${sectionTitle}${textSeparator}${newParagraph}`, item)}
                                   multiline={true}/>
                    </View>
                    :
                    <View style={screenViews.sectionView}>
                        <Text style={typoStyles.header}>{index + 1}) {sectionTitle}</Text>
                        <Text style={typoStyles.paragraph}>{sectionParagraph}</Text>
                    </View>
                }

            </View>
        )
    }

    function renderAsList(item: string, index: number) {

        return (
            <Text key={index} style={typoStyles.element}>{item}</Text>
        )
    }


    function renderAsClickableList(item: string, index: number) {

        return (
            <TouchableOpacity key={index} style={screenViews.clickableListView} onPress={() => {
                props.onClick ? props.onClick(item) : console.warn("renderAsClickableList: onClick doesn't exist !");
            }}>
                <Text style={typoStyles.paragraph}>{item}</Text>
            </TouchableOpacity>
        )
    }


    return (
        <View>
            {props.title ? <Text style={typoStyles.title}>{props.title}</Text> : null}
            {selectRender(props.render)}
        </View>
    )

}
