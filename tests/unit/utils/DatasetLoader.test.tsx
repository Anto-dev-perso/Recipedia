import { getDataset } from '@utils/DatasetLoader';
import { LANGUAGE_NAMES } from '@utils/i18n';
import { testIngredients } from '@test-data/ingredientsDataset';
import { testTags } from '@test-data/tagsDataset';
import { testRecipes } from '@test-data/recipesDataset';
import { englishIngredients } from '@assets/datasets/en/ingredients';
import { englishTags } from '@assets/datasets/en/tags';
import { englishRecipes } from '@assets/datasets/en/recipes';
import { frenchIngredients } from '@assets/datasets/fr/ingredients';
import { frenchTags } from '@assets/datasets/fr/tags';
import { frenchRecipes } from '@assets/datasets/fr/recipes';

describe('DatasetLoader Utility', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      (process.env as any).NODE_ENV = originalEnv;
    } else {
      delete (process.env as any).NODE_ENV;
    }
  });

  describe('development environment', () => {
    beforeEach(() => {
      (process.env as any).NODE_ENV = 'development';
    });

    test('loads test dataset for English in development', () => {
      const result = getDataset(LANGUAGE_NAMES.en);

      expect(result.ingredients).toEqual(testIngredients);
      expect(result.tags).toEqual(testTags);
      expect(result.recipes).toEqual(testRecipes);
    });

    test('loads test dataset for French in development', () => {
      const result = getDataset(LANGUAGE_NAMES.fr);

      expect(result.ingredients).toEqual(testIngredients);
      expect(result.tags).toEqual(testTags);
      expect(result.recipes).toEqual(testRecipes);
    });

    test('loads test dataset for any language in development', () => {
      const result = getDataset('unknown' as any);

      expect(result.ingredients).toEqual(testIngredients);
      expect(result.tags).toEqual(testTags);
      expect(result.recipes).toEqual(testRecipes);
    });
  });

  describe('production environment', () => {
    beforeEach(() => {
      (process.env as any).NODE_ENV = 'production';
    });

    test('loads English production dataset', () => {
      const result = getDataset(LANGUAGE_NAMES.en);

      expect(result.ingredients).toEqual(englishIngredients);
      expect(result.tags).toEqual(englishTags);
      expect(result.recipes).toEqual(englishRecipes);
    });

    test('loads French production dataset', () => {
      const result = getDataset(LANGUAGE_NAMES.fr);

      expect(result.ingredients).toEqual(frenchIngredients);
      expect(result.tags).toEqual(frenchTags);
      expect(result.recipes).toEqual(frenchRecipes);
    });

    test('defaults to English dataset for unknown language', () => {
      const result = getDataset('unknown' as any);

      expect(result.ingredients).toEqual(englishIngredients);
      expect(result.tags).toEqual(englishTags);
      expect(result.recipes).toEqual(englishRecipes);
    });
  });

  describe('dataset content verification', () => {
    test('different environments return appropriate datasets', () => {
      (process.env as any).NODE_ENV = 'development';
      const devResult = getDataset(LANGUAGE_NAMES.en);

      expect(devResult.ingredients).toEqual(testIngredients);
      expect(devResult.tags).toEqual(testTags);
      expect(devResult.recipes).toEqual(testRecipes);

      (process.env as any).NODE_ENV = 'production';
      const prodResult = getDataset(LANGUAGE_NAMES.en);

      expect(prodResult.ingredients).toEqual(englishIngredients);
      expect(prodResult.tags).toEqual(englishTags);
      expect(prodResult.recipes).toEqual(englishRecipes);
    });

    test('different languages in production return different content', () => {
      (process.env as any).NODE_ENV = 'production';
      const enResult = getDataset(LANGUAGE_NAMES.en);

      expect(enResult.ingredients).toEqual(englishIngredients);
      expect(enResult.tags).toEqual(englishTags);
      expect(enResult.recipes).toEqual(englishRecipes);

      const frResult = getDataset(LANGUAGE_NAMES.fr);

      expect(frResult.ingredients).toEqual(frenchIngredients);
      expect(frResult.tags).toEqual(frenchTags);
      expect(frResult.recipes).toEqual(frenchRecipes);
    });
  });
});
