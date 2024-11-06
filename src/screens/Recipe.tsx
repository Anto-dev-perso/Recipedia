

import { padding, remValue, screenViews, scrollView } from "@styles/spacing";
import React, { useState } from "react";
import { Image } from 'expo-image';
import { SafeAreaView, Text, View, ScrollView, TextInput, StatusBar, Alert } from 'react-native';
import { imageStyle } from '@styles/images'
import { borderStyle, headerBorder, paragraphBorder, textSeparator, titleBorder, typoRender, typoStyles, unitySeparator } from "@styles/typography";
import HorizontalList from "@components/molecules/HorizontalList";
import TextRender from "@components/molecules/TextRender";
import { bottomTopPosition, rectangleButtonHeight, LargeButtonDiameter, BottomTopButtonOffset, smallButtonDiameter, viewButtonStyles, mediumButtonDiameter } from '@styles/buttons';
import RectangleButton from "@components/atomic/RectangleButton";
import BottomTopButton from "@components/molecules/BottomTopButton";
import { RecipeScreenProp, StackScreenNavigation } from '@customTypes/ScreenTypes';
import { extractIngredientsNameWithQuantity, ingredientTableElement, ingredientType, isIngredientEqual, recipeTableElement } from "@customTypes/DatabaseElementTypes";
import { backIcon, crossIcon, enumIconTypes, iconsColor, iconsSize, pencilIcon, plusIcon, trashIcon } from "@assets/images/Icons";
import { recipeDb } from "@utils/RecipeDatabase";
import RoundButton from "@components/atomic/RoundButton";
import { palette } from "@styles/colors";
import { fileGestion } from "@utils/FileGestion";
import { CropPropsType } from "./Crop";
import { recipeColumnsNames, extractTagsName } from '../customTypes/DatabaseElementTypes';
import { recognizeText } from "@utils/OCR";
import { localImgData } from "@customTypes/ImageTypes";
import { AsyncAlert } from "@utils/AsyncAlert";

export enum recipeStateType {
    readOnly = 0,
    edit = 1,
    add = 2,
}

type readRecipe = {
    mode: "readOnly",
    recipe: recipeTableElement
}

type addRecipeManually = {
    mode: "addManually",
}

type addRecipeFromPicture = {
    mode: "addfromPic",
    img: localImgData
}


export type RecipePropType = readRecipe | addRecipeManually | addRecipeFromPicture

export default function Recipe({ route, navigation }: RecipeScreenProp) {

    const prop: RecipePropType = route.params;

    const recipeFromProps: recipeTableElement = (prop.mode == "readOnly") ? (prop.recipe) : ({ image_Source: "", ingredients: [], persons: 0, preparation: [], season: "", tags: [], time: 0, title: "", description: "" });

    let propImg = new Array<localImgData>();
    if (prop.mode == 'addfromPic') {
        propImg.push(prop.img)
    }

    let editMode: recipeStateType;

    switch (prop.mode) {
        case 'readOnly':
            editMode = recipeStateType.readOnly;
            break;
        case 'addManually':
            editMode = recipeStateType.edit;
            break;
        case 'addfromPic':
            editMode = recipeStateType.add;
            break;
    }



    const [stackMode, setStackMode] = useState<recipeStateType>(editMode);
    const [propRecipe, setPropRecipe] = useState<recipeTableElement>(recipeFromProps);


    const [imgForOCR, setImgForOCR] = useState<Array<localImgData>>(propImg);

    const [randomTags, setRandomTags] = useState<string>("");

    // const testImg = new Array<localImgData>()
    // testImg.push({uri: fileGestion.get_directoryUri() + "bike.jpg", width: 100, height:100})

    // const [imgForOCR, setImgForOCR] = useState<Array<localImgData>>(testImg);


    const openModalforField = (field: recipeColumnsNames) => {
        navigation.navigate('Modal', {
            arrImg: imgForOCR, setState: setImgForOCR, onSelectFunction: (imgSelected: localImgData, newNav: StackScreenNavigation) => {
                navigation.navigate('Crop', {
                    imageToCrop: imgSelected, validateFunction: async (newImg: localImgData) => {
                        await fillOneField(newImg.uri, field);
                        newNav.goBack();
                    }
                });
            }
        });
    }

    const fillOneField = async (uri: string, field: recipeColumnsNames) => {
        // TODO for debug only, remove these for release
        switch (field) {
            case recipeColumnsNames.image:
                setPropRecipe({ ...propRecipe, image_Source: uri });
                break;
            case recipeColumnsNames.title:
                const title = await recognizeText<string>(uri, field);
                // setPropRecipe({...propRecipe, title: title});
                setPropRecipe({ ...propRecipe, title: "Aiguillettes de poulet à la sauce satay" });
                break;
            case recipeColumnsNames.description:
                const description = await recognizeText<string>(uri, field);
                // setPropRecipe({...propRecipe, description: description});
                setPropRecipe({ ...propRecipe, description: "Cuisinez nos filets de poulet français avec\ndu riz basmati bio et une sauce satay maison: un condiment asiatique à base de cacahuètes et gingembre !" });
                break;
            case recipeColumnsNames.tags:
                // TODO
                const tags = await recognizeText<Array<string>>(uri, field);
                // setPropRecipe({...propRecipe, tags: tags});
                break;
            case recipeColumnsNames.persons:
                const persons = await recognizeText<number>(uri, field);
                // setPropRecipe({...propRecipe, persons: persons});
                setPropRecipe({ ...propRecipe, persons: 2 });
                break;
            case recipeColumnsNames.ingredients:
                const ingredients = await recognizeText<Array<string>>(uri, field);
                // setPropRecipe({...propRecipe, ingredients: ingredients});
                setPropRecipe({ ...propRecipe, ingredients: [{ ingName: "Filet de Poulet", unit: "", quantity: 2, type: ingredientType.poultry, season: "*" }, { ingName: "Cachuètes grillées", unit: "g", quantity: 25, type: ingredientType.condiment, season: "*" }, { ingName: "Citron vert", unit: "", quantity: 0.5, type: ingredientType.condiment, season: "*" }, { ingName: "Coriandre", unit: "qq brins", type: ingredientType.spice, season: "*" }, { ingName: "Gousse d'ail", unit: "", quantity: 0.5, type: ingredientType.condiment, season: "*" }, { ingName: "Lait de coco", unit: "mL", quantity: 150, type: ingredientType.dairy, season: "*" }, { ingName: "Oignon jaune", unit: "", quantity: 0.5, type: ingredientType.condiment, season: "*" }, { ingName: "Riz basmati", unit: "g", quantity: 150, type: ingredientType.cerealProduct, season: "*" }, { ingName: "Sucre", unit: "cc", quantity: 0.5, type: ingredientType.sugar, season: "*" }] });
                break;
            case recipeColumnsNames.preparation:
                const preparation = await recognizeText<Array<string>>(uri, field);
                // setPropRecipe({...propRecipe, preparation: preparation});
                setPropRecipe({ ...propRecipe, preparation: ["LE RIZ--Portez à ébullition une casserole d'eau salée.\nFaites cuire le riz selon les indications du paquet.\nPendant ce temps, préparez les filets de poulet à la sauce satay.\n", "LA SAUCE SATAY--Dans le bol d'un mixeur, déposez les ingrédients suivants :\nÉpluchez et hachez le gingembre.\nAjoutez les cacahuètes, le sucre et le lait de coco.\nSalez, poivrez. Mixez jusqu'à obtenir une texture homogène.\n", "LA CUISSON DU POULET--Coupez les filets de poulet en lanières.\nÉmincez l'oignon.\nPressez ou hachez l'ail.\nDans une poêle, faites chauffer un filet d'huile de cuisson à feu moyen à vif.\nFaites revenir l'oignon et l'ail 5 min.\nAu bout des 5 min, ajoutez le poulet et faites-le revenir 5 min environ.\nSalez légèrement, poivrez.\nAjoutez la sauce satay dans la sauteuse et poursuivez la cuisson 2 min\nen remuant régulièrement. Goûtez et rectifiez l'assaisonnement si nécessaire.\nEn parallèle, ciselez la coriandre (en entier, les tiges se consomment).\nCoupez le citron en quartiers.\nDégustez sans attendre vos aiguillettes de poulet sauce satay accompagnées\ndu riz! Parsemez le tout de coriandre et arrosez d'un filet de jus de citron!"] });
                break;
            case recipeColumnsNames.time:
                const time = await recognizeText<number>(uri, field);
                // setPropRecipe({...propRecipe, time: time});
                setPropRecipe({ ...propRecipe, time: 20 });
                break;
        }

    }

    const readOnlyValidation = async () => {
        await recipeDb.addRecipeToShopping(propRecipe);
        navigation.goBack();
        AsyncAlert("SUCCESSFULLY ADDED RECIPE TO SHOPPING LIST", `Recipe titled "${propRecipe.title}" has been successfully added to the shopping list`, "Understood");
    }
    
    const editValidation = async () => {
        // No need to wait for cleanCache
        fileGestion.clearCache();
        await recipeDb.editRecipe();
        setStackMode(recipeStateType.readOnly);
    }

    const addValidation = async () => {
        const nullRecipe = { image_Source: "", ingredients: [], persons: 0, preparation: [], season: "", tags: [], time: 0, title: "", description: "" }
        if (propRecipe == nullRecipe) {
            AsyncAlert("All elements missing", "You haven't add any of the elements to your recipe. Please enter before validate at least: \
            \n\t- an image\n\t- a title\n\t- some ingredients\n\t- for how many persons this recipe is\n\t- some instructions for the preparation");
        } else {
            let missingElem = new Array();

            if (propRecipe.image_Source.length == 0) {
                missingElem.push("an image");
            }
            if (propRecipe.title.length == 0) {
                missingElem.push("a title");
            }
            if (propRecipe.ingredients.length == 0) {
                missingElem.push("some ingredients");
            }
            if (propRecipe.preparation.length == 0) {
                missingElem.push("some instructions for the preparation");
            }
            if (propRecipe.persons == 0) {
                missingElem.push("for how many persons this recipe is");
            }


            // No mandatory elements missing
            if (missingElem.length == 0) {
                try {
                    // TODO deal case where 2 recipes share the same titel. Is it allowed ?
                    const newUri = await fileGestion.saveRecipeImage(propRecipe.image_Source, propRecipe.title);
                    let recipeToAdd = propRecipe;
                    const uriSplit = (newUri as string).split("/");
                    recipeToAdd.image_Source = uriSplit[uriSplit.length - 1];

                    // No need to wait
                    fileGestion.clearCache();

                    await recipeDb.addRecipe(recipeToAdd);
                    navigation.goBack();
                    AsyncAlert("SUCCESSFULLY ADDED RECIPE TO DATABASE", `Recipe titled "${recipeToAdd.title}" has been successfully added to the database`, "Understood");
                }
                catch (error) {
                    console.warn("Something went wrong when validating new recipe : ", error)
                }


            } else {
                let alertTitle = "";
                let alertMsg = "";
                if (missingElem.length == 1) {
                    alertTitle = "Missing element"
                    alertMsg = "You're missing " + missingElem[0] + " to your recipe. Please add this before validate."
                } else {
                    alertTitle = "Missing elements"
                    alertMsg = "You haven't add all of the elements to your recipe. Please enter before validate at least: "
                    missingElem.forEach(elem => {
                        alertMsg += `\n\t- ${elem}`
                    });
                }
                AsyncAlert(alertTitle, alertMsg, "Understood")
            }
        }

    }

    let validationButtonText: string = "";
    let validationFunction: Promise<void> | any;

    switch (stackMode) {

        case recipeStateType.readOnly:
            validationButtonText = "Add this recipe to the menu";
            validationFunction = readOnlyValidation;
            break;
        case recipeStateType.edit:
            validationButtonText = "Validate the recipe with these modifications";
            validationFunction = editValidation;
            break;
        case recipeStateType.add:
            validationButtonText = "Add this new recipe";
            validationFunction = addValidation;
            break;
    }


    {/* TODO let the possibility to add manually the field */ }

    const editTags = (newTag: string, oldTag?: string) => {

        // TODO pass through RecipeDatabase instead
        const newTagsArray = propRecipe.tags;
        if (oldTag && oldTag.length > 0) {
            for (let i = 0; i < newTagsArray.length; i++) {
                if (newTagsArray[i].tagName === oldTag) {
                    newTagsArray[i].tagName = newTag
                    break;
                }
            }
        } else {
            newTagsArray.push({ tagName: newTag });
        }
        setPropRecipe({ ...propRecipe, tags: newTagsArray });
    }

    const editIngredients = (newIngredient: string, oldIngredient?: string) => {
        const newIngredientArray = propRecipe.ingredients;

        if (oldIngredient && oldIngredient.length > 0) {

            // ${newQuantity}${unitySeparator}${unit}${textSeparator}${ingName}
            const splitOldIngredient = oldIngredient.split(textSeparator)
            const splitOldUnitAndQuantity = splitOldIngredient[0].split(unitySeparator);

            const oldName = splitOldIngredient[1];
            const oldQuantity = Number(splitOldUnitAndQuantity[0]);
            const oldUnit = splitOldUnitAndQuantity[1];

            const splitNewIngredient = newIngredient.split(textSeparator)
            const splitNewUnitAndQuantity = splitNewIngredient[0].split(unitySeparator);

            const newName = splitNewIngredient[1];
            const newQuantity = Number(splitNewUnitAndQuantity[0]);
            const newUnit = splitOldUnitAndQuantity[1];


            const oldIngToCompareWith: ingredientTableElement = { ingName: oldName, quantity: oldQuantity, unit: oldUnit, season: "*", type: ingredientType.undefined }

            for (let i = 0; i < newIngredientArray.length; i++) {
                if (isIngredientEqual(oldIngToCompareWith, newIngredientArray[i])) {
                    newIngredientArray[i].ingName = newName;
                    newIngredientArray[i].quantity = newQuantity;
                    newIngredientArray[i].unit = newUnit;
                    break;
                }
            }
        } else {
            // Replace by a add to database ? throw an error ?
            newIngredientArray.push({ ingName: newIngredient, season: "*", type: ingredientType.undefined, unit: "" });
        }
        setPropRecipe({ ...propRecipe, ingredients: newIngredientArray });
    }

    const editPreparation = (newPreparation: string, oldPreparation?: string) => {
        let newPreparationArray = propRecipe.preparation;

        if (oldPreparation && oldPreparation.length > 0) {
            for (let i = 0; i < newPreparationArray.length; i++) {
                if (newPreparationArray[i] === oldPreparation) {
                    newPreparationArray[i] = newPreparation;
                    break;
                }
            }
        } else {
            newPreparationArray.push(newPreparation);
        }

        const indexEmpty = newPreparationArray.indexOf(textSeparator, 0);
        if (indexEmpty > -1) {
            newPreparationArray.splice(indexEmpty, 1);
        }

        setPropRecipe({ ...propRecipe, preparation: newPreparationArray });
    }

    const renderImage = () => {
        switch (stackMode) {
            case recipeStateType.readOnly:
                return (
                    <View style={imageStyle.containerFullStyle}>
                        <Image source={{ uri: propRecipe.image_Source }} style={imageStyle.imageInsideView} />
                    </View>
                )
            case recipeStateType.edit:
            case recipeStateType.add:
                return (
                    <View style={imageStyle.containerFullStyle}>
                        <View style={imageStyle.imageInsideView}>
                            {(stackMode == recipeStateType.add && propRecipe.image_Source.length == 0) ?
                                <RoundButton style={{ ...viewButtonStyles.centeredView, flex: 1 }} diameter={mediumButtonDiameter} icon={{ type: enumIconTypes.materialCommunity, name: plusIcon, size: iconsSize.small, color: "#414a4c" }} onPressFunction={() => openModalforField(recipeColumnsNames.image)} />
                                :
                                // TODO add button to take picture when image is empty (with persmission to edit this time)
                                <Image source={{ uri: propRecipe.image_Source }} style={imageStyle.imageInsideView} contentFit="cover" />
                            }
                        </View>
                    </View>
                )
        }

    }

    const renderTitle = () => {
        switch (stackMode) {
            case recipeStateType.readOnly:
                return (
                    <View style={screenViews.sectionView}>
                        <Text style={typoStyles.title}>{propRecipe.title}</Text>
                    </View>
                )
            case recipeStateType.edit:
            case recipeStateType.add:
                return (
                    <View style={screenViews.sectionView}>
                        <Text style={typoStyles.header}>Title of the recipe : </Text>
                        {(stackMode == recipeStateType.add && propRecipe.title.length == 0) ?
                            <RoundButton style={{ ...viewButtonStyles.centeredView, flex: 1 }} diameter={mediumButtonDiameter} icon={{ type: enumIconTypes.materialCommunity, name: plusIcon, size: iconsSize.small, color: "#414a4c" }} onPressFunction={() => openModalforField(recipeColumnsNames.title)} />
                            :
                            <TextInput style={titleBorder} value={propRecipe.title} onChangeText={newTitle => setPropRecipe({ ...propRecipe, title: newTitle })} multiline={true} />
                        }
                    </View>
                )
        }
    }

    const renderDescription = () => {
        switch (stackMode) {
            case recipeStateType.readOnly:
                return (
                    <View style={screenViews.sectionView}>
                        <Text style={typoStyles.paragraph}>{propRecipe.description}</Text>
                    </View>
                )
            case recipeStateType.edit:
            case recipeStateType.add:
                return (
                    <View style={screenViews.sectionView}>
                        <Text style={typoStyles.header}>Description of the recipe : </Text>
                        {(stackMode == recipeStateType.add && propRecipe.description.length == 0) ?
                            <RoundButton style={{ ...viewButtonStyles.centeredView, flex: 1 }} diameter={mediumButtonDiameter} icon={{ type: enumIconTypes.materialCommunity, name: plusIcon, size: iconsSize.small, color: "#414a4c" }} onPressFunction={() => openModalforField(recipeColumnsNames.description)} />
                            :
                            <TextInput style={paragraphBorder} value={propRecipe.description} onChangeText={newTitle => setPropRecipe({ ...propRecipe, description: newTitle })} multiline={true} />
                        }
                    </View>
                )
        }
    }

    const renderTags = () => {
        const tags = extractTagsName(propRecipe.tags);
        switch (stackMode) {
            case recipeStateType.readOnly:
                return (
                    <View style={screenViews.sectionView}>
                        <HorizontalList list={{ propType: "Tag", item: tags, onTagPress: () => null }} />
                    </View>
                )
            case recipeStateType.edit:
            case recipeStateType.add:
                if (randomTags.length == 0) {
                    recipeDb.searchRandomlyTags(3).then((randomTags) => {
                        let tagsName = new Array<string>()
                        randomTags.forEach(element => {
                            tagsName.push(element.tagName)
                        });
                        setRandomTags(tagsName.join(', '))
                    });
                }
                return (
                    <View style={screenViews.sectionView}>
                        <Text style={typoStyles.header}>Tags of the recipe : </Text>
                        <Text style={typoStyles.element}>Tags are a way to identify a recipe and make easier its search. Here are some examples of tags you can have : {randomTags}</Text>
                        <View style={screenViews.tabView}>
                            {/* TODO make a proper implementation  */}
                            {(stackMode != recipeStateType.add && propRecipe.tags.length > 0) ?
                                <View style={{ flex: 3 }}>
                                    <HorizontalList list={{
                                        propType: "Tag", item: tags, icon: { type: enumIconTypes.entypo, name: crossIcon, size: padding.large, color: iconsColor, style: { paddingRight: 5 } }, editText: {
                                            withBorder: true, onChangeFunction: editTags
                                        }, onTagPress: () => null
                                    }} />
                                </View>
                                : null}

                            {/* TODO icon doesn't work */}
                            <RoundButton style={{ ...viewButtonStyles.centeredView, flex: 1 }} diameter={mediumButtonDiameter} icon={{ type: enumIconTypes.materialCommunity, name: plusIcon, size: iconsSize.small, color: "#414a4c" }} onPressFunction={() => editTags("New Tag")} />
                        </View>
                    </View>
                )
        }
    }

    const renderIngredients = () => {
        switch (stackMode) {
            case recipeStateType.readOnly:
                return (
                    <View style={screenViews.sectionView}>
                        <TextRender title={`Ingredients (${propRecipe.persons} persons)`} text={extractIngredientsNameWithQuantity(propRecipe.ingredients)} render={typoRender.ARRAY} />
                    </View>
                )
            case recipeStateType.edit:
            case recipeStateType.add:
                return (
                    <View style={screenViews.sectionView}>
                        {/* TODO add the possibility to add manually for all except image */}
                        {(stackMode == recipeStateType.add && propRecipe.persons == 0) ?

                            <View style={screenViews.tabView}>
                                <Text style={{ ...typoStyles.header, flex: 5 }}>This recipe is for : </Text>
                                <RoundButton style={{ ...viewButtonStyles.centeredView, flex: 6, alignItems: 'flex-start' }} diameter={mediumButtonDiameter} icon={{ type: enumIconTypes.materialCommunity, name: plusIcon, size: iconsSize.small, color: "#414a4c" }} onPressFunction={() => openModalforField(recipeColumnsNames.persons)} />
                            </View>
                            :
                            // TODO Kind of buggy when 0
                            <View style={screenViews.tabView}>
                                <Text style={{ ...typoStyles.header, flex: 5 }}>This recipe is for : </Text>
                                <TextInput style={{ ...headerBorder, flex: 1, textAlign: "center" }} value={propRecipe.persons.toString()} onChangeText={newPerson => setPropRecipe({ ...propRecipe, persons: Number(newPerson) })} keyboardType="numeric" maxLength={2} />
                                <Text style={{ ...typoStyles.header, flex: 4 }}> persons</Text>
                            </View>
                        }
                        <Text style={typoStyles.title}>Ingredients</Text>

                        {(stackMode == recipeStateType.add && propRecipe.ingredients.length == 0) ?
                            <View style={viewButtonStyles.centeredView}>
                                <RoundButton diameter={mediumButtonDiameter} icon={{ type: enumIconTypes.materialCommunity, name: plusIcon, size: iconsSize.small, color: "#414a4c" }} onPressFunction={() => openModalforField(recipeColumnsNames.ingredients)} />
                            </View>
                            :
                            <View>
                                <View style={screenViews.tabView}>
                                    <Text style={{ ...typoStyles.header, flex: 2, textAlign: "center" }}>Quantity</Text>
                                    <Text style={{ ...typoStyles.header, flex: 1, textAlign: "center" }}>Unit</Text>

                                    <Text style={{ ...typoStyles.header, flex: 3, textAlign: "center", flexWrap: 'wrap' }}>Ingredient name</Text>
                                </View>
                                {/* TODO : Make it as a choice to avoid errors */}
                                <TextRender text={extractIngredientsNameWithQuantity(propRecipe.ingredients)} render={typoRender.ARRAY} editText={{ withBorder: true, onChangeFunction: editIngredients }} />

                                <View style={viewButtonStyles.centeredView}>
                                    <RoundButton diameter={mediumButtonDiameter} icon={{ type: enumIconTypes.materialCommunity, name: plusIcon, size: iconsSize.small, color: "#414a4c" }} onPressFunction={() => editIngredients(` ${textSeparator}New Ingredient`)} />
                                </View>
                            </View>
                        }
                    </View>
                )
        }
    }

    const renderPreparation = () => {
        switch (stackMode) {
            case recipeStateType.readOnly:
                return (
                    <View style={screenViews.sectionView}>
                        <Text style={typoStyles.title}>{`Preparation (${propRecipe.time} min)`}</Text>
                        <TextRender text={propRecipe.preparation} render={typoRender.SECTION} />
                    </View>
                )
            case recipeStateType.edit:
            case recipeStateType.add:
                return (
                    <View>
                        {(stackMode == recipeStateType.add && propRecipe.time == 0) ?
                            <View style={screenViews.tabView}>
                                <Text style={{ ...typoStyles.header, flex: 6 }}>Time to prepare the recipe : </Text>
                                <RoundButton style={{ ...viewButtonStyles.centeredView, flex: 3, alignItems: 'flex-start' }} diameter={mediumButtonDiameter} icon={{ type: enumIconTypes.materialCommunity, name: plusIcon, size: iconsSize.small, color: "#414a4c" }} onPressFunction={() => openModalforField(recipeColumnsNames.time)} />
                            </View>
                            :
                            <View style={screenViews.tabView}>
                                <Text style={{ ...typoStyles.header, flex: 6 }}>Time to prepare the recipe : </Text>
                                <TextInput style={{ ...headerBorder, flex: 1, textAlign: "center" }} value={propRecipe.time.toString()} onChangeText={newTime => setPropRecipe({ ...propRecipe, time: Number(newTime) })} keyboardType="numeric" maxLength={5} />
                                <Text style={{ ...typoStyles.header, flex: 1 }}>min</Text>
                            </View>
                        }

                        {/* TODO let the possibility to add another time in picture */}
                        {(stackMode == recipeStateType.add && propRecipe.preparation.length == 0) ?
                            <View>
                                <Text style={typoStyles.title}>{`Preparation`}</Text>
                                <View style={{ ...screenViews.sectionView, ...viewButtonStyles.centeredView }}>
                                    <RoundButton diameter={mediumButtonDiameter} icon={{ type: enumIconTypes.materialCommunity, name: plusIcon, size: iconsSize.small, color: "#414a4c" }} onPressFunction={() => openModalforField(recipeColumnsNames.preparation)} />
                                </View>
                            </View>
                            :
                            <View>
                                <TextRender text={propRecipe.preparation} render={typoRender.SECTION} editText={{
                                    withBorder: true, onChangeFunction: editPreparation
                                }} />
                                <View style={{ ...screenViews.sectionView, ...viewButtonStyles.centeredView }}>
                                    <RoundButton diameter={mediumButtonDiameter} icon={{ type: enumIconTypes.materialCommunity, name: plusIcon, size: iconsSize.small, color: "#414a4c" }} onPressFunction={() => editPreparation(`New Step Title${textSeparator}New step content`)} />
                                </View>
                            </View>

                        }

                    </View>
                )
        }
    }


    return (
        <SafeAreaView style={screenViews.screenView}>
            <ScrollView horizontal={false} showsVerticalScrollIndicator={false} style={scrollView(rectangleButtonHeight).view}>
                <StatusBar animated={true} backgroundColor={palette.primary} />

                {renderImage()}

                {renderTitle()}

                {renderDescription()}

                {renderTags()}

                {renderIngredients()}

                {renderPreparation()}

                {/* Add some space to avoid missclicking */}
                <View style={{ paddingVertical: LargeButtonDiameter / 2 }} />

                {/* TODO add number of person */}
                {/* TODO add nutrition */}
            </ScrollView>

            <BottomTopButton as={RoundButton} position={bottomTopPosition.top_left} buttonOffset={0} onPressFunction={() => navigation.goBack()} diameter={LargeButtonDiameter} icon={{ type: enumIconTypes.materialCommunity, name: backIcon, size: iconsSize.medium, color: "#414a4c" }} />

            {stackMode == recipeStateType.readOnly ?
                <BottomTopButton as={RoundButton} position={bottomTopPosition.top_right} buttonOffset={0} onPressFunction={() => null} diameter={LargeButtonDiameter} icon={{ type: enumIconTypes.fontAwesome, name: trashIcon, size: iconsSize.medium, color: "#414a4c" }} />
                : null}

            {stackMode == recipeStateType.readOnly ?
                <BottomTopButton as={RoundButton} position={bottomTopPosition.bottom_right} buttonOffset={BottomTopButtonOffset} onPressFunction={() => setStackMode(recipeStateType.edit)} diameter={LargeButtonDiameter} icon={{ type: enumIconTypes.materialCommunity, name: pencilIcon, size: iconsSize.medium, color: "#414a4c" }} />
                : null}

            <BottomTopButton as={RectangleButton} position={bottomTopPosition.bottom_full} centered={true} text={validationButtonText} onPressFunction={async () => await validationFunction()} />
        </SafeAreaView>
    )
}