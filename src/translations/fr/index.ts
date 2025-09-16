import navigation from './navigation';
import common from './common';
import recipe from './recipe';
import shopping from './shopping';
import parameters from './parameters';
import seasons from './seasons';
import ingredientTypes from './ingredientTypes';
import filters from './filters';
import alerts from './alerts';
import months from './months';

export default {
  ...navigation,
  ...common,
  ...shopping,
  ...parameters,
  ...seasons,
  ...months,

  ...recipe,
  recipe: {
    nutrition: recipe.nutrition,
  },
  ingredientTypes,
  filterTypes: filters.filterTypes,
  alerts: {
    missingElements: alerts.missingElements,
    ocrRecipe: alerts.ocrRecipe,
    tagSimilarity: alerts.tagSimilarity,
    ingredientSimilarity: alerts.ingredientSimilarity,
  },
};
