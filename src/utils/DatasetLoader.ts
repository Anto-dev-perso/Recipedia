import {
  ingredientTableElement,
  recipeTableElement,
  tagTableElement,
} from '@customTypes/DatabaseElementTypes';
import { appLogger } from '@utils/logger';
import { LANGUAGE_NAMES, SupportedLanguage } from '@utils/i18n';

import { ingredientsDataset } from '@test-data/ingredientsDataset';
import { tagsDataset } from '@test-data/tagsDataset';
import { recipesDataset } from '@test-data/recipesDataset';

import { englishIngredients } from '@assets/datasets/en/ingredients';
import { englishTags } from '@assets/datasets/en/tags';
import { englishRecipes } from '@assets/datasets/en/recipes';
import { frenchIngredients } from '@assets/datasets/fr/ingredients';
import { frenchTags } from '@assets/datasets/fr/tags';
import { frenchRecipes } from '@assets/datasets/fr/recipes';

export interface DatasetCollection {
  ingredients: ingredientTableElement[];
  tags: tagTableElement[];
  recipes: recipeTableElement[];
}

function loadTestDataset(): DatasetCollection {
  return {
    ingredients: ingredientsDataset,
    tags: tagsDataset,
    recipes: recipesDataset,
  };
}

function loadEnglishDataset(): DatasetCollection {
  return {
    ingredients: englishIngredients,
    tags: englishTags,
    recipes: englishRecipes,
  };
}

function loadFrenchDataset(): DatasetCollection {
  return {
    ingredients: frenchIngredients,
    tags: frenchTags,
    recipes: frenchRecipes,
  };
}

function loadProductionDataset(language: SupportedLanguage): DatasetCollection {
  switch (language) {
    case LANGUAGE_NAMES.fr:
      return loadFrenchDataset();
    case LANGUAGE_NAMES.en:
    default:
      return loadEnglishDataset();
  }
}

export function getDataset(language: SupportedLanguage): DatasetCollection {
  try {
    const nodeEnv = process.env.NODE_ENV;
    const dataset = nodeEnv === 'production' ? loadProductionDataset(language) : loadTestDataset();

    appLogger.info('Loaded dataset', {
      nodeEnv,
      language,
      ingredientsCount: dataset.ingredients.length,
      tagsCount: dataset.tags.length,
      recipesCount: dataset.recipes.length,
    });

    return dataset;
  } catch (error) {
    appLogger.error('Failed to load dataset, falling back to test data', {
      nodeEnv: process.env.NODE_ENV,
      language,
      error,
    });
    return loadTestDataset();
  }
}
