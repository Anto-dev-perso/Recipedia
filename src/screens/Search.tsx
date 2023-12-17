

import SearchBar from "@components/organisms/SearchBar";
import { screenViews, scrollView } from "@styles/spacing";
import RecipeDatabase, { recipeDb } from "@utils/RecipeDatabase";
import React, { useEffect, useState } from "react";
import { Alert, Keyboard, SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
import { SearchScreenProp } from '@customTypes/ScreenTypes';
import { FlatList } from "react-native-gesture-handler";
import TextRender from "@components/molecules/TextRender";
import { typoRender } from "@styles/typography";
import { recipeTableElement } from "@customTypes/DatabaseElementTypes";
import SearchResultDisplay from "@components/organisms/SearchResultDisplay";
import FiltersSelection from "@components/organisms/FiltersSelection";
import { listFilter, recipeFilterType } from "@customTypes/RecipeFiltersTypes";
import { extractFilteredRecipeDatas, filterPrepTimeFromRecipe, filterTagsFromRecipe, filterIngredientsFromRecipe, recipeTitleFilteredFunction } from "@utils/FilterFunctions";
import { palette } from "@styles/colors";

export default function Search ({ route, navigation }: SearchScreenProp) {

    const [recipes, setAllRecipes] = useState<Array<recipeTableElement>>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<Array<recipeTableElement>>([]);

    const [filteredIngredients, setFilteredIngredients] = useState<Array<string>>([""]);
    const [filteredTags, setFilteredTags] = useState<Array<string>>([""]);
    const [filteredTitles, setFilteredTitles] = useState<Array<string>>([""]);

    const [searchBarClicked, setSearchBarClicked] = useState(false);
    const [addingAFilter, setAddingAFilter] = useState(false);
    const [typeOfFilterClick, setTypeOfFilterClick] = useState<Array<listFilter>>([]);

    const [searchPhrase, setSearchPhrase] = useState("");

    const [filtersIngredients, setFiltersIngredients] = useState<Array<recipeFilterType>>([]);
    const [filtersTags, setFiltersTags] = useState<Array<recipeFilterType>>([]);
    const [filtersPrepTime, setFiltersPrepTime] = useState<Array<recipeFilterType>>([]);


    useEffect(() => {
            recipeDb.getAllRecipes().then(elems => {
                setAllRecipes(elems);
                setFilteredRecipes(elems);

                let [titles, tags, ingredients] = extractFilteredRecipeDatas(elems);
                setFilteredTitles(titles);
                setFilteredTags(tags);
                setFilteredIngredients(ingredients);
            })
            .catch((error: any) => console.log(error));
      }, [])

      useEffect(() => {
        let arrayFiltered = recipes;
        
        arrayFiltered = recipeTitleFilteredFunction(arrayFiltered, searchPhrase);
        arrayFiltered = filterPrepTimeFromRecipe(arrayFiltered, filtersPrepTime);
        arrayFiltered = filterTagsFromRecipe(arrayFiltered, filtersTags);
        arrayFiltered = filterIngredientsFromRecipe(arrayFiltered, filtersIngredients);
        
        let [titles, tags, ingredients] = extractFilteredRecipeDatas(arrayFiltered);
        setFilteredTitles(titles);

        setFilteredRecipes(arrayFiltered);
        
      }, [searchPhrase, filtersTags, filtersPrepTime, filtersIngredients])

      useEffect(() => {
        let [titles, tags, ingredients] = extractFilteredRecipeDatas(filteredRecipes);
        
        setFilteredTags(tags);
        setFilteredIngredients(ingredients);
        
      }, [addingAFilter])


    return (
        <SafeAreaView style={screenViews.screenView}>
            <StatusBar animated={true} backgroundColor={palette.primary}/>
            <ScrollView style={scrollView(0).view} showsVerticalScrollIndicator={false}>
                <SearchBar clicked={searchBarClicked} searchPhrase={searchPhrase} setClicked={setSearchBarClicked} setSearchPhrase={setSearchPhrase} />

                {searchBarClicked ? 
                    <TextRender text={filteredTitles} render={typoRender.CLICK_LIST} onClick={(str: string) => {
                        Keyboard.dismiss();
                        setSearchBarClicked(false);
                        setSearchPhrase(str);
                    }}/>
                : 
                        <FiltersSelection addingFilter={addingAFilter} setAddingFilter={setAddingAFilter} filtersProps={{sectionsState: typeOfFilterClick, ingredientsState: filtersIngredients, tagsState: filtersTags, prepTimeState: filtersPrepTime, setterIngredients: setFiltersIngredients, setterTags: setFiltersTags, setterPrepTime: setFiltersPrepTime, sectionsSetter: setTypeOfFilterClick}} tagsList={filteredTags} ingredientsList={filteredIngredients} />
                        
                }
                {(!addingAFilter && !searchBarClicked) ? <SearchResultDisplay recipeArray={filteredRecipes}/> : null}
            </ScrollView>
        </SafeAreaView>
    )
}