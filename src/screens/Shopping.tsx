import {shoppingListTableElement} from "@customTypes/DatabaseElementTypes";
import {useFocusEffect} from "@react-navigation/native";
import React, {useState} from "react";
import {SectionList, StyleProp, TextStyle, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {ShoppingScreenProp} from '@customTypes/ScreenTypes';
import RecipeDatabase from "@utils/RecipeDatabase";
import {Checkbox, Divider, List, Text, useTheme} from "react-native-paper";
import {useI18n} from "@utils/i18n";
import {ShoppingAppliedToDatabase, shoppingCategories, TListFilter} from "@customTypes/RecipeFiltersTypes";
import BottomTopButton from "@components/molecules/BottomTopButton";
import RoundButton from "@components/atomic/RoundButton";
import {bottomTopPosition} from "@styles/buttons";
import {Icons} from "@assets/Icons";
import {AsyncAlert} from "@utils/AsyncAlert";

export default function Shopping({navigation, route}: ShoppingScreenProp) {
    const {t} = useI18n();
    const {colors, fonts} = useTheme();

    const [shoppingList, setShoppingList] = useState(new Array<shoppingListTableElement>());

    useFocusEffect(() => {
        navigation.addListener('focus', () => {
            setShoppingList([...RecipeDatabase.getInstance().get_shopping()]);
        });
    });

    const sections = shoppingCategories
        .map(category => {
            return {
                title: category,
                data: shoppingList.filter(item => item.type === category)
            } as ShoppingAppliedToDatabase;
        })
        .filter(section => section.data.length > 0);

    const screenId = "ShoppingScreen";
    const sectionId = screenId + "::SectionList";

    function updateShoppingList(ingredientName: string) {
        const newShoppingList = shoppingList.map(item => item);

        const ingToEdit = shoppingList.find(item => item.name === ingredientName);
        if (ingToEdit !== undefined) {
            ingToEdit.purchased = !ingToEdit.purchased;
            if (ingToEdit.id !== undefined) {
                RecipeDatabase.getInstance().purchaseIngredientOfShoppingList(ingToEdit.id, ingToEdit.purchased).then(() => setShoppingList(newShoppingList));
            } else {
                console.warn(`updateShoppingList:: Shopping list ingredient named ${ingredientName} doesn't have an id`);
            }
        } else {
            console.warn(`updateShoppingList::Shopping list not found for ${ingredientName}`);
        }
    }

    async function clearShoppingList() {
        await RecipeDatabase.getInstance().resetShoppingList();
        setShoppingList([]);
    }

    function renderSectionHeader({section: {title}}: { section: { title: TListFilter } }) {
        const headerId = sectionId + "::" + title;
        return (
            <View>
                <List.Subheader testID={headerId + "::SubHeader"} style={{...fonts.titleMedium, color: colors.primary}}
                >{t(title)}</List.Subheader>
                <Divider testID={headerId + "::Divider"}/>
            </View>
        )
    }

    function renderItem({item}: { item: shoppingListTableElement }) {

        const recipesCount = item.recipesTitle.length;
        const recipesText = recipesCount > 1
            ? `${recipesCount} ${t('recipes')}`
            : recipesCount === 1
                ? `1 ${t('recipe')}`
                : '';

        const textStyle: StyleProp<TextStyle> = [{...fonts.bodyMedium}, item.purchased && {textDecorationLine: 'line-through'}];
        const itemTestId = sectionId + "::" + item.name;
        return (
            <List.Item testID={itemTestId}
                       title={item.name}
                       titleStyle={textStyle}
                       descriptionStyle={textStyle}
                       description={recipesText}
                       left={props => (<Checkbox status={item.purchased ? 'checked' : 'unchecked'}/>)}
                       onPress={() => updateShoppingList(item.name)}
                       onLongPress={() => {
                           if (item.recipesTitle.length > 0) {
                               const recipesList = item.recipesTitle.map(title => `\n\t- ${title}`).join('');

                               const alertTitle = t('recipeUsingTitle') + ' ' + item.name.toLocaleLowerCase();
                               const alertMessage = t('recipeUsingMessage') + ' :' + recipesList;
                               // TODO to replace by a Dialog from react-native-paper
                               AsyncAlert(alertTitle, alertMessage, t('recipeUsingValidation'));
                           }
                       }}
            />
        );
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
            {shoppingList.length === 0 ? (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                    <Text variant="titleMedium">{t('noItemsInShoppingList')}</Text>
                </View>
            ) : (
                <SectionList testID={sectionId}
                             sections={sections}
                             keyExtractor={(item) => item.id?.toString() || item.name}
                             renderItem={renderItem}
                             renderSectionHeader={renderSectionHeader}
                             stickySectionHeadersEnabled={false}
                />
            )}
            <BottomTopButton testID={screenId + "::ClearShoppingListButton"}
                             as={RoundButton}
                             position={bottomTopPosition.top_right}
                             size={"medium"}
                             icon={Icons.trashIcon}
                             onPressFunction={clearShoppingList}
            />
        </SafeAreaView>
    );
}
