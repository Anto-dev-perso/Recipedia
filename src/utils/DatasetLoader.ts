import {
  ingredientTableElement,
  recipeTableElement,
  tagTableElement,
} from '@customTypes/DatabaseElementTypes';
import { appLogger } from '@utils/logger';
import { LANGUAGE_NAMES, SupportedLanguage } from '@utils/i18n';

import { testIngredients } from '@test-data/ingredientsDataset';
import { testTags } from '@test-data/tagsDataset';
import { testRecipes } from '@test-data/recipesDataset';

import { englishIngredients } from '@assets/datasets/en/ingredients';
import { englishTags } from '@assets/datasets/en/tags';
import { englishRecipes } from '@assets/datasets/en/recipes';
import { frenchIngredients } from '@assets/datasets/fr/ingredients';
import { frenchTags } from '@assets/datasets/fr/tags';
import { frenchRecipes } from '@assets/datasets/fr/recipes';

export type DatasetType = 'test' | 'production';

export interface DatasetCollection {
  ingredients: ingredientTableElement[];
  tags: tagTableElement[];
  recipes: recipeTableElement[];
}

function loadTestDataset(): DatasetCollection {
  return {
    ingredients: testIngredients,
    tags: testTags,
    recipes: testRecipes,
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

/**
 * Determines the current dataset type based on NODE_ENV
 *
 * @returns 'production' if NODE_ENV is 'production', otherwise 'test'
 */
export function getDatasetType(): DatasetType {
  return process.env.NODE_ENV === 'production' ? 'production' : 'test';
}

export function getDataset(language: SupportedLanguage): DatasetCollection {
  try {
    const datasetType = getDatasetType();
    const dataset =
      datasetType === 'production' ? loadProductionDataset(language) : loadTestDataset();

    appLogger.info('Loaded dataset', {
      datasetType,
      nodeEnv: process.env.NODE_ENV,
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
