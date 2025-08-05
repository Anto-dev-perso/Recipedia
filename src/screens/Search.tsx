import React, {useEffect, useState} from "react";
import {FlatList, ListRenderItemInfo, SafeAreaView, ScrollView, View} from "react-native";
import {SearchScreenProp} from '@customTypes/ScreenTypes';
import {ingredientTableElement, recipeTableElement} from "@customTypes/DatabaseElementTypes";
import {listFilter, TListFilter} from "@customTypes/RecipeFiltersTypes";
import {
    addValueToMultimap,
    editTitleInMultimap,
    extractFilteredRecipeDatas,
    filterFromRecipe,
    removeTitleInMultimap,
    removeValueToMultimap,
    retrieveAllFilters
} from "@utils/FilterFunctions";
import RecipeDatabase from "@utils/RecipeDatabase";
import {useFocusEffect} from "@react-navigation/native";
import {useI18n} from "@utils/i18n";
import {Divider, Text, useTheme} from "react-native-paper";
import SearchBar from "@components/organisms/SearchBar";
import SearchBarResults from "@components/organisms/SearchBarResults";
import FiltersSelection from "@components/organisms/FiltersSelection";
import {padding} from "@styles/spacing";
import RecipeCard from "@components/molecules/RecipeCard";
import FilterAccordion from "@components/organisms/FilterAccordion";
import {useSeasonFilter} from "@context/SeasonFilterContext";

export default function Search({}: SearchScreenProp) {
    const {t} = useI18n();
    const {colors} = useTheme();

    const {seasonFilter} = useSeasonFilter();

    const [filtersState, setFiltersState] = useState(new Map<TListFilter, Array<string>>());
    const [filteredRecipes, setFilteredRecipes] = useState<Array<recipeTableElement>>(RecipeDatabase.getInstance().get_recipes());
    const [filteredIngredients, setFilteredIngredients] = useState(new Array<ingredientTableElement>());
    const [filteredTags, setFilteredTags] = useState(new Array<string>());
    const [filteredTitles, setFilteredTitles] = useState(new Array<string>());
    const [searchPhrase, setSearchPhrase] = useState('');
    const [searchBarClicked, setSearchBarClicked] = useState(false);
    const [addingFilterMode, setAddingFilterMode] = useState(false);

    function updateFilteredRecipes(recipeArray: Array<recipeTableElement>) {
        const recipesFiltered = filterFromRecipe(recipeArray, filtersState, t);
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

    function checkIfUpdateOfSeasonFilterIsPossible() {
        const seasonFilterKey = listFilter.inSeason;
        const seasonFilterValue = t(listFilter.inSeason);

        // Add the filter if there is already no filter set
        if (seasonFilter && filtersState.size === 0) {
            addAFilterToTheState(seasonFilterKey, seasonFilterValue);
        }
        // Remove the filter if it is the only one left
        else if (!seasonFilter && filtersState.size === 1 && filtersState.has(seasonFilterKey)) {
            removeAFilterToTheState(seasonFilterKey, seasonFilterValue);
        }
    }

    useEffect(() => {
        checkIfUpdateOfSeasonFilterIsPossible();
        extractTitleTagsAndIngredients(filteredRecipes);
    }, []);

    // TODO Double rendering can occur when filter update
    useEffect(() => {
        updateFilteredRecipes(filteredRecipes);
    }, [filtersState]);

    useEffect(() => {
        checkIfUpdateOfSeasonFilterIsPossible();
    }, [seasonFilter]);

    // TODO use a context instead
    // Update filtered recipes when a recipe is deleted
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

    // Update search string and filter recipes
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

    function findFilterStringAndRemove(item: string) {
        for (const [key, value] of filtersState) {
            if (value.includes(item)) {
                removeAFilterToTheState(key, item);
                break;
            }
        }
    }


    const screenId = 'SearchScreen';
    const recipeCardsId = screenId + "::RecipeCards";

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: colors.background,}} testID={screenId}>
            {/* When there are no recipes, put flex on scrollView to child view to take the whole screen*/}
            <ScrollView contentContainerStyle={filteredRecipes.length === 0 ? {flex: 1} : {}}
                        showsVerticalScrollIndicator={true}>
                <SearchBar testId={screenId + "::SearchBar"} searchPhrase={searchPhrase}
                           setSearchBarClicked={setSearchBarClicked} updateSearchString={updateSearchString}/>

                {searchBarClicked ?
                    (<SearchBarResults testId={screenId + "::SearchBarResults"} filteredTitles={filteredTitles}
                                       setSearchBarClicked={setSearchBarClicked}
                                       updateSearchString={updateSearchString}/>)
                    : (
                        <View>
                            <FiltersSelection testId={screenId} filters={retrieveAllFilters(filtersState)}
                                              addingFilterMode={addingFilterMode}
                                              setAddingAFilter={setAddingFilterMode}
                                              onRemoveFilter={findFilterStringAndRemove}/>

                            <Divider testID={screenId + "::Divider"}/>

                            {addingFilterMode && (
                                <FilterAccordion
                                    testId={screenId + '::FilterAccordion'}
                                    tagsList={filteredTags}
                                    ingredientsList={filteredIngredients}
                                    filtersState={filtersState}
                                    addFilter={addAFilterToTheState}
                                    removeFilter={removeAFilterToTheState}
                                />
                            )}
                        </View>
                    )}

                {(!addingFilterMode && !searchBarClicked) && (
                    filteredRecipes.length > 0 ? (
                        <FlatList
                            data={filteredRecipes}
                            keyExtractor={(item) => item.id?.toString() || item.title}
                            numColumns={2}
                            scrollEnabled={false}
                            contentContainerStyle={{padding: padding.small}}
                            renderItem={({item, index}: ListRenderItemInfo<recipeTableElement>) =>
                                <RecipeCard testId={recipeCardsId + `::${index}`} size={"medium"} recipe={item}/>}
                        />
                    ) : (
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text testID={screenId + "::TextWhenEmpty"}
                                  variant={"titleMedium"}>{t('noRecipesFound')}</Text>
                        </View>
                    )
                )}
            </ScrollView>
        </SafeAreaView>
    )
}
