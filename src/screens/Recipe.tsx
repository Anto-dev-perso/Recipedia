import React, {useEffect, useRef, useState} from "react";
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
import Alert, {AlertProps} from "@components/dialogs/Alert";
import {getDefaultPersons} from "@utils/settings";
import {scaleQuantityForPersons} from "@utils/Quantity";
import SimilarityDialog, {SimilarityDialogProps} from "@components/dialogs/SimilarityDialog";
import {recipeLogger, validationLogger, ocrLogger} from '@utils/logger';

export enum recipeStateType {readOnly, edit, addManual, addOCR}

export type readRecipe = { mode: "readOnly", recipe: recipeTableElement }

export type editRecipeManually = { mode: "edit", recipe: recipeTableElement }

export type addRecipeManually = { mode: "addManually" }

export type addRecipeFromPicture = { mode: "addFromPic", imgUri: string }


export type RecipePropType = readRecipe | editRecipeManually | addRecipeManually | addRecipeFromPicture

type SimilarityDialogPropsPicked = Pick<SimilarityDialogProps, "isVisible" | "item">;
const defaultSimilarityDialogPropsPicked: SimilarityDialogPropsPicked = {
    isVisible: false,
    item: {
        type: "Tag", newItemName: "", onConfirm: (tag => {
            throw new Error("onConfirm callback calls on default prop. This should not be possible")
        })
    }
};

type ValidationDialogProps = Pick<AlertProps, "title" | "content" | "confirmText" | "cancelText" | "onConfirm" | "onCancel">;
const defaultValidationDialogProp: ValidationDialogProps = {title: "", content: "", confirmText: ""};


export default function Recipe({route, navigation}: RecipeScreenProp) {
    const {t} = useI18n();

    const {colors} = useTheme();

    const props: RecipePropType = route.params;
    const initStateFromProp = (props.mode === "readOnly" || (props.mode === "edit"));

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
    const [randomTags, setRandomTags] = useState(RecipeDatabase.getInstance().searchRandomlyTags(3).map(element => element.name));

    const [validationButtonText, validationFunction] = recipeValidationButtonProps();

    const [modalField, setModalField] = useState<recipeColumnsNames | undefined>(undefined);

    const [isValidationDialogOpen, setIsValidationDialogOpen] = useState(false);
    const [validationDialogProp, setValidationDialogProp] = useState(defaultValidationDialogProp);

    const [similarityDialog, setSimilarityDialog] = useState<SimilarityDialogPropsPicked>(defaultSimilarityDialogPropsPicked);

    const previousPersonsRef = useRef<number>(recipePersons);

    useEffect(() => {
        const loadDefaultPersons = async () => {
            if (!initStateFromProp) {
                const defaultPersons = await getDefaultPersons();
                setRecipePersons(defaultPersons);
            }
        };

        loadDefaultPersons();
    }, [initStateFromProp]);

    useEffect(() => {
        const previousPersons = previousPersonsRef.current;
        const nextPersons = recipePersons;
        if (previousPersons > 0 && nextPersons > 0 && previousPersons !== nextPersons) {
            setRecipeIngredients(prevIngredients => prevIngredients.map(ing => ({
                ...ing,
                quantity: ing.quantity ? scaleQuantityForPersons(ing.quantity, previousPersons, nextPersons) : undefined,
            })));
        }
        previousPersonsRef.current = nextPersons;
    }, [recipePersons]);


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

    async function onDelete() {
        switch (stackMode) {
            case recipeStateType.readOnly:
            case recipeStateType.edit:
                setValidationDialogProp({
                    title: t('deleteRecipe'),
                    content: t('confirmDelete'),
                    confirmText: t('save'),
                    cancelText: t('cancel'),
                    onConfirm: async () => {
                        let dialogProps: ValidationDialogProps = {
                            title: t('deleteRecipe'),
                            confirmText: t('ok'),
                            onConfirm: () => {
                                navigation.goBack()
                            },
                            content: ""
                        };
                        //@ts-ignore params.recipe exist because we already checked with switch
                        if (!await RecipeDatabase.getInstance().deleteRecipe(props.recipe)) {
                            dialogProps.content = `${t('errorOccurred')} ${t('deleteRecipe')} ${recipeTitle}`;
                        } else {
                            dialogProps.content = `${t('recipe')} ${recipeTitle} ${t('delete')} ${t('success')}`;
                        }
                        setValidationDialogProp(dialogProps);
                        setIsValidationDialogOpen(true);
                    }
                });
                setIsValidationDialogOpen(true);
                break;
            case recipeStateType.addManual:
            case recipeStateType.addOCR:
                recipeLogger.warn('Delete operation not allowed in current mode', { stackMode });
                break;
        }
    }

    // TODO let the possibility to add manually the field

    function removeTag(tag: string) {
        setRecipeTags(recipeTags.filter(tagElement => tagElement.name !== tag));
    }

    async function addTag(newTag: string) {
        if (!newTag || newTag.trim().length === 0) {
            return;
        }

        if (recipeTags.some(tag => tag.name.toLowerCase() === newTag.toLowerCase())) {
            return;
        }

        const similarTags = RecipeDatabase.getInstance().findSimilarTags(newTag);

        // Check for exact match in database - if found, add it directly without showing dialog
        const exactMatch = similarTags.find(tag => tag.name.toLowerCase() === newTag.toLowerCase());
        if (exactMatch) {
            setRecipeTags([...recipeTags, exactMatch]);
            return;
        }

        // Show similarity dialog for new tags or similar matches
        setSimilarityDialog({
            isVisible: true,
            item: {
                type: 'Tag',
                newItemName: newTag,
                similarItem: similarTags.length > 0 ? similarTags[0] : undefined,
                onConfirm: (tag: tagTableElement) => {
                    setRecipeTags([...recipeTags, tag]);
                },
                onUseExisting: (tag: tagTableElement) => {
                    setRecipeTags([...recipeTags, tag]);
                }
            }
        });
    }


    function editIngredients(oldIngredientId: number, newIngredient: string) {
        if (oldIngredientId < 0 || oldIngredientId >= recipeIngredients.length) {
            recipeLogger.warn('Cannot edit ingredient - invalid index', { 
                oldIngredientId, 
                ingredientsCount: recipeIngredients.length 
            });
            return;
        }

        // ${newQuantity}${unitySeparator}${unit}${textSeparator}${ingName}
        const [unitAndQuantity, newName] = newIngredient.split(textSeparator);
        const [newQuantity, newUnit] = unitAndQuantity.split(unitySeparator);

        if (!newName || newName.trim().length === 0) {
            return;
        }

        const updateIngredient = (ingredient: ingredientTableElement) => {
            const ingredientCopy: Array<ingredientTableElement> = recipeIngredients.map(ingredient => ({...ingredient}));
            const foundIngredient = ingredientCopy[oldIngredientId];
            if (ingredient.id && foundIngredient.id !== ingredient.id) {
                foundIngredient.id = ingredient.id;
            }
            if (ingredient.name && foundIngredient.name !== ingredient.name) {
                foundIngredient.name = ingredient.name;
            }
            if (ingredient.unit && foundIngredient.unit !== ingredient.unit) {
                foundIngredient.unit = ingredient.unit;
            }
            if (ingredient.season.length > 0 && foundIngredient.season !== ingredient.season) {
                foundIngredient.season = ingredient.season;
            }
            if (ingredient.type !== ingredientType.undefined && foundIngredient.type !== ingredient.type) {
                foundIngredient.type = ingredient.type;
            }

            setRecipeIngredients(ingredientCopy);
        };

        // Check if ingredient name changed and validate it
        if (newName.trim().length > 0 && recipeIngredients[oldIngredientId].name !== newName) {
            const similarIngredients = RecipeDatabase.getInstance().findSimilarIngredients(newName);

            const exactMatch = similarIngredients.find(ing =>
                ing.name.toLowerCase() === newName.toLowerCase()
            );
            if (exactMatch) {
                updateIngredient(exactMatch);
                return;
            }

            const dismissCallback = () => {
                validationLogger.debug('Ingredient validation cancelled - removing ingredient');
                setRecipeIngredients(recipeIngredients.filter((_, index) => index !== oldIngredientId));
            };

            const onCloseCallback = (chosenIngredient: ingredientTableElement) => {
                validationLogger.debug('Updating ingredient with validated data', { 
                    ingredientName: chosenIngredient.name,
                    ingredientType: chosenIngredient.type
                });
                updateIngredient(chosenIngredient);
            };

            setSimilarityDialog({
                isVisible: true,
                item: {
                    type: 'Ingredient',
                    newItemName: newName,
                    similarItem: similarIngredients.length > 0 ? similarIngredients[0] : undefined,
                    onConfirm: onCloseCallback,
                    onUseExisting: onCloseCallback,
                    onDismiss: dismissCallback
                }
            });
        } else {
            updateIngredient({
                name: newName,
                unit: newUnit,
                quantity: newQuantity,
                season: [],
                type: ingredientType.undefined
            });
        }
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
            recipeLogger.warn('Cannot edit preparation step - invalid index', { 
                oldPreparationId, 
                preparationCount: recipePreparation.length 
            });
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
        setValidationDialogProp({
            title: t('success'),
            content: `${t('Recipe')} "${recipeTitle}" ${t('addedToShoppingList')}`,
            confirmText: t('ok'),
            onConfirm: () => navigation.goBack(),

        });
        setIsValidationDialogOpen(true);
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
    // TODO ingredient quantity shouldn't be null
    async function addValidation() {
        let dialogProp = defaultValidationDialogProp;

        const missingElem = new Array<string>();
        const translatedMissingElemPrefix = 'alerts.missingElements.';

        // TODO image not implemented
        // if (this.state.recipeImage.length == 0) {
        //     missingElem.push("an image");
        // }
        if (recipeTitle.length == 0) {
            missingElem.push(t(translatedMissingElemPrefix + 'titleRecipe'));
        }
        if (recipeIngredients.length == 0) {
            missingElem.push(t(translatedMissingElemPrefix + 'titleIngredients'));
        } else {
            const allIngredientsHaveNames = recipeIngredients.every(ingredient =>
                ingredient.name && ingredient.name.trim().length > 0
            );
            if (!allIngredientsHaveNames) {
                missingElem.push(t(translatedMissingElemPrefix + 'ingredientNames'));
            }
            const allIngredientsHaveQuantities = recipeIngredients.every(ingredient =>
                ingredient.quantity && ingredient.quantity.trim().length > 0
            );
            if (!allIngredientsHaveQuantities) {
                missingElem.push(t(translatedMissingElemPrefix + 'ingredientQuantities'));
            }
        }
        if (recipePreparation.length == 0) {
            validationLogger.debug('Recipe preparation is empty', { recipeTitle });
            missingElem.push(t(translatedMissingElemPrefix + 'titlePreparation'));
        }
        if (recipePersons === defaultValueNumber) {
            missingElem.push(t(translatedMissingElemPrefix + 'titlePersons'));
        }

        // No mandatory elements missing
        if (missingElem.length == 0) {
            const recipeToAdd = createRecipeFromStates();
            const similarRecipes = RecipeDatabase.getInstance().findSimilarRecipes(recipeToAdd);

            const addRecipeToDatabase = async () => {
                try {
                    recipeToAdd.image_Source = await FileGestion.getInstance().saveRecipeImage(recipeImage, recipeTitle);

                    // @ts-ignore No need to wait
                    FileGestion.getInstance().clearCache();

                    // Scale recipe to default persons count before saving to database
                    const defaultPersons = await getDefaultPersons();
                    if (recipeToAdd.persons !== defaultPersons && recipeToAdd.persons > 0) {
                        recipeToAdd.ingredients = recipeToAdd.ingredients.map(ingredient => ({
                            ...ingredient,
                            quantity: ingredient.quantity
                                ? scaleQuantityForPersons(ingredient.quantity, recipeToAdd.persons, defaultPersons)
                                : ingredient.quantity
                        }));
                        recipeToAdd.persons = defaultPersons;
                    }

                    await RecipeDatabase.getInstance().addRecipe(recipeToAdd);
                    dialogProp.title = t('addAnyway');
                    dialogProp.content = t('Recipe') + ' "' + recipeToAdd.title + '" ' + t('addedToDatabase');
                    dialogProp.confirmText = t('understood');
                    dialogProp.onConfirm = () => {
                        navigation.goBack();
                    };
                } catch (error) {
                    validationLogger.error('Failed to validate and add recipe to database', { 
                        recipeTitle, 
                        error 
                    });
                }
            };

            if (similarRecipes.length === 0) {
                await addRecipeToDatabase();
            } else {
                // TODO to test
                dialogProp.title = t('similarRecipeFound');
                dialogProp.content = t('similarRecipeFoundContent') + similarRecipes.map((r: recipeTableElement) => r.title).join('\n\t- ');
                dialogProp.confirmText = t('addAnyway');
                dialogProp.cancelText = t('cancel');
                dialogProp.onConfirm = async () => {
                    await addRecipeToDatabase();
                };
            }
        }
        // TODO the dialog preparation should be a dedicated function for readiness
        else if (missingElem.length == 5) {
            dialogProp.title = t(translatedMissingElemPrefix + 'titleAll');
            dialogProp.content = t('messageAll');
        } else {
            dialogProp.confirmText = t('understood');
            if (missingElem.length == 1) {
                validationLogger.debug('Single validation element missing', { missingElement: missingElem[0] });

                dialogProp.title = t(translatedMissingElemPrefix + 'titleSingular');
                dialogProp.content = t(translatedMissingElemPrefix + 'messageSingularBeginning') + missingElem[0] + t(translatedMissingElemPrefix + 'messageSingularEnding');
            } else {
                dialogProp.title = t(translatedMissingElemPrefix + 'titlePlural');
                dialogProp.content = t(translatedMissingElemPrefix + 'messagePlural');
                for (const elem of missingElem) {
                    dialogProp.content += `\n\t- ${elem}`;
                }
            }
        }
        setValidationDialogProp(dialogProp);
        setIsValidationDialogOpen(true);
    }

    async function fillOneField(uri: string, field: recipeColumnsNames) {
        const newFieldData = await extractFieldFromImage(uri, field, {
            recipePreparation: recipePreparation,
            recipePersons: recipePersons,
            recipeIngredients: recipeIngredients,
            recipeTags: recipeTags,
        }, (msg) => {
            ocrLogger.warn('OCR processing warning', { message: msg });
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
                recipeLogger.warn('Unknown stack mode in recipeImageProp', { stackMode });
                return {
                    imgUri: "", openModal: () => {
                        recipeLogger.warn('Unknown stack mode in recipeImageProp callback', { stackMode });
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
                recipeLogger.warn('Unknown stack mode in recipeTitleProp', { stackMode });
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
                recipeLogger.warn('Unknown stack mode in recipeDescriptionProp', { stackMode });
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
                recipeLogger.warn('Unknown stack mode in recipeTagsProp', { stackMode });
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
                recipeLogger.warn('Unknown stack mode in recipePersonsProp', { stackMode });
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
                if (recipeTime === defaultValueNumber) {
                    return {
                        testID: personTestID,
                        numberProps: {
                            editType: 'add',
                            prefixText: t('timePrefixOCR'),
                            openModal: () => openModalForField(recipeColumnsNames.time),
                            manuallyFill: () => {
                                setRecipeTime(0);
                            },
                        }
                    };
                }
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
                recipeLogger.warn('Unknown stack mode in recipePersonsProp', { stackMode });
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
                recipeLogger.warn('Unknown stack mode in recipeIngredientsProp', { stackMode });
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
                recipeLogger.warn('Unknown stack mode in recipePreparationProp', { stackMode });
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
                recipeLogger.warn('Unknown stack mode in recipeValidationButtonProps', { stackMode });
                return ["", async () => recipeLogger.error('Validation button clicked with unknown stack mode', { stackMode })];
        }
    }


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
            <Alert {...validationDialogProp} isVisible={isValidationDialogOpen} testId={"Recipe"} onClose={() => {
                setIsValidationDialogOpen(false);
                setValidationDialogProp(defaultValidationDialogProp);
            }}/>
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

            {/* TODO to refactor for react-native-paper  */}
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

            {/* SimilarityDialog for both tags and ingredients */}
            {similarityDialog.item && (
                <SimilarityDialog
                    testId={`Recipe${similarityDialog.item.type}Similarity`}
                    isVisible={similarityDialog.isVisible}
                    onClose={() => setSimilarityDialog(defaultSimilarityDialogPropsPicked)}
                    item={similarityDialog.item}
                />
            )}
        </SafeAreaView>
    )
}
