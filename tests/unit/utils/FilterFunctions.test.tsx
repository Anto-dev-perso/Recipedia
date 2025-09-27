import {
  addValueToMultimap,
  editTitleInMultimap,
  extractFilteredRecipeDatas,
  filterFromRecipe,
  removeTitleInMultimap,
  removeValueToMultimap,
  retrieveAllFilters,
} from '@utils/FilterFunctions';
import { listFilter, prepTimeValues, TListFilter } from '@customTypes/RecipeFiltersTypes';
import { testRecipes } from '@test-data/recipesDataset';
import {
  ingredientTableElement,
  isIngredientEqual,
  recipeTableElement,
} from '@customTypes/DatabaseElementTypes';
import { testTags } from '@test-data/tagsDataset';
import { testIngredients } from '@test-data/ingredientsDataset';
import { useI18n } from '@utils/i18n';

jest.mock('@utils/i18n', () => require('@mocks/utils/i18n-mock').i18nMock());

const { t } = useI18n();

describe('FilterFunctions', () => {
  test('extractFilteredRecipeDatas extracts and sorts data', () => {
    let [resTitles, resIngredients, resTags] = extractFilteredRecipeDatas(
      Array<recipeTableElement>(testRecipes[0])
    );
    let expectedTags = testRecipes[0].tags.map(tag => tag.name).sort();
    let expectedIngredient = testRecipes[0].ingredients.sort();

    expect(resTitles).toEqual([testRecipes[0].title]);
    expect(resTags).toEqual(expectedTags);
    expect(resIngredients).toEqual(expectedIngredient);

    [resTitles, resIngredients, resTags] = extractFilteredRecipeDatas(
      Array<recipeTableElement>(testRecipes[0], testRecipes[8])
    );
    expectedTags = [
      ...testRecipes[0].tags.map(tag => tag.name),
      ...testRecipes[8].tags.map(tag => tag.name),
    ].sort();
    expectedIngredient = [...testRecipes[0].ingredients, ...testRecipes[8].ingredients]
      .filter(
        (elem: ingredientTableElement, index: number, self: Array<ingredientTableElement>) => {
          return index == self.indexOf(elem);
        }
      )
      .sort();

    expect(resTitles).toEqual([testRecipes[0].title, testRecipes[8].title]);
    expect(resTags).toEqual(expectedTags);
    expect(resIngredients).toEqual(expectedIngredient);

    [resTitles, resIngredients, resTags] = extractFilteredRecipeDatas(testRecipes);
    let expectedTitles = new Array<string>();
    expectedTags.splice(0);
    expectedIngredient.splice(0);

    for (const dataset of testRecipes) {
      expectedTitles = [...expectedTitles, dataset.title];
      expectedTags = [...expectedTags, ...dataset.tags.map(tag => tag.name)];
      for (const ingredient of dataset.ingredients) {
        if (
          expectedIngredient.find(previousIng => isIngredientEqual(previousIng, ingredient)) ===
          undefined
        ) {
          expectedIngredient.push(ingredient);
        }
      }
    }

    expectedTitles.sort();
    expectedTags = expectedTags
      .filter((elem: string, index: number, self: Array<string>) => index == self.indexOf(elem))
      .sort();
    expectedIngredient = expectedIngredient
      .filter(
        (elem: ingredientTableElement, index: number, self: Array<ingredientTableElement>) =>
          index == self.indexOf(elem)
      )
      .sort();

    expect(resTitles).toEqual(expectedTitles);
    expect(resTags).toEqual(expectedTags);
    expect(resIngredients).toEqual(expectedIngredient);

    [resTitles, resIngredients, resTags] = extractFilteredRecipeDatas([]);
    expect(resTitles).toEqual([]);
    expect(resTags).toEqual([]);
    expect(resIngredients).toEqual([]);
  });

  test('filterFromRecipe with empty filters return the array given in input', () => {
    expect(filterFromRecipe(testRecipes, new Map<TListFilter, Array<string>>(), t)).toEqual(
      testRecipes
    );
  });

  test('filterFromRecipe with undefined filters return the array given in input', () => {
    expect(
      filterFromRecipe(
        testRecipes,
        new Map<TListFilter, Array<string>>([[listFilter.undefined, ['*']]]),
        t
      )
    ).toEqual(testRecipes);
  });

  test('filterFromRecipe with only preparation time filters', () => {
    const filtersTime = new Map<TListFilter, Array<string>>([
      [listFilter.prepTime, [prepTimeValues[2]]],
    ]);
    const timeFilterArray = filtersTime.get(listFilter.prepTime) as Array<string>;

    expect(filterFromRecipe(testRecipes, filtersTime, t)).toEqual(
      Array<recipeTableElement>(testRecipes[1], testRecipes[3], testRecipes[4], testRecipes[7])
    );

    timeFilterArray.push(prepTimeValues[7]);
    expect(filterFromRecipe(testRecipes, filtersTime, t)).toEqual(
      Array<recipeTableElement>(
        testRecipes[1],
        testRecipes[3],
        testRecipes[4],
        testRecipes[6],
        testRecipes[7]
      )
    );

    timeFilterArray.push(prepTimeValues[0]);
    expect(filterFromRecipe(testRecipes, filtersTime, t)).toEqual(
      Array<recipeTableElement>(
        testRecipes[1],
        testRecipes[3],
        testRecipes[4],
        testRecipes[6],
        testRecipes[7]
      )
    );

    timeFilterArray.push(prepTimeValues[5]);
    expect(filterFromRecipe(testRecipes, filtersTime, t)).toEqual(
      Array<recipeTableElement>(
        testRecipes[0],
        testRecipes[1],
        testRecipes[3],
        testRecipes[4],
        testRecipes[5],
        testRecipes[6],
        testRecipes[7],
        testRecipes[9]
      )
    );

    timeFilterArray.push(prepTimeValues[3]);
    expect(filterFromRecipe(testRecipes, filtersTime, t)).toEqual(
      Array<recipeTableElement>(
        testRecipes[0],
        testRecipes[1],
        testRecipes[2],
        testRecipes[3],
        testRecipes[4],
        testRecipes[5],
        testRecipes[6],
        testRecipes[7],
        testRecipes[9]
      )
    );

    timeFilterArray.push(prepTimeValues[6]);
    expect(filterFromRecipe(testRecipes, filtersTime, t)).toEqual(testRecipes);

    timeFilterArray.push(prepTimeValues[1]);
    expect(filterFromRecipe(testRecipes, filtersTime, t)).toEqual(testRecipes);

    timeFilterArray.push(prepTimeValues[4]);
    expect(filterFromRecipe(testRecipes, filtersTime, t)).toEqual(testRecipes);
  });

  test('filterFromRecipe with only season filters', () => {
    const filtersSeason = new Map<TListFilter, Array<string>>([
      [listFilter.inSeason, ['not existing']],
    ]);
    const seasonFilterArray = filtersSeason.get(listFilter.inSeason) as Array<string>;

    expect(filterFromRecipe(testRecipes, filtersSeason, t)).toEqual([]);

    seasonFilterArray.push('3');
    expect(filterFromRecipe(testRecipes, filtersSeason, t)).toEqual(
      Array<recipeTableElement>(testRecipes[0], testRecipes[2], testRecipes[6], testRecipes[9])
    );

    seasonFilterArray.push('1');
    expect(filterFromRecipe(testRecipes, filtersSeason, t)).toEqual(
      Array<recipeTableElement>(
        testRecipes[0],
        testRecipes[2],
        testRecipes[5],
        testRecipes[6],
        testRecipes[9]
      )
    );

    seasonFilterArray.push('*');
    expect(filterFromRecipe(testRecipes, filtersSeason, t)).toEqual(testRecipes);
  });

  test('filterFromRecipe with only tags filters', () => {
    const filtersTags = new Map<TListFilter, Array<string>>([[listFilter.tags, ['not existing']]]);
    const tagFilterArray = filtersTags.get(listFilter.tags) as Array<string>;

    expect(filterFromRecipe(testRecipes, filtersTags, t)).toEqual([]);

    tagFilterArray.push(testTags[14].name);
    expect(filterFromRecipe(testRecipes, filtersTags, t)).toEqual(
      Array<recipeTableElement>(testRecipes[9])
    );

    tagFilterArray.push(testTags[0].name);
    expect(filterFromRecipe(testRecipes, filtersTags, t)).toEqual(
      Array<recipeTableElement>(testRecipes[0], testRecipes[4], testRecipes[7], testRecipes[9])
    );

    for (let i = 1; i < testTags.length - 1; i++) {
      tagFilterArray.push(testTags[i].name);
    }
    expect(filterFromRecipe(testRecipes, filtersTags, t)).toEqual(testRecipes);
  });

  test('filterFromRecipe with only title filters', () => {
    const filtersTitle = new Map<TListFilter, Array<string>>([
      [listFilter.recipeTitleInclude, [testRecipes[7].title]],
    ]);
    const titleFilterArray = filtersTitle.get(listFilter.recipeTitleInclude) as Array<string>;

    expect(filterFromRecipe(testRecipes, filtersTitle, t)).toEqual(
      Array<recipeTableElement>(testRecipes[7])
    );

    titleFilterArray.splice(0);
    titleFilterArray.push('Tacos');
    expect(filterFromRecipe(testRecipes, filtersTitle, t)).toEqual(
      Array<recipeTableElement>(testRecipes[1])
    );

    titleFilterArray.splice(0);
    titleFilterArray.push('e');
    expect(filterFromRecipe(testRecipes, filtersTitle, t)).toEqual(
      Array<recipeTableElement>(
        testRecipes[0],
        testRecipes[1],
        testRecipes[2],
        testRecipes[3],
        testRecipes[4],
        testRecipes[5],
        testRecipes[6],
        testRecipes[7],
        testRecipes[9]
      )
    );
  });

  test('filterFromRecipe with only ingredient type filters', () => {
    const filtersIngredientType = new Map<TListFilter, Array<string>>([
      [
        listFilter.cheese,
        testIngredients.filter(ing => ing.type === listFilter.cheese).map(ing => ing.name),
      ],
    ]);

    let expectedArr = new Array<recipeTableElement>(
      testRecipes[0],
      testRecipes[1],
      testRecipes[3],
      testRecipes[4],
      testRecipes[7]
    );

    expect(filterFromRecipe(testRecipes, filtersIngredientType, t)).toEqual(expectedArr);

    addValueToMultimap(filtersIngredientType, listFilter.grainOrCereal, 'Taco Shells');
    expectedArr = new Array<recipeTableElement>(testRecipes[1]);

    expect(filterFromRecipe(testRecipes, filtersIngredientType, t)).toEqual(expectedArr);

    addValueToMultimap(filtersIngredientType, listFilter.poultry, 'Chicken Breast');
    expect(filterFromRecipe(testRecipes, filtersIngredientType, t)).toEqual(expectedArr);
  });

  test('filterFromRecipe with mixed filters (in bonus, addValueToMultimap test)', () => {
    const filtersMixed = new Map<TListFilter, Array<string>>([
      [
        listFilter.cheese,
        testIngredients.filter(ing => ing.type === listFilter.cheese).map(ing => ing.name),
      ],
    ]);

    const expectedArr = new Array<recipeTableElement>(
      testRecipes[0],
      testRecipes[1],
      testRecipes[3],
      testRecipes[4],
      testRecipes[7]
    );

    expect(filterFromRecipe(testRecipes, filtersMixed, t)).toEqual(expectedArr);

    addValueToMultimap(filtersMixed, listFilter.recipeTitleInclude, 'o');
    expectedArr.splice(2, 2); // This will remove recipesDataset[3] and recipesDataset[4]
    expect(filterFromRecipe(testRecipes, filtersMixed, t)).toEqual(expectedArr);

    addValueToMultimap(filtersMixed, listFilter.tags, testRecipes[1].tags[0].name);
    expectedArr.splice(0, 1);
    expectedArr.splice(1);
    expect(filterFromRecipe(testRecipes, filtersMixed, t)).toEqual(expectedArr);

    // Add tag again to cover another branch of addValueToMultimap function
    addValueToMultimap(filtersMixed, listFilter.tags, testRecipes[1].tags[1].name);
    expect(filterFromRecipe(testRecipes, filtersMixed, t)).toEqual(expectedArr);
  });

  test('removeValueToMultimap shall effectively remove from the multimap the asked value', () => {
    const consoleWarningSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const filtersMixed = new Map<TListFilter, Array<string>>([
      [listFilter.prepTime, [prepTimeValues[3]]],
      [listFilter.purchased, ['true', 'false']],
      [listFilter.grainOrCereal, ['Pasta']],
      [listFilter.tags, ['Quick Meal']],
    ]);

    const workingFilters = new Map<TListFilter, Array<string>>(filtersMixed);
    removeValueToMultimap(workingFilters, listFilter.recipeTitleInclude, 'A title');
    expect(workingFilters).toEqual(filtersMixed);

    removeValueToMultimap(workingFilters, listFilter.recipeTitleInclude, 'Quick Meal');
    expect(workingFilters).toEqual(filtersMixed);

    consoleWarningSpy.mockReset();

    removeValueToMultimap(workingFilters, listFilter.tags, 'quick meal');
    expect(workingFilters).toEqual(filtersMixed);

    removeValueToMultimap(workingFilters, listFilter.tags, 'Quick Meal');
    let expectedMultiMap = new Map<TListFilter, Array<string>>([
      [listFilter.prepTime, [prepTimeValues[3]]],
      [listFilter.purchased, ['true', 'false']],
      [listFilter.grainOrCereal, ['Pasta']],
    ]);
    expect(workingFilters).toEqual(expectedMultiMap);

    removeValueToMultimap(workingFilters, listFilter.purchased, 'false');
    expectedMultiMap = new Map<TListFilter, Array<string>>([
      [listFilter.prepTime, [prepTimeValues[3]]],
      [listFilter.purchased, ['true']],
      [listFilter.grainOrCereal, ['Pasta']],
    ]);
    expect(workingFilters).toEqual(expectedMultiMap);

    removeValueToMultimap(workingFilters, listFilter.purchased, 'true');
    expectedMultiMap = new Map<TListFilter, Array<string>>([
      [listFilter.prepTime, [prepTimeValues[3]]],
      [listFilter.grainOrCereal, ['Pasta']],
    ]);
    expect(workingFilters).toEqual(expectedMultiMap);

    removeValueToMultimap(workingFilters, listFilter.prepTime, prepTimeValues[3]);
    expectedMultiMap = new Map<TListFilter, Array<string>>([[listFilter.grainOrCereal, ['Pasta']]]);
    expect(workingFilters).toEqual(expectedMultiMap);

    removeValueToMultimap(workingFilters, listFilter.grainOrCereal, 'Pasta');
    expect(workingFilters.size).toEqual(0);
    expect(workingFilters).toEqual(new Map<TListFilter, Array<string>>());
  });

  test('retrieveAllFilters shall return an array of string filters', () => {
    const filtersMixed = new Map<TListFilter, Array<string>>([
      [listFilter.prepTime, [prepTimeValues[3], prepTimeValues[3]]],
      [listFilter.purchased, ['true', 'false']],
      [listFilter.grainOrCereal, ['Pasta']],
      [listFilter.tags, ['Quick Meal']],
    ]);
    const expectedResult = new Array<string>(
      prepTimeValues[3],
      prepTimeValues[3],
      'true',
      'false',
      'Pasta',
      'Quick Meal'
    );

    expect(retrieveAllFilters(filtersMixed)).toEqual(expectedResult);

    expect(retrieveAllFilters(new Map<TListFilter, Array<string>>())).toEqual(new Array<string>());
  });

  test('editTitleInMultimap shall do the edit it is supposed to do', () => {
    let filtersMixed = new Map<TListFilter, Array<string>>([
      [listFilter.recipeTitleInclude, ['First Title', 'Second Title']],
    ]);

    let expectedResult = new Map<TListFilter, Array<string>>([
      [listFilter.recipeTitleInclude, ['First Title', 'Second Title']],
    ]);

    editTitleInMultimap(filtersMixed, 'Edited title');
    expect(filtersMixed).toEqual(expectedResult);

    filtersMixed = new Map<TListFilter, Array<string>>([
      [listFilter.prepTime, [prepTimeValues[3], prepTimeValues[3]]],
      [listFilter.purchased, ['true', 'false']],
      [listFilter.grainOrCereal, ['Pasta']],
      [listFilter.tags, ['Quick Meal']],
    ]);
    expectedResult = new Map<TListFilter, Array<string>>([
      [listFilter.prepTime, [prepTimeValues[3], prepTimeValues[3]]],
      [listFilter.purchased, ['true', 'false']],
      [listFilter.grainOrCereal, ['Pasta']],
      [listFilter.tags, ['Quick Meal']],
      [listFilter.recipeTitleInclude, ['New title']],
    ]);

    editTitleInMultimap(filtersMixed, 'New title');
    expect(filtersMixed).toEqual(expectedResult);

    filtersMixed = new Map<TListFilter, Array<string>>([
      [listFilter.prepTime, [prepTimeValues[3], prepTimeValues[3]]],
      [listFilter.purchased, ['true', 'false']],
      [listFilter.grainOrCereal, ['Pasta']],
      [listFilter.tags, ['Quick Meal']],
      [listFilter.recipeTitleInclude, ['A recipe title']],
    ]);

    editTitleInMultimap(filtersMixed, 'New title');
    expect(filtersMixed).toEqual(expectedResult);
  });

  test('removeTitleInMultimap shall remove the title given  if it exist', () => {
    let filtersMixed = new Map<TListFilter, Array<string>>([
      [listFilter.prepTime, [prepTimeValues[3], prepTimeValues[3]]],
      [listFilter.purchased, ['true', 'false']],
      [listFilter.grainOrCereal, ['Pasta']],
      [listFilter.tags, ['Quick Meal']],
    ]);
    let expectedResult = new Map<TListFilter, Array<string>>([
      [listFilter.prepTime, [prepTimeValues[3], prepTimeValues[3]]],
      [listFilter.purchased, ['true', 'false']],
      [listFilter.grainOrCereal, ['Pasta']],
      [listFilter.tags, ['Quick Meal']],
    ]);

    removeTitleInMultimap(filtersMixed);
    expect(filtersMixed).toEqual(expectedResult);

    filtersMixed = new Map<TListFilter, Array<string>>([
      [listFilter.prepTime, [prepTimeValues[3], prepTimeValues[3]]],
      [listFilter.purchased, ['true', 'false']],
      [listFilter.grainOrCereal, ['Pasta']],
      [listFilter.tags, ['Quick Meal']],
      [listFilter.recipeTitleInclude, ['A recipe title']],
    ]);

    removeTitleInMultimap(filtersMixed);
    expect(filtersMixed).toEqual(expectedResult);
  });
});
