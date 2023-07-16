/**
 * TODO fill this part
 * @format
 */

import RecipeRecommandation from "@components/organisms/RecipeRecommandation";
import React from "react";
import { View } from "react-native";
import { cardOfCarouselProps } from "@types/CarouselTypes";


const testArray: Array<cardOfCarouselProps> = [
  {
    title: "Very very very very very looooooooooooooooooooooooooooong text",
    image: 
      {uri: "https://images.unsplash.com/photo-1633205719979-e47958ff6d93?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=387&q=80"},
  },
  {
    title: "Phone",
    image:
      {uri: "https://images.unsplash.com/photo-1535303311164-664fc9ec6532?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=387&q=80"},
  },

  {
    title: "Old building",
    image:
    {uri: "https://images.unsplash.com/photo-1623345805780-8f01f714e65f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=387&q=80"},
  },
  {
    title: "Phone",
    image:
    {uri: "https://images.unsplash.com/photo-1535303311164-664fc9ec6532?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=387&q=80"},
  },
  {
    title: "Coral Reef",
    image:
    {uri: "https://images.unsplash.com/photo-1633205719979-e47958ff6d93?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=387&q=80"},
  },
];

export default function Home ({ navigation }) {
    return (
        <View>
            <RecipeRecommandation carouselProps={testArray} titleRecommandation="Recommandation 1"/>
            <RecipeRecommandation carouselProps={testArray} titleRecommandation="Recommandation 2"/>
            <RecipeRecommandation carouselProps={testArray} titleRecommandation="Recommandation 3"/>
        </View>
    )
}