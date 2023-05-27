/**
 * TODO fill this part
 * @format
 */

import React from "react";
import renderer from 'react-test-renderer';
import RecipeDetails from "./RecipeDetails";

// Integration test : example from Jtest with renderer from React. To consider also : Ract Native Testing Library

test('RecipeDetails component render correctly', () => {
    const tree = renderer.create(<RecipeDetails recipe={{title: "Test title", ingredients: "Test Ingredient 1, Test Ingredient 2", instructions: "Test Instruction 1, Test Instruction 2"}}  />).toJSON();
    expect(tree).toMatchSnapshot();
});