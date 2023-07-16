/**
 * TODO fill this part
 * @format
 */

import React, {useEffect, useState} from 'react';
import {Button, FlatList, Text, TextInput, TouchableOpacity, View, VirtualizedList} from 'react-native';
import {Recipe} from '../utils/DatabaseManipulation'; 
import {selectRecipes} from '../utils/DatabaseManipulation';
import RecipeDetails from './RecipeDetails';

// To consider for performance issues : RecyclerListView, react-native-largelist, react-native-super-grid, react-native-masonry-list


// export default function RecipeList ({ recipes }: RecipeListProps) {
export default function RecipeList () {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('Example recipe');
    const [selectRecipe, setSelectRecipe] = useState<Recipe | null>(null);

    const fetchRecipes = async () => {
        const data = await selectRecipes();
        console.log("Fetch data from SQL");
        setRecipes(data);
    };

    useEffect(() => {
        fetchRecipes();

    }, []);


    useEffect(() => {
        console.log("Change filteredRecipes with query " + searchQuery);
        setFilteredRecipes(
            recipes.filter((recipe) =>
                recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
        console.log("Recipes after filter : ", filteredRecipes);
    }, [recipes, searchQuery]);

    const renderItem = ({item}: {item: Recipe}) => {
        return(
            <TouchableOpacity onPress={() => setSelectRecipe(item)}>
                <Text>{item.title}</Text>
            </TouchableOpacity>
        )
    };

    return (
        <View>
            <Button title="Read from database" onPress={() => fetchRecipes()}/>
            <FlatList
                data={filteredRecipes}
                renderItem={renderItem}
            />
        {selectRecipe ? (
            <View>
                <Text>Creating RecipeDetails with {selectRecipe.title}, {selectRecipe.ingredients}, {selectRecipe.instructions}</Text>
                {/* <RecipeDetails recipe={selectRecipe} onClose={() => setSelectRecipe(null)}/> */}
                <RecipeDetails recipe={selectRecipe} onClose={() => setSelectRecipe(null)}/>
                <Button title="Add to list" onPress={() => addToCalendar()}/>
            </View>
        ):null} 
        </View>
    );

}; 