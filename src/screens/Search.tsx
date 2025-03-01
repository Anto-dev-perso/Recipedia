import SearchBar from "@components/organisms/SearchBar";
import {screenViews, scrollView} from "@styles/spacing";
import React, {useEffect, useState} from "react";
import {Keyboard, SafeAreaView, ScrollView, StatusBar} from "react-native";
import {SearchScreenProp} from '@customTypes/ScreenTypes';
import TextRender from "@components/molecules/TextRender";
import {typoRender} from "@styles/typography";
import {ingredientTableElement, recipeTableElement} from "@customTypes/DatabaseElementTypes";
import {listFilter, TListFilter} from "@customTypes/RecipeFiltersTypes";
import {
    addValueToMultimap,
    editTitleInMultimap,
    extractFilteredRecipeDatas,
    filterFromRecipe,
    removeTitleInMultimap,
    removeValueToMultimap
} from "@utils/FilterFunctions";
import {palette} from "@styles/colors";
import FiltersSelection from "@components/organisms/FiltersSelection";
import SearchResultDisplay from "@components/organisms/SearchResultDisplay";
import RecipeDatabase from "@utils/RecipeDatabase";
import {useFocusEffect} from "@react-navigation/native";

export default function Search({route, navigation}: SearchScreenProp) {
    const [filtersState, setFiltersState] = useState(new Map<TListFilter, Array<string>>());

    const [filteredRecipes, setFilteredRecipes] = useState<Array<recipeTableElement>>(RecipeDatabase.getInstance().get_recipes());

    const [filteredIngredients, setFilteredIngredients] = useState(new Array<ingredientTableElement>());
    const [filteredTags, setFilteredTags] = useState(new Array<string>());
    const [filteredTitles, setFilteredTitles] = useState(new Array<string>());
    const [searchPhrase, setSearchPhrase] = useState('');


    const [searchBarClicked, setSearchBarClicked] = useState(false);
    const [addingAFilter, setAddingAFilter] = useState(false);

// TODO maybe changing this file to a class so that we can use constructor

    function updateFilteredRecipes(recipeArray: Array<recipeTableElement>) {
        const recipesFiltered = filterFromRecipe(recipeArray, filtersState);
        setFilteredRecipes([...recipesFiltered]);
        extractTitleTagsAndIngredients(recipesFiltered);
    }

    function extractTitleTagsAndIngredients(recipeArray: Array<recipeTableElement>) {
        const [titles, ingredients, tags] = extractFilteredRecipeDatas(recipeArray);
        setFilteredTitles(titles);
        setFilteredIngredients(ingredients);
        setFilteredTags(tags);
        // TODO maybe call the database with the filter in it so that we benefit of the SQL optimizations and we don't take too much RAM
    }

    useEffect(() => {
        updateFilteredRecipes(filteredRecipes);
    }, [filtersState]);

    useEffect(() => {
        extractTitleTagsAndIngredients(filteredRecipes);
    }, []);


    useFocusEffect(() => {
        if (filteredRecipes.length === RecipeDatabase.getInstance().get_recipes().length) {
            return;
        }
        let recipeDeletedName = "";
        for (const recipe of filteredRecipes) {
            if (!RecipeDatabase.getInstance().isRecipeExist(recipe)) {
                recipeDeletedName = recipe.title;
                break;
            }
        }
        if (recipeDeletedName.length > 0) {
            updateFilteredRecipes(filteredRecipes.filter((recipe) => recipe.title !== recipeDeletedName));
        }
    });


    function updateSearchString(newSearchString: string) {
        if (newSearchString === "") {
            removeTitleInMultimap(filtersState);
            setFilteredRecipes(RecipeDatabase.getInstance().get_recipes());
        } else {
            const previousTitle = filtersState.get(listFilter.recipeTitleInclude);
            if (previousTitle !== undefined && previousTitle.length == 1 && previousTitle[0].length > newSearchString.length) {
                setFilteredRecipes(RecipeDatabase.getInstance().get_recipes());
            }
            editTitleInMultimap(filtersState, newSearchString);
        }
        setFiltersState(new Map(filtersState));
        setSearchPhrase(newSearchString);
    }

    function addAFilterToTheState(filterTitle: TListFilter, value: string) {
        addValueToMultimap(filtersState, filterTitle, value);
        setFiltersState(new Map(filtersState));
    }

    function removeAFilterToTheState(filterTitle: TListFilter, value: string) {
        removeValueToMultimap(filtersState, filterTitle, value);
        setFilteredRecipes(RecipeDatabase.getInstance().get_recipes());
        setFiltersState(new Map(filtersState));
        if (filterTitle == listFilter.recipeTitleInclude) {
            setSearchPhrase("");
        }
    }

    return (
        <SafeAreaView style={screenViews.screenView} testID={'SearchScreen'}>
            <StatusBar animated={true} backgroundColor={palette.primary}/>
            <ScrollView style={scrollView(0).view} showsVerticalScrollIndicator={false}>
                <SearchBar clicked={searchBarClicked} searchPhrase={searchPhrase} setClicked={setSearchBarClicked}
                           setSearch={updateSearchString}/>

                {searchBarClicked ?
                    <TextRender text={filteredTitles}
                                render={typoRender.CLICK_LIST} onClick={(str: string) => {
                        Keyboard.dismiss();
                        setSearchBarClicked(false);
                        updateSearchString(str);
                    }}/>
                    :
                    <FiltersSelection printSectionClickable={addingAFilter} setPrintSectionClickable={setAddingAFilter}
                                      tagsList={filteredTags} ingredientsList={filteredIngredients}
                                      filtersState={filtersState} addFilter={addAFilterToTheState}
                                      removeFilter={removeAFilterToTheState}/>
                }
                {(!addingAFilter && !searchBarClicked) ? <SearchResultDisplay recipeArray={filteredRecipes}/> : null}
            </ScrollView>
        </SafeAreaView>
    )
}
