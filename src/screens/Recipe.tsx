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
import {
    BottomTopButtonOffset,
    bottomTopPosition,
    LargeButtonDiameter,
    rectangleButtonHeight,
    viewButtonStyles
} from "@styles/buttons";
import {screenViews, scrollView} from "@styles/spacing";
import RecipeImage, {RecipeImageProps} from "@components/organisms/RecipeImage";
import {Icons} from "@assets/Icons";
import RecipeTextRender, {
    RecipeTextRenderAddOrEditProps,
    RecipeTextRenderProps,
    RecipeTextRenderReadOnlyProps
} from "@components/organisms/RecipeTextRender";
import RecipeText, {RecipeTextAddOrEditProps} from "@components/organisms/RecipeText";
import {textSeparator, typoRender, unitySeparator} from "@styles/typography";
import RecipeDatabase from "@utils/RecipeDatabase";
import RecipeTags, {RecipeTagProps} from "@components/organisms/RecipeTags";
import {alertUserChoice, AsyncAlert} from "@utils/AsyncAlert";
import FileGestion from "@utils/FileGestion";
import RectangleButton from "@components/atomic/RectangleButton";
import RoundButton from "@components/atomic/RoundButton";
import {extractFieldFromImage} from "@utils/OCR";
import RecipeNumber, {
    RecipeNumberAddOrEditProps,
    RecipeNumberReadAddOrEditProps
} from "@components/organisms/RecipeNumber";
import {defaultValueNumber} from "@utils/Constants";
import {useTheme} from "react-native-paper";
import ModalImageSelect from "@screens/ModalImageSelect";
import {cropImage} from "@utils/ImagePicker";

export enum recipeStateType {readOnly, edit, addManual, addOCR}

export type readRecipe = { mode: "readOnly", recipe: recipeTableElement }

export type editRecipeManually = { mode: "edit", recipe: recipeTableElement }

export type addRecipeManually = { mode: "addManually" }

export type addRecipeFromPicture = { mode: "addFromPic", imgUri: string }


export type RecipePropType = readRecipe | editRecipeManually | addRecipeManually | addRecipeFromPicture


export default function Recipe({route, navigation}: RecipeScreenProp) {

    const {colors} = useTheme();

    const props: RecipePropType = route.params;
    const initStateFromProp = (props.mode === "readOnly" || (props.mode === "edit"));
    const tags = RecipeDatabase.getInstance().searchRandomlyTags(3).map(element => element.tagName);

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
    const [recipeSeason, setRecipeSeason] = useState(initStateFromProp ? props.recipe.season : new Array<string>());
    const [recipePreparation, setRecipePreparation] = useState(initStateFromProp ? props.recipe.preparation : new Array<string>());
    const [recipeTime, setRecipeTime] = useState(initStateFromProp ? props.recipe.time : defaultValueNumber);
    const [imgForOCR, setImgForOCR] = useState(props.mode === "addFromPic" ? new Array<string>(props.imgUri) : new Array<string>());
    const [randomTags, setRandomTags] = useState(tags);

    const [modalField, setModalField] = useState<recipeColumnsNames | undefined>(undefined);


    async function onDelete() {
        switch (stackMode) {
            case recipeStateType.readOnly:
            case recipeStateType.edit:
                const choice = await AsyncAlert("Recipe deletion", "Are you sure you want to delete this recipe titled " + recipeTitle + " ?", "Yes", "No");
                if (choice === alertUserChoice.ok) {
                    let msg: string;
                    //@ts-ignore params.recipe exist because we already checked with switch
                    if (!await RecipeDatabase.getInstance().deleteRecipe(this.props.route.params.recipe)) {
                        msg = "An error occurred while deleting this recipe titled " + recipeTitle;
                    } else {
                        msg = "Recipe titled " + recipeTitle + " has been successfully deleted";
                    }
                    const promiseReturn = AsyncAlert("Recipe deletion", msg, "Understood");

                }
                break;
            case recipeStateType.addManual:
            case recipeStateType.addOCR:
                const message = "Call onDelete on mode " + stackMode + " which is not possible";
                const promiseReturn = AsyncAlert("Recipe deletion", message, "Understood");
                break;
        }
        navigation.goBack();
    }

    // TODO let the possibility to add manually the field

    function removeTag(tag: string) {
        setRecipeTags(recipeTags.filter(tagElement => tagElement.tagName !== tag));
    }

    function addTag(newTag: string) {
        setRecipeTags([...recipeTags, {tagName: newTag}]);
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
        if (foundIngredient.ingName !== newName) {
            foundIngredient.ingName = newName;
        }
        if (foundIngredient.quantity !== newQuantity) {
            foundIngredient.quantity = newQuantity;
        }
        if (foundIngredient.unit !== newUnit) {
            foundIngredient.unit = newUnit;
        }

        if (foundIngredient.unit === "") {
            const ingredientExist = RecipeDatabase.getInstance().get_ingredients().find(ingredient => ingredient.ingName.toLowerCase() === newName.toLowerCase());
            if (ingredientExist) {
                foundIngredient.unit = ingredientExist.unit;
            }
        }
        setRecipeIngredients(ingredientCopy);
    }

    function addNewIngredient() {
        setRecipeIngredients([...recipeIngredients, {
            ingName: '',
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
            season: recipeSeason,
            preparation: recipePreparation,
            time: recipeTime,
        }
    }

    async function readOnlyValidation() {
        await RecipeDatabase.getInstance().addRecipeToShopping(createRecipeFromStates());
        navigation.goBack();
        await AsyncAlert("SUCCESSFULLY ADDED RECIPE TO SHOPPING LIST", `Recipe titled "${recipeTitle}" has been successfully added to the shopping list`, "Understood");
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
                alertTitle = "Missing element";
                alertMsg = "You're missing " + missingElem[0] + " to your recipe. Please add this before validate."
            } else {
                alertTitle = "Missing elements";
                alertMsg = "You haven't add all of the elements to your recipe. Please enter before validate at least: ";
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

    let validationButtonText: string;
    let validationFunction: () => Promise<void>;

    const imgProps: RecipeImageProps = {
        testID: 'RecipeImage',
        imgUri: recipeImage,
        openModal: openModalForField
    };
    let titleAddOrEditProps: RecipeTextAddOrEditProps | undefined = undefined;
    let descriptionAddOrEditProps: RecipeTextAddOrEditProps | undefined = undefined;
    let personProps: RecipeNumberReadAddOrEditProps;
    let timeProps: RecipeNumberReadAddOrEditProps;

    let tagProps: RecipeTagProps;

    let preparationProps: RecipeTextRenderProps;
    let ingredientsProps: RecipeTextRenderProps;
    switch (stackMode) {
        case recipeStateType.readOnly:
            validationButtonText = "Add this recipe to the menu";
            validationFunction = readOnlyValidation;

            tagProps = {
                type: 'readOnly', tagsList: extractTagsName(recipeTags),
            };

            preparationProps =
                {
                    type: 'readOnly',
                    text: recipePreparation,
                    render: typoRender.SECTION
                } as RecipeTextRenderReadOnlyProps;
            ingredientsProps = {
                type: 'readOnly',
                text: extractIngredientsNameWithQuantity(recipeIngredients),
                render: typoRender.ARRAY
            } as RecipeTextRenderReadOnlyProps;

            timeProps = {
                editType: 'read',
                text: `Preparation (${recipeTime} min)`
            };
            personProps = {
                editType: 'read',
                text: `Ingredients (${recipePersons} persons)`
            };
            break;
        case recipeStateType.edit:
            validationButtonText = "Validate the recipe with these modifications";
            validationFunction = editValidation;

            imgProps.buttonIcon = Icons.cameraIcon;

            titleAddOrEditProps = {
                editType: 'editable',
                textEditable: recipeTitle,
                setTextToEdit: setRecipeTitle,
            } as RecipeTextAddOrEditProps;

            descriptionAddOrEditProps = {
                editType: 'editable',
                textEditable: recipeDescription,
                setTextToEdit: setRecipeDescription,
            } as RecipeTextAddOrEditProps;

            personProps = {
                editType: 'editable',
                textEditable: recipePersons,
                prefixText: 'This recipe is for : ',
                suffixText: ' persons',
                setTextToEdit: setRecipePersons,
            } as RecipeNumberAddOrEditProps;

            tagProps = {
                type: 'addOrEdit',
                tagsList: extractTagsName(recipeTags),
                randomTags: randomTags.join(', '),
                addNewTag: addTag,
                removeTag: removeTag,
            };

            timeProps = {
                editType: 'editable',
                prefixText: 'Time to prepare the recipe :',
                suffixText: 'min',
                textEditable: recipeTime,
                setTextToEdit: setRecipeTime,
            } as RecipeNumberAddOrEditProps;

            preparationProps = {
                type: 'addOrEdit',
                editType: 'editable',

                renderType: typoRender.SECTION,
                textEditable: recipePreparation,
                textEdited: editPreparation,
                addNewText: addNewPreparationStep,

                viewAddButton: {...screenViews.sectionView, ...viewButtonStyles.centeredView},
            } as RecipeTextRenderAddOrEditProps;

            ingredientsProps = {
                type: 'addOrEdit',
                editType: 'editable',
                prefixText: 'Ingredients',
                columnTitles: {
                    column1: 'Quantity',
                    column2: 'Unit',
                    column3: 'Ingredient name',
                },
                renderType: typoRender.ARRAY,
                textEditable: extractIngredientsNameWithQuantity(recipeIngredients),
                textEdited: editIngredients,
                addNewText: addNewIngredient,
                viewAddButton: viewButtonStyles.centeredView,
            } as RecipeTextRenderAddOrEditProps;
            break;
        case recipeStateType.addManual:
            validationButtonText = "Add this new recipe";
            validationFunction = addValidation;

            imgProps.buttonIcon = Icons.cameraIcon;
            titleAddOrEditProps = {
                editType: 'editable',
                textEditable: recipeTitle,
                setTextToEdit: setRecipeTitle,
            } as RecipeTextAddOrEditProps;

            descriptionAddOrEditProps = {
                editType: 'editable',
                textEditable: recipeDescription,
                setTextToEdit: setRecipeDescription,
            } as RecipeTextAddOrEditProps;

            personProps = {
                editType: 'editable',
                textEditable: recipePersons,
                prefixText: 'This recipe is for : ',
                suffixText: ' persons',
                setTextToEdit: setRecipePersons,
            } as RecipeNumberAddOrEditProps;

            tagProps = {
                type: 'addOrEdit',
                tagsList: extractTagsName(recipeTags),
                randomTags: randomTags.join(', '),
                addNewTag: addTag,
                removeTag: removeTag,
            };

            timeProps = {
                editType: 'editable',
                prefixText: 'Time to prepare the recipe :',
                suffixText: 'min',
                textEditable: recipeTime,
                setTextToEdit: setRecipeTime,
            } as RecipeNumberAddOrEditProps;

            preparationProps = {
                type: 'addOrEdit',
                editType: 'editable',

                renderType: typoRender.SECTION,
                textEditable: recipePreparation,
                textEdited: editPreparation,
                addNewText: addNewPreparationStep,
            };

            ingredientsProps = {
                type: 'addOrEdit',
                editType: 'editable',
                prefixText: 'Ingredients',
                columnTitles: {
                    column1: 'Quantity',
                    column2: 'Unit',
                    column3: 'Ingredient name'
                },
                renderType: typoRender.ARRAY,
                textEditable: extractIngredientsNameWithQuantity(recipeIngredients),
                textEdited: editIngredients,
                addNewText: addNewIngredient,
            } as RecipeTextRenderAddOrEditProps;
            break;
        case recipeStateType.addOCR:
            validationButtonText = "Add this new recipe";
            validationFunction = addValidation;

            imgProps.buttonIcon = Icons.scanImageIcon;

            if (recipeTitle.length == 0) {
                titleAddOrEditProps = {
                    editType: 'add',
                    flex: 1,
                    openModal: () => openModalForField(recipeColumnsNames.title),
                } as RecipeTextAddOrEditProps;
            } else {
                titleAddOrEditProps = {
                    editType: 'editable',
                    textEditable: recipeTitle,
                    setTextToEdit: setRecipeTitle,
                } as RecipeTextAddOrEditProps;
            }
            if (recipeDescription.length == 0) {
                descriptionAddOrEditProps = {
                    editType: 'add',
                    flex: 1,
                    openModal: () => openModalForField(recipeColumnsNames.description),
                } as RecipeTextAddOrEditProps;
            } else {
                descriptionAddOrEditProps = {
                    editType: 'editable',
                    textEditable: recipeDescription,
                    setTextToEdit: setRecipeDescription,
                } as RecipeTextAddOrEditProps;
            }
            if (recipePersons == defaultValueNumber) {
                personProps = {
                    editType: 'add',
                    prefixText: 'This recipe is for : ',
                    suffixText: ' persons',

                    openModal: () => openModalForField(recipeColumnsNames.persons),
                } as RecipeNumberAddOrEditProps;
            } else {
                personProps = {
                    editType: 'editable',
                    textEditable: recipePersons,

                    prefixText: 'This recipe is for : ',
                    suffixText: ' persons',
                    setTextToEdit: setRecipePersons,
                } as RecipeNumberAddOrEditProps;
            }

            tagProps = {
                type: 'addOrEdit', tagsList: extractTagsName(recipeTags),
                randomTags: randomTags.join(', '),
                addNewTag: addTag,
                removeTag: removeTag,
            };

            if (recipeTime == defaultValueNumber) {
                timeProps = {
                    editType: 'add',
                    prefixText: 'Time to prepare the recipe : ',
                    suffixText: ' min',
                    openModal: () => openModalForField(recipeColumnsNames.time),
                } as RecipeNumberAddOrEditProps;
            } else {
                timeProps = {
                    editType: 'editable',
                    prefixText: 'Time to prepare the recipe : ',
                    suffixText: 'min',

                    textEditable: recipeTime,
                    setTextToEdit: setRecipeTime,
                } as RecipeNumberAddOrEditProps;
            }
            if (recipePreparation.length == 0) {
                preparationProps = {
                    type: 'addOrEdit',
                    editType: 'add',
                    openModal: () => openModalForField(recipeColumnsNames.preparation),
                } as RecipeTextRenderAddOrEditProps;
            } else {
                preparationProps = {
                    type: 'addOrEdit',
                    editType: 'editable',

                    renderType: typoRender.SECTION,
                    textEditable: recipePreparation,
                    textEdited: editPreparation,
                    addNewText: addNewPreparationStep,

                    viewAddButton: {...screenViews.sectionView, ...viewButtonStyles.centeredView},
                } as RecipeTextRenderAddOrEditProps;
            }
            if (recipeIngredients.length == 0) {
                ingredientsProps = {
                    type: 'addOrEdit',
                    editType: 'add',
                    prefixText: 'Ingredients',
                    openModal: () => openModalForField(recipeColumnsNames.ingredients),
                } as RecipeTextRenderAddOrEditProps;
            } else {
                ingredientsProps = {
                    type: 'addOrEdit',
                    editType: 'editable',
                    prefixText: 'Ingredients',
                    columnTitles: {
                        column1: 'Quantity',
                        column3: 'Unit',
                        column2: 'Ingredient name',
                    },
                    textEditable: extractIngredientsNameWithQuantity(recipeIngredients),
                    textEdited: editIngredients,
                    addNewText: addNewIngredient,
                } as RecipeTextRenderAddOrEditProps;
            }
            break;
    }

    return (
        <SafeAreaView style={{backgroundColor: colors.background}}>
            <ScrollView horizontal={false} showsVerticalScrollIndicator={false}
                        style={scrollView(rectangleButtonHeight).view} keyboardShouldPersistTaps={"handled"}
                        nestedScrollEnabled={true}>

                {/*Image*/}
                <RecipeImage {...imgProps}/>

                {/*Title*/}
                <RecipeText testID={'RecipeTitle'}
                            rootText={{
                                style: stackMode == recipeStateType.readOnly ? 'headline' : 'title',
                                value: stackMode == recipeStateType.readOnly ? recipeTitle : 'Title:'
                            }}
                            addOrEditProps={titleAddOrEditProps}/>

                {/*Description*/}
                <RecipeText testID={'RecipeDescription'}
                            rootText={{
                                style: stackMode == recipeStateType.readOnly ? 'paragraph' : 'title',
                                value: (stackMode == recipeStateType.readOnly ? recipeDescription : 'Description:')
                            }}
                            addOrEditProps={descriptionAddOrEditProps}/>

                {/*Tags*/}
                <RecipeTags {...tagProps} testID={'RecipeTags'}/>

                {/*Persons*/}
                <RecipeNumber testID={'RecipePersons'} numberProps={personProps}/>

                {/*Ingredients*/}
                {/*TODO quantity shall be keyboard number*/}
                <RecipeTextRender {...ingredientsProps} testID={'RecipeIngredients'}/>

                {/* TODO let the possibility to add another time in picture */}
                {/*Time*/}
                <RecipeNumber testID={'RecipeTime'} numberProps={timeProps}/>

                {/*Preparation*/}
                <RecipeTextRender {...preparationProps} testID={'RecipePreparation'}/>

                {/* Add some space to avoid miss clicking */}
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
            {modalField ? <ModalImageSelect arrImg={imgForOCR} onSelectFunction={async (imgSelected: string) => {
                const croppedUri = await cropImage(imgSelected, colors);
                if (croppedUri.length > 0) {
                    fillOneField(croppedUri, modalField);
                    setModalField(undefined);
                }
            }} onDismissFunction={() => setModalField(undefined)}/> : null}
        </SafeAreaView>
    )
}
