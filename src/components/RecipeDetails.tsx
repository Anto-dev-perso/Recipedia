

import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Recipe} from '../utils/TableManipulation';

type RecipeDetailsProps = {
    recipe: Recipe;
    onClose: () => void;
  }

export default function RecipeDetails ({recipe, onClose}: RecipeDetailsProps) {
    return(
        <View>
            <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 10}}>{recipe.title}</Text>
            <TouchableOpacity onPress={onClose}>
                <Text>Close</Text>
            </TouchableOpacity>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 10}}>Ingredients:</Text>
            <Text style={{fontSize: 16, marginBottom: 10}}>{recipe.ingredients}</Text>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 10}}>Instructions:</Text>
            <Text style={{fontSize: 16, marginBottom: 10}}>{recipe.instructions}</Text>
        </View>
    )
}