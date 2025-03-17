import React from "react";
import {RecipeScreenProp, StackScreenNavigation} from '@customTypes/ScreenTypes';
import {
    extractIngredientsNameWithQuantity,
    extractTagsName,
    ingredientTableElement,
    ingredientType,
    recipeColumnsNames,
    recipeTableElement,
    tagTableElement
} from "@customTypes/DatabaseElementTypes";
import {localImgData} from "@customTypes/ImageTypes";
import BottomTopButton from "@components/molecules/BottomTopButton";
import {SafeAreaView, ScrollView, StatusBar, View} from "react-native";
import {
    BottomTopButtonOffset,
    bottomTopPosition,
    LargeButtonDiameter,
    rectangleButtonHeight,
    viewButtonStyles
} from "@styles/buttons";
import RectangleButton from "@components/atomic/RectangleButton";
import {screenViews, scrollView} from "@styles/spacing";
import {palette} from "@styles/colors";
import RecipeImage from "@components/organisms/RecipeImage";
import {backIcon, enumIconTypes, iconsSize, pencilIcon, trashIcon} from "@assets/images/Icons";
import RoundButton from "@components/atomic/RoundButton";
import RecipeTextRender, {
    RecipeTextRenderAddOrEditProps,
    RecipeTextRenderProps,
    RecipeTextRenderReadOnlyProps
} from "@components/organisms/RecipeTextRender";
import RecipeText, {RecipeTextAddOrEditProps, RecipeTextAddProps} from "@components/organisms/RecipeText";
import {headerBorder, textSeparator, titleBorder, typoRender, typoStyles, unitySeparator} from "@styles/typography";
import RecipeDatabase from "@utils/RecipeDatabase";
import RecipeTags, {RecipeTagProps} from "@components/organisms/RecipeTags";
import {alertUserChoice, AsyncAlert} from "@utils/AsyncAlert";
import FileGestion from "@utils/FileGestion";

export enum recipeStateType {readOnly, edit, addManual, addOCR}

export type readRecipe = { mode: "readOnly", recipe: recipeTableElement }

export type editRecipeManually = { mode: "edit", recipe: recipeTableElement }

export type addRecipeManually = { mode: "addManually" }

export type addRecipeFromPicture = { mode: "addFromPic", img: localImgData }


export type RecipePropType = readRecipe | editRecipeManually | addRecipeManually | addRecipeFromPicture


export type RecipeStates = {
    stackMode: recipeStateType,
    recipeImage: string,
    recipeTitle: string,
    recipeDescription: string,
    recipeTags: Array<tagTableElement>,
    recipePersons: string,
    recipeIngredients: Array<ingredientTableElement>,
    recipeSeason: Array<string>,
    recipePreparation: Array<string>,
    recipeTime: string,
    imgForOCR: Array<localImgData>,
    forceUpdateKey: number,
    randomTags: Array<string>,
}

class Recipe extends React.Component<RecipeScreenProp, RecipeStates> {
    constructor(recipeProps: RecipeScreenProp) {
        super(recipeProps);
        const params = this.props.route.params;
        const tags = RecipeDatabase.getInstance().searchRandomlyTags(3).map(element => element.tagName);
        switch (params.mode) {
            case "readOnly":
                this.state = {
                    stackMode: recipeStateType.readOnly,
                    recipeImage: params.recipe.image_Source,
                    recipeTitle: params.recipe.title,
                    recipeDescription: params.recipe.description,
                    recipeTags: params.recipe.tags,
                    recipePersons: params.recipe.persons.toString(),
                    recipeIngredients: params.recipe.ingredients,
                    recipeSeason: params.recipe.season,
                    recipePreparation: params.recipe.preparation,
                    recipeTime: params.recipe.time.toString(),
                    imgForOCR: [],
                    forceUpdateKey: 0,
                    randomTags: tags,
                };
                break;
            case "edit":
                this.state = {
                    stackMode: recipeStateType.edit,
                    recipeImage: params.recipe ? params.recipe.image_Source : "",
                    recipeTitle: params.recipe ? params.recipe.title : "",
                    recipeDescription: params.recipe ? params.recipe.description : "",
                    recipeTags: params.recipe ? params.recipe.tags : [],
                    recipePersons: params.recipe ? params.recipe.persons.toString() : "",
                    recipeIngredients: params.recipe ? params.recipe.ingredients : [],
                    recipeSeason: params.recipe ? params.recipe.season : [],
                    recipePreparation: params.recipe ? params.recipe.preparation : [],
                    recipeTime: params.recipe ? params.recipe.time.toString() : "",
                    imgForOCR: [],
                    forceUpdateKey: 0, randomTags: tags,
                };
                break;
            case "addManually":
                this.state = {
                    stackMode: recipeStateType.addManual,
                    recipeImage: "",
                    recipeTitle: "",
                    recipeDescription: "",
                    recipeTags: [],
                    recipePersons: "",
                    recipeIngredients: [],
                    recipeSeason: [],
                    recipePreparation: [],
                    recipeTime: "",
                    imgForOCR: [],
                    forceUpdateKey: 0, randomTags: tags,
                };
                break;
            case "addFromPic":
                this.state = {
                    stackMode: recipeStateType.addOCR,
                    recipeImage: "",
                    recipeTitle: "",
                    recipeDescription: "",
                    recipeTags: [],
                    recipePersons: "",
                    recipeIngredients: [],
                    recipeSeason: [],
                    recipePreparation: [],
                    recipeTime: "",
                    imgForOCR: new Array<localImgData>(params.img),
                    forceUpdateKey: 0, randomTags: tags,
                };
                break;
        }
    }

    forceReRender = () => {
        this.setState((prevState) => ({forceUpdateKey: prevState.forceUpdateKey + 1}))
    };

    setStackMode = (newStackMode: recipeStateType) => {
        this.setState({stackMode: newStackMode});
    };

    setRecipeImage = (newUri: string) => {
        this.setState({recipeImage: newUri});
    };

    setRecipeTitle = (newTitle: string) => {
        this.setState({recipeTitle: newTitle});
    };

    setRecipeDescription = (newDescription: string) => {
        this.setState({recipeDescription: newDescription})
    };

    setRecipeTags = (newTags: Array<tagTableElement>) => {
        this.setState({recipeTags: newTags})
    };

    setRecipePersons = (newPerson: string) => {
        this.setState({recipePersons: newPerson});
    };

    setRecipeIngredients = (newIngredient: Array<ingredientTableElement>) => {
        this.setState({recipeIngredients: newIngredient});
    };

    setRecipeSeason = (newSeason: Array<string>) => {
        this.setState({recipeSeason: newSeason});
    };

    setRecipePreparation = (newPreparation: Array<string>) => {
        this.setState({recipePreparation: newPreparation});
    };

    setRecipeTime = (newTime: string) => {
        this.setState({recipeTime: newTime});
    };

    setImgForOCR = (newOCR: Array<localImgData>) => {
        this.setState({imgForOCR: newOCR});
    };

    onDelete = async () => {
        switch (this.state.stackMode) {
            case recipeStateType.readOnly:
            case recipeStateType.edit:
                const choice = await AsyncAlert("Recipe deletion", "Are you sure you want to delete this recipe titled " + this.state.recipeTitle + " ?", "Yes", "No");
                if (choice === alertUserChoice.ok) {
                    let msg: string;
                    //@ts-ignore params.recipe exist because we already checked with switch case
                    if (!await RecipeDatabase.getInstance().deleteRecipe(this.props.route.params.recipe)) {
                        msg = "An error occurred while deleting this recipe titled " + this.state.recipeTitle;
                    } else {
                        msg = "Recipe titled " + this.state.recipeTitle + " has been successfully deleted";
                    }
                    const promiseReturn = AsyncAlert("Recipe deletion", msg, "Understood");

                }
                break;
            case recipeStateType.addManual:
            case recipeStateType.addOCR:
                const message = "Call onDelete on mode " + this.state.stackMode + " which is not possible";
                const promiseReturn = AsyncAlert("Recipe deletion", message, "Understood");
                break;
        }
        this.props.navigation.goBack();
    };
    // TODO let the possibility to add manually the field

    removeTag = (tag: string) => {

        this.setRecipeTags(this.state.recipeTags.filter(tagElement => tagElement.tagName !== tag));
    };

    addTag = (newTag: string) => {
        this.setRecipeTags(new Array(...this.state.recipeTags, {tagName: newTag}));
    };

    // TODO to rework
    editIngredients = (oldIngredientId: number, newIngredient: string) => {
        const ingredientCopy: Array<ingredientTableElement> = this.state.recipeIngredients.map(ingredient => ({...ingredient}));
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
        if (foundIngredient.quantity !== Number(newQuantity)) {
            foundIngredient.quantity = Number(newQuantity);
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
        this.setRecipeIngredients(ingredientCopy);
    };

    addNewIngredient = () => {
        this.setRecipeIngredients(new Array(...this.state.recipeIngredients, {
            ingName: '',
            unit: '',
            quantity: 0,
            type: ingredientType.undefined,
            season: []
        }));
    };

    editPreparation = (oldPreparationId: number, newPreparation: string) => {

        if (oldPreparationId < 0 || oldPreparationId > this.state.recipePreparation.length) {
            console.warn(`editPreparation:: Can't find old preparation at index: ${oldPreparationId}`);
            return;
        }
        const newPreparationArray = new Array(...this.state.recipePreparation);
        newPreparationArray[oldPreparationId] = newPreparation;
        this.setRecipePreparation(newPreparationArray);
    };

    addNewPreparationStep = () => {
        this.setRecipePreparation(new Array(...this.state.recipePreparation, ''));
    };

    createRecipeFromStates = (): recipeTableElement => {
        const {route} = this.props;
        return {
            id: (route.params.mode === 'readOnly' ? route.params.recipe.id : undefined),
            image_Source: this.state.recipeImage,
            title: this.state.recipeTitle,
            description: this.state.recipeDescription,
            tags: this.state.recipeTags,
            persons: Number(this.state.recipePersons),
            ingredients: this.state.recipeIngredients,
            season: this.state.recipeSeason,
            preparation: this.state.recipePreparation,
            time: Number(this.state.recipeTime),
        }
    }
    ;
    readOnlyValidation = async () => {
        await RecipeDatabase.getInstance().addRecipeToShopping(this.createRecipeFromStates());
        this.props.navigation.goBack();
        await AsyncAlert("SUCCESSFULLY ADDED RECIPE TO SHOPPING LIST", `Recipe titled "${this.state.recipeTitle}" has been successfully added to the shopping list`, "Understood");
    };

    editValidation = async () => {
        // @ts-ignore No need to wait for clearCache
        FileGestion.getInstance().clearCache();

        // TODO add safety to this (we won't let the user do anything)
        await RecipeDatabase.getInstance().editRecipe(this.createRecipeFromStates());
        this.setStackMode(recipeStateType.readOnly);
    };

    // TODO checking if tags aren't in doublons
    // TODO checking if ingredients aren't in doublons
    //  TODO checking if persons, time or ingredients aren't null
    // TODO ingredient quantity shouldn't be null
    addValidation = async () => {
        const missingElem = new Array<string>();

        // TODO image not implemented
        // if (this.state.recipeImage.length == 0) {
        //     missingElem.push("an image");
        // }
        if (this.state.recipeTitle.length == 0) {
            missingElem.push("a title");
        }
        if (this.state.recipeIngredients.length == 0) {
            missingElem.push("some ingredients");
        }
        if (this.state.recipePreparation.length == 0) {
            missingElem.push("some instructions for the preparation");
        }
        if (this.state.recipePersons.length == 0) {
            missingElem.push("for how many persons this recipe is");
        }

        // No mandatory elements missing
        if (missingElem.length == 0) {
            // TODO avoid try/catch here
            try {
                // TODO deal case where 2 recipes share the same title. Is it allowed ?
                const newUri = await FileGestion.getInstance().saveRecipeImage(this.state.recipeImage, this.state.recipeTitle);
                let recipeToAdd = this.createRecipeFromStates();
                // TODO can't we get rid of this local variable and directly use the states ?
                const uriSplit = (newUri as string).split("/");
                recipeToAdd.image_Source = uriSplit[uriSplit.length - 1];

                // @ts-ignore No need to wait
                FileGestion.getInstance().clearCache();

                const forDb = recipeToAdd;
                await RecipeDatabase.getInstance().addRecipe(recipeToAdd);
                this.props.navigation.goBack();
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

    };

    openModalForField = (field: recipeColumnsNames) => {
        const {navigation} = this.props;
        navigation.navigate('Modal', {
            arrImg: this.state.imgForOCR,
            setState: this.setImgForOCR,
            onSelectFunction: (imgSelected: localImgData, newNav: StackScreenNavigation) => {
                navigation.navigate('Crop', {
                    imageToCrop: imgSelected, validateFunction: (newImg: localImgData) => {
                        this.fillOneField(newImg.uri, field);
                        newNav.goBack();
                    }
                });
            }
        });
    };


    fillOneField = (uri: string, field: recipeColumnsNames) => {
        // TODO for debug only hardcoded values, remove these for release
        switch (field) {
            case recipeColumnsNames.image:
                // this.setRecipeImage(uri);
                this.setRecipeImage('New Image URI');
                break;
            case recipeColumnsNames.title:
                // const title =  await recognizeText<string>(uri, field);
                const title = 'New Title';
                this.setRecipeTitle(title);
                break;
            case recipeColumnsNames.description:
                // const description = await recognizeText<string>(uri, field);
                const description = 'New description';
                this.setRecipeDescription(description);
                break;
            case recipeColumnsNames.tags:
                // TODO to implement OCR for tags ?
                // const tags = await recognizeText<Array<string>>(uri, field);
                this.setRecipeTags([...this.state.recipeTags, {tagName: 'New tag'}]);
                break;
            case recipeColumnsNames.persons:
                // const persons = await recognizeText<number>(uri, field);
                const persons = '31';
                this.setRecipePersons(persons);
                break;
            case recipeColumnsNames.ingredients:
                // const newIngredients = await recognizeText<Array<string>>(uri, field);
                const newIngredients = [...this.state.recipeIngredients, {
                    ingName: 'New ingredient',
                    quantity: 111,
                    season: ['8,9,10'],
                    type: ingredientType.cheese,
                    unit: 'g'
                }];
                this.setRecipeIngredients(newIngredients);
                break;
            case recipeColumnsNames.preparation:
                // const newPreparation = await recognizeText<Array<string>>(uri, field);
                const newPreparation = [...this.state.recipePreparation, 'New preparation'];
                this.setRecipePreparation(newPreparation);
                break;
            case recipeColumnsNames.time:
                const time = '99';
                this.setRecipeTime(time);
                break;
        }

    };


    render() {
        const {navigation} = this.props;

        // TODO put this into a function ? useEffect ?
        let validationButtonText: string;
        let validationFunction: () => Promise<void>;

        let titleAddOrEditProps: RecipeTextAddOrEditProps | undefined = undefined;
        let descriptionAddOrEditProps: RecipeTextAddOrEditProps | undefined = undefined;
        let personAddOrEditProps: RecipeTextAddOrEditProps | undefined = undefined;
        let timeAddOrEditProps: RecipeTextAddOrEditProps | undefined = undefined;

        let tagProps: RecipeTagProps;

        let preparationProps: RecipeTextRenderProps;
        let ingredientsProps: RecipeTextRenderProps;
        switch (this.state.stackMode) {
            case recipeStateType.readOnly:
                validationButtonText = "Add this recipe to the menu";
                validationFunction = this.readOnlyValidation;

                tagProps = {
                    type: 'readOnly', tagsList: extractTagsName(this.state.recipeTags),
                };

                preparationProps =
                    {
                        type: 'readOnly',
                        text: this.state.recipePreparation,
                        render: typoRender.SECTION
                    } as RecipeTextRenderReadOnlyProps;
                ingredientsProps = {
                    type: 'readOnly',
                    text: extractIngredientsNameWithQuantity(this.state.recipeIngredients),
                    render: typoRender.ARRAY
                } as RecipeTextRenderReadOnlyProps;
                break;
            case recipeStateType.edit:
                validationButtonText = "Validate the recipe with these modifications";
                validationFunction = this.editValidation;

                titleAddOrEditProps = {
                    editType: 'editable',
                    textEditable: {style: titleBorder, value: this.state.recipeTitle},
                    setTextToEdit: this.setRecipeTitle,
                } as RecipeTextAddOrEditProps;

                descriptionAddOrEditProps = {
                    editType: 'editable',
                    textEditable: {style: titleBorder, value: this.state.recipeDescription},
                    setTextToEdit: this.setRecipeDescription,
                } as RecipeTextAddOrEditProps;

                personAddOrEditProps = {
                    editType: 'editable',
                    textEditable: {
                        style: {...headerBorder, flex: 1, textAlign: "center"},
                        value: this.state.recipePersons
                    },
                    editableViewStyle: screenViews.tabView,

                    prefixText: {style: {...typoStyles.header, flex: 5}, value: 'This recipe is for : '},
                    suffixText: {style: {...typoStyles.header, flex: 3}, value: ' persons'},
                    setTextToEdit: this.setRecipePersons,
                } as RecipeTextAddOrEditProps;

                tagProps = {
                    type: 'addOrEdit',
                    tagsList: extractTagsName(this.state.recipeTags),
                    randomTags: this.state.randomTags.join(', '),
                    addNewTag: this.addTag,
                    removeTag: this.removeTag,
                };

                timeAddOrEditProps = {
                    editType: 'editable',
                    editableViewStyle: screenViews.tabView,

                    prefixText: {
                        style: {...typoStyles.header, flex: 7},
                        value: 'Time to prepare the recipe :'
                    },
                    suffixText: {
                        style: {...typoStyles.header, flex: 1},
                        value: 'min',
                    },

                    textEditable: {
                        style: {...headerBorder, flex: 1, textAlign: "center"},
                        value: this.state.recipeTime
                    },
                    setTextToEdit: this.setRecipeTime,
                } as RecipeTextAddOrEditProps;

                preparationProps = {
                    type: 'addOrEdit',
                    editType: 'editable',

                    renderType: typoRender.SECTION,
                    textEditable: this.state.recipePreparation,
                    textEdited: this.editPreparation,
                    addNewText: this.addNewPreparationStep,

                    viewAddButton: {...screenViews.sectionView, ...viewButtonStyles.centeredView},
                } as RecipeTextRenderAddOrEditProps;

                ingredientsProps = {
                    type: 'addOrEdit',
                    editType: 'editable',
                    prefixText: {style: typoStyles.title, value: 'Ingredients',},
                    columnTitles: {
                        column1: {style: {...typoStyles.header, flex: 2, textAlign: "center"}, value: 'Quantity'},
                        column2: {style: {...typoStyles.header, flex: 1, textAlign: "center"}, value: 'Unit'},
                        column3: {
                            style: {...typoStyles.header, flex: 3, textAlign: "center", flexWrap: 'wrap'},
                            value: 'Ingredient name'
                        },
                    },
                    renderType: typoRender.ARRAY,
                    textEditable: extractIngredientsNameWithQuantity(this.state.recipeIngredients),
                    textEdited: this.editIngredients,
                    addNewText: this.addNewIngredient,
                    viewAddButton: viewButtonStyles.centeredView,
                } as RecipeTextRenderAddOrEditProps;
                break;
            case recipeStateType.addManual:
                validationButtonText = "Add this new recipe";
                validationFunction = this.addValidation;

                titleAddOrEditProps = {
                    editType: 'editable',
                    textEditable: {style: titleBorder, value: this.state.recipeTitle},
                    setTextToEdit: this.setRecipeTitle,
                } as RecipeTextAddOrEditProps;

                descriptionAddOrEditProps = {
                    editType: 'editable',
                    textEditable: {style: titleBorder, value: this.state.recipeDescription},
                    setTextToEdit: this.setRecipeDescription,
                } as RecipeTextAddOrEditProps;

                personAddOrEditProps = {
                    editType: 'editable',
                    textEditable: {
                        style: {...headerBorder, flex: 1, textAlign: "center"},
                        value: this.state.recipePersons
                    },
                    editableViewStyle: screenViews.tabView,

                    prefixText: {style: {...typoStyles.header, flex: 5}, value: 'This recipe is for : '},
                    suffixText: {style: {...typoStyles.header, flex: 3}, value: ' persons'},
                    setTextToEdit: this.setRecipePersons,
                } as RecipeTextAddOrEditProps;

                tagProps = {
                    type: 'addOrEdit',
                    tagsList: extractTagsName(this.state.recipeTags),
                    randomTags: this.state.randomTags.join(', '),
                    addNewTag: this.addTag,
                    removeTag: this.removeTag,
                };

                timeAddOrEditProps = {
                    editType: 'editable',
                    editableViewStyle: screenViews.tabView,

                    prefixText: {
                        style: {...typoStyles.header, flex: 7},
                        value: 'Time to prepare the recipe :'
                    },
                    suffixText: {
                        style: {...typoStyles.header, flex: 1},
                        value: 'min',
                    },

                    textEditable: {
                        style: {...headerBorder, flex: 1, textAlign: "center"},
                        value: this.state.recipeTime
                    },
                    setTextToEdit: this.setRecipeTime,
                } as RecipeTextAddOrEditProps;

                preparationProps = {
                    type: 'addOrEdit',
                    editType: 'editable',

                    renderType: typoRender.SECTION,
                    textEditable: this.state.recipePreparation,
                    textEdited: this.editPreparation,
                    addNewText: this.addNewPreparationStep,

                    viewAddButton: {...screenViews.sectionView, ...viewButtonStyles.centeredView},
                } as RecipeTextRenderAddOrEditProps;

                ingredientsProps = {
                    type: 'addOrEdit',
                    editType: 'editable',
                    prefixText: {style: typoStyles.title, value: 'Ingredients',},
                    columnTitles: {
                        column1: {style: {...typoStyles.header, flex: 2, textAlign: "center"}, value: 'Quantity'},
                        column2: {style: {...typoStyles.header, flex: 1, textAlign: "center"}, value: 'Unit'},
                        column3: {
                            style: {...typoStyles.header, flex: 3, textAlign: "center", flexWrap: 'wrap'},
                            value: 'Ingredient name'
                        },
                    },
                    renderType: typoRender.ARRAY,
                    textEditable: extractIngredientsNameWithQuantity(this.state.recipeIngredients),
                    textEdited: this.editIngredients,
                    addNewText: this.addNewIngredient,
                    viewAddButton: viewButtonStyles.centeredView,
                } as RecipeTextRenderAddOrEditProps;
                break;
            case recipeStateType.addOCR:
                validationButtonText = "Add this new recipe";
                validationFunction = this.addValidation;

                if (this.state.recipeTitle.length == 0) {
                    titleAddOrEditProps = {
                        editType: 'add',
                        flex: 1,
                        openModal: () => this.openModalForField(recipeColumnsNames.title),
                    } as RecipeTextAddOrEditProps;
                } else {
                    titleAddOrEditProps = {
                        editType: 'editable',
                        textEditable: {style: titleBorder, value: this.state.recipeTitle},
                        setTextToEdit: this.setRecipeTitle,
                    } as RecipeTextAddOrEditProps;
                }
                if (this.state.recipeDescription.length == 0) {
                    descriptionAddOrEditProps = {
                        editType: 'add',
                        flex: 1,
                        openModal: () => this.openModalForField(recipeColumnsNames.description),
                    } as RecipeTextAddOrEditProps;
                } else {
                    descriptionAddOrEditProps = {
                        editType: 'editable',
                        textEditable: {style: titleBorder, value: this.state.recipeDescription},
                        setTextToEdit: this.setRecipeDescription,
                    } as RecipeTextAddOrEditProps;
                }
                if (this.state.recipePersons.length == 0) {
                    personAddOrEditProps = {
                        editType: 'add',
                        editableViewStyle: screenViews.tabView,
                        textEditableStyle: {...headerBorder, flex: 1, textAlign: "center"},
                        flex: 6,
                        alignItems: 'flex-start',

                        prefixText: {style: {...typoStyles.header, flex: 5}, value: 'This recipe is for : '},
                        suffixText: {style: {...typoStyles.header, flex: 3}, value: ' persons'},

                        openModal: () => this.openModalForField(recipeColumnsNames.persons),
                    } as RecipeTextAddProps;
                } else {
                    personAddOrEditProps = {
                        editType: 'editable',
                        textEditable: {
                            style: {...headerBorder, flex: 1, textAlign: "center"},
                            value: this.state.recipePersons
                        },
                        editableViewStyle: screenViews.tabView,

                        prefixText: {style: {...typoStyles.header, flex: 5}, value: 'This recipe is for : '},
                        suffixText: {style: {...typoStyles.header, flex: 3}, value: ' persons'},
                        setTextToEdit: this.setRecipePersons,
                    } as RecipeTextAddOrEditProps;
                }

                tagProps = {
                    type: 'addOrEdit', tagsList: extractTagsName(this.state.recipeTags),
                    randomTags: this.state.randomTags.join(', '),
                    addNewTag: this.addTag,
                    removeTag: this.removeTag,
                };

                if (this.state.recipeTime.length == 0) {
                    timeAddOrEditProps = {
                        editType: 'add',
                        editableViewStyle: screenViews.tabView,

                        prefixText: {
                            style: {...typoStyles.header, flex: 6},
                            value: 'Time to prepare the recipe : '
                        },
                        flex: 3, alignItems: 'flex-start',

                        openModal: () => this.openModalForField(recipeColumnsNames.time),
                    } as RecipeTextAddOrEditProps;
                } else {
                    timeAddOrEditProps = {
                        editType: 'editable',
                        editableViewStyle: screenViews.tabView,

                        prefixText: {
                            style: {...typoStyles.header, flex: 6},
                            value: 'Time to prepare the recipe : '
                        },
                        suffixText: {
                            style: {...typoStyles.header, flex: 1},
                            value: 'min',
                        },

                        renderType: typoRender.ARRAY,
                        textEditable: {
                            style: {...headerBorder, flex: 1, textAlign: "center"},
                            value: this.state.recipeTime
                        },
                        setTextToEdit: this.setRecipeTime,
                    } as RecipeTextAddOrEditProps;
                }
                if (this.state.recipePreparation.length == 0) {
                    preparationProps = {
                        type: 'addOrEdit',
                        editType: 'add',
                        viewAddButton: {...screenViews.sectionView, ...viewButtonStyles.centeredView},
                        openModal: () => this.openModalForField(recipeColumnsNames.preparation),
                    } as RecipeTextRenderAddOrEditProps;
                } else {
                    preparationProps = {
                        type: 'addOrEdit',
                        editType: 'editable',

                        renderType: typoRender.SECTION,
                        textEditable: this.state.recipePreparation,
                        textEdited: this.editPreparation,
                        addNewText: this.addNewPreparationStep,

                        viewAddButton: {...screenViews.sectionView, ...viewButtonStyles.centeredView},
                    } as RecipeTextRenderAddOrEditProps;
                }
                if (this.state.recipeIngredients.length == 0) {
                    ingredientsProps = {
                        type: 'addOrEdit',
                        editType: 'add',
                        prefixText: {style: typoStyles.title, value: 'Ingredients',},
                        viewAddButton: viewButtonStyles.centeredView,
                        openModal: () => this.openModalForField(recipeColumnsNames.ingredients),
                    } as RecipeTextRenderAddOrEditProps;
                } else {
                    ingredientsProps = {
                        type: 'addOrEdit',
                        editType: 'editable',
                        prefixText: {style: typoStyles.title, value: 'Ingredients',},
                        columnTitles: {
                            column1: {style: {...typoStyles.header, flex: 2, textAlign: "center"}, value: 'Quantity'},
                            column3: {style: {...typoStyles.header, flex: 1, textAlign: "center"}, value: 'Unit'},
                            column2: {
                                style: {...typoStyles.header, flex: 3, textAlign: "center", flexWrap: 'wrap'},
                                value: 'Ingredient name'
                            },
                        },

                        textEditable: extractIngredientsNameWithQuantity(this.state.recipeIngredients),
                        textEdited: this.editIngredients,
                        addNewText: this.addNewIngredient,
                        viewAddButton: viewButtonStyles.centeredView,
                    } as RecipeTextRenderAddOrEditProps;
                }
                break;
        }

        return (
            <SafeAreaView style={screenViews.screenView} key={this.state.forceUpdateKey}>
                <ScrollView horizontal={false} showsVerticalScrollIndicator={false}
                            style={scrollView(rectangleButtonHeight).view} keyboardShouldPersistTaps={"handled"}
                            nestedScrollEnabled={true}>
                    <StatusBar animated={true} backgroundColor={palette.primary}/>

                    {/*Image*/}
                    <RecipeImage testID={'RecipeImage'} imgUri={this.state.recipeImage}
                                 addProps={(this.state.stackMode == recipeStateType.addOCR && this.state.recipeImage.length == 0) ?
                                     {setImgUri: this.setRecipeImage, openModal: this.openModalForField} : undefined}/>

                    {/*Title*/}
                    <RecipeText testID={'RecipeTitle'}
                                rootText={{
                                    style: (this.state.stackMode == recipeStateType.readOnly ? typoStyles.title : typoStyles.header),
                                    value: (this.state.stackMode == recipeStateType.readOnly ? this.state.recipeTitle : 'Title of the recipe : ')
                                }}
                                addOrEditProps={titleAddOrEditProps}/>

                    {/*Description*/}
                    <RecipeText testID={'RecipeDescription'}
                                rootText={{
                                    style: (this.state.stackMode == recipeStateType.readOnly ? typoStyles.paragraph : typoStyles.header),
                                    value: (this.state.stackMode == recipeStateType.readOnly ? this.state.recipeDescription : 'Description of the recipe : ')
                                }}
                                addOrEditProps={descriptionAddOrEditProps}/>

                    {/*Tags*/}
                    <RecipeTags {...tagProps} testID={'RecipeTags'}/>

                    {/*Persons*/}
                    {/*TODO shall be a keyboard number */}
                    <RecipeText testID={'RecipePersons'}
                                rootText={this.state.stackMode == recipeStateType.readOnly ? {
                                    style: typoStyles.title,
                                    value: `Ingredients (${this.state.recipePersons} persons)`
                                } : undefined}
                                addOrEditProps={personAddOrEditProps}/>

                    {/*Ingredients*/}
                    {/*TODO quantity shall be keyboard number*/}
                    <RecipeTextRender {...ingredientsProps} testID={'RecipeIngredients'}/>

                    {/* TODO let the possibility to add another time in picture */}
                    {/*Time*/}
                    {/*TODO shall be a keyboard number */}
                    <RecipeText testID={'RecipeTime'}
                                rootText={this.state.stackMode == recipeStateType.readOnly ?
                                    {
                                        style: typoStyles.title,
                                        value: `Preparation (${this.state.recipeTime} min)`,
                                    } : undefined}
                                addOrEditProps={timeAddOrEditProps}/>

                    {/*Preparation*/}
                    <RecipeTextRender {...preparationProps} testID={'RecipePreparation'}/>

                    {/* Add some space to avoid miss clicking */}
                    <View style={{paddingVertical: LargeButtonDiameter / 2}}/>

                    {/* TODO add nutrition */}
                </ScrollView>
                {/*TODO add a generic component to tell which bottom button we want*/}
                <BottomTopButton testID={'BackButton'} as={RoundButton} position={bottomTopPosition.top_left}
                                 buttonOffset={0}
                                 onPressFunction={() => navigation.goBack()} diameter={LargeButtonDiameter} icon={{
                    type: enumIconTypes.materialCommunity,
                    name: backIcon,
                    size: iconsSize.medium,
                    color: "#414a4c"
                }}/>

                {this.state.stackMode == recipeStateType.readOnly ?
                    <>
                        <BottomTopButton testID={'RecipeDelete'} as={RoundButton}
                                         position={bottomTopPosition.top_right}
                                         buttonOffset={0}
                                         onPressFunction={() => this.onDelete()}
                                         diameter={LargeButtonDiameter} icon={{
                            type: enumIconTypes.materialCommunity,
                            name: trashIcon,
                            size: iconsSize.medium,
                            color: "#414a4c"
                        }}/>
                        <BottomTopButton testID={'RecipeEdit'} as={RoundButton}
                                         position={bottomTopPosition.bottom_right}
                                         buttonOffset={BottomTopButtonOffset}
                                         onPressFunction={() => this.setStackMode(recipeStateType.edit)}
                                         diameter={LargeButtonDiameter} icon={{
                            type: enumIconTypes.materialCommunity,
                            name: pencilIcon,
                            size: iconsSize.medium,
                            color: "#414a4c"
                        }}/>
                    </>
                    : null}

                <BottomTopButton testID={'RecipeValidate'} as={RectangleButton} position={bottomTopPosition.bottom_full}
                                 centered={true}
                                 text={validationButtonText} onPressFunction={async () => await validationFunction()}/>
            </SafeAreaView>
        )
    }
}

export default Recipe;
