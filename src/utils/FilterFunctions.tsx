

import { arrayOfIngredientWithoutType, arrayOfType, ingredientType, recipeTableElement, regExp } from "@customTypes/DatabaseElementTypes";
import { recipeFilterType, prepTimeValues, listFilter, currentMonth, propsForFilter, isSeasonValue } from "@customTypes/RecipeFiltersTypes";
import { textSeparator } from "@styles/typography";


export function selectFilterFromProps(filter: listFilter, filterProps: propsForFilter, tagsList: Array<string>, ingredientsList: Array<string>): [Array<recipeFilterType>, React.Dispatch<React.SetStateAction<Array<recipeFilterType>>>, Array<string>]{
    
    let filterValue: Array<recipeFilterType>;
    let filterSetter: React.Dispatch<React.SetStateAction<Array<recipeFilterType>>>;
    let elementFilters: Array<string>;

    switch (filter) {
        case listFilter.inSeason:
            filterValue = filterProps.ingredientsState;
            filterSetter = filterProps.setterIngredients;
            elementFilters = isSeasonValue;
        break;
            case listFilter.cerealProduct:
            filterValue = filterProps.ingredientsState;
            filterSetter = filterProps.setterIngredients;
            elementFilters = arrayOfType(ingredientsList, ingredientType.base);
        break;
        case listFilter.tags:
            filterValue = filterProps.tagsState
            filterSetter = filterProps.setterTags;
            elementFilters = tagsList;
        break;
        case listFilter.prepTime:
            filterValue = filterProps.prepTimeState;
            filterSetter = filterProps.setterPrepTime;
            elementFilters = prepTimeValues;
        break;
        case listFilter.vegetable:
            filterValue = filterProps.ingredientsState;
            filterSetter = filterProps.setterIngredients;
            elementFilters = arrayOfType(ingredientsList, ingredientType.vegetable);
        break;
        case listFilter.meet:
            filterValue = filterProps.ingredientsState;
            filterSetter = filterProps.setterIngredients;
            elementFilters = arrayOfType(ingredientsList, ingredientType.meet);
        break;
        case listFilter.poultry:
            filterValue = filterProps.ingredientsState;
            filterSetter = filterProps.setterIngredients;
            elementFilters = arrayOfType(ingredientsList, ingredientType.poultry);
        break;
        case listFilter.spice:
            filterValue = filterProps.ingredientsState;
            filterSetter = filterProps.setterIngredients;
            elementFilters = arrayOfType(ingredientsList, ingredientType.spice);
        break;
        default:
            filterValue = filterProps.ingredientsState;
            filterSetter = filterProps.setterIngredients;
            elementFilters = arrayOfIngredientWithoutType(ingredientsList);
            break;
        }
        return [filterValue, filterSetter, elementFilters];
}


export function recipeTitleFilteredFunction(recipeArray: Array<recipeTableElement>, filter: string) {
    let result = recipeArray;
    if (filter.length > 0) {
        result = result.filter((item) => item.title.toLowerCase().includes(filter.toLowerCase()));
    }
    return result;
}

export function extractFilteredRecipeDatas(recipeArray: Array<recipeTableElement>): [Array<string>, Array<string>, Array<string>] {
    let ingredientsArray = new Array<string>();
    let tagsArray = new Array<string>();

    const titleSortedArray = recipeArray.map(({ title }) => (title)).sort();



    recipeArray.forEach(element => {
        element.ingredients.forEach(ing => {
            const splitIngredients = ing.split(textSeparator)
            let ingDecoded = splitIngredients[1] + textSeparator + splitIngredients[2];
            ingDecoded = ingDecoded.replace(regExp, "");
            if (!ingredientsArray.includes(ingDecoded)) {
                ingredientsArray.push(ingDecoded);
            }
        });
        element.tags.forEach(tag => {
            if (!tagsArray.includes(tag)) {
                tagsArray.push(tag);
            }
        });
    });
    tagsArray.sort();
    ingredientsArray.sort();

    return [titleSortedArray, tagsArray, ingredientsArray]
}

export function filterPrepTimeFromRecipe(recipeArray: Array<recipeTableElement>, filterTimeArray: Array<recipeFilterType>) {
    let result: Array<recipeTableElement> = recipeArray;

    if (filterTimeArray.length > 0) {

        let allowedTimes = new Array<number>();

        filterTimeArray.forEach(range => {
            if (range.value == prepTimeValues.at(prepTimeValues.length - 1)) {
                for (let i = 60; i < 120; i += 5) {
                    allowedTimes.push(i);
                }
            } else {
                let splitTime = range.value.replace(" min", "").split(`-`);

                splitTime.forEach(time => {
                    const timeInNumber = Number(time)
                    if (!allowedTimes.includes(timeInNumber)) {
                        allowedTimes.push(timeInNumber);
                    }
                });
            }
        });
        result = result.filter((item) => allowedTimes.includes(item.time));
    }

    return result;
}

function filterInArrayOfString(strArray: Array<string>, filter: string) {
    let breakNeeded = false;

    if (filter == "*") {
        breakNeeded = true;
    }

    for (let i = 0; (i < strArray.length) && !breakNeeded; i++) {
        if (strArray[i] == "*") {
            breakNeeded = true;
        } else {
            breakNeeded = breakNeeded || (strArray[i].toLowerCase().includes(filter.toLowerCase()));
        }
    }
    return breakNeeded;
}

export function filterFromRecipe(recipeArray: Array<recipeTableElement>, filterArray: Array<recipeFilterType>) {
    let filteredArray = recipeArray;

    if (filterArray.length > 0) {
        filteredArray = filteredArray.filter((item) => {
            let keepElement = false;

            for (let indexFilters = 0; (indexFilters < filterArray.length) && !keepElement; indexFilters++) {
                let arrayToFilter = new Array<string>();
                if (filterArray[indexFilters].title == listFilter.tags) {
                    arrayToFilter = item.tags;
                } else if (filterArray[indexFilters].title == listFilter.inSeason) {
                    arrayToFilter.push(item.season);
                }
                else {
                    arrayToFilter = item.ingredients;
                }
                keepElement = keepElement || filterInArrayOfString(arrayToFilter, filterArray[indexFilters].value);
            }
            return keepElement;
        });
    }
    return filteredArray;
}

export function filterTagsFromRecipe(recipeArray: Array<recipeTableElement>, filterTagsArray: Array<recipeFilterType>) {
    return filterFromRecipe(recipeArray, filterTagsArray);
}

export function filterIngredientsFromRecipe(recipeArray: Array<recipeTableElement>, filterIngredients: Array<recipeFilterType>) {
    let result: Array<recipeTableElement> = recipeArray;


    if (filterIngredients.length > 0) {

        let inSeasonFilter = new Array<recipeFilterType>();
        let baseFilter = new Array<recipeFilterType>();
        let otherIngredientsFilters = new Array<recipeFilterType>();


        filterIngredients.forEach(filter => {
            if (filter.title == listFilter.inSeason) {
                inSeasonFilter.push({ title: filter.title, value: currentMonth.toString() });
            } else if (filter.title == listFilter.cerealProduct) {
                baseFilter.push(filter);
            } else {
                otherIngredientsFilters.push(filter);
            }
        });

        if (baseFilter.length > 0) {
            result = filterFromRecipe(result, baseFilter);
        }
        if (inSeasonFilter.length > 0) {
            result = filterFromRecipe(result, inSeasonFilter);
        }
        if (otherIngredientsFilters.length > 0) {
            result = filterFromRecipe(result, otherIngredientsFilters);
        }
    }

    return result;
}

const filterInSeason = (arr: Array<recipeTableElement>, filter: Array<listFilter>) => {
    let result: Array<recipeTableElement> = arr;

    // In-season is a unique filter
    if (filter.length > 0) {
        // TODO

    }
    return result;
}