// import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import * as SQLite from 'expo-sqlite';
import {
    encodedRecipeElement,
    encodedShoppingListElement,
    ingredientsColumnsNames,
    ingredientsTableName,
    ingredientTableElement,
    ingredientType,
    isIngredientEqual,
    isRecipeEqual,
    isShoppingEqual,
    isTagEqual,
    recipeColumnsEncoding,
    recipeColumnsNames,
    recipeDatabaseName,
    recipeTableElement,
    recipeTableName,
    regExp,
    shoppingListColumnsEncoding,
    shoppingListColumnsNames,
    shoppingListTableElement,
    shoppingListTableName,
    tagsColumnsNames,
    tagTableElement,
    tagTableName
} from '@customTypes/DatabaseElementTypes';
import TableManipulation from './TableManipulation';
import {EncodingSeparator, textSeparator} from '@styles/typography';
import {alertUserChoice, AsyncAlert} from './AsyncAlert';
import {listFilter, TListFilter} from '@customTypes/RecipeFiltersTypes';
import FileGestion from '@utils/FileGestion'


const dbTest: Array<recipeTableElement> = [
    // {
    //   image_Source: '../assets/images/architecture.jpg',
    //   title: "Architecture take from far away",
    //   description: "This is an architecture",
    //   tags: ["Tag1"],
    //   ingredients: ["A photograph"],
    //   preparation: ["Go on a good spot and take the picture"],
    // },
    // {
    //   image_Source: '../assets/images/bike.jpg',
    //   title: "Bike on a beach",
    //   description: `For all our 'bobo', here is your partner in crime : a bike. On a beach beacause why not`,
    //   tags: ["Tag2"],
    //   ingredients: ["A beach, a bike"],
    //   preparation: ["Go to the beach with your bike. Park it and that's it !"],
    // },
    // {
    //   image_Source: '../assets/images/cat.jpg',
    //   title: "Beatiful cat",
    //   description: "It's a cat you know ...",
    //   tags: ["Tag3"],
    //   ingredients: ["A cat ... obviously"],
    //   preparation: ["Harm with patience and wait for him to look at you"],
    // },
    // {
    //   image_Source: '../assets/images/child.jpg',
    //   title: "Child wearing a purple coat",
    //   description: "On a purple room, this child is centered with its own purple coat",
    //   tags: ["Tag4"],
    //   ingredients: ["The room, the child, the coat"],
    //   preparation: ["But the coat on the child, place him front to the camera"],
    // },
    // {
    //   image_Source: '../assets/images/church.jpg',
    //   title: "Inside the church",
    //   description: "Coupole inside the church",
    //   tags: ["Tag5"],
    //   ingredients: ["A church, you neck"],
    //   preparation: ["Got to the chruch and look up"],
    // },
    // {
    //   image_Source: '../assets/images/coffee.jpg',
    //   title: "Wanna take a coffee break ?",
    //   description: "Set of coffee with everything you can possibly need",
    //   tags: ["Tag6"],
    //   ingredients: ["Cup of coffee"],
    //   preparation: ["Nothing"],
    // },
    // {
    //   image_Source: '../assets/images/crimson.jpg',
    //   title: "Is this King Crimson ?",
    //   description: "Little bird call Crimson on its branch",
    //   tags: ["Tag7"],
    //   ingredients: ["A very good objective"],
    //   preparation: ["Wait for it and good luck"],
    // },
    // {
    //   image_Source: '../assets/images/dog.jpg',
    //   title: "Cute dog",
    //   description: "Look a him, he is sooooooo cute",
    //   tags: ["Tag8"],
    //   ingredients: ["Dog"],
    //   preparation: ["Put the dog inside a flower garden"],
    // },
    // {
    //   image_Source: '../assets/images/monastery.jpg',
    //   title: "Monastery",
    //   description: "Picture of a monastery during a sunset",
    //   tags: ["Tag9"],
    //   ingredients: ["Monastery, sunset"],
    //   preparation: ["When time is ok, take this masterpiece"],
    // },
    // {
    //   image_Source: '../assets/images/motocross.jpg',
    //   title: "Biker during a drift",
    //   tags: ["Tag10"],
    //   description: "Fabulous drift",
    //   ingredients: ["A good biker"],
    //   preparation: ["During a hard virage, take this while a drift in ongoing"],
    // },
    // {
    //   image_Source: '../assets/images/mushrooms.jpg',
    //   title: "Brown mushrooms",
    //   description: "Mushrooms that's grows to much",
    //   tags: ["Tag11"],
    //   ingredients: ["This kind of mushromms all packed togethers"],
    //   preparation: ["If you find it while randonning, don't wait !"],
    // },
    // {
    //   image_Source: '../assets/images/scooter.jpg',
    //   title: "Parisians riding",
    //   description: "Look a those parisians with theirs scooters. What is this seriously",
    //   tags: ["Tag12"],
    //   ingredients: ["Parisians, Scooters"],
    //   preparation: [`It should be easy to find them in Paris.\nBe prepared to be insulted`],
    // },
    // {
    //   image_Source: '../assets/images/strawberries.jpg',
    //   title: "Strawberries verrine",
    //   tags: ["Tag13"],
    //   description: "Beautiful and appetizing strawberries verrine",
    //   ingredients: ["Strawberries"],
    //   preparation: ["Cook the verrrine"],
    // },
    // {
    //   image_Source: '../assets/images/tree.jpg',
    //   title: "Tree in the snow",
    //   description: "In a snow valley, those trees are rising",
    //   tags: ["Tag14"],
    //   ingredients: ["Trees, Snow"],
    //   preparation: ["Find this valley, look hard for thos trees"],
    // },
    // {
    //   image_Source: '../assets/images/waves.jpg',
    //   title: "Waves on the rock",
    //   description: "Riple waves arriving to the rocks",
    //   tags: ["Tag15"],
    //   ingredients: ["Rocks, Waves"],
    //   preparation: ["On a rainy day, go to these rocks"],
    // },
    {
        image_Source: 'waves.jpg',
        title: "Saucisse au couteau, crème aux champignons et macaroni",
        description: "Un plat rustique qui met tout le monde d'accord avec nos saucisses au couteau. Un plat de bistrot réconfortant pour petits et grands.",
        tags: [{tagName: "Kids friendly"}, {tagName: "Test d'un tag débordant"}, {tagName: "Gourmand"}, {tagName: "Express"}, {tagName: "Tradition"}],
        ingredients: [{
            ingName: "Champignons de Paris blanc",
            unit: "g",
            quantity: 100,
            type: ingredientType.vegetable,
            season: ["*"]
        }, {
            ingName: "Crème liquide",
            unit: "mL",
            quantity: 100,
            type: ingredientType.dairy,
            season: ["*"]
        }, {
            ingName: "Gousse d'ail",
            unit: "",
            quantity: 0.5,
            type: ingredientType.condiment,
            season: ["*"]
        }, {
            ingName: "Macaroni demi-complets",
            unit: "g",
            quantity: 200,
            type: ingredientType.grainOrCereal,
            season: ["*"]
        }, {
            ingName: "Oignon jaune",
            unit: "",
            quantity: 1,
            type: ingredientType.condiment,
            season: ["*"]
        }, {ingName: "Saucisse couteau nature", unit: "g", quantity: 250, type: ingredientType.meat, season: ["*"]}],
        preparation: ["Les saucisses--Dans une seconde sauteuse, faites chauffer un filet d'huile d'olive à feu moyen à vif.\nFaites revenir les saucisses 12 min environ. Salez, poivrez.\nPendant ce temps, faites cuire les macaroni.", "Les macaroni--Portez à ébullition une casserole d'eau salée.\nFaites cuire les macaroni selon les indications du paquet.", "Etape finale--Servez sans attendre votre saucisse au couteau nappée de crème aux champignons et accompagnée des macaroni"],
        time: 25,
        season: [],
        persons: 2,
    },
    {
        image_Source: 'tree.jpg',
        title: "Korma de légumes au lait de coco",
        description: "Ce mijoté indien vous est proposé en version 100% végétale avec du riz bio et des légumes cuits délicatement dans une purée de noisettes au curcuma.",
        tags: [{tagName: "Végétarien"}, {tagName: "Indien"}],
        ingredients: [{
            ingName: "Carotte",
            unit: "",
            quantity: 1,
            type: ingredientType.vegetable,
            season: ["*"]
        }, {
            ingName: "Concentré de tomates",
            unit: "g",
            quantity: 35,
            type: ingredientType.sauce,
            season: ["*"]
        }, {ingName: "Coriandre", unit: "qq brins", type: ingredientType.spice, season: ["*"]}, {
            ingName: "Courgette",
            unit: "",
            quantity: 1,
            type: ingredientType.vegetable,
            season: ["5", "6", "7", "8", "9", "10"]
        }, {
            ingName: "Curcuma",
            unit: "sachet",
            quantity: 0.25,
            type: ingredientType.spice,
            season: ["*"]
        }, {
            ingName: "Lait de coco",
            unit: "mL",
            quantity: 150,
            type: ingredientType.dairy,
            season: ["*"]
        }, {
            ingName: "Oignon jaune",
            unit: "",
            quantity: 1,
            type: ingredientType.condiment,
            season: ["*"]
        }, {
            ingName: "Purée de noisettes",
            unit: "g",
            quantity: 40,
            type: ingredientType.sauce,
            season: ["*"]
        }, {ingName: "Riz basmati", unit: "g", quantity: 150, type: ingredientType.grainOrCereal, season: ["*"]}],
        preparation: ["Les légumes--Émincez l'oignon.\nÉpluchez la carotte.\nCoupez la courgette et la carotte en dés.\nPelez et hachez finement l'ail et le gingembre.\nDans une sauteuse, faites chauffer un filet d'huile de cuisson à feu moyen à vif.\nFaites revenir l'oignon et la carotte 5 min.\nAu bout des 5 min de cuisson, ajoutez la courgette, le curcuma, l'ail et le gingembre et poursuivez la cuisson 10 min. Salez, poivrez.\nEn parallèle, faites cuire le riz.", "Le riz--Portez à ébullition une casserole d'eau salée.\nFaites cuire le riz selon les indications du paquet.", "Le korma--Une fois les légumes cuits, ajoutez dans la sauteuse le concentré de tomates, la purée de noisettes et le lait de coco.\nCouvrez et laissez mijoter 5 min.\nGoûtez et rectifiez l'assaisonnement si nécessaire.\nCiselez la coriandre (en entier, les tiges se consomment).", "A table--Servez votre korma de légumes au lait de coco bien chaud accompagné du riz et parsemé de coriandre !"],
        time: 30,
        season: [],
        persons: 2,
    },
    {
        image_Source: 'strawberries.jpg',
        title: "Piccata de dinde au citron et courgettes sautées à l'ail",
        description: "Nos délicieuses escalopes de dinde françaises se parent de farine, s'enrobent de beurre et se déglacent au jus de citron. Tout un programme !",
        tags: [{tagName: "Kids friendly"}, {tagName: "Italien"}],
        ingredients: [{
            ingName: "Citron jaune",
            unit: "",
            quantity: 0.5,
            type: ingredientType.condiment,
            season: ["*"]
        }, {
            ingName: "Courgette",
            unit: "",
            quantity: 2,
            type: ingredientType.vegetable,
            season: ["5", "6", "7", "8", "9", "10"]
        }, {
            ingName: "Escalope de dinde",
            unit: "",
            quantity: 2,
            type: ingredientType.poultry,
            season: ["*"]
        }, {
            ingName: "Gousse d'ail",
            unit: "",
            quantity: 0.5,
            type: ingredientType.condiment,
            season: ["*"]
        }, {
            ingName: "Origan",
            unit: "sachet",
            quantity: 0.25,
            type: ingredientType.spice,
            season: ["*"]
        }, {
            ingName: "Spaghetti blancs",
            unit: "g",
            quantity: 200,
            type: ingredientType.grainOrCereal,
            season: ["*"]
        }, {ingName: "Riz basmati", unit: "g", quantity: 150, type: ingredientType.grainOrCereal, season: ["*"]}],
        preparation: ["Les légumes--Emincez l'oignon.\nCoupez les courgettes en rondelles.\nPressez ou hachez l'ail.\nDans une sauteuse, faites chauffer un filet d'huile d'olive à feu moyen à vif.\nFaites revenir l'oignon 5 min.\nAu bout des 5 min de cuisson, ajoutez l'ail, l'origan et les courgettes et poursuivez la cuisson 10 min. Salez, poivrez.\nEn parallèle, faites cuire les spaghetti.", "Les spaghetti--Portez à ébullition une casserole d'eau salée.\nFaites cuire les spaghetti selon les indications du paquet.\nPendant la cuisson des spaghetti, réalisez la piccata de dinde.", "La piccata de dinde--Pressez le citron jaune.\nDéposez un peu de farine dans une assiette creuse.\nCoupez les escalopes de dinde en fines lanières. Salez, poivrez et trempez-les dans la farine.\nDans une poêle, faites fondre le beurre à feu moyen à vif.\nFaites cuire la dinde 5 à 8 min. En fin de cuisson, versez le jus de citron.", "A table--Servez sans attendre votre piccata de dinde accompagnée des spaghetti et des courgettes sautées !"],
        time: 30,
        season: [],
        persons: 2,
    },
    {
        image_Source: 'scooter.jpg',
        title: "Tofu fumé et sauce tomate aux épices chimichurri",
        description: "Les épices chimichurri ? Un mélange originaire d’Argentine à base d’origan, de piment doux et de thym qui relèveront à merveille notre tofu fumé !",
        tags: [{tagName: "Découverte"}, {tagName: "Végétarien"}],
        ingredients: [{
            ingName: "Champignons de Paris blanc",
            unit: "g",
            quantity: 250,
            type: ingredientType.vegetable,
            season: ["*"]
        }, {
            ingName: "Coquillettes demi-complètes",
            unit: "g",
            quantity: 200,
            type: ingredientType.grainOrCereal,
            season: ["*"]
        }, {
            ingName: "Gousse d'ail",
            unit: "",
            quantity: 0.5,
            type: ingredientType.condiment,
            season: ["*"]
        }, {
            ingName: "Mélange d'épices chimichurri",
            unit: "sachet",
            quantity: 0.25,
            type: ingredientType.spice,
            season: ["*"]
        }, {
            ingName: "Oignon jaune",
            unit: "",
            quantity: 1,
            type: ingredientType.condiment,
            season: ["*"]
        }, {
            ingName: "Origan",
            unit: "sachet",
            quantity: 0.25,
            type: ingredientType.spice,
            season: ["*"]
        }, {
            ingName: "Purée de tomates",
            unit: "g",
            quantity: 250,
            type: ingredientType.sauce,
            season: ["*"]
        }, {ingName: "Tofu fumé", unit: "g", quantity: 200, type: ingredientType.plantProtein, season: ["*"]}],
        preparation: ["Les légumes--Emincez l'oignon.\nCoupez les courgettes en rondelles.\nPressez ou hachez l'ail.\nDans une sauteuse, faites chauffer un filet d'huile d'olive à feu moyen à vif.\nFaites revenir l'oignon 5 min.\nAu bout des 5 min de cuisson, ajoutez l'ail, l'origan et les courgettes vf njdlsnv fjdet poursuivez la cuisson 10 min. Salez, poivrez.\nEn parallèle, faites cuire les spaghetti.", "Les spaghetti--Portez à ébullition une casserole d'eau salée.\nFaites cuire les spaghetti selon les indications du paquet.\nPendant la cuisson des spaghetti, réalisez la piccata de dinde.", "La piccata de dinde--Pressez le citron jaune.\nDéposez un peu de farine dans une assiette creuse.\nCoupez les escalopes de dinde en fines lanières. Salez, poivrez et trempez-les dans la farine.\nDans une poêle, faites fondre le beurre à feu moyen à vif.\nFaites cuire la dinde 5 à 8 min. En fin de cuisson, versez le jus de citron.", "A table--Servez sans attendre votre piccata de dinde accompagnée des spaghetti et des courgettes sautées !"],
        time: 30,
        season: [],
        persons: 2,
    }
];

const ingTable: Array<ingredientTableElement> = [
    {
        ingName: "Champignons de Paris blanc",
        unit: "g",
        type: ingredientType.vegetable,
        season: ["*"]
    },
    {ingName: "Crème liquide", unit: "mL", type: ingredientType.dairy, season: ["*"]},
    {
        ingName: "Gousse d'ail",
        unit: "",
        type: ingredientType.condiment,
        season: ["*"]
    },
    {
        ingName: "Macaroni demi-complets",
        unit: "g",
        type: ingredientType.grainOrCereal,
        season: ["*"]
    },
    {
        ingName: "Oignon jaune",
        unit: "",
        type: ingredientType.condiment,
        season: ["*"]
    },
    {ingName: "Saucisse couteau nature", unit: "g", type: ingredientType.meat, season: ["*"]},
    {
        ingName: "Carotte",
        unit: "",
        type: ingredientType.vegetable,
        season: ["*"]
    }, {ingName: "Concentré de tomates", unit: "g", type: ingredientType.sauce, season: ["*"]},
    {
        ingName: "Coriandre",
        unit: "qq brins",
        type: ingredientType.spice,
        season: ["*"]
    }, {
        ingName: "Courgette",
        unit: "",
        type: ingredientType.vegetable,
        season: ["5", "6", "7", "8", "9", "10"]
    },
    {ingName: "Curcuma", unit: "sachet", type: ingredientType.spice, season: ["*"]},
    {
        ingName: "Lait de coco",
        unit: "mL",
        type: ingredientType.dairy,
        season: ["*"]
    },
    {ingName: "Purée de noisettes", unit: "g", type: ingredientType.sauce, season: ["*"]},
    {
        ingName: "Riz basmati",
        unit: "g",
        type: ingredientType.grainOrCereal,
        season: ["*"]
    },
    {ingName: "Citron jaune", unit: "", type: ingredientType.condiment, season: ["*"]},
    {
        ingName: "Escalope de dinde",
        unit: "",
        type: ingredientType.poultry,
        season: ["*"]
    },
    {ingName: "Origan", unit: "sachet", type: ingredientType.spice, season: ["*"]},
    {
        ingName: "Spaghetti blancs",
        unit: "g",
        type: ingredientType.grainOrCereal,
        season: ["*"]
    },
    {
        ingName: "Coquillettes demi-complètes",
        unit: "g",
        type: ingredientType.grainOrCereal,
        season: ["*"]
    },
    {
        ingName: "Mélange d'épices chimichurri",
        unit: "sachet",
        type: ingredientType.spice,
        season: ["*"]
    },
    {ingName: "Purée de tomates", unit: "g", type: ingredientType.sauce, season: ["*"]},
    {
        ingName: "Tofu fumé",
        unit: "g",
        type: ingredientType.plantProtein,
        season: ["*"]
    }
    // , {ingName: "Riz basmati", unit: "g"}
];
const tagTable: Array<tagTableElement> = [
    {tagName: "Kids friendly"}, {tagName: "Gourmand"}, {tagName: "Express"}, {tagName: "Tradition"}, {tagName: "Test d'un tag débordant"}, {tagName: "Végétarien"}, {tagName: "Indien"}, {tagName: "Italien"}, {tagName: "Découverte"},
];

export default class RecipeDatabase {
    static #instance: RecipeDatabase;


    protected _databaseName: string;
    protected _dbConnection: SQLite.SQLiteDatabase;

    protected _recipesTable: TableManipulation;
    protected _ingredientsTable: TableManipulation;
    protected _tagsTable: TableManipulation;
    // TODO add nutrition
    // protected _nutritionTable: TableManipulation;

    protected _shoppingListTable: TableManipulation;

    protected _recipes: Array<recipeTableElement>;
    protected _ingredients: Array<ingredientTableElement>;
    protected _tags: Array<tagTableElement>;
    // protected _nutrition: Array<>;

    protected _shopping: Array<shoppingListTableElement>;

    /*    PRIVATE METHODS     */
    private constructor() {
        this._databaseName = recipeDatabaseName;

        this._recipesTable = new TableManipulation(recipeTableName, recipeColumnsEncoding);
        this._ingredientsTable = new TableManipulation(ingredientsTableName, ingredientsColumnsNames);
        this._tagsTable = new TableManipulation(tagTableName, tagsColumnsNames);
        // this._nutritionTable = new TableManipulation(nutritionTableName, nutritionColumnsNames);

        this._shoppingListTable = new TableManipulation(shoppingListTableName, shoppingListColumnsEncoding);

        this._recipes = new Array<recipeTableElement>();
        this._ingredients = new Array<ingredientTableElement>();
        this._tags = new Array<tagTableElement>();
        // this._nutrition = new Array<>();

        this._shopping = new Array<shoppingListTableElement>();
    }


    /* PUBLIC METHODS */

    public static getInstance(): RecipeDatabase {
        if (!RecipeDatabase.#instance) {
            RecipeDatabase.#instance = new RecipeDatabase();
        }

        return RecipeDatabase.#instance;
    }

    // public async exempleDb() {
    //     await this.addMultipleTags(tagTable);
    //     await this.addMultipleIngredients(ingTable);
    //     await this.addMultipleRecipes(dbTest);
    // }

    public async reset() {

        this.openDatabase();
        await this._recipesTable.deleteTable(this._dbConnection);
        await this._ingredientsTable.deleteTable(this._dbConnection);
        await this._tagsTable.deleteTable(this._dbConnection);
        await this._shoppingListTable.deleteTable(this._dbConnection);
        // await this._nutritionTable.deleteTable(this._dbConnection);

        this._recipes = new Array<recipeTableElement>();
        this._ingredients = new Array<ingredientTableElement>();
        this._tags = new Array<tagTableElement>();
        this._shopping = new Array<shoppingListTableElement>();
    }

    public async init() {


        this.openDatabase();

        // TODO can we create multiple table in a single query ?
        await this._recipesTable.createTable(this._dbConnection);
        await this._ingredientsTable.createTable(this._dbConnection);
        await this._tagsTable.createTable(this._dbConnection);
        await this._shoppingListTable.createTable(this._dbConnection);
        // await this._nutritionTable.createTable();


        // await this.addMultipleShopping(shoppingList);
        // await this.updateShoppingList({ type: listFilter.cerealProduct, name: "Riz basmati", quantity: 200, unit: "g", recipes: ["Title1", "Title2", "Title3"], purchased: false});
        // X : 250 g--Champignons de Paris blanc--Vegetable
        // this.addRecipeToShopping({
        //     image_Source: '../assets/images/strawberries.jpg',
        //     title: "Piccata de dinde au citron et courgettes sautées à l'ail",
        //     description: "Nos délicieuses escalopes de dinde françaises se parent de farine, s'enrobent de beurre et se déglacent au jus de citron. Tout un programme !",
        //     tags: ["Kids friendly", "Italien"],
        //     ingredients: ["0.5--Citron jaune--Vegetable", "2--Courgette--Vegetable", "2--Escalope de dinde--Meet", "0.5--Gousse d'ail--Vegetable", "0.25--Origan--Vegetable", "200 g--Spaghetti blancs--Cereal Product", "150 g--Riz basmati--Cereal Product"],
        //     preparation: ["Les légumes--Emincez l'oignon.\nCoupez les courgettes en rondelles.\nPressez ou hachez l'ail.\nDans une sauteuse, faites chauffer un filet d'huile d'olive à feu moyen à vif.\nFaites revenir l'oignon 5 min.\nAu bout des 5 min de cuisson, ajoutez l'ail, l'origan et les courgettes et poursuivez la cuisson 10 min. Salez, poivrez.\nEn parallèle, faites cuire les spaghetti.", "Les spaghetti--Portez à ébullition une casserole d'eau salée.\nFaites cuire les spaghetti selon les indications du paquet.\nPendant la cuisson des spaghetti, réalisez la piccata de dinde.", "La piccata de dinde--Pressez le citron jaune.\nDéposez un peu de farine dans une assiette creuse.\nCoupez les escalopes de dinde en fines lanières. Salez, poivrez et trempez-les dans la farine.\nDans une poêle, faites fondre le beurre à feu moyen à vif.\nFaites cuire la dinde 5 à 8 min. En fin de cuisson, versez le jus de citron.", "A table--Servez sans attendre votre piccata de dinde accompagnée des spaghetti et des courgettes sautées !"],
        //     time: 30,
        //     season: "",
        //   })

        this._ingredients = await this.getAllIngredients();
        this._tags = await this.getAllTags();
        this._recipes = await this.getAllRecipes();
        this._shopping = await this.getAllShopping();
    }

    public async addIngredient(ingredient: ingredientTableElement): Promise<ingredientTableElement | undefined> {
        const dbRes = await this._ingredientsTable.insertElement({
            id: ingredient.id,
            ingName: ingredient.ingName,
            unit: ingredient.unit,
            type: ingredient.type,
            season: ingredient.season.join(EncodingSeparator)
        }, this._dbConnection);
        if (dbRes === undefined || dbRes == 'Invalid insert query' || dbRes == 'Empty values') {
            console.warn("Can't add the ingredient because insertion in the database didn't worked");
            return undefined;
        }
        let dbIngredient: string;

        if (typeof dbRes === "number" && !Number.isNaN(dbRes)) {
            dbIngredient = await this._ingredientsTable.searchElementById(dbRes, this._dbConnection);
        } else {
            const searchTag = new Map<string, string>([[ingredientsColumnsNames[0].colName, ingredient.ingName], [ingredientsColumnsNames[1].colName, ingredient.unit], [ingredientsColumnsNames[2].colName, ingredient.type]])
            dbIngredient = await this._ingredientsTable.searchElement(this._dbConnection, searchTag) as string;
        }

        if (dbIngredient.length == 0) {
            console.warn("addIngredient: Searching for ingredient  ", ingredient.ingName, " didn't worked")
            return undefined;
        }
        const decodedIng = this.decodeIngredient(dbIngredient);

        // console.log("RecipeDatabase::addIngredient : after decoding ingredient decoded is ", decodedIng,". It was added from ", ingredient);

        this.add_ingredients(decodedIng);
        return decodedIng;

    }

    public async addTag(newTag: tagTableElement) {
        const dbRes = await this._tagsTable.insertElement({tagName: newTag.tagName}, this._dbConnection);
        if (dbRes === undefined || dbRes == 'Invalid insert query' || dbRes == 'Empty values') {
            console.warn("addTag: Can't add the tag because insertion in the database didn't worked")
            return
        }
        let dbTag: string;

        if (typeof dbRes === "number" && !Number.isNaN(dbRes)) {
            dbTag = await this._tagsTable.searchElementById(dbRes, this._dbConnection)
        } else {
            const searchTag = new Map<string, string>([[tagsColumnsNames[0].colName, newTag.tagName]])
            dbTag = await this._tagsTable.searchElement(this._dbConnection, searchTag) as string;
        }
        if (dbTag.length == 0) {
            console.warn("addTag: Searching for tag ", newTag.tagName, " didn't worked")
        } else {
            this.add_tags(this.decodeTag(dbTag));
        }
    }

    // TODO make a single call to SQL
    public async addMultipleIngredients(ingredients: Array<ingredientTableElement>) {
        for (const ing of ingredients) {
            await this.addIngredient(ing);
        }
    }

    // TODO make a single call to SQL
    public async addMultipleTags(tags: Array<tagTableElement>) {
        for (const tag of tags) {
            await this.addTag(tag);
        }
    }

    public async addRecipe(rec: recipeTableElement) {

        let recipe = {...rec};
        // TODO can we verify both in the same query ?
        recipe.tags = await this.verifyTagsExist(rec.tags);
        recipe.ingredients = await this.verifyIngredientsExist(rec.ingredients);

        const recipeConverted = this.encodeRecipe(recipe);

        const dbRes = await this._recipesTable.insertElement(recipeConverted, this._dbConnection);
        if (dbRes === undefined || dbRes == 'Invalid insert query' || dbRes == 'Empty values') {
            console.warn("addRecipe: Can't add the recipe because insertion in the database didn't worked")
            return
        }
        let dbRecipe: string;

        if (typeof dbRes === "number" && !Number.isNaN(dbRes)) {
            dbRecipe = await this._recipesTable.searchElementById(dbRes, this._dbConnection)
        } else {
            const searchedTitle = new Map<string, string>([[recipeColumnsNames.title, recipe.title], [recipeColumnsNames.description, rec.description], [recipeColumnsNames.image, rec.image_Source], [recipeColumnsNames.persons, recipe.persons.toString()], [recipeColumnsNames.time, recipe.time.toString()]])
            dbRecipe = await this._recipesTable.searchElement(this._dbConnection, searchedTitle) as string;
        }
        if (dbRecipe.length <= 0) {
            console.warn("addRecipe: Searching for recipe  ", recipeConverted.title, " didn't worked")
        } else {
            this.add_recipes(await this.decodeRecipe(dbRecipe));
        }
    }

    // TODO make a single call to SQL
    public async addMultipleRecipes(recs: Array<recipeTableElement>) {
        for (const recipe of recs) {
            await this.addRecipe(recipe);
        }
    }

    public async editRecipe(rec: recipeTableElement) {
        // TODO implement edit recipe
    }

    public async addRecipeToShopping(recipe: recipeTableElement) {
        let shopElement = new Array<shoppingListTableElement>();

        for (const ing of recipe.ingredients) {
            shopElement.push({
                type: ing.type as TListFilter,
                name: ing.ingName,
                quantity: (ing.quantity ? ing.quantity : 0),
                unit: ing.unit,
                recipesTitle: Array<string>(recipe.title),
                purchased: false
            })
        }

        // TODO make this a single query
        for (const shopToAdd of shopElement) {
            const foundShopping = this.find_shopping(shopToAdd);
            if (foundShopping === undefined) {
                await this.addShoppingList(shopToAdd);
            } else {
                await this.updateIngredientInShoppingList(shopToAdd, foundShopping);
            }
        }
    }

    public async updateIngredientInShoppingList(shopToAdd: shoppingListTableElement, previousShop: shoppingListTableElement) {

        if (previousShop.id === undefined) {
            console.error("CAN'T UPDATE A SHOPPING ELEMENT WITHOUT AN ID");
            return false;
        }

        previousShop.quantity = (shopToAdd.quantity + previousShop.quantity);
        previousShop.recipesTitle = [...previousShop.recipesTitle, ...shopToAdd.recipesTitle];

        if (await this._shoppingListTable.editElement(previousShop.id, new Map<string, number | string>([[shoppingListColumnsNames.quantity, previousShop.quantity], [shoppingListColumnsNames.recipeTitles, previousShop.recipesTitle.join(EncodingSeparator)]]), this._dbConnection)) {
            this.update_shopping(previousShop);
            return true;
        }
        return false;
    }

    public async purchaseIngredientOfShoppingList(ingredientId: number, newPurchasedValue: boolean) {

        if (await this._shoppingListTable.editElement(ingredientId, new Map<string, number | string>([[shoppingListColumnsNames.purchased, newPurchasedValue.toString()]]), this._dbConnection)) {
            this.setPurchasedOfShopping(ingredientId, newPurchasedValue);
            return true;
        }
        return false;
    }

    public async addMultipleShopping(recipes: Array<recipeTableElement>) {
        for (const recEl of recipes) {
            //TODO single query
            await this.addRecipeToShopping(recEl)
        }
    }

    public searchRandomlyRecipes(numOfElements: number): Array<recipeTableElement> {
        if (this._recipes.length == 0) {
            console.error("RECIPE TABLE IS EMPTY, IMPOSSIBLE TO EXTRACT A NUMBER FROM IT");
            return new Array<recipeTableElement>();
        } else {
            return fisherYatesShuffle(this._recipes, numOfElements);
        }
    }

    public searchRandomlyTags(numOfElements: number): Array<tagTableElement> {
        if (this._tags.length == 0) {
            console.error("NO TAGS PROVIDED, IMPOSSIBLE TO EXTRACT A NUMBER FROM IT");
            return new Array<tagTableElement>();
        } else {
            if (this._tags.length <= numOfElements) {
                console.log("Return directly the table because we want the same size");
                return this._tags;
            } else {
                // TODO can find a better random function
                // TODO this can be abstract in a function so that it is also used for other searchRandom
                let res = new Array<tagTableElement>();
                while (res.length < numOfElements) {
                    let skipElem = false;
                    const randomId = Math.floor(Math.random() * this._recipes.length);

                    for (let i = 0; i < res.length && !skipElem; i++) {
                        if (isTagEqual(res[i], this._tags[randomId])) {
                            skipElem = true;
                        }
                    }
                    if (!skipElem) {
                        res.push(this._tags[randomId]);
                    }
                }
                return res;
            }
        }
    }

    public get_recipes(): Array<recipeTableElement> {
        return this._recipes;
    }

    public get_ingredients() {
        return this._ingredients;
    }

    public get_tags(): Array<tagTableElement> {
        return this._tags;
    }

    public get_shopping(): Array<shoppingListTableElement> {
        return this._shopping;
    }

    public add_recipes(recipe: recipeTableElement) {
        this._recipes.push(recipe);
    }

    public add_ingredients(ingredient: ingredientTableElement) {
        this._ingredients.push(ingredient);
    }

    public add_tags(tag: tagTableElement) {
        this._tags.push(tag);
    }

    public add_shopping(shop: shoppingListTableElement) {
        this._shopping.push(shop);
    }

    public remove_recipe(recipe: recipeTableElement) {
        const foundRecipe = this.find_recipe(recipe);
        if (foundRecipe !== undefined) {
            this._recipes.splice(this._recipes.indexOf(foundRecipe), 1);
        } else {
            console.warn("remove_recipe: can't find recipe");
        }
    }

    public remove_ingredient(ingredient: ingredientTableElement) {
        const foundIngredient = this.find_ingredient(ingredient);
        if (foundIngredient !== undefined) {
            this._ingredients.splice(this._ingredients.indexOf(foundIngredient), 1);
        } else {
            console.warn("remove_ingredient: can't find ingredient");
        }
    }

    public remove_tag(tag: tagTableElement) {
        const foundTag = this.find_tag(tag);
        if (foundTag !== undefined) {
            this._tags.splice(this._tags.indexOf(foundTag), 1);
        } else {
            console.warn("remove_tag: can't find tag");
        }
    }

    public remove_shopping(shop: shoppingListTableElement) {
        const foundShopping = this.find_shopping(shop);
        if (foundShopping !== undefined) {
            this._shopping.splice(this._shopping.indexOf(foundShopping), 1);
        } else {
            console.warn("remove_shopping: can't find tag");
        }
    }

    public update_recipes(oldRecipe: recipeTableElement, newRecipe: recipeTableElement) {
        const foundRecipe = this._recipes.findIndex(element => isRecipeEqual(element, oldRecipe));
        if (foundRecipe !== -1) {
            this._recipes[foundRecipe] = newRecipe;
        }
    }

    public update_ingredients(oldIngredient: ingredientTableElement, newIngredient: ingredientTableElement) {
        const foundIngredient = this._ingredients.findIndex(element => isIngredientEqual(element, oldIngredient));
        if (foundIngredient !== -1) {
            this._ingredients[foundIngredient] = newIngredient;
        }
    }

    public update_tags(oldTag: tagTableElement, newTag: tagTableElement) {
        const foundTag = this._tags.findIndex(element => isTagEqual(element, oldTag));
        if (foundTag !== -1) {
            this._tags[foundTag] = newTag;
        }
    }

    public find_recipe(recipeToFind: recipeTableElement): recipeTableElement | undefined {
        let findFunc: (element: recipeTableElement) => boolean;
        if (recipeToFind.id !== undefined) {
            findFunc = (element: recipeTableElement) => element.id === recipeToFind.id;
        } else {
            findFunc = (element: recipeTableElement) => isRecipeEqual(element, recipeToFind);
        }
        return this._recipes.find(element => findFunc(element));
    }

    public find_ingredient(ingToFind: ingredientTableElement): ingredientTableElement | undefined {
        let findFunc: (element: ingredientTableElement) => boolean;
        if (ingToFind.id !== undefined) {
            findFunc = (element: ingredientTableElement) => element.id === ingToFind.id;
        } else {
            findFunc = (element: ingredientTableElement) => isIngredientEqual(element, ingToFind);
        }
        return this._ingredients.find(element => findFunc(element));
    }

    public find_tag(tagToSearch: tagTableElement): tagTableElement | undefined {
        let findFunc: (element: tagTableElement) => boolean;
        if (tagToSearch.id !== undefined) {
            findFunc = (element: tagTableElement) => element.id === tagToSearch.id;
        } else {
            findFunc = (element: tagTableElement) => isTagEqual(element, tagToSearch);
        }
        return this._tags.find(element => findFunc(element));
    }

    public find_shopping(toSearch: shoppingListTableElement): shoppingListTableElement | undefined {
        let findFunc: (element: shoppingListTableElement) => boolean;
        if (toSearch.id !== undefined) {
            findFunc = (element: shoppingListTableElement) => element.id === toSearch.id;
        } else {
            findFunc = (element: shoppingListTableElement) => isShoppingEqual(element, toSearch);
        }
        return this._shopping.find(element => findFunc(element));
    }


    // TODO nutrition

    // TODO to test
    public setPurchasedOfShopping(ingredientId: number, newPurchasedValue: boolean) {
        if (ingredientId > 0 && ingredientId <= this._shopping.length) {
            this._shopping[ingredientId - 1].purchased = newPurchasedValue;
            return;
        } else {
            console.error("setPurchasedOfShopping:: Element of shopping with id ", ingredientId, " is out of bound");
        }
    }

    // TODO to test
    public update_shopping(shop: shoppingListTableElement) {
        if (shop.id !== undefined) {
            this._shopping[shop.id - 1] = shop;
            return;
        }
        const foundShopping = this._shopping.findIndex(element => element.name == shop.name);
        if (foundShopping !== -1) {
            this._shopping[foundShopping] = shop;
            return;
        }
        console.error("update_shopping Element of shopping named ", shop.name, " doesn't exist already");
    }


    public async resetShoppingList() {

        this._shopping.length = 0;
        await this._shoppingListTable.deleteTable(this._dbConnection);
        await this._shoppingListTable.createTable(this._dbConnection);
    }

    /* PROTECTED METHODS */
    protected openDatabase() {
        try {
            this._dbConnection = SQLite.openDatabase(this._databaseName);
        } catch (error) {
            console.warn("ERROR during openDatabase : ", error);
        }
    };

    protected async deleteDatabase() {
        try {
            await this._dbConnection.deleteAsync();
            await this.reset();
        } catch (error: any) {
            console.warn('deleteDatabase : received error ', error);
        }
    }

    protected async verifyTagsExist(tags: Array<tagTableElement>): Promise<Array<tagTableElement>> {
        // TODO is it really useful to return a new Array ?
        // isn't it better to simply return eventually the array to push ?
        let result = new Array<tagTableElement>();
        for (const tag of tags) {
            const elemFound = this.find_tag(tag)
            if (elemFound) {
                result.push(elemFound)
            } else {
                // TODO
                // result.push(await AsyncAlert(`TAG "${tags[i].tagName.toUpperCase()}" NOT FOUND.`, "Do you want to add it ?", 'OK', 'Cancel', 'Edit before add', tags[i].tagName));
                console.error("TODO")
            }
        }
        return result;
    }

    protected async verifyIngredientsExist(ingredients: Array<ingredientTableElement>): Promise<Array<ingredientTableElement>> {

        // TODO is it really useful to return a new Array ?
        // isn't it better to simply return eventually the array to push ?
        let result = new Array<ingredientTableElement>();
        let newIngredients = new Array<ingredientTableElement>();

        for (const ing of ingredients) {
            const elemFound = this.find_ingredient(ing);
            if (elemFound !== undefined) {
                elemFound.quantity = ing.quantity;
                result.push(elemFound)
            } else {
                // TODO Check for similar names ?
                newIngredients.push(ing);
            }
        }

        if (newIngredients.length > 0) {
            let alertTitle: string;
            let alertMessage = "Do you want to add or edit it before  ?";
            const alertOk = "OK";
            const alertCancel = "Cancel";
            const alertEdit = "Edit before add";
            if (newIngredients.length > 1) {
                // Plural
                alertTitle = "INGREDIENTS NOT FOUND";
                alertMessage = `Following ingredients were not found in database :  \n`;
                newIngredients.forEach(ing => {
                    alertMessage += "\t- " + ing.ingName + "\n";
                });
                alertMessage += `Do you want to add these as is or edit them before adding ?`;

            } else {
                alertTitle = `INGREDIENT NOT FOUND`;
                alertMessage = `Do you want to add this as is or edit it before adding ?`;
            }


            switch (await AsyncAlert(alertTitle, alertMessage, alertOk, alertCancel, alertEdit)) {
                case alertUserChoice.neutral:
                    // TODO edit before add
                    break;
                case alertUserChoice.ok:
                    await this.addMultipleIngredients(newIngredients);
                    result = result.concat(newIngredients);
                    break;
                case alertUserChoice.cancel:
                default:
                    console.log("User canceled adding ingredient");
                    break;
            }
        }
        return result;

    }

    protected encodeRecipe(recToEncode: recipeTableElement): encodedRecipeElement {

        const encodedTag: Array<string> = recToEncode.tags.map(tag => this.encodeTag(tag));
        const encodedIngredients: Array<string> = recToEncode.ingredients.map(ing => this.encodeIngredient(ing));


        let recipeConverted: encodedRecipeElement = {
            image: recToEncode.image_Source,
            title: recToEncode.title,
            description: recToEncode.description,
            tags: encodedTag.join(EncodingSeparator),
            persons: recToEncode.persons,
            ingredients: encodedIngredients.join(EncodingSeparator),
            preparation: recToEncode.preparation.join(EncodingSeparator),
            time: recToEncode.time,
        };
        if (recToEncode.id) {
            recipeConverted.id = recToEncode.id;
        }
        return recipeConverted;
    }

    protected async decodeRecipe(queryResult: string): Promise<recipeTableElement> {
        let result: recipeTableElement = {
            id: 0,
            image_Source: "",
            title: "",
            description: "",
            tags: [],
            persons: 0,
            ingredients: [],
            season: [],
            preparation: [],
            time: 0
        };

        if (queryResult.length > 0) {
            // ID is not separate in the same way than the others
            const idStr = queryResult.split(`,\"IMAGE_SOURCE`)[0];

            // Remove ID part from queryResult and split in 2 part to have the column and the value
            const arrStr = queryResult.replace(idStr + ',', "").split(`,"`);


            result.id = +idStr.replace(regExp, "").split(`:`)[1];

            for (const strSplit of arrStr) {
                const elem = strSplit.split(`":`); // { "Column name" , "Value"}
                // console.log("elem : ", elem);
                // IMAGE_SOURCE
                if (elem[0].includes(recipeColumnsNames.image)) {
                    result.image_Source = FileGestion.getInstance().get_directoryUri() + elem[1].replace(regExp, "");
                }
                // TITLE
                else if (elem[0].includes(recipeColumnsNames.title)) {
                    result.title = elem[1].replace(regExp, "");
                }
                // DESCRIPTION
                else if (elem[0].includes(recipeColumnsNames.description)) {
                    result.description = elem[1].replace(regExp, "");
                }
                // TAGS
                else if (elem[0].includes(recipeColumnsNames.tags)) {
                    const tags = elem[1].replace(regExp, "");
                    if (tags.length > 0) {
                        (await this.decodeTagFromRecipe(tags)).forEach(tag => {
                            result.tags.push(tag)
                        });
                    }
                }
                // PERSONS
                else if (elem[0].includes(recipeColumnsNames.persons)) {
                    result.persons = parseInt(elem[1].replace(regExp, ""));
                }
                // INGREDIENTS
                else if (elem[0].includes(recipeColumnsNames.ingredients)) {
                    const decodeRes = await this.decodeIngredientFromRecipe(elem[1].replace(regExp, ""));
                    if (decodeRes !== undefined) {
                        const [decodedIngredients, decodedSeason] = decodeRes;
                        result.season = decodedSeason;
                        result.ingredients = decodedIngredients;
                    }
                }
                // PREPARATION
                else if (elem[0].includes(recipeColumnsNames.preparation)) {
                    result.preparation = elem[1].replace(regExp, "").split(EncodingSeparator);
                }
                // TIME
                else if (elem[0].includes(recipeColumnsNames.time)) {
                    result.time = parseInt(elem[1].replace(regExp, ""));
                } else {
                    console.warn(`NO SUCH COLUMNS FOUND FOR ELEMENT : ${elem}`)
                }
            }
        }

        // console.log("Returning from decoding : ", result);
        return result;
    }

    protected async decodeArrayOfRecipe(queryResult: Array<string>): Promise<Array<recipeTableElement>> {
        const returnRecipes = new Array<recipeTableElement>();
        if (queryResult.length > 0) {
            for (const recipeEncoded of queryResult) {
                returnRecipes.push(await this.decodeRecipe(recipeEncoded))
            }
        }
        return returnRecipes;
    }

    protected encodeIngredient(ingredientToEncode: ingredientTableElement): string {
        // To encode : ID--quantity
        const quantity = (ingredientToEncode.quantity ? ingredientToEncode.quantity.toString() : "")
        let idForEncoding: number;
        if (ingredientToEncode.id === undefined) {
            const foundIngredient = this.find_ingredient(ingredientToEncode);
            if (foundIngredient == undefined || foundIngredient.id == undefined) {
                console.warn('ERROR : ingredient not found');
                return "";
            } else {
                idForEncoding = foundIngredient.id;
            }
        } else {
            idForEncoding = ingredientToEncode.id;
        }
        return idForEncoding + textSeparator + quantity;
    }

    protected async decodeIngredientFromRecipe(encodedIngredient: string): Promise<[Array<ingredientTableElement>, Array<string>] | undefined> {
        const arrDecoded = new Array<ingredientTableElement>();
        let recipeSeason = new Array<string>('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');
        let firstSeasonFound = true;

        // Ex : 1--250__2--100__3--0.5__4--200__5--1__6--250
        let ingSplit: Array<string>;
        if (encodedIngredient.includes(EncodingSeparator)) {
            ingSplit = encodedIngredient.split(EncodingSeparator)
        } else {
            ingSplit = new Array<string>(encodedIngredient)
        }

        for (const ingredient of ingSplit) {
            const id: number = Number(ingredient.split(textSeparator)[0]);
            const ingQuantity = Number(ingredient.split(textSeparator)[1]);

            const tableIngredient = await this._ingredientsTable.searchElementById(id, this._dbConnection);
            if (tableIngredient.length == 0) {
                console.warn("decodeIngredientFromRecipe: Searching for ingredient at id ", id, " didn't worked")
                return undefined;
            }

            let decodedIngredient = this.decodeIngredient(tableIngredient);
            decodedIngredient.quantity = ingQuantity;
            arrDecoded.push(decodedIngredient);


            // In case of *, nothing to do
            if (!decodedIngredient.season.includes("*")) {
                // For the first element, store directly the value
                if (firstSeasonFound) {
                    recipeSeason = decodedIngredient.season;
                    firstSeasonFound = false;
                } else {
                    recipeSeason = this.decodeSeason(recipeSeason, decodedIngredient.season);
                }
            }
        }
        return [arrDecoded, recipeSeason];
    }

    protected decodeIngredient(dbIngredient: string): ingredientTableElement {

        // Retrieve directly the name
        // Ex :  {"ID":1,"INGREDIENT":"INGREDIENT NAME","UNIT":"g", "TYPE":"BASE", "SEASON":"*"}
        const splitIngredient = dbIngredient.split(',');

        const ingId = Number(splitIngredient[0].split(':')[1]);
        const ingName = splitIngredient[1].split(':')[1].replace(regExp, "");
        const ingUnit = splitIngredient[2].split(':')[1].replace(regExp, "");
        let ingType: ingredientType;
        const ingSeason = splitIngredient[4].split(':')[1].replace(regExp, "").split(EncodingSeparator);

        switch (splitIngredient[3].split(':')[1].replace(regExp, "").toLowerCase()) {
            case ingredientType.legumes.toLowerCase():
                ingType = ingredientType.legumes;
                break;
            case ingredientType.grainOrCereal.toLowerCase():
                ingType = ingredientType.grainOrCereal;
                break;
            case ingredientType.vegetable.toLowerCase():
                ingType = ingredientType.vegetable;
                break;
            case ingredientType.plantProtein.toLowerCase():
                ingType = ingredientType.plantProtein;
                break;
            case ingredientType.condiment.toLowerCase():
                ingType = ingredientType.condiment;
                break;
            case ingredientType.sauce.toLowerCase():
                ingType = ingredientType.sauce;
                break;
            case ingredientType.meat.toLowerCase():
                ingType = ingredientType.meat;
                break;
            case ingredientType.poultry.toLowerCase():
                ingType = ingredientType.poultry;
                break;
            case ingredientType.fish.toLowerCase():
                ingType = ingredientType.fish;
                break;
            case ingredientType.seafood.toLowerCase():
                ingType = ingredientType.seafood;
                break;
            case ingredientType.dairy.toLowerCase():
                ingType = ingredientType.dairy;
                break;
            case ingredientType.cheese.toLowerCase():
                ingType = ingredientType.cheese;
                break;
            case ingredientType.sugar.toLowerCase():
                ingType = ingredientType.sugar;
                break;
            case ingredientType.spice.toLowerCase():
                ingType = ingredientType.spice;
                break;
            case ingredientType.fruit.toLowerCase():
                ingType = ingredientType.fruit;
                break;
            case ingredientType.oilAndFat.toLowerCase():
                ingType = ingredientType.oilAndFat;
                break;
            case ingredientType.nutsAndSeeds.toLowerCase():
                ingType = ingredientType.nutsAndSeeds;
                break;
            case ingredientType.sweetener.toLowerCase():
                ingType = ingredientType.sweetener;
                break;
            default:
                ingType = ingredientType.undefined;
                break;
        }

        return {
            id: ingId,
            ingName: ingName,
            unit: ingUnit,
            type: ingType,
            season: ingSeason
        };
    }

    protected decodeArrayOfIngredients(queryResult: Array<string>): Array<ingredientTableElement> {
        if (!queryResult || !Array.isArray(queryResult) || queryResult.length == 0) {
            return new Array<ingredientTableElement>
        }
        return queryResult.map(ingredient => this.decodeIngredient(ingredient));
    }

    protected decodeSeason(previousSeason: Array<string>, ingredientSeason: Array<string>): Array<string> {
        return previousSeason.filter(month => ingredientSeason.includes(month));
    }

    protected encodeTag(tag: tagTableElement): string {
        if (tag.id === undefined) {
            const foundedTag = this.find_tag(tag);
            if (foundedTag && foundedTag.id) {
                return foundedTag.id.toString();
            } else {
                return "ERROR : tag not found";
            }
        } else {
            return tag.id.toString();
        }
    }

    protected async decodeTagFromRecipe(encodedTag: string): Promise<Array<tagTableElement>> {
        let arrDecoded = new Array<tagTableElement>();

        // Ex : "1__2__5__3__4"
        let tagSplit: Array<string>
        if (encodedTag.includes(EncodingSeparator)) {
            tagSplit = encodedTag.split(EncodingSeparator);
        } else {
            tagSplit = new Array<string>(encodedTag);
        }

        for (const tag of tagSplit) {
            const tableTag = await this._tagsTable.searchElementById(+tag, this._dbConnection);
            if (tableTag.length > 0) {
                arrDecoded.push(this.decodeTag(tableTag));
            } else {
                console.warn("decodeTagFromRecipe: Searching for tag ", +tag, " didn't worked")
            }
        }

        return arrDecoded;
    }

    protected decodeTag(dbTag: string): tagTableElement {

        // Retrieve directly the name
        // Ex : {"ID":4,"NAME":"TAG NAME"}
        const splitTag = dbTag.split(',');

        const id = Number(splitTag[0].split(':')[1].replace(regExp, ""));
        const name = splitTag[1].split(':')[1].replace(regExp, "");

        return {id: id, tagName: name};
    }

    protected decodeArrayOfTags(queryResult: Array<string>): Array<tagTableElement> {
        if (!queryResult || !Array.isArray(queryResult) || queryResult.length == 0) {
            return new Array<tagTableElement>();
        }
        return queryResult.map(tagFound => this.decodeTag(tagFound));
    }

    protected encodeShopping(shopToEncode: shoppingListTableElement): encodedShoppingListElement {
        return {
            type: shopToEncode.type as string,
            name: shopToEncode.name,
            quantity: shopToEncode.quantity,
            unit: shopToEncode.unit,
            recipes: shopToEncode.recipesTitle.join(EncodingSeparator),
            purchased: shopToEncode.purchased,
        }
    }

    protected decodeShopping(queryResult: string): shoppingListTableElement {

        let result: shoppingListTableElement = {
            type: listFilter.purchased,
            name: "",
            purchased: true,
            quantity: 0,
            recipesTitle: [],
            unit: ""
        };
        if (queryResult.length > 0) {
            // ID is not separate in the same way as the others
            const idStr = queryResult.split(`,\"TYPE`)[0];

            // Remove ID part from queryResult and split in 2 part to have the column and the value
            const arrStr = queryResult.replace(idStr + ',', "").split(`,"`);

            result.id = +idStr.replace(regExp, "").split(`:`)[1];

            for (const strSplit of arrStr) {
                const elem = strSplit.split(`":`); // { "Column name" , "Value"}
                // TYPE
                if (elem[0].includes(shoppingListColumnsNames.type)) {

                    result.type = elem[1].replace(regExp, "") as TListFilter;
                }
                // INGREDIENTS
                else if (elem[0].includes(shoppingListColumnsNames.ingredient)) {
                    result.name = elem[1].replace(regExp, "");
                }
                // QUANTITY
                else if (elem[0].includes(shoppingListColumnsNames.quantity)) {
                    result.quantity = Number(elem[1].replace(regExp, ""));
                }
                // UNIT
                else if (elem[0].includes(shoppingListColumnsNames.unit)) {
                    result.unit = elem[1].replace(regExp, "");
                }
                // RECIPES TITLES
                else if (elem[0].includes(shoppingListColumnsNames.recipeTitles)) {
                    result.recipesTitle = elem[1].replace(regExp, "").split(EncodingSeparator);
                }
                // PURCHASED
                else if (elem[0].includes(shoppingListColumnsNames.purchased)) {
                    result.purchased = elem[1].replace(regExp, "").toLowerCase() === 'true';
                } else {
                    console.warn(`NO SUCH COLUMNS FOUND FOR ELEMENT : ${elem}`);
                }
            }
        }
        return result;
    }

    protected decodeArrayOfShopping(queryResult: Array<string>): Array<shoppingListTableElement> {
        if (!queryResult || !Array.isArray(queryResult) || queryResult.length == 0) {
            return new Array<shoppingListTableElement>()
        }
        return queryResult.map(shoppingElement => this.decodeShopping(shoppingElement));
    }

    protected async getAllRecipes(): Promise<Array<recipeTableElement>> {
        return await this.decodeArrayOfRecipe(await this._recipesTable.searchElement(this._dbConnection) as Array<string>)
    }

    protected async getAllTags(): Promise<Array<tagTableElement>> {
        return this.decodeArrayOfTags(await this._tagsTable.searchElement(this._dbConnection) as Array<string>)
    }

    protected async getAllIngredients(): Promise<Array<ingredientTableElement>> {
        return this.decodeArrayOfIngredients(await this._ingredientsTable.searchElement(this._dbConnection) as Array<string>)
    }

    protected async getAllShopping(): Promise<Array<shoppingListTableElement>> {
        return this.decodeArrayOfShopping(await this._shoppingListTable.searchElement(this._dbConnection) as Array<string>)
    }

    protected async addShoppingList(shop: shoppingListTableElement) {

        const dbRes = await this._shoppingListTable.insertElement(this.encodeShopping(shop), this._dbConnection);
        if (dbRes === undefined || dbRes == 'Invalid insert query' || dbRes == 'Empty values') {
            console.warn("addShoppingList: Can't add the shopping because insertion in the database didn't worked")
            return;
        }
        let dbShopping: string;

        if (typeof dbRes === "number" && !Number.isNaN(dbRes)) {
            dbShopping = await this._shoppingListTable.searchElementById(dbRes, this._dbConnection)
        } else {
            const searchedShopping = new Map<string, string>([[shoppingListColumnsNames.type, shop.type], [shoppingListColumnsNames.ingredient, shop.name], [shoppingListColumnsNames.quantity, shop.quantity.toString()], [shoppingListColumnsNames.unit, shop.unit]]);
            dbShopping = await this._shoppingListTable.searchElement(this._dbConnection, searchedShopping) as string;
        }
        if (dbShopping.length <= 0) {
            console.warn("addRecipe: Searching for recipe  ", shop.recipesTitle, " didn't worked")
        } else {
            this.add_shopping(this.decodeShopping(dbShopping));
        }
    }

}

/**
 * Shuffles the data array using the Fisher-Yates algorithm.
 * @param arrayToShuffle
 * @param numberOfElementsWanted
 */
// TODO to be placed at a better place ?
export function fisherYatesShuffle<T>(arrayToShuffle: Array<T>, numberOfElementsWanted?: number): Array<T> {
    const shuffled = [...arrayToShuffle]; // Create a copy to avoid mutating the original array
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Pick a random index
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    if (numberOfElementsWanted === undefined || numberOfElementsWanted === 0 || numberOfElementsWanted >= arrayToShuffle.length) {
        return shuffled
    } else {
        return shuffled.slice(0, numberOfElementsWanted);
    }
}
