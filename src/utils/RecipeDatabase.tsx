/**
 * TODO fill this part
 * @format
 */


// import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import * as SQLite from 'expo-sqlite';
import { recipeColumnsNames, recipeTableName, recipeDatabaseName, recipeTableElement, encodedRecipeElement, tagTableName, ingredientsTableName, ingredientsColumnsNames, tagsColumnsNames, nutritionColumnsNames, nutritionTableName, ingredientTableElement, tagTableElement, regExp, recipeColumnsEncoding, ingredientType, shoppingListTableElement, shoppingListColumnsEncoding, shoppingListTableName, shoppingListColumnsNames, encodedShoppingListElement } from '@customTypes/DatabaseElementTypes';
import TableManipulation from './TableManipulation';
import { EncodingSeparator, textSeparator } from '@styles/typography';
import { Alert } from 'react-native';
import { AsyncAlert } from './AsyncAlert';
import { listFilter } from '@customTypes/RecipeFiltersTypes';
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
      tags: ["Kids friendly", "Test d'un tag débordant", "Gourmand", "Express", "Tradition"],
      ingredients: ["Champignons de Paris blanc--250", "Crème liquide--100", "Gousse d'ail--0.5", "Macaroni demi-complets--200", "Oignon jaune--1", "Saucisse couteau nature--250"],
      preparation: ["Les saucisses--Dans une seconde sauteuse, faites chauffer un filet d'huile d'olive à feu moyen à vif.\nFaites revenir les saucisses 12 min environ. Salez, poivrez.\nPendant ce temps, faites cuire les macaroni.", "Les macaroni--Portez à ébullition une casserole d'eau salée.\nFaites cuire les macaroni selon les indications du paquet.", "Etape finale--Servez sans attendre votre saucisse au couteau nappée de crème aux champignons et accompagnée des macaroni"],
      time: 25,
      season: "",
    },
    {
        image_Source: 'tree.jpg',
        title: "Korma de légumes au lait de coco",
        description: "Ce mijoté indien vous est proposé en version 100% végétale avec du riz bio et des légumes cuits délicatement dans une purée de noisettes au curcuma.",
        tags: ["Végétarien", "Indien"],
        ingredients: ["Carotte--1", "Concentré de tomates--35", "Coriandre--", "Courgette--1", "Curcuma--0.25", "Lait de coco--150", "Oignon jaune--1", "Purée de noisettes--40", "Riz basmati--150"],
        preparation: ["Les légumes--Émincez l'oignon.\nÉpluchez la carotte.\nCoupez la courgette et la carotte en dés.\nPelez et hachez finement l'ail et le gingembre.\nDans une sauteuse, faites chauffer un filet d'huile de cuisson à feu moyen à vif.\nFaites revenir l'oignon et la carotte 5 min.\nAu bout des 5 min de cuisson, ajoutez la courgette, le curcuma, l'ail et le gingembre et poursuivez la cuisson 10 min. Salez, poivrez.\nEn parallèle, faites cuire le riz.", "Le riz--Portez à ébullition une casserole d'eau salée.\nFaites cuire le riz selon les indications du paquet.", "Le korma--Une fois les légumes cuits, ajoutez dans la sauteuse le concentré de tomates, la purée de noisettes et le lait de coco.\nCouvrez et laissez mijoter 5 min.\nGoûtez et rectifiez l'assaisonnement si nécessaire.\nCiselez la coriandre (en entier, les tiges se consomment).", "A table--Servez votre korma de légumes au lait de coco bien chaud accompagné du riz et parsemé de coriandre !"],
        time: 30,
        season: "",
      },
      {
          image_Source: 'strawberries.jpg',
          title: "Piccata de dinde au citron et courgettes sautées à l'ail",
          description: "Nos délicieuses escalopes de dinde françaises se parent de farine, s'enrobent de beurre et se déglacent au jus de citron. Tout un programme !",
          tags: ["Kids friendly", "Italien"],
          ingredients: ["Citron jaune--0.5", "Courgette--2", "Escalope de dinde--2", "Gousse d'ail--0.5", "Origan--0.25", "Spaghetti blancs--200", "Riz basmati--150"],
          preparation: ["Les légumes--Emincez l'oignon.\nCoupez les courgettes en rondelles.\nPressez ou hachez l'ail.\nDans une sauteuse, faites chauffer un filet d'huile d'olive à feu moyen à vif.\nFaites revenir l'oignon 5 min.\nAu bout des 5 min de cuisson, ajoutez l'ail, l'origan et les courgettes et poursuivez la cuisson 10 min. Salez, poivrez.\nEn parallèle, faites cuire les spaghetti.", "Les spaghetti--Portez à ébullition une casserole d'eau salée.\nFaites cuire les spaghetti selon les indications du paquet.\nPendant la cuisson des spaghetti, réalisez la piccata de dinde.", "La piccata de dinde--Pressez le citron jaune.\nDéposez un peu de farine dans une assiette creuse.\nCoupez les escalopes de dinde en fines lanières. Salez, poivrez et trempez-les dans la farine.\nDans une poêle, faites fondre le beurre à feu moyen à vif.\nFaites cuire la dinde 5 à 8 min. En fin de cuisson, versez le jus de citron.", "A table--Servez sans attendre votre piccata de dinde accompagnée des spaghetti et des courgettes sautées !"],
          time: 30,
          season: "",
        },
        {
            image_Source: 'scooter.jpg',
            title: "Tofu fumé et sauce tomate aux épices chimichurri",
            description: "Les épices chimichurri ? Un mélange originaire d’Argentine à base d’origan, de piment doux et de thym qui relèveront à merveille notre tofu fumé !",
            tags: ["Découverte", "Végétarien"],
            ingredients: ["Champignons de Paris blanc--250", "Coquillettes demi-complètes--200", "Gousse d'ail--0.5", "Mélange d'épices chimichurri--0.25", "Oignon jaune--1", "Origan--0.25", "Purée de tomates--250", "Tofu fumé--200"],
            preparation: ["Les légumes--Emincez l'oignon.\nCoupez les courgettes en rondelles.\nPressez ou hachez l'ail.\nDans une sauteuse, faites chauffer un filet d'huile d'olive à feu moyen à vif.\nFaites revenir l'oignon 5 min.\nAu bout des 5 min de cuisson, ajoutez l'ail, l'origan et les courgettes et poursuivez la cuisson 10 min. Salez, poivrez.\nEn parallèle, faites cuire les spaghetti.", "Les spaghetti--Portez à ébullition une casserole d'eau salée.\nFaites cuire les spaghetti selon les indications du paquet.\nPendant la cuisson des spaghetti, réalisez la piccata de dinde.", "La piccata de dinde--Pressez le citron jaune.\nDéposez un peu de farine dans une assiette creuse.\nCoupez les escalopes de dinde en fines lanières. Salez, poivrez et trempez-les dans la farine.\nDans une poêle, faites fondre le beurre à feu moyen à vif.\nFaites cuire la dinde 5 à 8 min. En fin de cuisson, versez le jus de citron.", "A table--Servez sans attendre votre piccata de dinde accompagnée des spaghetti et des courgettes sautées !"],
            time: 30,
            season: "",
          }
  ]

  const ingTable: Array<ingredientTableElement> = [
    {ingName: "Champignons de Paris blanc", unit: "g", type: ingredientType.vegetable, season: "*"}, {ingName: "Crème liquide", unit: "mL", type: ingredientType.dairy, season: "*"},{ingName: "Gousse d'ail", unit: "", type: ingredientType.condiment, season: "*"}, {ingName: "Macaroni demi-complets", unit: "g", type: ingredientType.base, season: "*"}, {ingName: "Oignon jaune", unit: "", type: ingredientType.condiment, season: "*"}, {ingName: "Saucisse couteau nature", unit: "g", type: ingredientType.meet, season: "*"}, {ingName: "Carotte", unit: "", type: ingredientType.vegetable, season: "*"}, {ingName: "Concentré de tomates", unit: "g", type: ingredientType.sauce, season: "*"}, {ingName: "Coriandre", unit: "qq brins", type: ingredientType.spice, season: "*"}, {ingName: "Courgette", unit: "", type: ingredientType.vegetable, season: "5--6--7--8--9--10"}, {ingName: "Curcuma", unit: "sachet", type: ingredientType.spice, season: "*"}, {ingName: "Lait de coco", unit: "mL", type: ingredientType.dairy, season: "*"}, {ingName: "Purée de noisettes", unit: "g", type: ingredientType.sauce, season: "*"}, {ingName: "Riz basmati", unit: "g", type: ingredientType.base, season: "*"} , {ingName: "Citron jaune", unit: "", type: ingredientType.condiment, season: "*"}, {ingName: "Escalope de dinde", unit: "", type: ingredientType.poultry, season: "*"}, {ingName: "Origan", unit: "sachet", type: ingredientType.spice, season: "*"}, {ingName: "Spaghetti blancs", unit: "g", type: ingredientType.base, season: "*"}, {ingName: "Coquillettes demi-complètes", unit: "g", type: ingredientType.base, season: "*"}, {ingName: "Mélange d'épices chimichurri", unit: "sachet", type: ingredientType.spice, season: "*"}, {ingName: "Purée de tomates", unit: "g", type: ingredientType.sauce, season: "*"}, {ingName: "Tofu fumé", unit: "g", type: ingredientType.tofu, season: "*"}
    // , {ingName: "Riz basmati", unit: "g"}
];
  const tagTable: Array<tagTableElement> = [
    {tagName: "Kids friendly"}, {tagName: "Gourmand"}, {tagName: "Express"}, {tagName: "Tradition"}, {tagName: "Test d'un tag débordant"}, {tagName: "Végétarien"}, {tagName: "Indien"}, {tagName: "Italien"}, {tagName: "Découverte"},
    //  {tagName: "Indien"},
];

const shoppingList: Array<shoppingListTableElement> = [{ type: listFilter.poultry, name: "Escalope de dinde", quantity: 2, unit: "", recipes: ["Title1", "Title2", "Title3"], purchased: true},
    { type: listFilter.cerealProduct, name: "Riz basmati", quantity: 200, unit: "g", recipes: ["Title1", "Title2", "Title3"], purchased: false}, { type: listFilter.cerealProduct, name: "Macaroni demi-complets", quantity: 200, unit: "g", recipes: ["Title1", "Title2", "Title3"], purchased: false}, { type: listFilter.cerealProduct, name: "Coquillettes demi-complètes", quantity: 200, unit: "g", recipes: ["Title1", "Title2", "Title3"], purchased: false}, { type: listFilter.vegetable, name: "Champignons de Paris blanc", quantity: 200, unit: "g", recipes: ["Title1", "Title2", "Title3"], purchased: false}, { type: listFilter.vegetable, name: "Carotte", quantity: 2, unit: "", recipes: ["Title1", "Title2", "Title3"], purchased: false}
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

    public _shopping: Array<shoppingListTableElement>;


    public constructor() {
        this._databaseName = recipeDatabaseName;

        this._recipesTable = new TableManipulation(recipeTableName, recipeColumnsEncoding);
        this._ingredientsTable = new TableManipulation(ingredientsTableName, ingredientsColumnsNames);
        this._tagsTable = new TableManipulation(tagTableName, tagsColumnsNames);
        // this._nutritionTable = new TableManipulation(nutritionTableName, nutritionColumnsNames);

        this._shoppingListTable = new TableManipulation(shoppingListTableName, shoppingListColumnsEncoding);

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

    protected async addTag(tag: string) {
        this._tagsTable.insertElement({tagName: tag}, this._dbConnection)
    }

    protected async verifyTagsExist(tags: Array<string>): Promise<Array<string>> {
        
        return new Promise(async (resolve, reject) => {
            let result: Array<string> = new Array();

            for (let i = 0; i < tags.length && result; i++) {
                const searchMap = new Map<string, string>([[tagsColumnsNames[0].colName, tags[i]]]); 
                const elemFound = await this._tagsTable.searchElement(this._dbConnection, searchMap) as string;
                

                if(!elemFound){
                    try{
                        result.push(await AsyncAlert(`TAG "${tags[i].toUpperCase()}" NOT FOUND.`, "Do you want to add it ?", 'OK', 'Cancel', 'Edit before add', tags[i]));
                    }catch(error: any){
                        reject(error)                        
                    }
                }else{
                    result.push(this.encodeTag(elemFound))
                }
        }
        resolve(result);
        })
    }

    protected async verifyIngredientsExist(ingredients: Array<string>): Promise<Array<string>> {
        
        return new Promise(async (resolve, reject) => {
            let result: Array<string> = new Array();

            for (let i = 0; i < ingredients.length; i++) {
                const searchMap = new Map<string, string>([[ingredientsColumnsNames[0].colName, ingredients[i].split(textSeparator)[0]]]); 
                
                const elemFound = await this._ingredientsTable.searchElement(this._dbConnection, searchMap) as string;

                if(!elemFound){
                    try{
                        result.push(await AsyncAlert(`INGREDIENT "${ingredients[i].split(textSeparator)[0].toUpperCase()}" NOT FOUND.`, "Do you want to add it ?", 'OK', 'Cancel', 'Edit before add', ingredients[i]));
                    }catch(error: any){
                        reject(error)                        
                    }
                }else{
                    result.push(this.encodeIngredient(elemFound, ingredients[i]))
                }
        }
        resolve(result);
        })
    }

    protected encodeRecipe(recToEncode: recipeTableElement): Promise<encodedRecipeElement> {
        return new Promise((resolve) => {
            let recipeConverted: encodedRecipeElement = {
                image: recToEncode.image_Source,
                title: recToEncode.title,
                description: recToEncode.description,
                tags: recToEncode.tags.join(EncodingSeparator),
                ingredients: recToEncode.ingredients.join(EncodingSeparator),
                preparation: recToEncode.preparation.join(EncodingSeparator),
                time: recToEncode.time,
            }
            if (recToEncode.id){
                recipeConverted.id = recToEncode.id;
            }
            resolve(recipeConverted)
        })
    }
    
    protected async decodeRecipe (queryResult: string): Promise<recipeTableElement> {
        return new Promise(async (resolve, reject) => {
            let result: recipeTableElement = { id: 0, image_Source: "", title: "", description: "", tags: [""], ingredients: [""], season: "", preparation: [""], time: 0};

            // ID is not separate in the same way than the others
            const idStr = queryResult.split(`,\"IMAGE_SOURCE`)[0]
        
            // Remove ID part from queryResult and split in 2 part to have the column and the value
            let arrStr = queryResult.replace(idStr+',', "").split(`","`);
            // console.log("Element to map is : ",arrStr);
            
            
            result.id = +idStr.replace(regExp, "").split(`:`)[1];

            for (let i = 0; i < arrStr.length; i++) {
                let elem = arrStr[i].split(`":`); // { "Column name" , "Value"}
              //   console.log("elem : ",elem);
                
                // IMAGE_SOURCE
                if(elem[0].includes(recipeColumnsNames.image)) {
                    result.image_Source =  fileGestion.get_directoryUri() + elem[1].replace(regExp, "");
                }
                // TITLE
                else if(elem[0].includes(recipeColumnsNames.title)) {
                    result.title = elem[1].replace(regExp, "");
                }
                // DESCRIPTION
                else if(elem[0].includes(recipeColumnsNames.description)) {
                    result.description = elem[1].replace(regExp, "");
                }
                // TAGS
                else if(elem[0].includes(recipeColumnsNames.tags)) {
                    try{
                        result.tags = await this.decodeTag(elem[1].replace(regExp, ""));
                    }catch(error: any) {
                        reject(error); 
                    }
                }
                // INGREDIENTS
                else if(elem[0].includes(recipeColumnsNames.ingredients)) {
                    try{
                        [result.ingredients, result.season ] = await this.decodeIngredient(elem[1].replace(regExp, ""));
                    }catch(error: any) {
                        reject(error);
                    }
                }
                // PREPARATION
                else if(elem[0].includes(recipeColumnsNames.preparation)) {
                    result.preparation = elem[1].replace(regExp, "").split(EncodingSeparator);
                }
                // TIME
                else if(elem[0].includes(recipeColumnsNames.time)) {
                    result.time = parseInt(elem[1].replace(regExp, ""));
                }
                else{
                    reject(`NO SUCH COLUMNS FOUND FOR ELEMENT : ${elem}`);
                }
                
            }
            // console.log("Returning from query : ", result);
            resolve(result);
    
        })
    }
    
    protected encodeIngredient (queryIngredient: string, oldIngredientToEncode: string) {
    
        // TODO change type to have the quantity easily for math
        // Retrieve ID directly
        // Ex : {"ID":5,"INGREDIENT":"INGREDIENT NAME","UNIT":"L", "TYPE":"MEET"}
        const arrSplit = queryIngredient.split(',"');
    
        // Retrieve the quantity of this ingredient in input string
        // Ex : "INGREDIENT NAME--5"
        const quantityWithUnit = oldIngredientToEncode.split(textSeparator)[1];
    
        // Mix up previous results to have the encoding value
        return arrSplit[0].split('ID":')[1] + textSeparator + quantityWithUnit;
      }
    
    protected async decodeIngredient (encodedIngredient: string): Promise<[Array<string>, string]>{

    return new Promise(async (resolve, reject) => {
        let arrDecoded = new Array<string>();
        let season = "*";
        let firstSeasonFound = true;
        // Ex : 1--250__2--100__3--0.5__4--200__5--1__6--250 
        const ingSplit = encodedIngredient.split(EncodingSeparator)

        try{
            for (let indexIngredient = 0; indexIngredient < ingSplit.length; indexIngredient++) {
                const id: number = +ingSplit[indexIngredient].split(textSeparator)[0];
                const quantity = ingSplit[indexIngredient].split(textSeparator)[1];

                let tableIngredient = await this._ingredientsTable.searchElementById(id, this._dbConnection);

                // Retrieve directly the name
                // Ex :  {"ID":1,"INGREDIENT":"INGREDIENT NAME","UNIT":"g", "TYPE":"BASE", "SEASON":"*"}
                let splitIngredient = tableIngredient.split(',');
                
                let decodedIngredient = quantity + " " + splitIngredient[2].split(':')[1] + textSeparator + splitIngredient[1].split(':')[1]+ textSeparator + splitIngredient[3].split(':')[1];
                arrDecoded.push(decodedIngredient.replace(regExp, ""));
                
                
                // In case of *, nothing to do
                if(!splitIngredient[4].includes("*")){
                    // For the first element, store directly the value
                    if(firstSeasonFound){
                        season = splitIngredient[4];
                        firstSeasonFound = false;
                    }else{
                        season = this.decodeSeason(season, splitIngredient[4]);
                    }
                }
            }
        }catch(error: any){
            reject(error)
        }
        resolve([arrDecoded, season]);
        
    })
    }
      
    protected decodeSeason(season: string, ingredientSeason: string){
        let result = "";
        
        const arrSeason = season.includes(textSeparator);
        const arrIngSeason = ingredientSeason.includes(textSeparator);

        const splitSeason =  arrSeason ? season.split(textSeparator) : new Array<string>();
        const ingSeason =  arrIngSeason ? ingredientSeason.split(textSeparator) : new Array<string>();
        
                if (arrSeason && arrIngSeason){
                    const filterSeason = splitSeason.filter((month) => {
                        let toKeep = false;
                        for (let i = 0; i < ingSeason.length; i++) {
                            if(ingSeason[i].includes(month)){
                                toKeep = true;
                                break;
                            }
                        }
                        return toKeep;
                    });
                    for (let i = 0; i < filterSeason.length; i++) {
                        if(i != 0){
                            result = result + textSeparator + filterSeason[i];
                        }else{
                            result = filterSeason[0];
                        }
                    }
                }else if (!arrSeason && arrIngSeason){
                    for (let i = 0; i < ingSeason.length; i++) {
                        if(ingSeason[i].includes(season)){
                            result = season;
                            break;
                        }
                    }
                }else if (arrSeason && !arrIngSeason) {
                    const filterSeason = splitSeason.filter((month) => ingredientSeason == month);
                    for (let i = 0; i < filterSeason.length; i++) {
                        if(i != 0){
                            result = result + textSeparator + filterSeason[i];
                        }
                        else{
                            result = filterSeason[0];
                        }
                    }
                }else{
                    if(ingredientSeason == season){
                        result = season;
                    }else{
                        result = "";
                    }
                }
        return result;
    }

    protected encodeTag (tag: string) {
    
      // Retrieve ID directly 
      // Ex : {"ID":5,"NAME":"TAG NAME"}
      return tag.split(`,\"`)[0].split('ID":')[1];
    }

    protected readTagName (tag: string) {
        // Retrieve NAME directly 
      // Ex : {"ID":5,"NAME":"TAG NAME"}
      return tag.split(`,\"`)[1].split('NAME":')[1].replace(regExp, "");
    }

    protected readIngredientName (ingredient: string) {
        // TODO change type to have the quantity easily for math
            // Retrieve INGREDIENT directly
            // Ex : {"ID":5,"INGREDIENT":"INGREDIENT NAME","UNIT":"L"}
            const arrSplit = ingredient.split(',"');
        
            return arrSplit[1].split('INGREDIENT":')[1].replace(regExp, "");
    }
    
    protected async decodeTag (encodedTag: string): Promise<Array<string>> {
    
        return new Promise(async (resolve, reject) => {
            let arrDecoded = new Array<string>();
            // Ex : "1__2__5__3__4"
            const tagSplit = encodedTag.split(EncodingSeparator);

            for (let i = 0; i < tagSplit.length; i++) {
                try{
                    let tableTag = await this._tagsTable.searchElementById(+tagSplit[i], this._dbConnection);
                    // Retrieve directly the name
                    // Ex : {"ID":4,"NAME":"TAG NAME"}
                    arrDecoded.push(tableTag.split(tagsColumnsNames[0].colName + '":"')[1].replace(regExp, ""));
                }catch(error: any){
                    reject(error);
                    
                }
            }
            resolve(arrDecoded);
            
        })
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

    protected async decodeShopping (queryResult: string): Promise<shoppingListTableElement>{

        return new Promise(async (resolve, reject) => {
            let result: shoppingListTableElement = { type: listFilter.purchased, name: "", purchased: true, quantity: 0, recipes: [], unit: ""};

            // ID is not separate in the same way than the others
            const idStr = queryResult.split(`,\"TYPE`)[0];
        
            // Remove ID part from queryResult and split in 2 part to have the column and the value
            let arrStr = queryResult.replace(idStr+',', "").split(`,"`);

            result.id = +idStr.replace(regExp, "").split(`:`)[1];

            for (let i = 0; i < arrStr.length; i++) {
                let elem = arrStr[i].split(`":`); // { "Column name" , "Value"}
                
                // TYPE
                if(elem[0].includes(shoppingListColumnsNames.type)) {
                    
                    result.type = elem[1].replace(regExp, "") as listFilter;
                }
                // INGREDIENTS
                else if(elem[0].includes(shoppingListColumnsNames.ingredient)) {
                    result.name = elem[1].replace(regExp, "");
                }
                // QUANTITY
                else if(elem[0].includes(shoppingListColumnsNames.quantity)) {
                    result.quantity = Number(elem[1].replace(regExp, ""));
                }
                // UNIT
                else if(elem[0].includes(shoppingListColumnsNames.unit)) {
                    result.unit = elem[1].replace(regExp, "");
                }
                // RECIPES TITLES
                else if(elem[0].includes(shoppingListColumnsNames.recipeTitles)) {
                    result.recipes = elem[1].replace(regExp, "").split(EncodingSeparator);
                }
                // PURCHASED
                else if(elem[0].includes(shoppingListColumnsNames.purchased)) {
                    result.purchased = elem[1].replace(regExp, "").toLowerCase() === 'true';
                }
                else{
                    reject(`NO SUCH COLUMNS FOUND FOR ELEMENT : ${elem}`);
                }
                
            }
            console.log("Returning from query : ", result);
            resolve(result);
    
        })
    }

    protected set_shopping(newShopping: Array<shoppingListTableElement>){
        this._shopping = newShopping;
    }

    /* PUBLIC METHODS */

    public async deleteDatabase() {
        try{
            await this._dbConnection.deleteAsync();
        }catch(error: any){
            console.warn('Delete : received error ', error.code, " : ", error.message);
        }
    }

    public async decodeArrayOfRecipe (queryResult: Array<string>): Promise<Array<recipeTableElement>> {
        
        return new Promise(async (resolve, reject) => {
            let recipeTableElement = new Array<recipeTableElement>();
        
            for (let i = 0; i < queryResult.length; i++) {
                try{
                    recipeTableElement.push(await this.decodeRecipe(queryResult[i]))        
                }catch(error: any) {
                    reject(error)
                }
                
            }
            resolve(recipeTableElement);
        })
    }

    public async decodeArrayOfTags(queryResult: Array<string>): Promise<Array<string>> {
        return new Promise(async (resolve, reject) => {
            let tagsArray = new Array<string>();
            
            for (let i = 0; i < queryResult.length; i++) {
                try{
                    tagsArray.push(await this.readTagName(queryResult[i]))        
                }catch(error: any) {
                    reject(error)
                }
            }
            resolve(tagsArray);
        })
    }

    public async decodeArrayOfIngredients(queryResult: Array<string>): Promise<Array<string>> {
        return new Promise(async (resolve, reject) => {
            let ingredientsrray = new Array<string>();
            
            for (let i = 0; i < queryResult.length; i++) {
                try{
                    ingredientsrray.push(await this.readIngredientName(queryResult[i]));        
                }catch(error: any) {
                    reject(error)
                }
            }
            resolve(ingredientsrray);
        })
    }
    
    public async decodeArrayOfShopping (queryResult: Array<string>): Promise<Array<shoppingListTableElement>> {
        
        return new Promise(async (resolve, reject) => {
            let shoppingListTableElement = new Array<shoppingListTableElement>();
        
            for (let i = 0; i < queryResult.length; i++) {
                try{
                    shoppingListTableElement.push(await this.decodeShopping(queryResult[i]))        
                }catch(error: any) {
                    reject(error)
                }
                
            }
            resolve(shoppingListTableElement);
        })
    }

    

    public async init() {
        
        try{
            await this.openDatabase();
    
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
            
            
            await this.addMultipleRecipes(dbTest);
            
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

            
        }catch(error: any){
            console.warn(error);
            
        }
        
      }

      public async addRecipe(rec: recipeTableElement){

        try{
            rec.tags = await this.verifyTagsExist(rec.tags);
            rec.ingredients = await this.verifyIngredientsExist(rec.ingredients);
            
            const recipeConverted = await this.encodeRecipe(rec);
            await this._recipesTable.insertElement(recipeConverted, this._dbConnection);
        }catch(error: any){
            console.warn("ERROR : ", error);
        }
      }

      public async addMultipleRecipes(recs: Array<recipeTableElement>){
        try {
            for (let i = 0; i < recs.length; i++) {
                await this.addRecipe(recs[i]);   
            }
        } catch (error) {
            console.warn(error);
            
        }
    }


    public async addShoppingList(shop: shoppingListTableElement){

        try{
            const shoppingEncoded = await this.encodeShopping(shop);
            await this._shoppingListTable.insertElement(shoppingEncoded, this._dbConnection);
        }catch(error: any){
            console.warn("ERROR : ", error);
        }
      }

    public async addRecipeToShopping(recipe: recipeTableElement){
        let shopElement = new Array<shoppingListTableElement>();
        recipe.ingredients.forEach(ing => {
            // EX : 250 g--Champignons de Paris blanc--Vegetable
            const splitIng = ing.split(textSeparator);
            let quantityDecoded: number;
            let unitDecoded: string;

            if(splitIng[0].includes(" ")){
                quantityDecoded = Number(splitIng[0].split(" ")[0]);
                unitDecoded = splitIng[0].split(" ")[1];
            }else{
                quantityDecoded = Number(splitIng[0]);
                unitDecoded = "";
            }
            shopElement.push({type: splitIng[2] as listFilter, name: splitIng[1], quantity: quantityDecoded, unit: unitDecoded, recipes: [recipe.title], purchased: false})

        });
        
        for (let i = 0; i < shopElement.length; i++) {
            await this.updateShoppingList(shopElement[i]);
        }
    }

      public async updateShoppingList(shop: shoppingListTableElement){

        try{
            const searchMap = new Map<string, string>([[shoppingListColumnsNames.ingredient, shop.name], [shoppingListColumnsNames.unit, shop.unit]]); 
            const elemFoundEncoded = await this._shoppingListTable.searchElement(this._dbConnection, searchMap) as string;
            
            if(elemFoundEncoded === undefined){
                this.add_shopping(shop);
                
                await this.addShoppingList(shop);
            }else{
                let elemSQL = new Map<string, number | string>();
                const elemFoundDecoded = await this.decodeShopping(elemFoundEncoded);
                let elemUpdated = elemFoundDecoded;

                if ((shop.quantity == elemFoundDecoded.quantity) && (shop.recipes == elemFoundDecoded.recipes)){
                    elemUpdated.purchased = shop.purchased;
                    elemSQL.set(shoppingListColumnsNames.purchased, elemUpdated.purchased.toString());
                }else{
                    elemUpdated.quantity= (shop.quantity + elemFoundDecoded.quantity);
                    elemUpdated.recipes = [...elemFoundDecoded.recipes, ...shop.recipes];
    
                    if(elemFoundDecoded.unit == shop.unit){
                        elemSQL.set(shoppingListColumnsNames.quantity, elemUpdated.quantity);
                        elemSQL.set(shoppingListColumnsNames.recipeTitles, elemUpdated.recipes.join(EncodingSeparator));
                    }
                }


                if(elemUpdated.id){
                    this.update_shopping(elemUpdated);
                    await this._shoppingListTable.editElement(elemUpdated.id, elemSQL, this._dbConnection);
                }else{
                    console.error("DECODED SHOPPING LIST DOESN'T HAVE ID !");
                }
            }

        }catch(error: any){
            console.warn("ERROR : ", error);
        }
      }

      public async addMultipleShopping(shops: Array<shoppingListTableElement>){
        try {
            for (let i = 0; i < shops.length; i++) {
                this.add_shopping(shops[i]);
                await this.addShoppingList(shops[i]);   
            }
        } catch (error) {
            console.warn(error);
            
        }
    }

      public async searchRandomlyRecipes(id: number): Promise<Array<recipeTableElement>> {
        return new Promise(async (resolve, reject) => {
            try{
            const res = await this.decodeArrayOfRecipe(await this._recipesTable.searchRandomlyElement(id, this._dbConnection))
            resolve(res);
            }catch(error){
                reject(error)
            }
        })

      }

      public async getAllRecipes(): Promise<Array<recipeTableElement>> {
        return new Promise(async (resolve, reject) => {
            try{
            const res = await this.decodeArrayOfRecipe(await this._recipesTable.searchElement(this._dbConnection) as Array<string>)
            resolve(res);
            }catch(error){
                reject(error);
            }
        })
      }

      public async getAllShopping(): Promise<Array<shoppingListTableElement>> {
        return new Promise(async (resolve, reject) => {
            try{
            const res = await this.decodeArrayOfShopping(await this._shoppingListTable.searchElement(this._dbConnection) as Array<string>)
            resolve(res);
            }catch(error){
                reject(error);
            }
        })
      }

      public async getAllTags(): Promise<Array<string>> {
        return new Promise(async (resolve, reject) => {
            try{
                const res = await this.decodeArrayOfTags(await this._tagsTable.searchElement(this._dbConnection) as Array<string>)
                resolve(res);
            }catch(error){
                reject(error);
            }
        })
      }

      public async getAllIngredients(): Promise<Array<string>> {
        return new Promise(async (resolve, reject) => {
            try{
                const res = await this.decodeArrayOfIngredients(await this._ingredientsTable.searchElement(this._dbConnection) as Array<string>)
                resolve(res);
            }catch(error){
                reject(error);
            }
        })
      }

      public get_shopping(){
        return this._shopping;
      }

      public add_shopping(shop: shoppingListTableElement){
        this._shopping.push(shop);
    }

    public remove_shopping(shop: shoppingListTableElement){
        this._shopping = this._shopping.filter(element => element.name == shop.name);
    }

    public update_shopping(shop: shoppingListTableElement){
        this._shopping.forEach(element => {
            if(element.name == shop.name){
                element = shop;
            }
        });
    }
}


export const recipeDb = new RecipeDatabase();