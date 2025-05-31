import React, {useState} from "react";
import {RecipeScreenProp} from '@customTypes/ScreenTypes';
import {
    extractIngredientsNameWithQuantity,
    extractTagsName,
    ingredientTableElement,
    ingredientType,
    recipeColumnsNames,
    recipeTableElement,
    tagTableElement
} from "@customTypes/DatabaseElementTypes";
import BottomTopButton from "@components/molecules/BottomTopButton";
import {SafeAreaView, ScrollView, View} from "react-native";
import {BottomTopButtonOffset, bottomTopPosition, LargeButtonDiameter, rectangleButtonHeight} from "@styles/buttons";
import {scrollView} from "@styles/spacing";
import RecipeImage, {RecipeImageProps} from "@components/organisms/RecipeImage";
import {Icons} from "@assets/Icons";
import RecipeTextRender, {RecipeTextRenderProps} from "@components/organisms/RecipeTextRender";
import RecipeText, {RecipeTextProps, TextProp} from "@components/organisms/RecipeText";
import {textSeparator, typoRender, unitySeparator} from "@styles/typography";
import RecipeDatabase from "@utils/RecipeDatabase";
import RecipeTags, {RecipeTagProps} from "@components/organisms/RecipeTags";
import {alertUserChoice, AsyncAlert} from "@utils/AsyncAlert";
import FileGestion from "@utils/FileGestion";
import RectangleButton from "@components/atomic/RectangleButton";
import RoundButton from "@components/atomic/RoundButton";
import {extractFieldFromImage} from "@utils/OCR";
import RecipeNumber, {RecipeNumberProps} from "@components/organisms/RecipeNumber";
import {defaultValueNumber} from "@utils/Constants";
import {useTheme} from "react-native-paper";
import ModalImageSelect from "@screens/ModalImageSelect";
import {cropImage} from "@utils/ImagePicker";
import {useI18n} from "@utils/i18n";

export enum recipeStateType {readOnly, edit, addManual, addOCR}

export type readRecipe = { mode: "readOnly", recipe: recipeTableElement }

export type editRecipeManually = { mode: "edit", recipe: recipeTableElement }

export type addRecipeManually = { mode: "addManually" }

export type addRecipeFromPicture = { mode: "addFromPic", imgUri: string }


export type RecipePropType = readRecipe | editRecipeManually | addRecipeManually | addRecipeFromPicture


export default function Recipe({route, navigation}: RecipeScreenProp) {
    const {t} = useI18n();

    const {colors} = useTheme();

    const props: RecipePropType = route.params;
    const initStateFromProp = (props.mode === "readOnly" || (props.mode === "edit"));
    const tags = RecipeDatabase.getInstance().searchRandomlyTags(3).map(element => element.name);

    function convertModeFromProps() {
        switch (props.mode) {
            case "readOnly":
                return recipeStateType.readOnly;
            case "edit":
                return recipeStateType.edit;
            case "addManually":
                return recipeStateType.addManual;
            case "addFromPic":
                return recipeStateType.addOCR;
        }
    }

    const [stackMode, setStackMode] = useState(convertModeFromProps());
    const [recipeImage, setRecipeImage] = useState(initStateFromProp ? props.recipe.image_Source : "");
    const [recipeTitle, setRecipeTitle] = useState(initStateFromProp ? props.recipe.title : "");
    const [recipeDescription, setRecipeDescription] = useState(initStateFromProp ? props.recipe.description : "");
    const [recipeTags, setRecipeTags] = useState(initStateFromProp ? props.recipe.tags : new Array<tagTableElement>());
    const [recipePersons, setRecipePersons] = useState(initStateFromProp ? props.recipe.persons : defaultValueNumber);
    const [recipeIngredients, setRecipeIngredients] = useState(initStateFromProp ? props.recipe.ingredients : new Array<ingredientTableElement>());
    const [recipePreparation, setRecipePreparation] = useState(initStateFromProp ? props.recipe.preparation : new Array<string>());
    const [recipeTime, setRecipeTime] = useState(initStateFromProp ? props.recipe.time : defaultValueNumber);
    const [imgForOCR, setImgForOCR] = useState(props.mode === "addFromPic" ? new Array<string>(props.imgUri) : new Array<string>());
    const [randomTags, setRandomTags] = useState(tags);

    const [modalField, setModalField] = useState<recipeColumnsNames | undefined>(undefined);
    const [recipePersonsManuallyEdited, setRecipePersonsManuallyEdited] = useState(false);
    const [recipeTimeManuallyEdited, setRecipeTimeManuallyEdited] = useState(false);


    async function onDelete() {
        switch (stackMode) {
            case recipeStateType.readOnly:
            case recipeStateType.edit:
                const choice = await AsyncAlert(t('deleteRecipe'), `${t('confirmDelete')} ${recipeTitle}?`, t('save'), t('cancel'));
                if (choice === alertUserChoice.ok) {
                    let msg: string;
                    //@ts-ignore params.recipe exist because we already checked with switch
                    if (!await RecipeDatabase.getInstance().deleteRecipe(this.props.route.params.recipe)) {
                        msg = `${t('errorOccurred')} ${t('deleteRecipe')} ${recipeTitle}`;
                    } else {
                        msg = `${t('recipe')} ${recipeTitle} ${t('delete')} ${t('success')}`;
                    }
                    const promiseReturn = AsyncAlert(t('deleteRecipe'), msg, t('ok'));

                }
                break;
            case recipeStateType.addManual:
            case recipeStateType.addOCR:
                const message = "Call onDelete on mode " + stackMode + " which is not possible";
                const promiseReturn = AsyncAlert(t('deleteRecipe'), message, t('ok'));
                break;
        }
        navigation.goBack();
    }

    // TODO let the possibility to add manually the field

    function removeTag(tag: string) {
        setRecipeTags(recipeTags.filter(tagElement => tagElement.name !== tag));
    }

    function addTag(newTag: string) {
        setRecipeTags([...recipeTags, {name: newTag}]);
    }

    // TODO to rework
    function editIngredients(oldIngredientId: number, newIngredient: string) {
        const ingredientCopy: Array<ingredientTableElement> = recipeIngredients.map(ingredient => ({...ingredient}));
        if (oldIngredientId < 0 || oldIngredientId > ingredientCopy.length) {
            console.warn("Can't find ingredient at index ", oldIngredientId, " for edit");
            return;
        }

        // ${newQuantity}${unitySeparator}${unit}${textSeparator}${ingName}
        const [unitAndQuantity, newName] = newIngredient.split(textSeparator);
        const [newQuantity, newUnit] = unitAndQuantity.split(unitySeparator);

        // Copy to avoid editing the original array (needed anyway for useState)
        const foundIngredient = ingredientCopy[oldIngredientId];
        if (foundIngredient.name !== newName) {
            foundIngredient.name = newName;
        }
        if (foundIngredient.quantity !== newQuantity) {
            foundIngredient.quantity = newQuantity;
        }
        if (foundIngredient.unit !== newUnit) {
            foundIngredient.unit = newUnit;
        }

        if (foundIngredient.unit === "") {
            const ingredientExist = RecipeDatabase.getInstance().get_ingredients().find(ingredient => ingredient.name.toLowerCase() === newName.toLowerCase());
            if (ingredientExist) {
                foundIngredient.unit = ingredientExist.unit;
            }
        }
        setRecipeIngredients(ingredientCopy);
    }

    function addNewIngredient() {
        setRecipeIngredients([...recipeIngredients, {
            name: '',
            unit: '',
            quantity: "",
            type: ingredientType.undefined,
            season: []
        }]);
    }

    function editPreparation(oldPreparationId: number, newPreparation: string) {

        if (oldPreparationId < 0 || oldPreparationId > recipePreparation.length) {
            console.warn(`editPreparation:: Can't find old preparation at index: ${oldPreparationId}`);
            return;
        }
        const newPreparationArray = new Array(...recipePreparation);
        newPreparationArray[oldPreparationId] = newPreparation;
        setRecipePreparation(newPreparationArray);
    }

    function addNewPreparationStep() {
        setRecipePreparation([...recipePreparation, '']);
    }

    function createRecipeFromStates(): recipeTableElement {
        return {
            id: (props.mode === 'readOnly' ? props.recipe.id : undefined),
            image_Source: recipeImage,
            title: recipeTitle,
            description: recipeDescription,
            tags: recipeTags,
            persons: recipePersons,
            ingredients: recipeIngredients,
            season: initStateFromProp ? props.recipe.season : new Array<string>(),
            preparation: recipePreparation,
            time: recipeTime,
        }
    }

    async function readOnlyValidation() {
        await RecipeDatabase.getInstance().addRecipeToShopping(createRecipeFromStates());
        navigation.goBack();
        await AsyncAlert(t('success'), `${t('recipe')} "${recipeTitle}" ${t('addedToShoppingList')}`, t('ok'));
    }

    async function editValidation() {
        // @ts-ignore No need to wait for clearCache
        FileGestion.getInstance().clearCache();

        // TODO add safety to this (we won't let the user do anything)
        await RecipeDatabase.getInstance().editRecipe(createRecipeFromStates());
        setStackMode(recipeStateType.readOnly);
    }

    // TODO checking if tags aren't in doublons
    // TODO checking if ingredients aren't in doublons
    //  TODO checking if persons, time or ingredients aren't null
    // TODO ingredient quantity shouldn't be null
    async function addValidation() {
        const missingElem = new Array<string>();

        // TODO image not implemented
        // if (this.state.recipeImage.length == 0) {
        //     missingElem.push("an image");
        // }
        if (recipeTitle.length == 0) {
            missingElem.push("a title");
        }
        if (recipeIngredients.length == 0) {
            missingElem.push("some ingredients");
        }
        if (recipePreparation.length == 0) {
            missingElem.push("some instructions for the preparation");
        }
        if (recipePersons == defaultValueNumber) {
            missingElem.push("for how many persons this recipe is");
        }

        // No mandatory elements missing
        if (missingElem.length == 0) {
            // TODO avoid try/catch here
            try {
                // TODO deal case where 2 recipes share the same title. Is it allowed ?
                const newUri = await FileGestion.getInstance().saveRecipeImage(recipeImage, recipeTitle);
                let recipeToAdd = createRecipeFromStates();
                // TODO can't we get rid of this local variable and directly use the states ?
                const uriSplit = (newUri as string).split("/");
                recipeToAdd.image_Source = uriSplit[uriSplit.length - 1];

                // @ts-ignore No need to wait
                FileGestion.getInstance().clearCache();

                await RecipeDatabase.getInstance().addRecipe(recipeToAdd);
                navigation.goBack();
                await AsyncAlert("SUCCESSFULLY ADDED RECIPE TO DATABASE", `Recipe titled "${recipeToAdd.title}" has been successfully added to the database`, "Understood");
            } catch (error) {
                console.warn("addValidation: Something went wrong when validating new recipe : ", error)
            }


        }
        // TODO the AsyncAlert dialog preparation should be a dedicated function for readiness
        else if (missingElem.length == 5) {
            await AsyncAlert("All elements missing", "You haven't add any of the elements to your recipe. Please enter before validate at least: \
            \n\t- an image\n\t- a title\n\t- some ingredients\n\t- for how many persons this recipe is\n\t- some instructions for the preparation");
        } else {
            let alertTitle: string;
            let alertMsg: string;
            if (missingElem.length == 1) {
                alertTitle = t('alerts.missingElements.titleSingular');
                alertMsg = "You're missing " + missingElem[0] + " to your recipe. Please add this before validate.";
                alertMsg = t('alerts.missingElements.messageSingularBeginning') + missingElem[0] + t('alerts.missingElements.messageSingularEnding');
            } else {
                alertTitle = t('alerts.missingElements.titlePlural');
                alertMsg = t('alerts.missingElements.messagePlural');
                for (const elem of missingElem) {
                    alertMsg += `\n\t- ${elem}`;
                }
            }
            await AsyncAlert(alertTitle, alertMsg, "Understood")
        }
    }

    async function fillOneField(uri: string, field: recipeColumnsNames) {
        const newFieldData = await extractFieldFromImage(uri, field, {
            recipePreparation: recipePreparation,
            recipePersons: recipePersons,
            recipeIngredients: recipeIngredients,
            recipeTags: recipeTags,
        }, (msg) => {
            console.warn("OCR warning:", msg);
        });
        if (newFieldData.recipeImage) {
            setRecipeImage(newFieldData.recipeImage);
        }
        if (newFieldData.recipeTitle) {
            setRecipeTitle(newFieldData.recipeTitle);
        }
        if (newFieldData.recipeDescription) {
            setRecipeDescription(newFieldData.recipeDescription);
        }
        if (newFieldData.recipeTags) {
            setRecipeTags(newFieldData.recipeTags);
        }
        if (newFieldData.recipePreparation) {
            setRecipePreparation(newFieldData.recipePreparation);
        }
        if (newFieldData.recipePersons) {
            setRecipePersons(newFieldData.recipePersons);
        }
        if (newFieldData.recipeTime) {
            setRecipeTime(newFieldData.recipeTime);
        }
        if (newFieldData.recipeIngredients) {
            setRecipeIngredients(newFieldData.recipeIngredients);
        }
    }

    function openModalForField(field: recipeColumnsNames) {
        setModalField(field);
    }

    function recipeImageProp(): RecipeImageProps {
        const defaultReturn: RecipeImageProps = {imgUri: recipeImage, openModal: openModalForField};
        switch (stackMode) {
            case recipeStateType.readOnly:
                return defaultReturn;
            case recipeStateType.edit:
            case recipeStateType.addManual:
                return {...defaultReturn, buttonIcon: Icons.cameraIcon};
            case recipeStateType.addOCR:
                return {...defaultReturn, buttonIcon: Icons.scanImageIcon};
            default:
                console.warn("recipeImageProp: Unknown stackMode");
                return {
                    imgUri: "", openModal: () => {
                        console.warn("recipeImageProp: Unknown stackMode")
                    }
                };
        }
    }

    function recipeTitleProp(): RecipeTextProps {
        const titleTestID = 'RecipeTitle';
        const titleRootText: TextProp = {
            style: stackMode == recipeStateType.readOnly ? 'headline' : 'title',
            value: stackMode == recipeStateType.readOnly ? recipeTitle : t('title') + ':'
        };
        switch (stackMode) {
            case recipeStateType.readOnly:
                return {
                    testID: titleTestID,
                    rootText: titleRootText,
                };
            case recipeStateType.addOCR:
                if (recipeTitle.length == 0) {
                    return {
                        testID: titleTestID,
                        rootText: titleRootText,
                        addOrEditProps: {editType: 'add', openModal: () => openModalForField(recipeColumnsNames.title),}
                    };
                }
            // Else return the same props as edit or addManual
            case recipeStateType.edit:
            case recipeStateType.addManual:
                return {
                    testID: titleTestID,
                    rootText: titleRootText,
                    addOrEditProps: {
                        editType: 'editable',
                        textEditable: recipeTitle,
                        setTextToEdit: setRecipeTitle,
                    }
                };
            default:
                console.warn("recipeTitleProp: Unknown stackMode");
                return {rootText: {style: 'paragraph', value: ''}};
        }
    }

    function recipeDescriptionProp(): RecipeTextProps {
        const descriptionTestID = 'RecipeDescription';
        const descriptionRootText: TextProp = {
            style: stackMode == recipeStateType.readOnly ? 'paragraph' : 'title',
            value: stackMode == recipeStateType.readOnly ? recipeDescription : t('Description') + ':'
        };
        switch (stackMode) {
            case recipeStateType.readOnly:
                return {rootText: descriptionRootText, testID: descriptionTestID};
            case recipeStateType.addOCR:
                if (recipeDescription.length == 0) {
                    return {
                        rootText: descriptionRootText, testID: descriptionTestID,
                        addOrEditProps: {
                            editType: 'add',
                            openModal: () => openModalForField(recipeColumnsNames.description)
                        }
                    };
                }
            // Else return the same props as edit or addManual
            case recipeStateType.edit:
            case recipeStateType.addManual:
                return {
                    rootText: descriptionRootText, testID: descriptionTestID,
                    addOrEditProps: {
                        editType: 'editable',
                        textEditable: recipeDescription,
                        setTextToEdit: setRecipeDescription,
                    }
                };

            default:
                console.warn("recipeDescriptionProp: Unknown stackMode");
                return {rootText: {style: 'paragraph', value: ''}};
        }
    }

    function recipeTagsProp(): RecipeTagProps {
        const tagsExtracted = extractTagsName(recipeTags);
        const editProps: RecipeTagProps = {
            tagsList: tagsExtracted,
            type: 'addOrEdit',
            editType: "edit",
            randomTags: randomTags.join(', '),
            addNewTag: addTag,
            removeTag: removeTag,
        };
        switch (stackMode) {
            case recipeStateType.readOnly:
                return {type: 'readOnly', tagsList: tagsExtracted};
            case recipeStateType.addOCR:
                return {...editProps, editType: 'add', openModal: () => openModalForField(recipeColumnsNames.tags)};
            case recipeStateType.edit:
            case recipeStateType.addManual:
                return editProps;
            default:
                console.warn("recipeTagsProp: Unknown stackMode");
                return {tagsList: [], type: 'readOnly'}
        }
    }

    function recipePersonsProp(): RecipeNumberProps {
        const personTestID = 'RecipePersons';
        switch (stackMode) {
            case recipeStateType.readOnly:
                return {
                    testID: personTestID,
                    numberProps: {
                        editType: 'read',
                        text: t('ingredientReadOnlyBeforePerson') + recipePersons + t('ingredientReadOnlyAfterPerson')
                    }
                };
            case recipeStateType.addOCR:
                if (!recipePersonsManuallyEdited && recipePersons === defaultValueNumber) {
                    return {
                        testID: personTestID,
                        numberProps: {
                            editType: 'add',
                            prefixText: t('personPrefixOCR'),
                            openModal: () => openModalForField(recipeColumnsNames.persons),
                            manuallyFill: () => setRecipePersonsManuallyEdited(true),
                        }
                    };
                }
            // Else return the same props as edit or addManual
            case recipeStateType.edit:
            case recipeStateType.addManual:
                return {
                    testID: personTestID,
                    numberProps: {
                        editType: 'editable',
                        textEditable: recipePersons,
                        prefixText: t('personPrefixEdit'),
                        suffixText: t('personSuffixEdit'),
                        setTextToEdit: setRecipePersons,
                    }
                };
            default:
                console.warn("recipePersonsProp: Unknown stackMode");
                return {
                    testID: personTestID,
                    numberProps: {editType: 'read', text: ''}
                };
        }
    }

    function recipeTimeProp(state: recipeStateType = stackMode): RecipeNumberProps {
        const personTestID = 'RecipeTime';
        switch (state) {
            case recipeStateType.readOnly:
                return {
                    testID: personTestID,
                    numberProps: {
                        editType: 'read',
                        text: t('timeReadOnlyBeforePerson') + recipeTime + t('timeReadOnlyAfterPerson')
                    }
                };
            case recipeStateType.addOCR:
                if (!recipeTimeManuallyEdited && recipeTime === defaultValueNumber) {
                    return {
                        testID: personTestID,
                        numberProps: {
                            editType: 'add',
                            prefixText: t('personPrefixOCR'),
                            openModal: () => openModalForField(recipeColumnsNames.time),
                            manuallyFill: () => setRecipeTimeManuallyEdited(true),
                        }
                    };
                }
            // Else return the same props as edit or addManual
            case recipeStateType.edit:
            case recipeStateType.addManual:
                return {
                    testID: personTestID,
                    numberProps: {
                        editType: 'editable',
                        textEditable: recipeTime,
                        prefixText: t('timePrefixEdit'),
                        suffixText: t('timeSuffixEdit'),
                        setTextToEdit: setRecipeTime,
                    }
                };
            default:
                console.warn("recipePersonsProp: Unknown stackMode");
                return {
                    testID: personTestID,
                    numberProps: {editType: 'read', text: ''}
                };
        }
    }

    function recipeIngredientsProp(): RecipeTextRenderProps {
        const ingredientPrefixText = t('ingredients') + ': ';
        const ingredientRender: typoRender = typoRender.ARRAY;
        const extractedIngredients = extractIngredientsNameWithQuantity(recipeIngredients);
        const ingredientTestID = 'RecipeIngredients';
        switch (stackMode) {
            case recipeStateType.readOnly:
                return {
                    testID: ingredientTestID,
                    type: 'readOnly',
                    text: extractedIngredients,
                    render: ingredientRender
                };
            case recipeStateType.addOCR:
                if (recipeIngredients.length == 0) {
                    return {
                        testID: ingredientTestID,
                        type: 'addOrEdit',
                        editType: 'add',
                        prefixText: ingredientPrefixText,
                        openModal: () => openModalForField(recipeColumnsNames.ingredients),
                    };
                }
            // Else return the same props as edit or addManual
            case recipeStateType.edit:
            case recipeStateType.addManual:
                return {
                    testID: ingredientTestID,
                    type: 'addOrEdit',
                    editType: 'editable',
                    prefixText: ingredientPrefixText,
                    columnTitles: {
                        column1: t('quantity'),
                        column2: t('unit'),
                        column3: t('ingredientName'),
                    },
                    renderType: typoRender.ARRAY,
                    textEditable: extractedIngredients,
                    textEdited: editIngredients,
                    addNewText: addNewIngredient,
                };
            default:
                console.warn("recipeIngredientsProp: Unknown stackMode");
                return {
                    testID: ingredientTestID,
                    type: 'readOnly',
                    text: [],
                    render: typoRender.LIST
                };
        }
    }

    function recipePreparationProp(): RecipeTextRenderProps {
        const preparationRender: typoRender = typoRender.SECTION;
        const preparationTestID = 'RecipePreparation';
        switch (stackMode) {
            case recipeStateType.readOnly:
                return {
                    testID: preparationTestID,
                    type: 'readOnly',
                    text: recipePreparation,
                    render: preparationRender
                };
            case recipeStateType.addOCR:
                if (recipePreparation.length == 0) {
                    return {
                        testID: preparationTestID,
                        type: 'addOrEdit',
                        editType: 'add',
                        prefixText: t('preparationReadOnly'),
                        openModal: () => openModalForField(recipeColumnsNames.preparation),
                    };
                }
            // Else return the same props as edit or addManual
            case recipeStateType.edit:
            case recipeStateType.addManual:
                return {
                    testID: preparationTestID,
                    type: 'addOrEdit',
                    editType: 'editable',
                    renderType: preparationRender,
                    textEditable: recipePreparation,
                    textEdited: editPreparation,
                    addNewText: addNewPreparationStep,
                };
            default:
                console.warn("recipePreparationProp: Unknown stackMode");
                return {
                    testID: preparationTestID,
                    type: 'readOnly',
                    text: [],
                    render: typoRender.LIST
                };
        }
    }

    function recipeValidationButtonProps(): [string, () => Promise<void>] {
        switch (stackMode) {
            case recipeStateType.readOnly:
                return [t('validateReadOnly'), readOnlyValidation];
            case recipeStateType.edit:
                return [t('validateEdit'), editValidation];
            case recipeStateType.addManual:
            case recipeStateType.addOCR:
                return [t('validateAdd'), addValidation];
            default:
                console.warn("recipeValidationButtonProps: Unknown stackMode");
                return ["", async () => console.warn("Error: Unknown stackMode")];
        }
    }

    const [validationButtonText, validationFunction] = recipeValidationButtonProps();

    return (
        <SafeAreaView style={{backgroundColor: colors.background}}>
            <ScrollView horizontal={false} showsVerticalScrollIndicator={false}
                        style={scrollView(rectangleButtonHeight).view} keyboardShouldPersistTaps={"handled"}
                        nestedScrollEnabled={true}>

                {/*Image*/}
                <RecipeImage {...recipeImageProp()}/>

                {/*Title*/}
                <RecipeText {...recipeTitleProp()}/>

                {/*Description*/}
                <RecipeText {...recipeDescriptionProp()}/>

                {/*Tags*/}
                <RecipeTags {...recipeTagsProp()} />

                {/*Persons*/}
                <RecipeNumber {...recipePersonsProp()}/>

                {/*Ingredients*/}
                <RecipeTextRender {...recipeIngredientsProp()} />

                {/* TODO let the possibility to add another time in picture */}
                {/*Time*/}
                <RecipeNumber {...recipeTimeProp()}/>

                {/*Preparation*/}
                <RecipeTextRender {...recipePreparationProp()} />

                {/* Add some space to avoid missing clicking */}
                <View style={{paddingVertical: LargeButtonDiameter / 2}}/>

                {/* TODO add nutrition */}
            </ScrollView>
            {/*TODO add a generic component to tell which bottom button we want*/}
            <BottomTopButton testID={'BackButton'} as={RoundButton} position={bottomTopPosition.top_left}
                             buttonOffset={0} size={"medium"}
                             onPressFunction={() => navigation.goBack()} icon={Icons.backIcon}/>

            {stackMode == recipeStateType.readOnly ?
                <>
                    <BottomTopButton testID={'RecipeDelete'} as={RoundButton}
                                     position={bottomTopPosition.top_right}
                                     buttonOffset={0}
                                     onPressFunction={() => onDelete()}
                                     size={"medium"} icon={Icons.trashIcon}/>
                    <BottomTopButton testID={'RecipeEdit'} as={RoundButton}
                                     position={bottomTopPosition.bottom_right}
                                     buttonOffset={BottomTopButtonOffset}
                                     onPressFunction={() => setStackMode(recipeStateType.edit)}
                                     size={"medium"} icon={Icons.pencilIcon}/>
                </>
                : null}

            <BottomTopButton testID={'RecipeValidate'} as={RectangleButton} position={bottomTopPosition.bottom_full}
                             text={validationButtonText} centered={true} border={false}
                             onPressFunction={async () => await validationFunction()}/>
            {modalField ?
                <ModalImageSelect arrImg={imgForOCR} onSelectFunction={async (imgSelected: string) => {
                    const croppedUri = await cropImage(imgSelected, colors);
                    if (croppedUri.length > 0) {
                        fillOneField(croppedUri, modalField);
                        setModalField(undefined);
                    }
                }} onDismissFunction={() => setModalField(undefined)}
                                  onImagesUpdated={(imageUri: string) => setImgForOCR([...imgForOCR, imageUri])}/> : null}
        </SafeAreaView>
    )
}
