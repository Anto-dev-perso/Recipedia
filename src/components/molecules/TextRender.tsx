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
import {TouchableOpacity, View} from "react-native"
import {Text, TextInput} from "react-native-paper";
import {palette} from "@styles/colors";
import TextInputWithDropDown from "@components/molecules/TextInputWithDropDown";
import RecipeDatabase from "@utils/RecipeDatabase";

// TODO use variant for Text

export type TextRenderProps = {
    testID?: string,
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

        const ingredientsList = RecipeDatabase.getInstance().get_ingredients().map(ingredient => ingredient.ingName).sort();

        return (
            <View key={index}>
                {props.editText ?
                    <View style={screenViews.tabView}>
                        <TextInput testID={props.testID + `::${index}::QuantityInput`}
                                   style={{...paragraphBorder, flex: 2, textAlign: "center"}}
                                   value={quantity.toString()}
                                   onChangeText={newQuantity => props.editText?.onChangeFunction(index, `${newQuantity}${unitySeparator}${unit}${textSeparator}${ingName}`)}
                            // TODO this can't stay like this forever but what about the test ?
                                   autoCorrect={false} spellCheck={false}
                        />
                        <Text testID={props.testID + `::${index}::Unit`} style={{
                            ...paragraphBorder,
                            backgroundColor: palette.backgroundColor,
                            flex: 1,
                            textAlign: "center",
                            textAlignVertical: "center"
                        }}>{unit}</Text>

                        <View style={{flex: 3}}>
                            <TextInputWithDropDown testID={props.testID + `::${index}::Dropdown`}
                                                   absoluteDropDown={true}
                                                   referenceTextArray={ingredientsList}
                                                   value={ingName}
                                                   onValidate={newIngredientName => props.editText?.onChangeFunction(index, `${unitAndQuantity}${textSeparator}${newIngredientName}`)}/>
                        </View>
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
        const [sectionTitle, sectionParagraph] = item.length > 0 ? item.split(textSeparator) : ['', ''];

        return (
            <View key={index}>
                {props.editText ?
                    <View style={screenViews.sectionView}>
                        <Text style={{...typoStyles.title, textAlign: "center",}}>Preparation : step {index + 1}</Text>

                        <Text style={typoStyles.header}>Title of step {index + 1} : </Text>
                        <TextInput testID={props.testID + `::${index}::InputTitle`} style={headerBorder}
                                   value={sectionTitle}
                                   onChangeText={newTitle => props.editText?.onChangeFunction(index, `${newTitle}${textSeparator}${sectionParagraph}`)}
                                   multiline={true}
                            // TODO this can't stay like this forever but what about the test ?
                                   autoCorrect={false} spellCheck={false}
                        />

                        <Text style={typoStyles.header}>Content of step {index + 1} : </Text>
                        <TextInput testID={props.testID + `::${index}::InputParagraph`} style={paragraphBorder}
                                   value={sectionParagraph}
                                   onChangeText={newParagraph => props.editText?.onChangeFunction(index, `${sectionTitle}${textSeparator}${newParagraph}`)}
                                   multiline={true}
                            // TODO this can't stay like this forever but what about the test ?
                                   autoCorrect={false} spellCheck={false}/>
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
