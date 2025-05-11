export default {
    // Navigation
    home: 'Accueil',
    shopping: 'Courses',
    parameters: 'Paramètres',
    recipe: 'Recette',
    search: 'Recherche',
    plannification: 'Planification',

    // Common actions
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    remove: 'Retirer',
    ok: 'RECETTE AJOUTÉE AU MENU',
    success: 'Succès',
    addedToShoppingList: 'a été ajouté avec succès à la liste de courses',
    addFilter: 'Ajouter un filtre',

    // Loading states
    loading: 'Chargement...',

    // Recipe related
    title: "Titre",
    description: "Description",
    tags: 'Étiquettes',
    tagExplanation: "Les étiquettes représentent une façon d'identifier une recette afin d'en faciliter la recherche.\nVoici certains exemples d'étiquettes que vous pouvez utiliser : ",

    ingredients: 'Ingrédients ',
    ingredientReadOnlyBeforePerson: 'Ingrédients (',
    ingredientReadOnlyAfterPerson: ' personnes)',
    quantity: "Quantité",
    unit: "Unité",
    ingredientName: "Nom",

    preparationReadOnly: 'Préparation : ',
    preparationOCRStep: 'Préparation: étape',
    preparationOCRStepTitle: "Titre de l'étape",
    preparationOCRStepContent: "Contenu de l'étape",

    timeReadOnlyBeforePerson: 'Préparation (',
    timeReadOnlyAfterPerson: ' min)',
    timePrefixOCR: 'Temps de préparation (minutes) :',
    timePrefixEdit: "Temps de préparation :",
    timeSuffixEdit: "min",

    personPrefixOCR: "Pour combien de personnes ?",
    personPrefixEdit: "Cette recette est pour : ",
    personSuffixEdit: " personnes",

    validateReadOnly: "Ajouter au menu",
    validateEdit: "Valider les modifications",
    validateAdd: "Ajouter cette nouvelle recette",

    editRecipe: 'Modifier la recette',
    deleteRecipe: 'Supprimer la recette',
    recommendation: 'Recommandation',
    searchRecipeTitle: 'Titre de la recette',

    // Shopping related
    shoppingList: 'Liste de courses',
    addToShoppingList: 'Ajouter à la liste de courses',

    // Parameters related
    language: 'Langue',
    theme: 'Thème',
    about: 'À propos',
    version: 'Version',

    // Time units
    minutes: 'minutes',
    hours: 'heures',

    // Confirmation messages
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer ceci ?',

    // Error messages
    errorOccurred: 'Une erreur est survenue',
    tryAgain: 'Veuillez réessayer',

    alerts: {
        missingElements: {
            titleSingular: 'Élement manquant',
            titlePlural: 'Élements manquants',
            messageSingularBeginning: "Votre recette manque de ",
            messageSingularEnding: ". Veuillez l'ajouter avant de valider.",
            messagePlural: "Vous n'avez pas renseigné tous les éléments essentiels à une recette. Avant de valider, veuillez renseigner : ",

        },
    },

    // Ingredient Types
    ingredientTypes: {
        grainOrCereal: 'Céréales et Grains',
        legumes: 'Légumineuses',
        vegetable: 'Légumes',
        plantProtein: 'Protéines Végétales',
        condiment: 'Condiments',
        sauce: 'Sauces',
        meat: 'Viande',
        poultry: 'Volaille',
        fish: 'Poisson',
        seafood: 'Fruits de Mer',
        dairy: 'Produits Laitiers',
        cheese: 'Fromage',
        sugar: 'Sucre',
        spice: 'Épices',
        fruit: 'Fruits',
        oilAndFat: 'Huiles et Graisses',
        nutsAndSeeds: 'Noix et Graines',
        sweetener: 'Édulcorants',
        undefined: 'Non défini',
    },

    // Filter Types
    filterTypes: {
        recipeTitleInclude: 'Titre de la recette',
        prepTime: 'Temps de préparation',
        inSeason: 'Recettes de saisons uniquement',
        tags: 'Étiquettes',
        purchased: 'Déjà acheté',
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
