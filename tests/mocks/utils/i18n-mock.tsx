export const mockSetLocale = jest.fn();

export function i18nMock() {
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
  };
}
