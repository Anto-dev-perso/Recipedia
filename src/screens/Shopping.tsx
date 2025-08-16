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
import Alert from "@components/dialogs/Alert";
import {shoppingLogger} from '@utils/logger';

type ingredientDataForDialog = Pick<shoppingListTableElement, "name" | "recipesTitle">;

export default function Shopping({navigation}: ShoppingScreenProp) {
    const {t} = useI18n();
    const {colors, fonts} = useTheme();

    const [shoppingList, setShoppingList] = useState(new Array<shoppingListTableElement>());

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [ingredientDataForDialog, setIngredientDataForDialog] = useState<ingredientDataForDialog>({
        recipesTitle: [],
        name: ""
    });

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

    function createDialogTitle() {
        return t('recipeUsingTitle') + ' ' + ingredientDataForDialog.name.toLowerCase();
    }

    function createDialogContent() {
        return t('recipeUsingMessage') + ' :' + ingredientDataForDialog.recipesTitle.map(title => `\n\t- ${title}`).join('');
    }

    function updateShoppingList(ingredientName: string) {
        const newShoppingList = shoppingList.map(item => item);

        const ingToEdit = shoppingList.find(item => item.name === ingredientName);
        if (ingToEdit !== undefined) {
            ingToEdit.purchased = !ingToEdit.purchased;
            if (ingToEdit.id !== undefined) {
                RecipeDatabase.getInstance().purchaseIngredientOfShoppingList(ingToEdit.id, ingToEdit.purchased).then(() => setShoppingList(newShoppingList));
            } else {
                shoppingLogger.warn('Shopping list ingredient missing ID', { ingredientName });
            }
        } else {
            shoppingLogger.warn('Shopping list ingredient not found', { ingredientName });
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
                           setIngredientDataForDialog(item);
                           setIsDialogOpen(true)
                       }}/>);
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
            {shoppingList.length === 0 ? (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                    <Text testID={screenId + "::TextNoItem"} variant="titleMedium">{t('noItemsInShoppingList')}</Text>
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

            <Alert isVisible={isDialogOpen} confirmText={t('recipeUsingValidation')} content={createDialogContent()}
                   testId={screenId}
                   title={createDialogTitle()} onClose={() => {
                setIsDialogOpen(false);
                setIngredientDataForDialog({name: "", recipesTitle: []})
            }}/>
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
