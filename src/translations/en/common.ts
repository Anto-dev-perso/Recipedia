export default {
  // Common actions
  save: 'Save',
  cancel: 'Cancel',
  confirm: 'Confirm',
  delete: 'Delete',
  edit: 'Edit',
  add: 'Add',
  remove: 'Remove',
  ok: 'OK',
  understood: 'Understood',

  success: 'Success',
  addedToDatabase: 'Recipe "{{recipeName}}" has been successfully added to the database',
  addedToShoppingList: 'Recipe "{{recipeName}}" has been successfully added to the shopping list',
  deletedFromDatabase: 'Recipe "{{recipeName}}" has been successfully deleted',
  addFilter: 'Add a filter',
  seeFilterResult: 'See filtered recipes',

  // Loading states
  loading: 'Loading...',

  // Confirmation messages
  confirmDelete: 'Are you sure you want to delete ',
  interrogationMark: ' ?',

  // Error messages
  errorOccurred: 'An error occurred',
  tryAgain: 'Please try again',

  // Time units
  minutes: 'minutes',
  hours: 'hours',

  // Home screen recommendations
  recommendations: {
    randomSelection: 'Random Selection',
    perfectForCurrentSeason: 'Seasonal Picks',
    greatGrainDishes: 'Great Grain Dishes',
    basedOnIngredient: '{{ingredientName}}-based',
    tagRecipes: 'Tagged {{tagName}}',
  },

  // Empty states
  emptyState: {
    noRecommendations: {
      title: 'No Recommendations Available',
      description: 'Add some recipes to your collection to see personalized recommendations.',
    },
  },
};
