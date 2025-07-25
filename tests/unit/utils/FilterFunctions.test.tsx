import {useI18n} from "@utils/i18n";
import {
    addValueToMultimap,
    editTitleInMultimap,
    extractFilteredRecipeDatas,
    filterFromRecipe,
    removeTitleInMultimap,
    removeValueToMultimap,
    retrieveAllFilters,
    selectFilterCategoriesValuesToDisplay,
} from '@utils/FilterFunctions';
import {listFilter, prepTimeValues, TListFilter} from '@customTypes/RecipeFiltersTypes';
import {recipesDataset} from "@test-data/recipesDataset";
import {ingredientTableElement, isIngredientEqual, recipeTableElement} from "@customTypes/DatabaseElementTypes";
import {tagsDataset} from "@test-data/tagsDataset";
import {ingredientsDataset} from "@test-data/ingredientsDataset";

jest.mock('@utils/i18n', () => require('@mocks/utils/i18n-mock').i18nFilterTimeMock());


describe('FilterFunctions', () => {
    const {t} = useI18n();
    test('selectFilterValuesToDisplay return the expected array for a given filter', () => {

        const tagListGiven = recipesDataset[3].tags.map(tag => tag.name);
        const ingredientListGiven = recipesDataset[3].ingredients;

        expect(selectFilterCategoriesValuesToDisplay(listFilter.inSeason, tagListGiven, ingredientListGiven, t)).toEqual(["filterTypes.inSeason"]);

        expect(selectFilterCategoriesValuesToDisplay(listFilter.tags, tagListGiven, ingredientListGiven, t)).toEqual(tagListGiven);

        expect(selectFilterCategoriesValuesToDisplay(listFilter.prepTime, tagListGiven, ingredientListGiven, t)).toEqual(prepTimeValues.map(toTranslate => t(toTranslate)));

        expect(selectFilterCategoriesValuesToDisplay(listFilter.purchased, tagListGiven, ingredientListGiven, t)).toEqual([]);

        expect(selectFilterCategoriesValuesToDisplay(listFilter.recipeTitleInclude, tagListGiven, ingredientListGiven, t)).toEqual([]);

        expect(selectFilterCategoriesValuesToDisplay(listFilter.grainOrCereal, tagListGiven, ingredientListGiven, t)).toEqual(['Croutons']);
        expect(selectFilterCategoriesValuesToDisplay(listFilter.legumes, tagListGiven, ingredientListGiven, t)).toEqual([]);
        expect(selectFilterCategoriesValuesToDisplay(listFilter.vegetable, tagListGiven, ingredientListGiven, t)).toEqual(['Romaine Lettuce']);
        expect(selectFilterCategoriesValuesToDisplay(listFilter.plantProtein, tagListGiven, ingredientListGiven, t)).toEqual([]);
        expect(selectFilterCategoriesValuesToDisplay(listFilter.condiment, tagListGiven, ingredientListGiven, t)).toEqual([]);
        expect(selectFilterCategoriesValuesToDisplay(listFilter.sauce, tagListGiven, ingredientListGiven, t)).toEqual(['Caesar Dressing']);
        expect(selectFilterCategoriesValuesToDisplay(listFilter.meat, tagListGiven, ingredientListGiven, t)).toEqual([]);
        expect(selectFilterCategoriesValuesToDisplay(listFilter.poultry, tagListGiven, ingredientListGiven, t)).toEqual([]);
        expect(selectFilterCategoriesValuesToDisplay(listFilter.fish, tagListGiven, ingredientListGiven, t)).toEqual([]);
        expect(selectFilterCategoriesValuesToDisplay(listFilter.seafood, tagListGiven, ingredientListGiven, t)).toEqual([]);
        expect(selectFilterCategoriesValuesToDisplay(listFilter.dairy, tagListGiven, ingredientListGiven, t)).toEqual([]);
        expect(selectFilterCategoriesValuesToDisplay(listFilter.cheese, tagListGiven, ingredientListGiven, t)).toEqual(['Parmesan']);
        expect(selectFilterCategoriesValuesToDisplay(listFilter.sugar, tagListGiven, ingredientListGiven, t)).toEqual([]);
        expect(selectFilterCategoriesValuesToDisplay(listFilter.spice, tagListGiven, ingredientListGiven, t)).toEqual([]);
        expect(selectFilterCategoriesValuesToDisplay(listFilter.fruit, tagListGiven, ingredientListGiven, t)).toEqual([]);
        expect(selectFilterCategoriesValuesToDisplay(listFilter.oilAndFat, tagListGiven, ingredientListGiven, t)).toEqual([]);
        expect(selectFilterCategoriesValuesToDisplay(listFilter.nutsAndSeeds, tagListGiven, ingredientListGiven, t)).toEqual([]);
        expect(selectFilterCategoriesValuesToDisplay(listFilter.sweetener, tagListGiven, ingredientListGiven, t)).toEqual([]);
        expect(selectFilterCategoriesValuesToDisplay(listFilter.undefined, tagListGiven, ingredientListGiven, t)).toEqual([]);
    });


    test('extractFilteredRecipeDatas extracts and sorts data', () => {
        let [resTitles, resIngredients, resTags] = extractFilteredRecipeDatas(Array<recipeTableElement>(recipesDataset[0]));
        let expectedTags = recipesDataset[0].tags.map(tag => tag.name).sort();
        let expectedIngredient = recipesDataset[0].ingredients.sort();

        expect(resTitles).toEqual([recipesDataset[0].title]);
        expect(resTags).toEqual(expectedTags);
        expect(resIngredients).toEqual(expectedIngredient);

        [resTitles, resIngredients, resTags] = extractFilteredRecipeDatas(Array<recipeTableElement>(recipesDataset[0], recipesDataset[8]));
        expectedTags = [...recipesDataset[0].tags.map(tag => tag.name), ...recipesDataset[
            8].tags.map(tag => tag.name)].sort();
        expectedIngredient = [...recipesDataset[0].ingredients, ...recipesDataset[8].ingredients].filter((elem: ingredientTableElement, index: number, self: Array<ingredientTableElement>) => {
            return index == self.indexOf(elem)
        }).sort();

        expect(resTitles).toEqual([recipesDataset[0].title, recipesDataset[8].title]);
        expect(resTags).toEqual(expectedTags);
        expect(resIngredients).toEqual(expectedIngredient);


        [resTitles, resIngredients, resTags] = extractFilteredRecipeDatas(recipesDataset);
        let expectedTitles = new Array<string>();
        expectedTags.splice(0);
        expectedIngredient.splice(0);

        for (const dataset of recipesDataset) {
            expectedTitles = [...expectedTitles, dataset.title];
            expectedTags = [...expectedTags, ...dataset.tags.map(tag => tag.name)];
            for (const ingredient of dataset.ingredients) {
                if (expectedIngredient.find(previousIng => isIngredientEqual(previousIng, ingredient)) === undefined) {
                    expectedIngredient.push(ingredient);
                }
            }
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
        expect(filterFromRecipe(recipesDataset, new Map<TListFilter, Array<string>>(), t)).toEqual(recipesDataset);
    });

    test('filterFromRecipe with undefined filters return the array given in input', () => {
        expect(filterFromRecipe(recipesDataset, new Map<TListFilter, Array<string>>([[listFilter.undefined, ['*']]]), t)).toEqual(recipesDataset);
    });

    test('filterFromRecipe with only preparation time filters', () => {

        const filtersTime = new Map<TListFilter, Array<string>>([[listFilter.prepTime, [prepTimeValues[2]]]]);
        const timeFilterArray = filtersTime.get(listFilter.prepTime) as Array<string>;

        expect(filterFromRecipe(recipesDataset, filtersTime, t)).toEqual(Array<recipeTableElement>(recipesDataset[1], recipesDataset[3], recipesDataset[4], recipesDataset[7]));

        timeFilterArray.push(prepTimeValues[7]);
        expect(filterFromRecipe(recipesDataset, filtersTime, t)).toEqual(Array<recipeTableElement>(recipesDataset[1], recipesDataset[3], recipesDataset[4], recipesDataset[6], recipesDataset[7]));

        timeFilterArray.push(prepTimeValues[0]);
        expect(filterFromRecipe(recipesDataset, filtersTime, t)).toEqual(Array<recipeTableElement>(recipesDataset[1], recipesDataset[3], recipesDataset[4], recipesDataset[6], recipesDataset[7]));

        timeFilterArray.push(prepTimeValues[5]);
        expect(filterFromRecipe(recipesDataset, filtersTime, t)).toEqual(Array<recipeTableElement>(recipesDataset[0], recipesDataset[1], recipesDataset[3], recipesDataset[4], recipesDataset[5], recipesDataset[6], recipesDataset[7], recipesDataset[9]));

        timeFilterArray.push(prepTimeValues[3]);
        expect(filterFromRecipe(recipesDataset, filtersTime, t)).toEqual(Array<recipeTableElement>(recipesDataset[0], recipesDataset[1], recipesDataset[2], recipesDataset[3], recipesDataset[4], recipesDataset[5], recipesDataset[6], recipesDataset[7], recipesDataset[9]));

        timeFilterArray.push(prepTimeValues[6]);
        expect(filterFromRecipe(recipesDataset, filtersTime, t)).toEqual(recipesDataset);

        timeFilterArray.push(prepTimeValues[1]);
        expect(filterFromRecipe(recipesDataset, filtersTime, t)).toEqual(recipesDataset);

        timeFilterArray.push(prepTimeValues[4]);
        expect(filterFromRecipe(recipesDataset, filtersTime, t)).toEqual(recipesDataset);
    });

    test('filterFromRecipe with only season filters', () => {
        const filtersSeason = new Map<TListFilter, Array<string>>([[listFilter.inSeason, ['not existing']]]);
        const seasonFilterArray = filtersSeason.get(listFilter.inSeason) as Array<string>;

        expect(filterFromRecipe(recipesDataset, filtersSeason, t)).toEqual([]);

        seasonFilterArray.push('3');
        expect(filterFromRecipe(recipesDataset, filtersSeason, t)).toEqual(Array<recipeTableElement>(recipesDataset[0], recipesDataset[2], recipesDataset[6], recipesDataset[9]));

        seasonFilterArray.push('1');
        expect(filterFromRecipe(recipesDataset, filtersSeason, t)).toEqual(Array<recipeTableElement>(recipesDataset[0], recipesDataset[2], recipesDataset[5], recipesDataset[6], recipesDataset[9]));

        seasonFilterArray.push('*');
        expect(filterFromRecipe(recipesDataset, filtersSeason, t)).toEqual(recipesDataset);
    });

    test('filterFromRecipe with only tags filters', () => {

        const filtersTags = new Map<TListFilter, Array<string>>([[listFilter.tags, ['not existing']]]);
        const tagFilterArray = filtersTags.get(listFilter.tags) as Array<string>;

        expect(filterFromRecipe(recipesDataset, filtersTags, t)).toEqual([]);

        tagFilterArray.push(tagsDataset[14].name);
        expect(filterFromRecipe(recipesDataset, filtersTags, t)).toEqual(Array<recipeTableElement>(recipesDataset[9]));

        tagFilterArray.push(tagsDataset[0].name);
        expect(filterFromRecipe(recipesDataset, filtersTags, t)).toEqual(Array<recipeTableElement>(recipesDataset[0], recipesDataset[4], recipesDataset[7], recipesDataset[9]));

        for (let i = 1; i < tagsDataset.length - 1; i++) {
            tagFilterArray.push(tagsDataset[i].name);
        }
        expect(filterFromRecipe(recipesDataset, filtersTags, t)).toEqual(recipesDataset);
    });

    test('filterFromRecipe with only title filters', () => {
        const filtersTitle = new Map<TListFilter, Array<string>>([[listFilter.recipeTitleInclude, [recipesDataset[7].title]]]);
        const titleFilterArray = filtersTitle.get(listFilter.recipeTitleInclude) as Array<string>;

        expect(filterFromRecipe(recipesDataset, filtersTitle, t)).toEqual(Array<recipeTableElement>(recipesDataset[7]));

        titleFilterArray.splice(0);
        titleFilterArray.push('Tacos');
        expect(filterFromRecipe(recipesDataset, filtersTitle, t)).toEqual(Array<recipeTableElement>(recipesDataset[1]));

        titleFilterArray.splice(0);
        titleFilterArray.push('e');
        expect(filterFromRecipe(recipesDataset, filtersTitle, t)).toEqual(Array<recipeTableElement>(recipesDataset[0], recipesDataset[1], recipesDataset[2], recipesDataset[3], recipesDataset[4], recipesDataset[5], recipesDataset[6], recipesDataset[7], recipesDataset[9]));
    });

    test('filterFromRecipe with only ingredient type filters', () => {
        const filtersIngredientType = new Map<TListFilter, Array<string>>([[listFilter.cheese, ingredientsDataset.filter(ing => ing.type === listFilter.cheese).map(ing => ing.name)]]);

        let expectedArr = new Array<recipeTableElement>(recipesDataset[0], recipesDataset[1], recipesDataset[3], recipesDataset[4], recipesDataset[7]);

        expect(filterFromRecipe(recipesDataset, filtersIngredientType, t)).toEqual(expectedArr);

        addValueToMultimap(filtersIngredientType, listFilter.grainOrCereal, 'Taco Shells');
        expectedArr = new Array<recipeTableElement>(recipesDataset[1]);

        expect(filterFromRecipe(recipesDataset, filtersIngredientType, t)).toEqual(expectedArr);

        addValueToMultimap(filtersIngredientType, listFilter.poultry, 'Chicken Breast');
        expect(filterFromRecipe(recipesDataset, filtersIngredientType, t)).toEqual(expectedArr);
    });

    test('filterFromRecipe with mixed filters (in bonus, addValueToMultimap test)', () => {
        const filtersMixed = new Map<TListFilter, Array<string>>([[listFilter.cheese, ingredientsDataset.filter(ing => ing.type === listFilter.cheese).map(ing => ing.name)]]);

        const expectedArr = new Array<recipeTableElement>(recipesDataset[0], recipesDataset[1], recipesDataset[3], recipesDataset[4], recipesDataset[7]);

        expect(filterFromRecipe(recipesDataset, filtersMixed, t)).toEqual(expectedArr);

        addValueToMultimap(filtersMixed, listFilter.recipeTitleInclude, 'o');
        expectedArr.splice(2, 2); // This will remove recipesDataset[3] and recipesDataset[4]
        expect(filterFromRecipe(recipesDataset, filtersMixed, t)).toEqual(expectedArr);

        addValueToMultimap(filtersMixed, listFilter.tags, recipesDataset[1].tags[0].name);
        expectedArr.splice(0, 1);
        expectedArr.splice(1);
        expect(filterFromRecipe(recipesDataset, filtersMixed, t)).toEqual(expectedArr);

        // Add tag again to cover another branch of addValueToMultimap function
        addValueToMultimap(filtersMixed, listFilter.tags, recipesDataset[1].tags[1].name);
        expect(filterFromRecipe(recipesDataset, filtersMixed, t)).toEqual(expectedArr);
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
            'removeValueFromMultimap: Trying to remove value A title at key filterTypes.recipeTitleInclude from multimap but key finding fails'
        );

        removeValueToMultimap(workingFilters, listFilter.recipeTitleInclude, 'Quick Meal');
        expect(workingFilters).toEqual(filtersMixed);
        expect(consoleWarningSpy).toHaveBeenCalledWith(
            'removeValueFromMultimap: Trying to remove value Quick Meal at key filterTypes.recipeTitleInclude from multimap but key finding fails'
        );

        consoleWarningSpy.mockReset();

        removeValueToMultimap(workingFilters, listFilter.tags, 'quick meal');
        expect(workingFilters).toEqual(filtersMixed);
        expect(consoleWarningSpy).toHaveBeenCalledWith(
            'removeValueFromMultimap: Trying to remove value quick meal at key filterTypes.tags from multimap but value finding fails'
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

    test('removeTitleInMultimap shall remove the title given  if it exist', () => {

        let filtersMixed = new Map<TListFilter, Array<string>>([[listFilter.prepTime, [prepTimeValues[3], prepTimeValues[3]]], [listFilter.purchased, ['true', 'false']], [listFilter.grainOrCereal, ['Pasta']], [listFilter.tags, ['Quick Meal']]]);
        let expectedResult = new Map<TListFilter, Array<string>>([[listFilter.prepTime, [prepTimeValues[3], prepTimeValues[3]]], [listFilter.purchased, ['true', 'false']], [listFilter.grainOrCereal, ['Pasta']], [listFilter.tags, ['Quick Meal']]]);

        removeTitleInMultimap(filtersMixed);
        expect(filtersMixed).toEqual(expectedResult);

        filtersMixed = new Map<TListFilter, Array<string>>([[listFilter.prepTime, [prepTimeValues[3], prepTimeValues[3]]], [listFilter.purchased, ['true', 'false']], [listFilter.grainOrCereal, ['Pasta']], [listFilter.tags, ['Quick Meal']], [listFilter.recipeTitleInclude, ['A recipe title']]]);

        removeTitleInMultimap(filtersMixed);
        expect(filtersMixed).toEqual(expectedResult);
    });
});
