export default {
    // Navigation
    home: 'Home',
    shopping: 'Shopping',
    parameters: 'Parameters',
    recipe: 'Recipe',
    search: 'Search',
    plannification: 'Planning',

    // Common actions
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    remove: 'Remove',
    ok: 'OK',
    success: 'SUCCESSFULLY ADDED RECIPE TO SHOPPING LIST',
    addedToShoppingList: 'has been successfully added to the shopping list',
    addFilter: 'Add a filter',

    // Loading states
    loading: 'Loading...',

    // Recipe related
    title: "Title",
    description: "Description",
    tags: 'Tags',
    tagExplanation: 'Tags are a way to identify a recipe and make easier its search.\nHere are some examples of tags you can have : ',

    ingredients: 'Ingredients',
    ingredientReadOnlyBeforePerson: 'Ingredients (',
    ingredientReadOnlyAfterPerson: ' persons)',
    quantity: "Quantity",
    unit: "Unit",
    ingredientName: "Name",

    timeReadOnlyBeforePerson: 'Preparation (',
    timeReadOnlyAfterPerson: ' min)',
    timePrefixOCR: 'Prep time (minutes):',
    timePrefixEdit: "Time to prepare the recipe :",
    timeSuffixEdit: "min",

    preparationReadOnly: 'Preparation :',
    preparationOCRStep: 'Preparation: step',
    preparationOCRStepTitle: 'Title of step',
    preparationOCRStepContent: 'Content of step',

    personPrefixOCR: 'How many serving (people) ?',
    personPrefixEdit: "This recipe is for : ",
    personSuffixEdit: " persons",

    validateReadOnly: "Add to the menu",
    validateEdit: "Validate the recipe with these modifications",
    validateAdd: "Add this new recipe",

    deleteRecipe: 'Delete Recipe',
    recommendation: 'Recommendation',
    searchRecipeTitle: 'Title of recipe',

    // Shopping related
    shoppingList: 'Shopping List',
    addToShoppingList: 'Add to Shopping List',

    // Parameters related
    language: 'Language',
    theme: 'Theme',
    about: 'About',
    version: 'Version',

    // Time units
    minutes: 'minutes',
    hours: 'hours',

    // Confirmation messages
    confirmDelete: 'Are you sure you want to delete this?',

    // Error messages
    errorOccurred: 'An error occurred',
    tryAgain: 'Please try again',

    alerts: {
        missingElements: {
            titleSingular: 'Missing element',
            titlePlural: 'Missing elements',
            messageSingularBeginning: "You're missing ",
            messageSingularEnding: " to your recipe. Please add this before validate.",
            messagePlural: "You haven't add all of the elements to your recipe. Please enter before validate at least: ",

        },
    },

    // Ingredient Types
    ingredientTypes: {
        grainOrCereal: "Grain or Cereal",
        legumes: "Legumes",
        vegetable: "Vegetable",
        plantProtein: "Plant Protein",
        condiment: "Condiment",
        sauce: "Sauce",
        meat: "Meat",
        poultry: "Poultry",
        fish: "Fish",
        seafood: "Seafood",
        dairy: "Dairy",
        cheese: "Cheese",
        sugar: "Sugar",
        spice: "Spice",
        fruit: "Fruit",
        oilAndFat: "Oil and Fat",
        nutsAndSeeds: "Nuts and Seeds",
        sweetener: "Sweetener",
        undefined: 'Undefined',
    },

    // Filter Types
    filterTypes: {
        recipeTitleInclude: "recipeTitleInclude",
        prepTime: "Preparation Time",
        inSeason: "Only in-season ingredients",
        tags: "Tags",
        purchased: "Already purchased",
    },

    preparationTimes: {
        noneToTen: "0-10 min",
        tenToFifteen: "10-15 min",
        FifteenToTwenty: "15-20 min",
        twentyToTwentyFive: "20-25 min",
        twentyFiveToThirty: "25-30 min",
        thirtyToFourty: "30-40 min",
        fourtyToFifty: "40-50 min",
        oneHourPlus: "+60 min",
    }
};
