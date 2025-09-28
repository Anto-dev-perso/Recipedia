export const mockSetLocale = jest.fn();

export function i18nMock() {
  const ocrTerms = {
    energyKj: ['Energie', 'Énergie', 'Énergie (kJ)', 'Energie (kJ)'],
    energyKcal: ['Energie', 'Énergie', 'Énergie (kCal)', 'Energie (kCal)'],
    fat: ['matières grasses', 'matieres grasses', 'lipides'],
    saturatedFat: ['dont acides gras saturés', 'dont saturés', 'dont satures'],
    carbohydrates: ['glucides'],
    sugars: ['dont sucres', 'dont sucre'],
    fiber: ['fibres'],
    protein: ['protéines', 'proteines'],
    salt: ['sel'],
    per100g: ['pour 100g'],
    perPortion: ['Par portion', 'Pour ce plat'],
  };

  const translations: Record<string, string> = {
    'preparationTimes.noneToTen': '0-10 min',
    'preparationTimes.tenToFifteen': '10-15 min',
    'preparationTimes.FifteenToTwenty': '15-20 min',
    'preparationTimes.twentyToTwentyFive': '20-25 min',
    'preparationTimes.twentyFiveToThirty': '25-30 min',
    'preparationTimes.thirtyToFourty': '30-40 min',
    'preparationTimes.fourtyToFifty': '40-50 min',
    'preparationTimes.oneHourPlus': '+60 min',
    personPrefixOCR: 'personPrefixOCR',
    personPrefixEdit: 'personPrefixEdit',
    timePrefixOCR: 'timePrefixOCR',
    timePrefixEdit: 'timePrefixEdit',
    preparationReadOnly: 'preparationReadOnly',
    timeSuffixEdit: 'min',
    'recipeCard.prepTime': 'Prep. {{time}} min',
    'recipeCard.persons': '{{count}} p.',
    'filters.tags': 'filters.tags',
    'filters.vegetables': 'filters.vegetables',
    'filters.fruits': 'filters.fruits',
    'filters.meat': 'filters.meat',
    tags: 'filters.tags',
    vegetables: 'filters.vegetables',
    fruits: 'filters.fruits',
    meat: 'filters.meat',
    searchRecipeTitle: 'searchRecipeTitle',

    'recipe.nutrition.title': 'recipe.nutrition.title',
    'recipe.nutrition.titleSimple': 'recipe.nutrition.titleSimple',
    'recipe.nutrition.per100g': 'recipe.nutrition.per100g',
    'recipe.nutrition.perPortionTab': 'recipe.nutrition.perPortionTab',
    'recipe.nutrition.removeNutrition': 'recipe.nutrition.removeNutrition',
    'recipe.nutrition.confirmDelete': 'recipe.nutrition.confirmDelete',
    'recipe.nutrition.portionWeight': 'recipe.nutrition.portionWeight',
    'recipe.nutrition.energyKcal': 'recipe.nutrition.energyKcal',
    'recipe.nutrition.energyKj': 'recipe.nutrition.energyKj',
    'recipe.nutrition.fat': 'recipe.nutrition.fat',
    'recipe.nutrition.saturatedFat': 'recipe.nutrition.saturatedFat',
    'recipe.nutrition.carbohydrates': 'recipe.nutrition.carbohydrates',
    'recipe.nutrition.sugars': 'recipe.nutrition.sugars',
    'recipe.nutrition.fiber': 'recipe.nutrition.fiber',
    'recipe.nutrition.protein': 'recipe.nutrition.protein',
    'recipe.nutrition.salt': 'recipe.nutrition.salt',

    delete: 'delete',
    cancel: 'cancel',
    'emptyState.noRecommendations.title': 'No Recommendations Available',
    'emptyState.noRecommendations.description':
      'Add some recipes to your collection to see personalized recommendations.',
    'recommendations.randomSelection': 'Random Selection',
    'recommendations.perfectForCurrentSeason': 'Seasonal Picks',
  };
  return {
    useI18n: () => ({
      t: (key: string, params?: Record<string, any>) => {
        let translation = translations[key] ?? key;
        if (params) {
          // Replace {{param}} with actual values
          Object.entries(params).forEach(([paramKey, value]) => {
            translation = translation.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value));
          });
        }
        return translation;
      },
      getLocale: () => jest.fn().mockReturnValue('en'),
      setLocale: mockSetLocale,
      getAvailableLocales: jest.fn().mockReturnValue(['en', 'fr']),
      getLocaleName: jest.fn().mockImplementation(() => 'locale name'),
    }),
    language: 'fr',
    getResource: (language: string, namespace: string, key: string) => {
      if (key === 'recipe.nutrition.ocr') {
        return ocrTerms;
      }
      return undefined;
    },
    getFixedT:
      (language: string, namespace: string, keyPrefix: string) => (key: string, options?: any) => {
        if (keyPrefix === 'recipe.nutrition.ocr' && key === '') {
          // Return the OCR nutrition terms object
          return options?.returnObjects ? ocrTerms : ocrTerms;
        }
        // For other keys, return as normal
        const fullKey = keyPrefix ? `${keyPrefix}.${key}` : key;
        return translations[fullKey] ?? fullKey;
      },
  };
}
