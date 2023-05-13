/**
 * TODO fill this part
 * @format
 */

import React, {useEffect, useState} from 'react';
import {Button, FlatList, Text, TextInput, TouchableOpacity, View, VirtualizedList} from 'react-native';
import {Recipe} from './SQLComponent'; 
import {selectRecipes} from './SQLComponent';

// To consider for performance issues : RecyclerListView, react-native-largelist, react-native-super-grid, react-native-masonry-list


// export default function RecipeList ({ recipes }: RecipeListProps) {
export default function RecipeList () {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('Example recipe');

    // const filteredRecipes = recipes.filter((recipe) => recipe.title.toLowerCase().includes(filter.toLowerCase()));

    
    useEffect(() => {
        const fetchRecipes = async () => {
            const data = await selectRecipes();
            console.log("Fetch data from SQL");
            setRecipes(data);
        };
        fetchRecipes();
    }, []);


    useEffect(() => {
        console.log("\n\nChange filteredRecipes with query " + searchQuery);
        setFilteredRecipes(
            recipes.filter((recipe) =>
                recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
                // recipe.title.toLowerCase().includes('e:xAMple recipe'.toLowerCase())
            )
        );
        console.log("Recipes after filter : ", filteredRecipes);
    }, [recipes, searchQuery]);

    const renderItem = ({item}: {item: Recipe}) => {
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>{item.title}</Text>
                <Text>{item.ingredients}</Text>
                <Text>{item.instructions}</Text>
            </View>
        )
    };

    return (
        // <View>
        //     <TextInput placeholder='Filter recipes' value={filter} onChangeText={setFilter} />
        // <FlatList data={filteredRecipes}
        //  renderItem={({item: recipe}) => (
        //         <View>
        //             <Text>{recipe.title}</Text>
        //             <Text>{recipe.ingredients}</Text>
        //             <Text>{recipe.instructions}</Text>
        //         </View>
        // )}/>
        // </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {/* <Button title="Read from database" onPress={() => fetchRecipes()} /> */}
            <FlatList
                data={filteredRecipes}
                // initialNumToRender={4}
                renderItem={renderItem}
            />
        </View>
    );

};