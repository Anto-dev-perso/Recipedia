import React from "react";
import {Button, Text, View} from "react-native";
import {RecipeTextRenderProps} from "@components/organisms/RecipeTextRender";


export function recipeTextRenderMock(recipeTextRenderProp: RecipeTextRenderProps) {
    return (
        <View>
            {recipeTextRenderProp.type === 'addOrEdit' ?
                <View>
                    <Text testID={recipeTextRenderProp.testID + "::ViewAddButton"}>
                        {JSON.stringify(recipeTextRenderProp.viewAddButton)}
                    </Text>
                    <Text testID={recipeTextRenderProp.testID + "::PrefixText"}>
                        {JSON.stringify(recipeTextRenderProp.prefixText)}
                    </Text>
                    <Text testID={recipeTextRenderProp.testID + "::SuffixText"}>
                        {JSON.stringify(recipeTextRenderProp.suffixText)}
                    </Text>
                    {recipeTextRenderProp.editType === 'add' ?
                        <View>
                            <Text testID={recipeTextRenderProp.testID + "::Flex"}>
                                {JSON.stringify(recipeTextRenderProp.flex)}
                            </Text>
                            <Text testID={recipeTextRenderProp.testID + "::AlignItems"}>
                                {JSON.stringify(recipeTextRenderProp.alignItems)}
                            </Text>
                            <Button testID={recipeTextRenderProp.testID + "::OpenModal"}
                                    onPress={() => {
                                        // @ts-ignore always edit here
                                        recipeTextRenderProp.openModal();
                                    }}
                                    title="Set Text to Edit"/>
                        </View>
                        :
                        <View>
                            <Text testID={recipeTextRenderProp.testID + "::TextEditable"}>
                                {JSON.stringify(recipeTextRenderProp.textEditable)}
                            </Text>
                            <Text testID={recipeTextRenderProp.testID + "::RenderType"}>
                                {JSON.stringify(recipeTextRenderProp.renderType)}
                            </Text>
                            <Button testID={recipeTextRenderProp.testID + "::TextEdited"} onPress={(newText) => {
                                // @ts-ignore can't pass in a string into a onPress but let it go for testing
                                recipeTextRenderProp.textEdited(0, recipeTextRenderProp.textEditable[0] + newText)
                            }} title="Set Text to Edit"/>
                            {recipeTextRenderProp.columnTitles ?
                                <View>
                                    <Text testID={recipeTextRenderProp.testID + "::Column1"}>
                                        {JSON.stringify(recipeTextRenderProp.columnTitles.column1)}
                                    </Text>
                                    <Text testID={recipeTextRenderProp.testID + "::Column2"}>
                                        {JSON.stringify(recipeTextRenderProp.columnTitles.column2)}
                                    </Text>
                                    <Text testID={recipeTextRenderProp.testID + "::Column3"}>
                                        {JSON.stringify(recipeTextRenderProp.columnTitles.column3)}
                                    </Text>
                                </View>
                                : null}
                        </View>
                    }
                </View>
                :
                <View>
                    <Text testID={recipeTextRenderProp.testID + "::Text"}>
                        {JSON.stringify(recipeTextRenderProp.text)}
                    </Text>
                    <Text testID={recipeTextRenderProp.testID + "::Title"}>
                        {JSON.stringify(recipeTextRenderProp.title)}
                    </Text>
                    <Text testID={recipeTextRenderProp.testID + "::Render"}>
                        {JSON.stringify(recipeTextRenderProp.render)}
                    </Text>
                    <Text testID={recipeTextRenderProp.testID + "::WithBorder"}>
                        {JSON.stringify(recipeTextRenderProp.editText?.withBorder)}
                    </Text>
                    <Button testID={recipeTextRenderProp.testID + "::OnClick"}
                            onPress={() => {
                                // @ts-ignore onClick always define here
                                recipeTextRenderProp.onClick()
                            }} title="On Click"/>
                    <Button testID={recipeTextRenderProp.testID + "::OnChangeFunction"}
                            onPress={() => {
                                // @ts-ignore onCLick always define here
                                recipeTextRenderProp.editText.onChangeFunction(recipeTextRenderProp.text[0], recipeTextRenderProp.text[0] + ' edited')
                            }} title="Edit Text"/>
                </View>

            }
        </View>
    );
}
