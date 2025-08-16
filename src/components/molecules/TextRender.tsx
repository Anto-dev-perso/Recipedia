import {screenViews} from "@styles/spacing"
import {editableText, textSeparator, typoRender, typoStyles, unitySeparator} from "@styles/typography"
import React from "react"
import {TouchableOpacity, View} from "react-native"
import {Text} from "react-native-paper";
import TextInputWithDropDown from "@components/molecules/TextInputWithDropDown";
import RecipeDatabase from "@utils/RecipeDatabase";
import {recipeTextRenderStyles} from "@styles/recipeComponents";
import CustomTextInput from "@components/atomic/CustomTextInput";
import {useI18n} from "@utils/i18n";
import {uiLogger} from '@utils/logger';


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

    const {t} = useI18n();

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
            default:
                uiLogger.warn('Unrecognized render choice in TextRender', { renderChoice });
        }
    }

    // TODO split into separate files all these render functions
    function renderAsTable(item: string, index: number) {

        // For now, only 2 columns are render
        // So far; only ingredients use this
        const [unitAndQuantity, ingName] = item.split(textSeparator);
        const [quantity, unit] = unitAndQuantity.split(unitySeparator);

        const ingredientsList = RecipeDatabase.getInstance().get_ingredients().map(ingredient => ingredient.name).sort();

        return (
            <View key={index}>
                {props.editText ?
                    <View style={screenViews.tabView}>
                        <CustomTextInput testID={props.testID + `::${index}::QuantityInput`}
                                         style={recipeTextRenderStyles.firstColumn}
                                         contentStyle={recipeTextRenderStyles.columnContentStyle}
                                         value={quantity.toString()}
                                         onChangeText={newQuantity => props.editText?.onChangeFunction(index, `${newQuantity}${unitySeparator}${unit}${textSeparator}${ingName}`)}/>
                        <CustomTextInput testID={props.testID + `::${index}::Unit`}
                                         value={unit}
                                         style={recipeTextRenderStyles.secondColumn}
                                         contentStyle={recipeTextRenderStyles.columnContentStyle}
                                         editable={false}/>
                        <TextInputWithDropDown testID={props.testID + `::${index}::Dropdown`}
                                               style={recipeTextRenderStyles.thirdColumn}
                                               contentStyle={recipeTextRenderStyles.columnContentStyle}
                                               absoluteDropDown={true}
                                               referenceTextArray={ingredientsList}
                                               value={ingName}
                                               onValidate={newIngredientName => props.editText?.onChangeFunction(index, `${unitAndQuantity}${textSeparator}${newIngredientName}`)}/>
                    </View>
                    :
                    <View style={screenViews.tabView}>
                        <Text testID={props.testID + `::${index}::QuantityAndUnit`} variant={"titleMedium"}
                              style={{flex: 1}}>{quantity} {unit}</Text>
                        <Text testID={props.testID + `::${index}::IngredientName`} variant={"titleMedium"}
                              style={{flex: 3}}>{ingName}</Text>
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
                        <Text testID={props.testID + `::${index}::Step`} variant={"headlineMedium"}
                              style={recipeTextRenderStyles.headlineElement}>{t('preparationOCRStep')} {index + 1}</Text>

                        <View style={recipeTextRenderStyles.containerSection}>
                            <Text testID={props.testID + `::${index}::Title`} variant={"titleLarge"}
                                  style={recipeTextRenderStyles.containerElement}>{t('preparationOCRStepTitle')} {index + 1} : </Text>
                            <CustomTextInput testID={props.testID + `::${index}::TextInputTitle`} value={sectionTitle}
                                             style={recipeTextRenderStyles.containerElement}
                                             onChangeText={newTitle => props.editText?.onChangeFunction(index, `${newTitle}${textSeparator}${sectionParagraph}`)}
                                             multiline={true}/>
                            <Text testID={props.testID + `::${index}::Content`} variant={"titleLarge"}
                                  style={recipeTextRenderStyles.containerElement}>{t('preparationOCRStepContent')} {index + 1} : </Text>
                            <CustomTextInput testID={props.testID + `::${index}::TextInputContent`}
                                             style={recipeTextRenderStyles.containerElement} value={sectionParagraph}
                                             onChangeText={newParagraph => props.editText?.onChangeFunction(index, `${sectionTitle}${textSeparator}${newParagraph}`)}
                                             multiline={true}/>
                        </View>
                    </View>
                    :
                    <View style={recipeTextRenderStyles.containerSection}>
                        <Text testID={props.testID + `::${index}::SectionTitle`} variant={"titleLarge"}
                              style={recipeTextRenderStyles.headlineElement}>{index + 1}) {sectionTitle}</Text>
                        <Text testID={props.testID + `::${index}::SectionParagraph`} variant={"titleMedium"}
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
                props.onClick ? props.onClick(item) : uiLogger.warn('Missing onClick handler in renderAsClickableList');
            }}>
                <Text style={typoStyles.paragraph}>{item}</Text>
            </TouchableOpacity>
        )
    }


    return (
        <View>
            {props.title ? <Text testID={props.testID + "::Title"} variant={"headlineSmall"}
                                 style={recipeTextRenderStyles.containerElement}>{props.title}</Text> : null}
            {selectRender(props.render)}
        </View>
    )

}
