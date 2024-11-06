


// import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import * as SQLite from 'expo-sqlite';
import { recipeColumnsNames, recipeTableName, recipeDatabaseName, recipeTableElement, encodedRecipeElement, tagTableName, ingredientsTableName, ingredientsColumnsNames, tagsColumnsNames, nutritionColumnsNames, nutritionTableName, ingredientTableElement, tagTableElement, regExp, recipeColumnsEncoding, ingredientType, shoppingListTableElement, shoppingListColumnsEncoding, shoppingListTableName, shoppingListColumnsNames, encodedShoppingListElement, isRecipeEqual, isIngredientEqual, isTagEqual } from '@customTypes/DatabaseElementTypes';
import TableManipulation from './TableManipulation';
import { EncodingSeparator, textSeparator, unitySeparator } from '@styles/typography';
import { AsyncAlert, alertUserChoice } from './AsyncAlert';
import { TListFilter, listFilter } from '@customTypes/RecipeFiltersTypes';
import { fileGestion } from './FileGestion';


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
        tags: [{ tagName: "Kids friendly" }, { tagName: "Test d'un tag débordant" }, { tagName: "Gourmand" }, { tagName: "Express" }, { tagName: "Tradition" }],
        ingredients: [{ ingName: "Champignons de Paris blanc", unit: "g", quantity: 100, type: ingredientType.vegetable, season: "*" }, { ingName: "Crème liquide", unit: "mL", quantity: 100, type: ingredientType.dairy, season: "*" }, { ingName: "Gousse d'ail", unit: "", quantity: 0.5, type: ingredientType.condiment, season: "*" }, { ingName: "Macaroni demi-complets", unit: "g", quantity: 200, type: ingredientType.cerealProduct, season: "*" }, { ingName: "Oignon jaune", unit: "", quantity: 1, type: ingredientType.condiment, season: "*" }, { ingName: "Saucisse couteau nature", unit: "g", quantity: 250, type: ingredientType.meet, season: "*" }],
        preparation: ["Les saucisses--Dans une seconde sauteuse, faites chauffer un filet d'huile d'olive à feu moyen à vif.\nFaites revenir les saucisses 12 min environ. Salez, poivrez.\nPendant ce temps, faites cuire les macaroni.", "Les macaroni--Portez à ébullition une casserole d'eau salée.\nFaites cuire les macaroni selon les indications du paquet.", "Etape finale--Servez sans attendre votre saucisse au couteau nappée de crème aux champignons et accompagnée des macaroni"],
        time: 25,
        season: "",
        persons: 2,
    },
    {
        image_Source: 'tree.jpg',
        title: "Korma de légumes au lait de coco",
        description: "Ce mijoté indien vous est proposé en version 100% végétale avec du riz bio et des légumes cuits délicatement dans une purée de noisettes au curcuma.",
        tags: [{ tagName: "Végétarien" }, { tagName: "Indien" }],
        ingredients: [{ ingName: "Carotte", unit: "", quantity: 1, type: ingredientType.vegetable, season: "*" }, { ingName: "Concentré de tomates", unit: "g", quantity: 35, type: ingredientType.sauce, season: "*" }, { ingName: "Coriandre", unit: "qq brins", type: ingredientType.spice, season: "*" }, { ingName: "Courgette", unit: "", quantity: 1, type: ingredientType.vegetable, season: "5--6--7--8--9--10" }, { ingName: "Curcuma", unit: "sachet", quantity: 0.25, type: ingredientType.spice, season: "*" }, { ingName: "Lait de coco", unit: "mL", quantity: 150, type: ingredientType.dairy, season: "*" }, { ingName: "Oignon jaune", unit: "", quantity: 1, type: ingredientType.condiment, season: "*" }, { ingName: "Purée de noisettes", unit: "g", quantity: 40, type: ingredientType.sauce, season: "*" }, { ingName: "Riz basmati", unit: "g", quantity: 150, type: ingredientType.cerealProduct, season: "*" }],
        preparation: ["Les légumes--Émincez l'oignon.\nÉpluchez la carotte.\nCoupez la courgette et la carotte en dés.\nPelez et hachez finement l'ail et le gingembre.\nDans une sauteuse, faites chauffer un filet d'huile de cuisson à feu moyen à vif.\nFaites revenir l'oignon et la carotte 5 min.\nAu bout des 5 min de cuisson, ajoutez la courgette, le curcuma, l'ail et le gingembre et poursuivez la cuisson 10 min. Salez, poivrez.\nEn parallèle, faites cuire le riz.", "Le riz--Portez à ébullition une casserole d'eau salée.\nFaites cuire le riz selon les indications du paquet.", "Le korma--Une fois les légumes cuits, ajoutez dans la sauteuse le concentré de tomates, la purée de noisettes et le lait de coco.\nCouvrez et laissez mijoter 5 min.\nGoûtez et rectifiez l'assaisonnement si nécessaire.\nCiselez la coriandre (en entier, les tiges se consomment).", "A table--Servez votre korma de légumes au lait de coco bien chaud accompagné du riz et parsemé de coriandre !"],
        time: 30,
        season: "",
        persons: 2,
    },
    {
        image_Source: 'strawberries.jpg',
        title: "Piccata de dinde au citron et courgettes sautées à l'ail",
        description: "Nos délicieuses escalopes de dinde françaises se parent de farine, s'enrobent de beurre et se déglacent au jus de citron. Tout un programme !",
        tags: [{ tagName: "Kids friendly" }, { tagName: "Italien" }],
        ingredients: [{ ingName: "Citron jaune", unit: "", quantity: 0.5, type: ingredientType.condiment, season: "*" }, { ingName: "Courgette", unit: "", quantity: 2, type: ingredientType.vegetable, season: "5--6--7--8--9--10" }, { ingName: "Escalope de dinde", unit: "", quantity: 2, type: ingredientType.poultry, season: "*" }, { ingName: "Gousse d'ail", unit: "", quantity: 0.5, type: ingredientType.condiment, season: "*" }, { ingName: "Origan", unit: "sachet", quantity: 0.25, type: ingredientType.spice, season: "*" }, { ingName: "Spaghetti blancs", unit: "g", quantity: 200, type: ingredientType.cerealProduct, season: "*" }, { ingName: "Riz basmati", unit: "g", quantity: 150, type: ingredientType.cerealProduct, season: "*" }],
        preparation: ["Les légumes--Emincez l'oignon.\nCoupez les courgettes en rondelles.\nPressez ou hachez l'ail.\nDans une sauteuse, faites chauffer un filet d'huile d'olive à feu moyen à vif.\nFaites revenir l'oignon 5 min.\nAu bout des 5 min de cuisson, ajoutez l'ail, l'origan et les courgettes et poursuivez la cuisson 10 min. Salez, poivrez.\nEn parallèle, faites cuire les spaghetti.", "Les spaghetti--Portez à ébullition une casserole d'eau salée.\nFaites cuire les spaghetti selon les indications du paquet.\nPendant la cuisson des spaghetti, réalisez la piccata de dinde.", "La piccata de dinde--Pressez le citron jaune.\nDéposez un peu de farine dans une assiette creuse.\nCoupez les escalopes de dinde en fines lanières. Salez, poivrez et trempez-les dans la farine.\nDans une poêle, faites fondre le beurre à feu moyen à vif.\nFaites cuire la dinde 5 à 8 min. En fin de cuisson, versez le jus de citron.", "A table--Servez sans attendre votre piccata de dinde accompagnée des spaghetti et des courgettes sautées !"],
        time: 30,
        season: "",
        persons: 2,
    },
    {
        image_Source: 'scooter.jpg',
        title: "Tofu fumé et sauce tomate aux épices chimichurri",
        description: "Les épices chimichurri ? Un mélange originaire d’Argentine à base d’origan, de piment doux et de thym qui relèveront à merveille notre tofu fumé !",
        tags: [{ tagName: "Découverte" }, { tagName: "Végétarien" }],
        ingredients: [{ ingName: "Champignons de Paris blanc", unit: "g", quantity: 250, type: ingredientType.vegetable, season: "*" }, { ingName: "Coquillettes demi-complètes", unit: "g", quantity: 200, type: ingredientType.cerealProduct, season: "*" }, { ingName: "Gousse d'ail", unit: "", quantity: 0.5, type: ingredientType.condiment, season: "*" }, { ingName: "Mélange d'épices chimichurri", unit: "sachet", quantity: 0.25, type: ingredientType.spice, season: "*" }, { ingName: "Oignon jaune", unit: "", quantity: 1, type: ingredientType.condiment, season: "*" }, { ingName: "Origan", unit: "sachet", quantity: 0.25, type: ingredientType.spice, season: "*" }, { ingName: "Purée de tomates", unit: "g", quantity: 250, type: ingredientType.sauce, season: "*" }, { ingName: "Tofu fumé", unit: "g", quantity: 200, type: ingredientType.tofu, season: "*" }],
        preparation: ["Les légumes--Emincez l'oignon.\nCoupez les courgettes en rondelles.\nPressez ou hachez l'ail.\nDans une sauteuse, faites chauffer un filet d'huile d'olive à feu moyen à vif.\nFaites revenir l'oignon 5 min.\nAu bout des 5 min de cuisson, ajoutez l'ail, l'origan et les courgettes et poursuivez la cuisson 10 min. Salez, poivrez.\nEn parallèle, faites cuire les spaghetti.", "Les spaghetti--Portez à ébullition une casserole d'eau salée.\nFaites cuire les spaghetti selon les indications du paquet.\nPendant la cuisson des spaghetti, réalisez la piccata de dinde.", "La piccata de dinde--Pressez le citron jaune.\nDéposez un peu de farine dans une assiette creuse.\nCoupez les escalopes de dinde en fines lanières. Salez, poivrez et trempez-les dans la farine.\nDans une poêle, faites fondre le beurre à feu moyen à vif.\nFaites cuire la dinde 5 à 8 min. En fin de cuisson, versez le jus de citron.", "A table--Servez sans attendre votre piccata de dinde accompagnée des spaghetti et des courgettes sautées !"],
        time: 30,
        season: "",
        persons: 2,
    }
]

const ingTable: Array<ingredientTableElement> = [
    { ingName: "Champignons de Paris blanc", unit: "g", type: ingredientType.vegetable, season: "*" }, { ingName: "Crème liquide", unit: "mL", type: ingredientType.dairy, season: "*" }, { ingName: "Gousse d'ail", unit: "", type: ingredientType.condiment, season: "*" }, { ingName: "Macaroni demi-complets", unit: "g", type: ingredientType.cerealProduct, season: "*" }, { ingName: "Oignon jaune", unit: "", type: ingredientType.condiment, season: "*" }, { ingName: "Saucisse couteau nature", unit: "g", type: ingredientType.meet, season: "*" }, { ingName: "Carotte", unit: "", type: ingredientType.vegetable, season: "*" }, { ingName: "Concentré de tomates", unit: "g", type: ingredientType.sauce, season: "*" }, { ingName: "Coriandre", unit: "qq brins", type: ingredientType.spice, season: "*" }, { ingName: "Courgette", unit: "", type: ingredientType.vegetable, season: "5--6--7--8--9--10" }, { ingName: "Curcuma", unit: "sachet", type: ingredientType.spice, season: "*" }, { ingName: "Lait de coco", unit: "mL", type: ingredientType.dairy, season: "*" }, { ingName: "Purée de noisettes", unit: "g", type: ingredientType.sauce, season: "*" }, { ingName: "Riz basmati", unit: "g", type: ingredientType.cerealProduct, season: "*" }, { ingName: "Citron jaune", unit: "", type: ingredientType.condiment, season: "*" }, { ingName: "Escalope de dinde", unit: "", type: ingredientType.poultry, season: "*" }, { ingName: "Origan", unit: "sachet", type: ingredientType.spice, season: "*" }, { ingName: "Spaghetti blancs", unit: "g", type: ingredientType.cerealProduct, season: "*" }, { ingName: "Coquillettes demi-complètes", unit: "g", type: ingredientType.cerealProduct, season: "*" }, { ingName: "Mélange d'épices chimichurri", unit: "sachet", type: ingredientType.spice, season: "*" }, { ingName: "Purée de tomates", unit: "g", type: ingredientType.sauce, season: "*" }, { ingName: "Tofu fumé", unit: "g", type: ingredientType.tofu, season: "*" }
    // , {ingName: "Riz basmati", unit: "g"}
];
const tagTable: Array<tagTableElement> = [
    { tagName: "Kids friendly" }, { tagName: "Gourmand" }, { tagName: "Express" }, { tagName: "Tradition" }, { tagName: "Test d'un tag débordant" }, { tagName: "Végétarien" }, { tagName: "Indien" }, { tagName: "Italien" }, { tagName: "Découverte" },
    //  {tagName: "Indien"},
];

export default class RecipeDatabase {

    protected _databaseName: string;
    protected _dbConnection: SQLite.SQLiteDatabase;

    // Tables
    protected _recipesTable: TableManipulation;
    protected _ingredientsTable: TableManipulation;
    protected _tagsTable: TableManipulation;
    // protected _nutritionTable: TableManipulation;

    protected _shoppingListTable: TableManipulation;

    // 
    protected _recipes: Array<recipeTableElement>;
    protected _ingredients: Array<ingredientTableElement>;
    protected _tags: Array<tagTableElement>;
    // protected _nutrition: Array<>;

    protected _shopping: Array<shoppingListTableElement>;


    public constructor() {
        this._databaseName = recipeDatabaseName;

        this._recipesTable = new TableManipulation(recipeTableName, recipeColumnsEncoding);
        this._ingredientsTable = new TableManipulation(ingredientsTableName, ingredientsColumnsNames);
        this._tagsTable = new TableManipulation(tagTableName, tagsColumnsNames);
        // this._nutritionTable = new TableManipulation(nutritionTableName, nutritionColumnsNames);

        this._shoppingListTable = new TableManipulation(shoppingListTableName, shoppingListColumnsEncoding);

        this._recipes = new Array<recipeTableElement>();
        this._ingredients = new Array<ingredientTableElement>();
        this._tags = new Array<tagTableElement>();
        // this._nutrition = new Array<string>();

        this._shopping = new Array<shoppingListTableElement>();

    }

    /* PROTECTED METHODS */

    protected async openDatabase() {
        try {
            this._dbConnection = await SQLite.openDatabase(this._databaseName);
        } catch (error) {
            console.warn("ERROR during opening of the database : ", error);
        }
    };

    protected async deleteDatabase() {
        try {
            await this._dbConnection.deleteAsync();
        } catch (error: any) {
            console.warn('Delete : received error ', error.code, " : ", error.message);
        }
    }

    protected async verifyTagsExist(tags: Array<tagTableElement>): Promise<Array<tagTableElement>> {

        return new Promise(async (resolve, reject) => {
            let result = new Array<tagTableElement>();

            for (let i = 0; i < tags.length && result; i++) {
                const elemFound = this.find_tag(tags[i])
                if (elemFound) {
                    result.push(elemFound)
                } else {
                    try {
                        // TODO
                        // result.push(await AsyncAlert(`TAG "${tags[i].tagName.toUpperCase()}" NOT FOUND.`, "Do you want to add it ?", 'OK', 'Cancel', 'Edit before add', tags[i].tagName));
                    } catch (error: any) {
                        reject(error)
                    }
                }
            }
            resolve(result);
        })
    }

    protected async verifyIngredientsExist(ingredients: Array<ingredientTableElement>): Promise<Array<ingredientTableElement>> {

        return new Promise(async (resolve, reject) => {
            let result = new Array<ingredientTableElement>();
            let newIngredients = new Array<ingredientTableElement>();

            for (let i = 0; i < ingredients.length; i++) {
                const elemFound = this.find_ingredient(ingredients[i])
                if (elemFound) {
                    elemFound.quantity = ingredients[i].quantity;
                    result.push(elemFound)
                } else {
                    // TODO Check for similar names ?
                    newIngredients.push(ingredients[i]);
                }
            }

            if (newIngredients.length == 0) {
                // All ingredients were found, exit function
                resolve(result);
            } else {
                let alertTitle = "";
                let alertMessage = "Do you want to add or edit it before  ?";
                let alertOk = "OK";
                let alertCancel = "Cancel";
                let alertEdit = "Edit before add";
                if (newIngredients.length > 1) {
                    // Plural
                    alertTitle = "INGREDIENTS NOT FOUND"
                    alertMessage = `Following ingredients were not found in database :  \n`
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
                    case alertUserChoice.ok:
                        await this.addIngredients(newIngredients);
                        result = result.concat(newIngredients);
                        resolve(result);
                        break;
                    case alertUserChoice.cancel:
                    default:
                        reject("User canceled adding ingredient");
                        break;
                }
            }

        })
    }


    protected encodeRecipe(recToEncode: recipeTableElement): Promise<encodedRecipeElement> {
        return new Promise(async (resolve, reject) => {

            try {
                let encodedTag = new Array<string>();
                let encodedIngredients = new Array<string>();

                for (let i = 0; i < recToEncode.tags.length; i++) {
                    encodedTag.push(await this.encodeTag(recToEncode.tags[i]));
                }
                for (let i = 0; i < recToEncode.ingredients.length; i++) {
                    const test = await this.encodeIngredient(recToEncode.ingredients[i]);
                    encodedIngredients.push(test);

                }
                let recipeConverted: encodedRecipeElement = {
                    image: recToEncode.image_Source,
                    title: recToEncode.title,
                    description: recToEncode.description,
                    tags: encodedTag.join(EncodingSeparator),
                    persons: recToEncode.persons,
                    ingredients: encodedIngredients.join(EncodingSeparator),
                    preparation: recToEncode.preparation.join(EncodingSeparator),
                    time: recToEncode.time,
                }
                if (recToEncode.id) {
                    recipeConverted.id = recToEncode.id;
                }
                resolve(recipeConverted)
            } catch (error) {
                reject(error)
            }
        })
    }

    protected async decodeRecipe(queryResult: string): Promise<recipeTableElement> {
        return new Promise(async (resolve, reject) => {
            let result: recipeTableElement = { id: 0, image_Source: "", title: "", description: "", tags: [], persons: 0, ingredients: [], season: "", preparation: [], time: 0 };

            // ID is not separate in the same way than the others
            const idStr = queryResult.split(`,\"IMAGE_SOURCE`)[0]

            // Remove ID part from queryResult and split in 2 part to have the column and the value
            let arrStr = queryResult.replace(idStr + ',', "").split(`,"`);


            result.id = +idStr.replace(regExp, "").split(`:`)[1];

            for (let i = 0; i < arrStr.length; i++) {
                let elem = arrStr[i].split(`":`); // { "Column name" , "Value"}
                // console.log("elem : ", elem);

                // IMAGE_SOURCE
                if (elem[0].includes(recipeColumnsNames.image)) {
                    result.image_Source = fileGestion.get_directoryUri() + elem[1].replace(regExp, "");
                }
                // TITLE
                else if (elem[0].includes(recipeColumnsNames.title)) {
                    try {
                        result.title = elem[1].replace(regExp, "");
                    } catch (error) {
                        reject(`Title decoding error : ${error}`);
                    }
                }
                // DESCRIPTION
                else if (elem[0].includes(recipeColumnsNames.description)) {
                    try {
                        result.description = elem[1].replace(regExp, "");
                    } catch (error) {
                        reject(`Description decoding error : ${error}`);
                    }
                }
                // TAGS
                else if (elem[0].includes(recipeColumnsNames.tags)) {
                    try {
                        const tags = elem[1].replace(regExp, "");
                        let decodedTags = new Array<tagTableElement>();
                        if (tags.length > 0) {
                            const decodedTags = await this.decodeTagFromRecipe(tags);
                        }

                        decodedTags.forEach(tag => {
                            result.tags.push(tag)
                        });
                    } catch (error: any) {
                        reject(`Tag decoding error : ${error}`);
                    }
                }
                // PERSONS
                else if (elem[0].includes(recipeColumnsNames.persons)) {
                    try {
                        result.persons = parseInt(elem[1].replace(regExp, ""));
                    } catch (error: any) {
                        reject(`Person decoding error : ${error}`);
                    }
                }
                // INGREDIENTS
                else if (elem[0].includes(recipeColumnsNames.ingredients)) {
                    try {
                        const [decodedIngredients, decodedSeason] = await this.decodeIngredientFromRecipe(elem[1].replace(regExp, ""));

                        result.season = decodedSeason
                        result.ingredients = decodedIngredients
                    } catch (error: any) {
                        reject(`Ingredient decoding error : ${error}`);
                    }
                }
                // PREPARATION
                else if (elem[0].includes(recipeColumnsNames.preparation)) {
                    try {
                        result.preparation = elem[1].replace(regExp, "").split(EncodingSeparator);
                    } catch (error) {
                        reject(`Preparation decoding error : ${error}`);
                    }
                }
                // TIME
                else if (elem[0].includes(recipeColumnsNames.time)) {
                    try {
                        result.time = parseInt(elem[1].replace(regExp, ""));
                    } catch (error) {
                        reject(`Time decoding error : ${error}`);
                    }
                }
                else {
                    reject(`NO SUCH COLUMNS FOUND FOR ELEMENT : ${elem}`);
                }

            }
            // console.log("Returning from decoding : ", result);
            resolve(result);
        })
    }

    protected async decodeArrayOfRecipe(queryResult: Array<string>): Promise<Array<recipeTableElement>> {

        return new Promise(async (resolve, reject) => {
            let recipeTableElement = new Array<recipeTableElement>();

            for (let i = 0; i < queryResult.length; i++) {
                try {
                    recipeTableElement.push(await this.decodeRecipe(queryResult[i]))
                } catch (error: any) {
                    reject(error)
                }

            }
            resolve(recipeTableElement);
        })
    }

    protected encodeIngredient(ingredientToEncode: ingredientTableElement): Promise<string> {

        return new Promise((resolve, reject) => {
            // To encode : ID--quantity
            const quantity = (ingredientToEncode.quantity ? ingredientToEncode.quantity.toString() : "")
            if (ingredientToEncode.id) {
                resolve(ingredientToEncode.id + textSeparator + quantity)
            } else {
                const foundIngredient = this.find_ingredient(ingredientToEncode);
                if (foundIngredient) {
                    resolve(foundIngredient.id + textSeparator + quantity)
                } else {
                    reject("ERROR : ingredient not found")
                }
            }
        })
    }

    protected async decodeIngredientFromRecipe(encodedIngredient: string): Promise<[Array<ingredientTableElement>, string]> {

        return new Promise(async (resolve, reject) => {
            let arrDecoded = new Array<ingredientTableElement>();
            let recipeSeason = "*";
            let firstSeasonFound = true;

            // Ex : 1--250__2--100__3--0.5__4--200__5--1__6--250 
            let ingSplit: Array<string>
            if (encodedIngredient.includes(EncodingSeparator)) {
                ingSplit = encodedIngredient.split(EncodingSeparator)
            } else {
                ingSplit = new Array<string>(encodedIngredient)
            }

            try {
                for (let indexIngredient = 0; indexIngredient < ingSplit.length; indexIngredient++) {

                    const id: number = Number(ingSplit[indexIngredient].split(textSeparator)[0]);
                    const ingQuantity = Number(ingSplit[indexIngredient].split(textSeparator)[1]);

                    const tableIngredient = await this._ingredientsTable.searchElementById(id, this._dbConnection);

                    let decodedIngredient = await this.decodeIngredient(tableIngredient);
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
            } catch (error: any) {
                reject(`ERROR in decodeIngredientFromRecipe ${error}`);
            }
            resolve([arrDecoded, recipeSeason]);

        })
    }

    protected async decodeIngredient(dbIngredient: string) {

        // Retrieve directly the name
        // Ex :  {"ID":1,"INGREDIENT":"INGREDIENT NAME","UNIT":"g", "TYPE":"BASE", "SEASON":"*"}
        const splitIngredient = dbIngredient.split(',');

        const ingId = Number(splitIngredient[0].split(':')[1]);
        const ingName = splitIngredient[1].split(':')[1].replace(regExp, "");
        const ingUnit = splitIngredient[2].split(':')[1].replace(regExp, "");
        let ingType: ingredientType;
        const ingSeason = splitIngredient[4].split(':')[1].replace(regExp, "");

        switch (splitIngredient[3].split(':')[1].replace(regExp, "").toLowerCase()) {
            case ingredientType.cerealProduct.toLowerCase():
                ingType = ingredientType.cerealProduct;
                break;
            case ingredientType.vegetable.toLowerCase():
                ingType = ingredientType.vegetable;
                break;
            case ingredientType.condiment.toLowerCase():
                ingType = ingredientType.condiment;
                break;
            case ingredientType.sauce.toLowerCase():
                ingType = ingredientType.sauce;
                break;
            case ingredientType.meet.toLowerCase():
                ingType = ingredientType.meet;
                break;
            case ingredientType.poultry.toLowerCase():
                ingType = ingredientType.poultry;
            case ingredientType.fish.toLowerCase():
                ingType = ingredientType.fish;
                break;
            case ingredientType.tofu.toLowerCase():
                ingType = ingredientType.tofu;
            case ingredientType.dairy.toLowerCase():
                ingType = ingredientType.dairy;
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
            default:
                ingType = ingredientType.undefined;
                break;
        }


        const decodedIngredient: ingredientTableElement = { id: ingId, ingName: ingName, unit: ingUnit, type: ingType, season: ingSeason }
        return decodedIngredient;
    }

    protected async decodeArrayOfIngredients(queryResult: Array<string>): Promise<Array<ingredientTableElement>> {
        return new Promise(async (resolve, reject) => {
            let ingredientsArray = new Array<ingredientTableElement>();

            for (let i = 0; i < queryResult.length; i++) {
                try {
                    const ingredient = await this.decodeIngredient(queryResult[i]);
                    ingredientsArray.push(ingredient);
                } catch (error: any) {
                    reject(error)
                }
            }
            resolve(ingredientsArray);
        })
    }

    protected async addIngredient(ingredient: ingredientTableElement) {
        try {
            const ingToAdd: ingredientTableElement = { ingName: ingredient.ingName, unit: ingredient.unit, type: ingredient.type, season: ingredient.season }
            const dbRes = await this._ingredientsTable.insertElement(ingToAdd, this._dbConnection);
            let dbIngredient: string;

            if (typeof dbRes === "number" && !Number.isNaN(dbRes)) {
                dbIngredient = await this._ingredientsTable.searchElementById(dbRes, this._dbConnection)
            } else {
                const searchTag = new Map<string, string>([[ingredientsColumnsNames[0].colName, ingToAdd.ingName], [ingredientsColumnsNames[1].colName, ingToAdd.unit], [ingredientsColumnsNames[2].colName, ingToAdd.type]])
                dbIngredient = await this._ingredientsTable.searchElement(this._dbConnection, searchTag) as string;
            }

            const decodedIng = await this.decodeIngredient(dbIngredient);

            // console.log("RecipeDatabase::addIngredient : after decoding ingredient decoded is ", decodedIng,". It was added from ", ingredient);

            this._ingredients.push(decodedIng);
            return (decodedIng);
        } catch (error: any) {
            console.warn("ERROR while trying to add an ingredient : ", error);
        }
    }

    protected async addIngredients(ingArray: Array<ingredientTableElement>) {
        let ingAdded = new Array<ingredientTableElement>();
        for (let i = 0; i < ingArray.length; i++) {
            ingAdded.push(await this.addIngredient(ingArray[i]) as ingredientTableElement);
        }
    }

    protected decodeSeason(season: string, ingredientSeason: string) {
        let result = "";

        const arrSeason = season.includes(textSeparator);
        const arrIngSeason = ingredientSeason.includes(textSeparator);

        const splitSeason = arrSeason ? season.split(textSeparator) : new Array<string>();
        const ingSeason = arrIngSeason ? ingredientSeason.split(textSeparator) : new Array<string>();

        if (arrSeason && arrIngSeason) {
            const filterSeason = splitSeason.filter((month) => {
                let toKeep = false;
                for (let i = 0; i < ingSeason.length; i++) {
                    if (ingSeason[i].includes(month)) {
                        toKeep = true;
                        break;
                    }
                }
                return toKeep;
            });
            for (let i = 0; i < filterSeason.length; i++) {
                if (i != 0) {
                    result = result + textSeparator + filterSeason[i];
                } else {
                    result = filterSeason[0];
                }
            }
        } else if (!arrSeason && arrIngSeason) {
            for (let i = 0; i < ingSeason.length; i++) {
                if (ingSeason[i].includes(season)) {
                    result = season;
                    break;
                }
            }
        } else if (arrSeason && !arrIngSeason) {
            const filterSeason = splitSeason.filter((month) => ingredientSeason == month);
            for (let i = 0; i < filterSeason.length; i++) {
                if (i != 0) {
                    result = result + textSeparator + filterSeason[i];
                }
                else {
                    result = filterSeason[0];
                }
            }
        } else {
            if (ingredientSeason == season) {
                result = season;
            } else {
                result = "";
            }
        }
        return result;
    }

    protected encodeTag(tag: tagTableElement): Promise<string> {

        return new Promise((resolve, reject) => {
            if (tag.id) {
                resolve(tag.id.toString());
            } else {
                const foundedTag = this.find_tag(tag);
                if (foundedTag && foundedTag.id) {
                    resolve(foundedTag.id.toString());
                } else {
                    reject("ERROR : tag not found")
                }
            }
        })
    }

    protected readTagName(tag: string) {
        // Retrieve NAME directly 
        // Ex : {"ID":5,"NAME":"TAG NAME"}
        return tag.split(`,\"`)[1].split('NAME":')[1].replace(regExp, "");
    }

    protected async decodeTagFromRecipe(encodedTag: string): Promise<Array<tagTableElement>> {

        return new Promise(async (resolve, reject) => {
            let arrDecoded = new Array<tagTableElement>();

            // Ex : "1__2__5__3__4"
            let tagSplit: Array<string>
            if (encodedTag.includes(EncodingSeparator)) {
                tagSplit = encodedTag.split(EncodingSeparator);
            } else {
                tagSplit = new Array<string>(encodedTag);
            }

            for (let i = 0; i < tagSplit.length; i++) {
                try {
                    let tableTag = await this._tagsTable.searchElementById(+tagSplit[i], this._dbConnection);

                    arrDecoded.push(await this.decodeTag(tableTag));
                } catch (error: any) {
                    reject(error);

                }
            }
            resolve(arrDecoded);

        })
    }

    protected async decodeTag(dbTag: string) {

        // Retrieve directly the name
        // Ex : {"ID":4,"NAME":"TAG NAME"}
        const splitTag = dbTag.split(',');

        const id = Number(splitTag[0].split(':')[1].replace(regExp, ""));
        const name = splitTag[1].split(':')[1].replace(regExp, "");

        const decodedTag: tagTableElement = { id: id, tagName: name }
        return decodedTag;
    }

    protected async decodeArrayOfTags(queryResult: Array<string>): Promise<Array<tagTableElement>> {
        return new Promise(async (resolve, reject) => {
            let tagsArray = new Array<tagTableElement>();

            for (let i = 0; i < queryResult.length; i++) {
                try {
                    const tag = await this.decodeTag(queryResult[i])
                    tagsArray.push(tag);
                } catch (error: any) {
                    reject(error)
                }
            }
            resolve(tagsArray);
        })
    }

    protected async addTag(newTag: string) {
        try {
            const dbRes = await this._tagsTable.insertElement({ tagName: newTag }, this._dbConnection);
            let dbTag: string;

            if (typeof dbRes === "number" && !Number.isNaN(dbRes)) {
                dbTag = await this._tagsTable.searchElementById(dbRes, this._dbConnection)
            } else {
                const searchTag = new Map<string, string>([[tagsColumnsNames[0].colName, newTag]])
                dbTag = await this._tagsTable.searchElement(this._dbConnection, searchTag) as string;
            }

            const tag = await this.decodeTag(dbTag);
            this._tags.push(tag);
        } catch (error: any) {
            console.warn("ERROR while trying to add a tag : ", error);
        }
    }



    protected encodeShopping(shopToEncode: shoppingListTableElement): Promise<encodedShoppingListElement> {
        return new Promise((resolve) => {
            let shoppingConverted: encodedShoppingListElement = {
                type: shopToEncode.type as string,
                name: shopToEncode.name,
                quantity: shopToEncode.quantity,
                unit: shopToEncode.unit,
                recipes: shopToEncode.recipes.join(EncodingSeparator),
                purchased: shopToEncode.purchased,
            }
            resolve(shoppingConverted);
        })
    }

    protected async decodeShopping(queryResult: string): Promise<shoppingListTableElement> {

        return new Promise(async (resolve, reject) => {
            let result: shoppingListTableElement = { type: listFilter.purchased, name: "", purchased: true, quantity: 0, recipes: [], unit: "" };

            // ID is not separate in the same way than the others
            const idStr = queryResult.split(`,\"TYPE`)[0];

            // Remove ID part from queryResult and split in 2 part to have the column and the value
            let arrStr = queryResult.replace(idStr + ',', "").split(`,"`);

            result.id = +idStr.replace(regExp, "").split(`:`)[1];

            for (let i = 0; i < arrStr.length; i++) {
                let elem = arrStr[i].split(`":`); // { "Column name" , "Value"}

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
                    result.recipes = elem[1].replace(regExp, "").split(EncodingSeparator);
                }
                // PURCHASED
                else if (elem[0].includes(shoppingListColumnsNames.purchased)) {
                    result.purchased = elem[1].replace(regExp, "").toLowerCase() === 'true';
                }
                else {
                    reject(`NO SUCH COLUMNS FOUND FOR ELEMENT : ${elem}`);
                }

            }
            console.log("Returning from query : ", result);
            resolve(result);

        })
    }

    protected async decodeArrayOfShopping(queryResult: Array<string>): Promise<Array<shoppingListTableElement>> {

        return new Promise(async (resolve, reject) => {
            let shoppingListTableElement = new Array<shoppingListTableElement>();

            for (let i = 0; i < queryResult.length; i++) {
                try {
                    shoppingListTableElement.push(await this.decodeShopping(queryResult[i]))
                } catch (error: any) {
                    reject(error)
                }

            }
            resolve(shoppingListTableElement);
        })
    }

    protected set_recipes(newRecipes: Array<recipeTableElement>) {
        this._recipes = newRecipes;
    }

    protected set_ingredients(newIngredients: Array<ingredientTableElement>) {
        this._ingredients = newIngredients;
    }

    protected set_tags(newTags: Array<tagTableElement>) {
        this._tags = newTags;
    }

    protected find_ingredient(ingToFind: ingredientTableElement) {
        let res: ingredientTableElement | undefined;

        const foundIngredient = this._ingredients.find(ing => ing.ingName.toLowerCase() == ingToFind.ingName.toLowerCase());
        if (foundIngredient && foundIngredient.id) {
            res = foundIngredient;
        }
        return res;
    }

    protected find_tag(toSearch: tagTableElement) {
        let res: tagTableElement | undefined;

        const foundTag = this._tags.find(tag => tag.tagName.toLowerCase() == toSearch.tagName.toLowerCase());
        if (foundTag && foundTag.id) {
            res = foundTag;
        }
        return res;
    }

    // TODO nutrition

    protected set_shopping(newShopping: Array<shoppingListTableElement>) {
        this._shopping = newShopping;
    }


    protected async getAllRecipes(): Promise<Array<recipeTableElement>> {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.decodeArrayOfRecipe(await this._recipesTable.searchElement(this._dbConnection) as Array<string>)
                resolve(res);
            } catch (error) {
                reject(error);
            }
        })
    }

    protected async getAllTags(): Promise<Array<tagTableElement>> {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.decodeArrayOfTags(await this._tagsTable.searchElement(this._dbConnection) as Array<string>)
                resolve(res);
            } catch (error) {
                reject(error);
            }
        })
    }

    protected async getAllIngredients(): Promise<Array<ingredientTableElement>> {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.decodeArrayOfIngredients(await this._ingredientsTable.searchElement(this._dbConnection) as Array<string>)
                resolve(res);
            } catch (error) {
                reject(error);
            }
        })
    }

    protected async getAllShopping(): Promise<Array<shoppingListTableElement>> {
        return new Promise(async (resolve, reject) => {
            try {
                const dbRes = await this._shoppingListTable.searchElement(this._dbConnection)
                let res: Array<shoppingListTableElement>;
                if (dbRes === "undefined") {
                    res = new Array<shoppingListTableElement>()
                } else {
                    res = await this.decodeArrayOfShopping(dbRes as Array<string>)
                }
                resolve(res);
            } catch (error) {
                reject(error);
            }
        })
    }


    /* PUBLIC METHODS */

    public async init() {

        try {
            await this.openDatabase();

            // TODO temporary part for debugging

            await this._recipesTable.deleteTable(this._dbConnection);
            await this._ingredientsTable.deleteTable(this._dbConnection);
            await this._tagsTable.deleteTable(this._dbConnection);
            await this._shoppingListTable.deleteTable(this._dbConnection);
            // await this._nutritionTable.deleteTable(this._dbConnection);

            await this._recipesTable.createTable(this._dbConnection);
            await this._ingredientsTable.createTable(this._dbConnection);
            await this._tagsTable.createTable(this._dbConnection);
            await this._shoppingListTable.createTable(this._dbConnection);
            // await this._nutritionTable.createTable();

            await this._tagsTable.insertArrayOfElement(tagTable, this._dbConnection);
            await this._ingredientsTable.insertArrayOfElement(ingTable, this._dbConnection);

            this._ingredients = await this.getAllIngredients();
            this._tags = await this.getAllTags();

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


            await this.addMultipleRecipes(dbTest);
            this._recipes = await this.getAllRecipes();

            //_nutrition =

            // this._shopping = await this.getAllShopping();

        } catch (error: any) {
            console.warn(error);
        }

    }

    public async addRecipe(rec: recipeTableElement) {

        try {
            let recipe = rec;
            recipe.tags = await this.verifyTagsExist(rec.tags);
            recipe.ingredients = await this.verifyIngredientsExist(rec.ingredients);

            const recipeConverted = await this.encodeRecipe(recipe);

            const dbRes = await this._recipesTable.insertElement(recipeConverted, this._dbConnection);

            let dbRecipe: string;

            if (typeof dbRes === "number" && !Number.isNaN(dbRes)) {
                dbRecipe = await this._recipesTable.searchElementById(dbRes, this._dbConnection)
            } else {
                const searchedTitle = new Map<string, string>([[recipeColumnsNames.title, recipe.title], [recipeColumnsNames.description, rec.description], [recipeColumnsNames.image, rec.image_Source], [recipeColumnsNames.persons, recipe.persons.toString()], [recipeColumnsNames.time, recipe.time.toString()]])
                dbRecipe = await this._recipesTable.searchElement(this._dbConnection, searchedTitle) as string;
            }
            this._recipes.push(await this.decodeRecipe(dbRecipe));
        } catch (error: any) {
            console.warn("ERROR in addRecipe : ", error);
        }
    }

    public async addMultipleRecipes(recs: Array<recipeTableElement>) {
        try {
            for (let i = 0; i < recs.length; i++) {
                await this.addRecipe(recs[i]);
            }
        } catch (error) {
            console.warn(error);

        }
    }


    public async addShoppingList(shop: shoppingListTableElement) {

        try {
            const shoppingEncoded = await this.encodeShopping(shop);
            await this._shoppingListTable.insertElement(shoppingEncoded, this._dbConnection);
        } catch (error: any) {
            console.warn("ERROR in addShopping : ", error);
        }
    }

    public async addRecipeToShopping(recipe: recipeTableElement) {
        let shopElement = new Array<shoppingListTableElement>();
        recipe.ingredients.forEach(ing => {

            shopElement.push({ type: ing.type as TListFilter, name: ing.ingName, quantity: (ing.quantity ? ing.quantity : 0), unit: ing.unit, recipes: [recipe.title], purchased: false })

        });

        for (let i = 0; i < shopElement.length; i++) {
            await this.updateShoppingList(shopElement[i]);
        }
    }

    public async updateShoppingList(shop: shoppingListTableElement) {

        try {
            const searchMap = new Map<string, string>([[shoppingListColumnsNames.ingredient, shop.name], [shoppingListColumnsNames.unit, shop.unit]]);
            const elemFoundEncoded = await this._shoppingListTable.searchElement(this._dbConnection, searchMap) as string;

            if (elemFoundEncoded === undefined) {
                await this.addShoppingList(shop);
                this.add_shopping(shop);
            } else {
                let elemSQL = new Map<string, number | string>();
                const elemFoundDecoded = await this.decodeShopping(elemFoundEncoded);
                let elemUpdated = elemFoundDecoded;

                if ((shop.quantity == elemFoundDecoded.quantity) && (shop.recipes == elemFoundDecoded.recipes)) {
                    elemUpdated.purchased = shop.purchased;
                    elemSQL.set(shoppingListColumnsNames.purchased, elemUpdated.purchased.toString());
                } else {
                    elemUpdated.quantity = (shop.quantity + elemFoundDecoded.quantity);
                    elemUpdated.recipes = [...elemFoundDecoded.recipes, ...shop.recipes];

                    if (elemFoundDecoded.unit == shop.unit) {
                        elemSQL.set(shoppingListColumnsNames.quantity, elemUpdated.quantity);
                        elemSQL.set(shoppingListColumnsNames.recipeTitles, elemUpdated.recipes.join(EncodingSeparator));
                    }
                }


                if (elemUpdated.id) {
                    this.update_shopping(elemUpdated);
                    await this._shoppingListTable.editElement(elemUpdated.id, elemSQL, this._dbConnection);
                } else {
                    console.error("DECODED SHOPPING LIST DOESN'T HAVE ID !");
                }
            }

        } catch (error: any) {
            throw new Error("ERROR in updateShoppingList : ", error);
        }
    }

    public async addMultipleShopping(shops: Array<shoppingListTableElement>) {
        try {
            for (let i = 0; i < shops.length; i++) {
                this.add_shopping(shops[i]);
                await this.addShoppingList(shops[i]);
            }
        } catch (error) {
            console.warn(error);

        }
    }

    public async searchRandomlyRecipes(numOfElements: number): Promise<Array<recipeTableElement>> {
        return new Promise(async (resolve, reject) => {
            if (this._recipes.length == 0) {
                reject("RECIPE TABLE IS EMPTY, IMPOSSIBLE TO EXTRACT A NUMBER FROM IT")
            } else {
                let res = new Array<recipeTableElement>();
                if (this._recipes.length <= numOfElements) {
                    console.log("Return directly the table because we want the same size");
                    res = this._recipes;
                } else {
                    while (res.length < numOfElements) {
                        let skipElem = false;
                        const randomId = Math.floor(Math.random() * this._recipes.length);

                        for (let i = 0; i < res.length && !skipElem; i++) {
                            if (isRecipeEqual(res[i], this._recipes[randomId])) {
                                skipElem = true;
                            }
                        }
                        if (!skipElem) {
                            res.push(this._recipes[randomId]);
                        }
                    }
                }
                resolve(res);

            }
        })
    }

    public async searchRandomlyTags(numOfElements: number): Promise<Array<tagTableElement>> {
        return new Promise(async (resolve, reject) => {
            if (this._tags.length == 0) {
                reject("NO TAGS PROVIDED, IMPOSSIBLE TO EXTRACT A NUMBER FROM IT")
            } else {
                let res = new Array<tagTableElement>();
                if (this._tags.length <= numOfElements) {
                    console.log("Return directly the table because we want the same size");
                    res = this._tags;
                } else {
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
                }
                resolve(res);

            }
        })

    }

    public get_recipes() {
        return this._recipes;
    }

    public get_ingredients() {
        return this._ingredients;
    }

    public get_tags() {
        return this._tags;
    }

    public get_shopping() {
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
        this._recipes = this._recipes.filter(element => isRecipeEqual(element, recipe));
    }

    public remove_recipeById(id: number) {
        this._recipes = this._recipes.filter(element => {
            if (element.id) {
                return element.id == id
            }
        });
    }

    public remove_ingredient(ingredient: ingredientTableElement) {
        this._ingredients = this._ingredients.filter(element => isIngredientEqual(element, ingredient));
    }

    public remove_ingredientById(id: number) {
        this._ingredients = this._ingredients.filter(element => {
            if (element.id) {
                return element.id == id
            }
        });
    }

    public remove_tag(tag: tagTableElement) {
        this._tags = this._tags.filter(element => isTagEqual(element, tag));
    }

    public remove_tagById(id: number) {
        this._tags = this._tags.filter(element => {
            if (element.id) {
                return element.id == id
            }
        });
    }

    public remove_shopping(shop: shoppingListTableElement) {
        this._shopping = this._shopping.filter(element => element.name == shop.name);
    }

    public update_recipes(oldRecipe: recipeTableElement, newRecipe: recipeTableElement) {
        this._recipes.forEach(element => {
            if (isRecipeEqual(oldRecipe, element) || (oldRecipe.id == element.id)) {
                element = newRecipe;
            }
        });
    }

    public update_ingredients(oldIngredient: ingredientTableElement, newIngredient: ingredientTableElement) {
        this._ingredients.forEach(element => {
            if (isIngredientEqual(element, oldIngredient)) {
                element = newIngredient;
            }
        });
    }

    public update_tags(oldTag: tagTableElement, newTag: tagTableElement) {
        this._tags.forEach(element => {
            if (isTagEqual(element, oldTag)) {
                element = newTag;
            }
        });
    }


    public update_shopping(shop: shoppingListTableElement) {
        this._shopping.forEach(element => {
            if (element.name == shop.name) {
                element = shop;
            }
        });
    }
}


export const recipeDb = new RecipeDatabase();