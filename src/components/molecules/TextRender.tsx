import {screenViews} from "@styles/spacing"
import {editableText, textSeparator, typoRender, typoStyles, unitySeparator} from "@styles/typography"
import React from "react"
import {TouchableOpacity, View} from "react-native"
import {Text, TextInput, useTheme} from "react-native-paper";
import TextInputWithDropDown from "@components/molecules/TextInputWithDropDown";
import RecipeDatabase from "@utils/RecipeDatabase";
import {recipeTextRenderStyles} from "@styles/recipeComponents";

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

    const {colors} = useTheme();

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
                        <TextInput
                            testID={props.testID + `::${index}::QuantityInput`}
                            mode={'outlined'}
                            style={recipeTextRenderStyles.firstColumn}
                            contentStyle={recipeTextRenderStyles.columnContentStyle}
                            value={quantity.toString()}
                            onChangeText={newQuantity => props.editText?.onChangeFunction(index, `${newQuantity}${unitySeparator}${unit}${textSeparator}${ingName}`)}
                            autoCorrect={false}
                            spellCheck={false} pointerEvents={"auto"}
                            scrollEnabled={false}
                            multiline={true} numberOfLines={1}
                        />
                        <TextInput testID={props.testID + `::${index}::Unit`} mode={'outlined'}
                                   style={[recipeTextRenderStyles.secondColumn, {backgroundColor: colors.backdrop}]}
                                   contentStyle={recipeTextRenderStyles.columnContentStyle}
                                   scrollEnabled={false}
                                   editable={false} pointerEvents={"auto"}
                                   multiline={true} numberOfLines={1}>{unit}</TextInput>

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
                        <Text variant={"titleMedium"} style={{flex: 1}}>{quantity} {unit}</Text>
                        <Text variant={"titleMedium"} style={{flex: 3}}>{ingName}</Text>
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
                    <View style={recipeTextRenderStyles.containerSection}>
                        <Text variant={"headlineMedium"} style={recipeTextRenderStyles.headlineElement}>Preparation :
                            step {index + 1}</Text>

                        <View style={recipeTextRenderStyles.containerSection}>
                            <Text variant={"titleLarge"} style={recipeTextRenderStyles.containerElement}>Title of
                                step {index + 1} : </Text>
                            <TextInput testID={props.testID + `::${index}::InputTitle`}
                                       mode={'outlined'}
                                       value={sectionTitle}
                                       style={recipeTextRenderStyles.containerElement}
                                       onChangeText={newTitle => props.editText?.onChangeFunction(index, `${newTitle}${textSeparator}${sectionParagraph}`)}
                                       multiline={false} scrollEnabled={false}
                                // TODO this can't stay like this forever but what about the test ?
                                       autoCorrect={false} spellCheck={false}
                            />

                            <Text variant={"titleLarge"} style={recipeTextRenderStyles.containerElement}>Content of
                                step {index + 1} : </Text>
                            <TextInput testID={props.testID + `::${index}::InputParagraph`} mode={'outlined'}
                                       style={recipeTextRenderStyles.containerElement} value={sectionParagraph}
                                       onChangeText={newParagraph => props.editText?.onChangeFunction(index, `${sectionTitle}${textSeparator}${newParagraph}`)}
                                       multiline={true} scrollEnabled={false}
                                // TODO this can't stay like this forever but what about the test ?
                                       autoCorrect={false} spellCheck={false}/>
                        </View>
                    </View>
                    :
                    <View style={recipeTextRenderStyles.containerSection}>
                        <Text variant={"titleLarge"}
                              style={recipeTextRenderStyles.headlineElement}>{index + 1}) {sectionTitle}</Text>
                        <Text variant={"titleMedium"}
                              style={recipeTextRenderStyles.containerElement}>{sectionParagraph}</Text>
                    </View>
                }

            </View>
        )
    }

    function renderAsList(item: string, index: number) {

        return (
            <Text key={index} variant={"titleMedium"}>{item}</Text>
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
            {props.title ? <Text variant={"headlineSmall"}
                                 style={recipeTextRenderStyles.containerElement}>{props.title}</Text> : null}
            {selectRender(props.render)}
        </View>
    )

}
