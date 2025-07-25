import {arrayOfType, ingredientTableElement, recipeTableElement} from "@customTypes/DatabaseElementTypes";
import {
    FiltersAppliedToDatabase,
    filtersCategories,
    listFilter,
    prepTimeValues,
    TListFilter
} from "@customTypes/RecipeFiltersTypes";
import {TFunction} from "i18next";


export function selectFilterCategoriesValuesToDisplay(tagsList: Array<string>, ingredientsList: Array<ingredientTableElement>, t: TFunction<"translation", undefined>): Array<FiltersAppliedToDatabase> {
    return filtersCategories
        .map(category => {
            const filterApplyToDatabase: FiltersAppliedToDatabase = {
                title: category as TListFilter,
                data: []
            };
            switch (category) {
                case listFilter.inSeason:
                    filterApplyToDatabase.data = new Array<string>(t(listFilter.inSeason));
                    break;
                case listFilter.tags:
                    filterApplyToDatabase.data = tagsList;
                    break;
                case listFilter.prepTime:
                    filterApplyToDatabase.data = prepTimeValues.map(time => t(time));
                    break;
                case listFilter.recipeTitleInclude:
                case listFilter.purchased:
                case listFilter.grainOrCereal:
                case listFilter.legumes:
                case listFilter.vegetable:
                case listFilter.plantProtein:
                case listFilter.condiment:
                case listFilter.sauce:
                case listFilter.meat:
                case listFilter.poultry:
                case listFilter.fish:
                case listFilter.seafood:
                case listFilter.dairy:
                case listFilter.cheese:
                case listFilter.sugar:
                case listFilter.spice:
                case listFilter.fruit:
                case listFilter.oilAndFat:
                case listFilter.nutsAndSeeds:
                case listFilter.sweetener:
                case listFilter.undefined:
                    filterApplyToDatabase.data = arrayOfType(ingredientsList, category).map(ing => ing.name);
                    break;
                default:
                    console.warn("selectFilterValuesToDisplay:: default shall not be reach");
                    filterApplyToDatabase.data = new Array<string>();
            }

            return filterApplyToDatabase;
        });
}


export function extractFilteredRecipeDatas(recipeArray: Array<recipeTableElement>): [Array<string>, Array<ingredientTableElement>, Array<string>] {
    // TODO is set really faster in this case ? To profile
    const ingredientsUniqueCollection = new Array<ingredientTableElement>();
    const tagsUniqueCollection = new Set<string>();

    for (const element of recipeArray) {
        for (const ing of element.ingredients) {
            if (ingredientsUniqueCollection.find(ingredient => ingredient.name === ing.name) === undefined) {
                ingredientsUniqueCollection.push(ing);
            }
        }
        for (const tag of element.tags) {
            tagsUniqueCollection.add(tag.name);
        }
    }

    const titleSortedArray = recipeArray.map(({title}) => title).sort();

    return [titleSortedArray, ingredientsUniqueCollection.sort(), Array.from(tagsUniqueCollection).sort()]
}

// TODO find a better type for the multimap (maybe https://github.com/teppeis/multimaps
export function filterFromRecipe(recipeArray: Array<recipeTableElement>, filter: Map<TListFilter, Array<string>>, t: TFunction<"translation", undefined>): Array<recipeTableElement> {
    if (filter.size == 0) {
        return new Array<recipeTableElement>(...recipeArray);
    }
    return new Array<recipeTableElement>(...recipeArray.filter(recipe => {
        let elementToKeep = true;
        for (const [key, value] of filter) {
            switch (key) {
                case listFilter.prepTime:
                    elementToKeep = elementToKeep && applyToRecipeFilterPrepTime(recipe, value, t);
                    break;
                case listFilter.recipeTitleInclude:
                    elementToKeep = elementToKeep && isTheElementContainsTheFilter(recipe.title, value);
                    break;
                case listFilter.inSeason:
                    elementToKeep = elementToKeep && isTheElementContainsTheFilter(recipe.season, value);
                    break;
                case listFilter.tags:
                    elementToKeep = elementToKeep && isTheElementContainsTheFilter(recipe.tags.map(tag => tag.name), value);
                    break;
                case listFilter.purchased:
                    // Nothing to do so break
                    break;
                case listFilter.grainOrCereal:
                case listFilter.legumes:
                case listFilter.vegetable:
                case listFilter.plantProtein:
                case listFilter.condiment:
                case listFilter.sauce:
                case listFilter.meat:
                case listFilter.poultry:
                case listFilter.fish:
                case listFilter.seafood:
                case listFilter.dairy:
                case listFilter.cheese:
                case listFilter.sugar:
                case listFilter.spice:
                case listFilter.fruit:
                case listFilter.oilAndFat:
                case listFilter.nutsAndSeeds:
                case listFilter.sweetener:
                    elementToKeep = elementToKeep && isTheElementContainsTheFilter(recipe.ingredients.map(ing => ing.name), value);
                    break;
                case listFilter.undefined:
                default:
                    console.error("filterFromRecipe:: Impossible to reach");
                    break;
            }
        }
        return elementToKeep;
    }));
}

// TODO return a boolean to say that we modify or not
// It will help not re-triggering rendering if no modification happens
export function addValueToMultimap<TKey, TValue>(multimap: Map<TKey, Array<TValue>>, key: TKey, value: TValue) {
    const values = multimap.get(key);
    if (values === undefined) {
        multimap.set(key, new Array<TValue>(value))
    } else {
        if (!values.includes(value)) {
            values.push(value)
        }
    }
}

// TODO return a boolean to say that we modify or not
// It will help not re-triggering rendering if no modification happens
export function removeValueToMultimap<TKey, TValue>(multimap: Map<TKey, Array<TValue>>, key: TKey, value: TValue) {
    const values = multimap.get(key);
    if (values !== undefined) {
        const valueIndex = values.indexOf(value);
        if (valueIndex != -1) {
            values.splice(valueIndex, 1);
            if (values.length == 0) {
                multimap.delete(key);
            }
        } else {
            console.warn(`removeValueFromMultimap: Trying to remove value ${value} at key ${key} from multimap but value finding fails`);
        }
    } else {
        console.warn(`removeValueFromMultimap: Trying to remove value ${value} at key ${key} from multimap but key finding fails`);
    }
}

// TODO return a boolean to say that we modify or not
// It will help not re-triggering rendering if no modification happens
export function editTitleInMultimap(multimap: Map<TListFilter, Array<string>>, newSearchString: string) {
    // TODO to refactor to a direct modification of the Multimap
    const value = multimap.get(listFilter.recipeTitleInclude);
    if (multimap.size == 0 || value === undefined) {
        multimap.set(listFilter.recipeTitleInclude, new Array<string>(newSearchString))
    } else {
        if (value.length > 1) {
            console.warn("updateSearchString:: Not possible")
        } else {
            value[0] = newSearchString;
        }
    }
}

// TODO test me
export function removeTitleInMultimap(multimap: Map<TListFilter, Array<string>>) {
    multimap.delete(listFilter.recipeTitleInclude);
}


// TODO in case of creating a multimap
/*
        const tmp = new Map<string, Array<string>>();
        for (const filter of filterMultimap) {
            switch (filter.title) {
                case listFilter.prepTime:
                    addValueToMultimap(tmp, listFilter.prepTime, filter.value);
                    break;
                case listFilter.recipeTitleInclude:
                    addValueToMultimap(tmp, listFilter.recipeTitleInclude, filter.value);
                    break;
                case listFilter.inSeason:
                    addValueToMultimap(tmp, listFilter.inSeason, filter.value);
                    break;
                case listFilter.tags:
                    addValueToMultimap(tmp, listFilter.tags, filter.value);
                    break;
                case listFilter.grainOrCereal:
                case listFilter.legumes:
                case listFilter.vegetable:
                case listFilter.plantProtein:
                case listFilter.condiment:
                case listFilter.sauce:
                case listFilter.meat:
                case listFilter.poultry:
                case listFilter.fish:
                case listFilter.seafood:
                case listFilter.dairy:
                case listFilter.cheese:
                case listFilter.sugar:
                case listFilter.spice:
                case listFilter.fruit:
                case listFilter.oilAndFat:
                case listFilter.nutsAndSeeds:
                case listFilter.sweetener:
                    // TODO for now use grainOrCereal but not that a good idea
                    addValueToMultimap(tmp, listFilter.grainOrCereal, filter.value);
                    break;
                case listFilter.undefined:
                default:
                    console.error(`filterFromRecipe:: Unknown type `, filter.title);
            }
        }
        */

export function retrieveAllFilters(filters: Map<TListFilter, Array<string>>): Array<string> {
    const allFilters = new Array<string>();
    for (const [_, value] of filters) {
        allFilters.push(...value);
    }
    return allFilters;
}


function isTheElementContainsTheFilter(elementToTest: string | Array<string>, filters: Array<string> | string): boolean {
    if (filters instanceof Array) {
        for (const filterValue of filters) {
            if (filterValue == "*") {
                return true;
            }
            // Careful here because includes does not lean the same for array and string
            // For array, we want s strict equality while a string not
            // string case will happen on title only and we won't have strict equality here
            if (elementToTest.includes(filterValue)) {
                return true;
            }
        }
    } else {
        return elementToTest.includes(filters);
    }

    return false;
}

function applyToRecipeFilterPrepTime(recipe: recipeTableElement, filterTimeIntervals: Array<string>, t: TFunction<"translation", undefined>): boolean {
    for (const curFilter of filterTimeIntervals) {
        const translatedTimeFilter = t(curFilter);
        const minutesTranslated = t("timeSuffixEdit");
        if (curFilter == prepTimeValues[prepTimeValues.length - 1]) {
            if (Number(translatedTimeFilter.replace(minutesTranslated, "").replace("+", "")) <= recipe.time) {
                return true;
            }
        } else {
            const [beginTime, endTime] = translatedTimeFilter.replace(minutesTranslated, "").split(`-`);
            if (Number(beginTime) <= recipe.time && recipe.time <= Number(endTime)) {
                return true;
            }
        }
    }
    return false;


}
