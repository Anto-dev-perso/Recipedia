import {ingredientType, recipeTableElement} from "@customTypes/DatabaseElementTypes";

export const recipesDataset: Array<recipeTableElement> = [
    {
        id: 1,
        image_Source: 'spaghetti.jpg',
        title: 'Spaghetti Bolognese',
        description: 'A classic Italian pasta dish.',
        tags: [{id: 1, tagName: 'Italian'}, {id: 2, tagName: 'Dinner'}],
        persons: 4,
        ingredients: [
            {
                id: 1,
                ingName: 'Spaghetti',
                unit: 'g',
                type: ingredientType.grainOrCereal,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 200
            },
            {
                id: 2,
                ingName: 'Ground Beef',
                unit: 'g',
                type: ingredientType.meat,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 300
            },
            {
                id: 3,
                ingName: 'Tomato Sauce',
                unit: 'ml',
                type: ingredientType.sauce,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 250
            },
            {
                id: 4,
                ingName: 'Parmesan',
                unit: 'g',
                type: ingredientType.cheese,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 50
            },
        ],
        season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        preparation: [
            'Cook the spaghetti according to the package instructions.',
            'In a pan, brown the ground beef.',
            'Add the tomato sauce to the beef and simmer for 10 minutes.',
            'Serve the sauce over the spaghetti and top with grated Parmesan.',
        ],
        time: 33,
    },
    {
        id: 2,
        image_Source: 'tacos.jpg',
        title: 'Chicken Tacos',
        description: 'Mexican-style tacos with chicken.',
        tags: [{id: 3, tagName: 'Mexican'}, {id: 4, tagName: 'Lunch'}],
        persons: 2,
        ingredients: [
            {
                id: 5,
                ingName: 'Taco Shells',
                unit: 'pieces',
                type: ingredientType.grainOrCereal,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 6
            },
            {
                id: 6,
                ingName: 'Chicken Breast',
                unit: 'g',
                type: ingredientType.poultry,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 300
            },
            {
                id: 7,
                ingName: 'Lettuce',
                unit: 'g',
                type: ingredientType.vegetable,
                season: ['5', '6', '7', '8', '9', '10'],
                quantity: 50
            },
            {
                id: 8,
                ingName: 'Cheddar',
                unit: 'g',
                type: ingredientType.cheese,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 50
            },
        ],
        season: ['5', '6', '7', '8', '9', '10'],
        preparation: [
            'Cook the chicken breast and slice it into strips.',
            'Fill each taco shell with chicken, lettuce, and cheddar.',
            'Serve immediately.',
        ],
        time: 20,
    },
    {
        id: 3,
        image_Source: 'pancakes.jpg',
        title: 'Classic Pancakes',
        description: 'Fluffy and golden pancakes.',
        tags: [{id: 5, tagName: 'Breakfast'}, {id: 6, tagName: 'Dessert'}],
        persons: 4,
        ingredients: [
            {
                id: 9,
                ingName: 'Flour',
                unit: 'g',
                type: ingredientType.grainOrCereal,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 200
            },
            {
                id: 10,
                ingName: 'Milk',
                unit: 'ml',
                type: ingredientType.dairy,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 300
            },
            {
                id: 11,
                ingName: 'Eggs',
                unit: 'pieces',
                type: ingredientType.plantProtein,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 2
            },
            {
                id: 12,
                ingName: 'Butter',
                unit: 'g',
                type: ingredientType.oilAndFat,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 50
            },
        ],
        season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        preparation: [
            'Mix the flour, milk, and eggs in a bowl until smooth.',
            'Heat a pan and add butter.',
            'Pour the batter into the pan and cook until golden on each side.',
        ],
        time: 25,
    },
    {
        id: 4,
        image_Source: 'caesar_salad.jpg',
        title: 'Caesar Salad',
        description: 'Crisp lettuce with creamy Caesar dressing.',
        tags: [{id: 14, tagName: 'Salad'}, {id: 7, tagName: 'Healthy'}],
        persons: 2,
        ingredients: [
            {
                id: 13,
                ingName: 'Romaine Lettuce',
                unit: 'g',
                type: ingredientType.vegetable,
                season: ['5', '6', '7', '8', '9', '10'],
                quantity: 100
            },
            {
                id: 14,
                ingName: 'Croutons',
                unit: 'g',
                type: ingredientType.grainOrCereal,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 50
            },
            {
                id: 32,
                ingName: 'Caesar Dressing',
                unit: 'ml',
                type: ingredientType.sauce,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 50
            },
            {
                id: 4,
                ingName: 'Parmesan',
                unit: 'g',
                type: ingredientType.cheese,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 30
            },
        ],
        season: ['5', '6', '7', '8', '9', '10'],
        preparation: [
            'Wash and chop the lettuce.',
            'Mix lettuce with Caesar dressing.',
            'Top with croutons and Parmesan.',
        ],
        time: 15,
    },
    {
        id: 5,
        image_Source: 'pizza.jpg',
        title: 'Margherita Pizza',
        description: 'Classic pizza with tomato and mozzarella.',
        tags: [{id: 1, tagName: 'Italian'}, {id: 4, tagName: 'Lunch'}],
        persons: 2,
        ingredients: [
            {
                id: 33,
                ingName: 'Pizza Dough',
                unit: 'g',
                type: ingredientType.grainOrCereal,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 250
            },
            {
                id: 3,
                ingName: 'Tomato Sauce',
                unit: 'ml',
                type: ingredientType.sauce,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 100
            },
            {
                id: 16,
                ingName: 'Mozzarella',
                unit: 'g',
                type: ingredientType.cheese,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 150
            },
            {
                id: 15,
                ingName: 'Basil Leaves',
                unit: 'g',
                type: ingredientType.spice,
                season: ['5', '6', '7', '8', '9', '10'],
                quantity: 10
            },
        ],
        season: ['5', '6', '7', '8', '9', '10'],
        preparation: [
            'Spread tomato sauce over the pizza dough.',
            'Add mozzarella and basil leaves on top.',
            'Bake in a preheated oven at 220°C for 10 minutes.',
        ],
        time: 20,
    },
    {
        id: 6,
        image_Source: 'vegetable_soup.jpg',
        title: 'Vegetable Soup',
        description: 'A warm and hearty vegetable soup.',
        tags: [{id: 7, tagName: 'Healthy'}, {id: 8, tagName: 'Soup'}],
        persons: 4,
        ingredients: [
            {
                id: 17,
                ingName: 'Carrots',
                unit: 'g',
                type: ingredientType.vegetable,
                season: ['10', '11', '12', '1', '2', '3', '4'],
                quantity: 150
            },
            {
                id: 18,
                ingName: 'Celery',
                unit: 'g',
                type: ingredientType.vegetable,
                season: ['1', '2', '9', '10', '11', '12'],
                quantity: 100
            },
            {
                id: 19,
                ingName: 'Potatoes',
                unit: 'g',
                type: ingredientType.vegetable,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 200
            },
            {
                id: 20,
                ingName: 'Vegetable Broth',
                unit: 'ml',
                type: ingredientType.sauce,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 500
            },
        ],
        season: ['10', '11', '12', '1', '2',],
        preparation: [
            'Chop the vegetables into small pieces.',
            'Simmer the vegetables in vegetable broth until tender.',
            'Serve hot.',
        ],
        time: 40,
    },
    {
        id: 7,
        image_Source: 'chocolate_cake.jpg',
        title: 'Chocolate Cake',
        description: 'Rich and moist chocolate cake.',
        tags: [{id: 6, tagName: 'Dessert'}, {id: 13, tagName: 'Chocolate'}],
        persons: 6,
        ingredients: [
            {
                id: 9,
                ingName: 'Flour',
                unit: 'g',
                type: ingredientType.grainOrCereal,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 200
            },
            {
                id: 21,
                ingName: 'Cocoa Powder',
                unit: 'g',
                type: ingredientType.spice,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 50
            },
            {
                id: 22,
                ingName: 'Sugar',
                unit: 'g',
                type: ingredientType.sugar,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 150
            },
            {
                id: 12,
                ingName: 'Butter',
                unit: 'g',
                type: ingredientType.oilAndFat,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 100
            },
        ],
        season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        preparation: [
            'Mix the flour, cocoa powder, sugar, and butter.',
            'Bake the mixture in a preheated oven at 180°C for 30 minutes.',
        ],
        time: 60,
    },
    {
        id: 8,
        image_Source: 'pesto_pasta.jpg',
        title: 'Pesto Pasta',
        description: 'Pasta tossed with fresh basil pesto.',
        tags: [{id: 1, tagName: 'Italian'}, {id: 9, tagName: 'Quick Meal'}],
        persons: 2,
        ingredients: [
            {
                id: 34,
                ingName: 'Pasta',
                unit: 'g',
                type: ingredientType.grainOrCereal,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 200
            },
            {
                id: 15,
                ingName: 'Basil Leaves',
                unit: 'g',
                type: ingredientType.spice,
                season: ['5', '6', '7', '8', '9', '10'],
                quantity: 50
            },
            {
                id: 4,
                ingName: 'Parmesan',
                unit: 'g',
                type: ingredientType.cheese,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 30
            },
            {
                id: 35,
                ingName: 'Olive Oil',
                unit: 'ml',
                type: ingredientType.oilAndFat,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 50
            },
            {
                id: 23,
                ingName: 'Pine Nuts',
                unit: 'g',
                type: ingredientType.nutsAndSeeds,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 20
            },
        ],
        season: ['5', '6', '7', '8', '9', '10'],
        preparation: [
            'Cook the pasta according to the package instructions.',
            'Blend basil leaves, Parmesan, olive oil, and pine nuts to make pesto.',
            'Toss the pasta with the pesto sauce and serve warm.',
        ],
        time: 20,
    },
    {
        id: 9,
        image_Source: 'sushi_rolls.jpg',
        title: 'Sushi Rolls',
        description: 'Classic sushi rolls with nori, rice, and fillings.',
        tags: [{id: 11, tagName: 'Japanese'}, {id: 10, tagName: 'Seafood'}],
        persons: 4,
        ingredients: [
            {
                id: 24,
                ingName: 'Sushi Rice',
                unit: 'g',
                type: ingredientType.grainOrCereal,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 250
            },
            {
                id: 25,
                ingName: 'Nori Sheets',
                unit: 'pieces',
                type: ingredientType.condiment,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 5
            },
            {
                id: 26,
                ingName: 'Salmon',
                unit: 'g',
                type: ingredientType.fish,
                season: ['5', '6', '7', '8', '9', '10'],
                quantity: 200
            },
            {
                id: 27,
                ingName: 'Avocado',
                unit: 'g',
                type: ingredientType.fruit,
                season: ['5', '6', '7', '8', '9', '10'],
                quantity: 100
            },
            {
                id: 36,
                ingName: 'Soy Sauce',
                unit: 'ml',
                type: ingredientType.condiment,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 50
            },
        ],
        season: ['5', '6', '7', '8', '9', '10'],
        preparation: [
            'Cook the sushi rice and let it cool.',
            'Place a sheet of nori on a bamboo mat and spread rice evenly over it.',
            'Add salmon and avocado as fillings and roll tightly.',
            'Slice the roll into pieces and serve with soy sauce.',
        ],
        time: 45,
    },
    {
        id: 10,
        image_Source: 'lentil_curry.jpg',
        title: 'Lentil Curry',
        description: 'A spicy and flavorful lentil curry.',
        tags: [{id: 15, tagName: 'Indian'}, {id: 12, tagName: 'Vegetarian'}],
        persons: 4,
        ingredients: [
            {
                id: 28,
                ingName: 'Red Lentils',
                unit: 'g',
                type: ingredientType.legumes,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 200
            },
            {
                id: 29,
                ingName: 'Onions',
                unit: 'g',
                type: ingredientType.vegetable,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 100
            },
            {
                id: 37,
                ingName: 'Tomatoes',
                unit: 'g',
                type: ingredientType.vegetable,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 150
            },
            {
                id: 30,
                ingName: 'Coconut Milk',
                unit: 'ml',
                type: ingredientType.sauce,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 200
            },
            {
                id: 31,
                ingName: 'Curry Powder',
                unit: 'g',
                type: ingredientType.spice,
                season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                quantity: 10
            },
        ],
        season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        preparation: [
            'Sauté onions in a pan until golden.',
            'Add tomatoes, red lentils, curry powder, and coconut milk.',
            'Simmer until the lentils are tender and the curry thickens.',
            'Serve with rice or bread.',
        ],
        time: 35,
    },
] as const;
