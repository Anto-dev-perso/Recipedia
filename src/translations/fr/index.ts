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
import onboarding from './onboarding';

export default {
  ...common,
  ...parameters,
  ...seasons,
  ...months,
  ...recipe,
  ...onboarding,
  home: navigation.home,
  search: navigation.search,
  parameters: navigation.parameters,
  plannification: navigation.plannification,
  shopping: navigation.shopping,
  shoppingScreen: {
    ...shopping,
  },
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
