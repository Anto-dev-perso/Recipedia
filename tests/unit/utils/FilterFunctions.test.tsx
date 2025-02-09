import {
    addValueToMultimap,
    editTitleInMultimap,
    extractFilteredRecipeDatas,
    filterFromRecipe,
    removeValueToMultimap,
    retrieveAllFilters,
    selectFilterValuesToDisplay,
} from '@utils/FilterFunctions';
import {listFilter, prepTimeValues, TListFilter} from '@customTypes/RecipeFiltersTypes';
import {recipesDataset} from "@test-data/recipesDataset";
import {ingredientTableElement, recipeTableElement} from "@customTypes/DatabaseElementTypes";
import {tagsDataset} from "@test-data/tagsDataset";

describe('FilterFunctions', () => {

    test('selectFilterValuesToDisplay return the expected array for a given filter', () => {

        const tagListGiven = recipesDataset[3].tags.map(tag => tag.tagName);
        const ingredientListGiven = recipesDataset[3].ingredients;

        expect(selectFilterValuesToDisplay(listFilter.inSeason, tagListGiven, ingredientListGiven)).toEqual(["Only in-season ingredients"]);

        expect(selectFilterValuesToDisplay(listFilter.tags, tagListGiven, ingredientListGiven)).toEqual(tagListGiven);

        expect(selectFilterValuesToDisplay(listFilter.prepTime, tagListGiven, ingredientListGiven)).toEqual(prepTimeValues);

        expect(selectFilterValuesToDisplay(listFilter.purchased, tagListGiven, ingredientListGiven)).toEqual([]);

        expect(selectFilterValuesToDisplay(listFilter.recipeTitleInclude, tagListGiven, ingredientListGiven)).toEqual([]);

        expect(selectFilterValuesToDisplay(listFilter.grainOrCereal, tagListGiven, ingredientListGiven)).toEqual(['Croutons']);
        expect(selectFilterValuesToDisplay(listFilter.legumes, tagListGiven, ingredientListGiven)).toEqual([]);
        expect(selectFilterValuesToDisplay(listFilter.vegetable, tagListGiven, ingredientListGiven)).toEqual(['Romaine Lettuce']);
        expect(selectFilterValuesToDisplay(listFilter.plantProtein, tagListGiven, ingredientListGiven)).toEqual([]);
        expect(selectFilterValuesToDisplay(listFilter.condiment, tagListGiven, ingredientListGiven)).toEqual([]);
        expect(selectFilterValuesToDisplay(listFilter.sauce, tagListGiven, ingredientListGiven)).toEqual(['Caesar Dressing']);
        expect(selectFilterValuesToDisplay(listFilter.meat, tagListGiven, ingredientListGiven)).toEqual([]);
        expect(selectFilterValuesToDisplay(listFilter.poultry, tagListGiven, ingredientListGiven)).toEqual([]);
        expect(selectFilterValuesToDisplay(listFilter.fish, tagListGiven, ingredientListGiven)).toEqual([]);
        expect(selectFilterValuesToDisplay(listFilter.seafood, tagListGiven, ingredientListGiven)).toEqual([]);
        expect(selectFilterValuesToDisplay(listFilter.dairy, tagListGiven, ingredientListGiven)).toEqual([]);
        expect(selectFilterValuesToDisplay(listFilter.cheese, tagListGiven, ingredientListGiven)).toEqual(['Parmesan']);
        expect(selectFilterValuesToDisplay(listFilter.sugar, tagListGiven, ingredientListGiven)).toEqual([]);
        expect(selectFilterValuesToDisplay(listFilter.spice, tagListGiven, ingredientListGiven)).toEqual([]);
        expect(selectFilterValuesToDisplay(listFilter.fruit, tagListGiven, ingredientListGiven)).toEqual([]);
        expect(selectFilterValuesToDisplay(listFilter.oilAndFat, tagListGiven, ingredientListGiven)).toEqual([]);
        expect(selectFilterValuesToDisplay(listFilter.nutsAndSeeds, tagListGiven, ingredientListGiven)).toEqual([]);
        expect(selectFilterValuesToDisplay(listFilter.sweetener, tagListGiven, ingredientListGiven)).toEqual([]);
        expect(selectFilterValuesToDisplay(listFilter.undefined, tagListGiven, ingredientListGiven)).toEqual([]);
    });


    test('extractFilteredRecipeDatas extracts and sorts data', () => {


        let [resTitles, resIngredients, resTags] = extractFilteredRecipeDatas(Array<recipeTableElement>(recipesDataset[0]));
        let expectedTags = recipesDataset[0].tags.map(tag => tag.tagName).sort();
        let expectedIngredient = recipesDataset[0].ingredients.sort()

        expect(resTitles).toEqual([recipesDataset[0].title]);
        expect(resTags).toEqual(expectedTags);
        expect(resIngredients).toEqual(expectedIngredient);

        [resTitles, resIngredients, resTags] = extractFilteredRecipeDatas(Array<recipeTableElement>(recipesDataset[0], recipesDataset[8]));
        expectedTags = [...recipesDataset[0].tags.map(tag => tag.tagName), ...recipesDataset[
            8].tags.map(tag => tag.tagName)].sort()
        expectedIngredient = [...recipesDataset[0].ingredients, ...recipesDataset[8].ingredients].filter((elem: ingredientTableElement, index: number, self: Array<ingredientTableElement>) => {
            return index == self.indexOf(elem)
        }).sort()

        expect(resTitles).toEqual([recipesDataset[0].title, recipesDataset[8].title]);
        expect(resTags).toEqual(expectedTags);
        expect(resIngredients).toEqual(expectedIngredient);


        [resTitles, resIngredients, resTags] = extractFilteredRecipeDatas(recipesDataset);
        let expectedTitles = new Array<string>();
        expectedTags.splice(0);
        expectedIngredient.splice(0);

        for (const dataset of recipesDataset) {
            expectedTitles = [...expectedTitles, dataset.title];
            expectedTags = [...expectedTags, ...dataset.tags.map(tag => tag.tagName)];
            expectedIngredient = [...expectedIngredient, ...dataset.ingredients.map(ing => ing)];
        }

        expectedTitles.sort();
        expectedTags = expectedTags.filter((elem: string, index: number, self: Array<string>) => index == self.indexOf(elem)
        ).sort();
        expectedIngredient = expectedIngredient.filter((elem: ingredientTableElement, index: number, self: Array<ingredientTableElement>) => index == self.indexOf(elem)).sort();

        expect(resTitles).toEqual(expectedTitles);
        expect(resTags).toEqual(expectedTags);
        expect(resIngredients).toEqual(expectedIngredient);

        [resTitles, resIngredients, resTags] = extractFilteredRecipeDatas([]);
        expect(resTitles).toEqual([]);
        expect(resTags).toEqual([]);
        expect(resIngredients).toEqual([]);
    });

    test('filterFromRecipe with empty filters return the array given in input', () => {
        expect(filterFromRecipe(recipesDataset, new Map<TListFilter, Array<string>>())).toEqual(recipesDataset);
    });

    test('filterFromRecipe with undefined filters return the array given in input', () => {
        expect(filterFromRecipe(recipesDataset, new Map<TListFilter, Array<string>>([[listFilter.undefined, ['*']]]))).toEqual(recipesDataset);
    });

    test('filterFromRecipe with only preparation time filters', () => {

        const filtersTime = new Map<TListFilter, Array<string>>([[listFilter.prepTime, [prepTimeValues[2]]]]);
        const timeFilterArray = filtersTime.get(listFilter.prepTime) as Array<string>;

        expect(filterFromRecipe(recipesDataset, filtersTime)).toEqual(Array<recipeTableElement>(recipesDataset[1], recipesDataset[3], recipesDataset[4], recipesDataset[7]));

        timeFilterArray.push(prepTimeValues[7]);
        expect(filterFromRecipe(recipesDataset, filtersTime)).toEqual(Array<recipeTableElement>(recipesDataset[1], recipesDataset[3], recipesDataset[4], recipesDataset[6], recipesDataset[7]));

        timeFilterArray.push(prepTimeValues[0]);
        expect(filterFromRecipe(recipesDataset, filtersTime)).toEqual(Array<recipeTableElement>(recipesDataset[1], recipesDataset[3], recipesDataset[4], recipesDataset[6], recipesDataset[7]));

        timeFilterArray.push(prepTimeValues[5]);
        expect(filterFromRecipe(recipesDataset, filtersTime)).toEqual(Array<recipeTableElement>(recipesDataset[0], recipesDataset[1], recipesDataset[3], recipesDataset[4], recipesDataset[5], recipesDataset[6], recipesDataset[7], recipesDataset[9]));

        timeFilterArray.push(prepTimeValues[3]);
        expect(filterFromRecipe(recipesDataset, filtersTime)).toEqual(Array<recipeTableElement>(recipesDataset[0], recipesDataset[1], recipesDataset[2], recipesDataset[3], recipesDataset[4], recipesDataset[5], recipesDataset[6], recipesDataset[7], recipesDataset[9]));

        timeFilterArray.push(prepTimeValues[6]);
        expect(filterFromRecipe(recipesDataset, filtersTime)).toEqual(recipesDataset);

        timeFilterArray.push(prepTimeValues[1]);
        expect(filterFromRecipe(recipesDataset, filtersTime)).toEqual(recipesDataset);

        timeFilterArray.push(prepTimeValues[4]);
        expect(filterFromRecipe(recipesDataset, filtersTime)).toEqual(recipesDataset);
    });

    test('filterFromRecipe with only season filters', () => {
        const filtersSeason = new Map<TListFilter, Array<string>>([[listFilter.inSeason, ['not existing']]]);
        const seasonFilterArray = filtersSeason.get(listFilter.inSeason) as Array<string>;

        expect(filterFromRecipe(recipesDataset, filtersSeason)).toEqual([]);

        seasonFilterArray.push('3');
        expect(filterFromRecipe(recipesDataset, filtersSeason)).toEqual(Array<recipeTableElement>(recipesDataset[0], recipesDataset[2], recipesDataset[6], recipesDataset[9]));

        seasonFilterArray.push('1');
        expect(filterFromRecipe(recipesDataset, filtersSeason)).toEqual(Array<recipeTableElement>(recipesDataset[0], recipesDataset[2], recipesDataset[5], recipesDataset[6], recipesDataset[9]));

        seasonFilterArray.push('*');
        expect(filterFromRecipe(recipesDataset, filtersSeason)).toEqual(recipesDataset);
    });

    test('filterFromRecipe with only tags filters', () => {

        const filtersTags = new Map<TListFilter, Array<string>>([[listFilter.tags, ['not existing']]]);
        const tagFilterArray = filtersTags.get(listFilter.tags) as Array<string>;

        expect(filterFromRecipe(recipesDataset, filtersTags)).toEqual([]);

        tagFilterArray.push(tagsDataset[14].tagName);
        expect(filterFromRecipe(recipesDataset, filtersTags)).toEqual(Array<recipeTableElement>(recipesDataset[9]));

        tagFilterArray.push(tagsDataset[0].tagName);
        expect(filterFromRecipe(recipesDataset, filtersTags)).toEqual(Array<recipeTableElement>(recipesDataset[0], recipesDataset[4], recipesDataset[7], recipesDataset[9]));

        for (let i = 1; i < tagsDataset.length - 1; i++) {
            tagFilterArray.push(tagsDataset[i].tagName);
        }
        expect(filterFromRecipe(recipesDataset, filtersTags)).toEqual(recipesDataset);
    });

    test('filterFromRecipe with only title filters', () => {
        const filtersTitle = new Map<TListFilter, Array<string>>([[listFilter.recipeTitleInclude, [recipesDataset[7].title]]]);
        const titleFilterArray = filtersTitle.get(listFilter.recipeTitleInclude) as Array<string>;

        expect(filterFromRecipe(recipesDataset, filtersTitle)).toEqual(Array<recipeTableElement>(recipesDataset[7]));

        titleFilterArray.splice(0);
        titleFilterArray.push('Tacos');
        expect(filterFromRecipe(recipesDataset, filtersTitle)).toEqual(Array<recipeTableElement>(recipesDataset[1]));

        titleFilterArray.splice(0);
        titleFilterArray.push('e');
        expect(filterFromRecipe(recipesDataset, filtersTitle)).toEqual(Array<recipeTableElement>(recipesDataset[0], recipesDataset[1], recipesDataset[2], recipesDataset[3], recipesDataset[4], recipesDataset[5], recipesDataset[6], recipesDataset[7], recipesDataset[9]));
    });

    test('filterFromRecipe with only ingredient type filters', () => {
        const filtersIngredientType = new Map<TListFilter, Array<string>>([[listFilter.cheese, [listFilter.cheese]]]);

        const expectedArr = new Array<recipeTableElement>(recipesDataset[0], recipesDataset[1], recipesDataset[3], recipesDataset[4], recipesDataset[7]);

        expect(filterFromRecipe(recipesDataset, filtersIngredientType)).toEqual(expectedArr);

        addValueToMultimap(filtersIngredientType, listFilter.grainOrCereal, listFilter.grainOrCereal);
        expect(filterFromRecipe(recipesDataset, filtersIngredientType)).toEqual(expectedArr);

        addValueToMultimap(filtersIngredientType, listFilter.poultry, listFilter.poultry);
        expect(filterFromRecipe(recipesDataset, filtersIngredientType)).toEqual([recipesDataset[1]]);
    });

    test('filterFromRecipe with mixed filters (in bonus, addValueToMultimap test)', () => {
        const filtersMixed = new Map<TListFilter, Array<string>>([[listFilter.cheese, [listFilter.cheese]]]);

        const expectedArr = new Array<recipeTableElement>(recipesDataset[0], recipesDataset[1], recipesDataset[3], recipesDataset[4], recipesDataset[7]);

        expect(filterFromRecipe(recipesDataset, filtersMixed)).toEqual(expectedArr);

        addValueToMultimap(filtersMixed, listFilter.recipeTitleInclude, 'o');
        expectedArr.splice(2, 2); // This will remove recipesDataset[3] and recipesDataset[4]
        expect(filterFromRecipe(recipesDataset, filtersMixed)).toEqual(expectedArr);

        addValueToMultimap(filtersMixed, listFilter.tags, recipesDataset[1].tags[0].tagName);
        expectedArr.splice(0, 1);
        expectedArr.splice(1);
        expect(filterFromRecipe(recipesDataset, filtersMixed)).toEqual(expectedArr);

        // Add tag again to cover another branch of addValueToMultimap function
        addValueToMultimap(filtersMixed, listFilter.tags, recipesDataset[1].tags[1].tagName);
        expect(filterFromRecipe(recipesDataset, filtersMixed)).toEqual(expectedArr);
    });

    test('removeValueToMultimap shall effectively remove from the multimap the asked value', () => {
        const consoleWarningSpy = jest.spyOn(console, 'warn').mockImplementation(() => {
        });

        const filtersMixed = new Map<TListFilter, Array<string>>([[listFilter.prepTime, [prepTimeValues[3]]], [listFilter.purchased, ['true', 'false']], [listFilter.grainOrCereal, ['Pasta']], [listFilter.tags, ['Quick Meal']]]);

        const workingFilters = new Map<TListFilter, Array<string>>(filtersMixed)
        ;

        removeValueToMultimap(workingFilters, listFilter.recipeTitleInclude, 'A title');
        expect(workingFilters).toEqual(filtersMixed);
        expect(consoleWarningSpy).toHaveBeenCalledWith(
            'removeValueFromMultimap: Trying to remove value A title at key recipeTitleInclude from multimap but key finding fails'
        );

        removeValueToMultimap(workingFilters, listFilter.recipeTitleInclude, 'Quick Meal');
        expect(workingFilters).toEqual(filtersMixed);
        expect(consoleWarningSpy).toHaveBeenCalledWith(
            'removeValueFromMultimap: Trying to remove value Quick Meal at key recipeTitleInclude from multimap but key finding fails'
        );


        removeValueToMultimap(workingFilters, listFilter.tags, 'quick meal');
        expect(workingFilters).toEqual(filtersMixed);
        expect(consoleWarningSpy).toHaveBeenCalledWith(
            'removeValueFromMultimap: Trying to remove value quick meal at key Tags from multimap but value finding fails'
        );

        removeValueToMultimap(workingFilters, listFilter.tags, 'Quick Meal');
        let expectedMultiMap = new Map<TListFilter, Array<string>>([[listFilter.prepTime, [prepTimeValues[3]]], [listFilter.purchased, ['true', 'false']], [listFilter.grainOrCereal, ['Pasta']]]);
        expect(workingFilters).toEqual(expectedMultiMap);

        removeValueToMultimap(workingFilters, listFilter.purchased, 'false');
        expectedMultiMap = new Map<TListFilter, Array<string>>([[listFilter.prepTime, [prepTimeValues[3]]], [listFilter.purchased, ['true']], [listFilter.grainOrCereal, ['Pasta']]]);
        expect(workingFilters).toEqual(expectedMultiMap);

        removeValueToMultimap(workingFilters, listFilter.purchased, 'true');
        expectedMultiMap = new Map<TListFilter, Array<string>>([[listFilter.prepTime, [prepTimeValues[3]]], [listFilter.grainOrCereal, ['Pasta']]]);
        expect(workingFilters).toEqual(expectedMultiMap);

        removeValueToMultimap(workingFilters, listFilter.prepTime, prepTimeValues[3]);
        expectedMultiMap = new Map<TListFilter, Array<string>>([[listFilter.grainOrCereal, ['Pasta']]]);
        expect(workingFilters).toEqual(expectedMultiMap);

        removeValueToMultimap(workingFilters, listFilter.grainOrCereal, 'Pasta');
        expect(workingFilters.size).toEqual(0);
        expect(workingFilters).toEqual(new Map<TListFilter, Array<string>>());
    });


    test('retrieveAllFilters shall return an array of string filters', () => {
        const filtersMixed = new Map<TListFilter, Array<string>>([[listFilter.prepTime, [prepTimeValues[3], prepTimeValues[3]]], [listFilter.purchased, ['true', 'false']], [listFilter.grainOrCereal, ['Pasta']], [listFilter.tags, ['Quick Meal']]]);
        const expectedResult = new Array<string>(prepTimeValues[3], prepTimeValues[3], 'true', 'false', 'Pasta', 'Quick Meal');

        expect(retrieveAllFilters(filtersMixed)).toEqual(expectedResult);

        expect(retrieveAllFilters(new Map<TListFilter, Array<string>>())).toEqual(new Array<string>());
    });

    test('editTitleInMultimap shall do the edit it is supposed to do', () => {
        const consoleWarningSpy = jest.spyOn(console, 'warn').mockImplementation(() => {
        });

        let filtersMixed = new Map<TListFilter, Array<string>>([[listFilter.recipeTitleInclude, ['First Title', 'Second Title']]]);

        let expectedResult = new Map<TListFilter, Array<string>>([[listFilter.recipeTitleInclude, ['First Title', 'Second Title']]]);

        editTitleInMultimap(filtersMixed, 'Edited title');
        expect(filtersMixed).toEqual(expectedResult);
        expect(consoleWarningSpy).toHaveBeenCalledWith('updateSearchString:: Not possible');


        filtersMixed = new Map<TListFilter, Array<string>>([[listFilter.prepTime, [prepTimeValues[3], prepTimeValues[3]]], [listFilter.purchased, ['true', 'false']], [listFilter.grainOrCereal, ['Pasta']], [listFilter.tags, ['Quick Meal']]]);
        expectedResult = new Map<TListFilter, Array<string>>([[listFilter.prepTime, [prepTimeValues[3], prepTimeValues[3]]], [listFilter.purchased, ['true', 'false']], [listFilter.grainOrCereal, ['Pasta']], [listFilter.tags, ['Quick Meal']], [listFilter.recipeTitleInclude, ['New title']]]);

        editTitleInMultimap(filtersMixed, 'New title');
        expect(filtersMixed).toEqual(expectedResult);

        filtersMixed = new Map<TListFilter, Array<string>>([[listFilter.prepTime, [prepTimeValues[3], prepTimeValues[3]]], [listFilter.purchased, ['true', 'false']], [listFilter.grainOrCereal, ['Pasta']], [listFilter.tags, ['Quick Meal']], [listFilter.recipeTitleInclude, ['A recipe title']]]);

        editTitleInMultimap(filtersMixed, 'New title');
        expect(filtersMixed).toEqual(expectedResult);
    });
});
