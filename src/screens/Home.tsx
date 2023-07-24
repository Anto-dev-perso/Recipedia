/**
 * TODO fill this part
 * @format
 */

import RecipeRecommandation from "@components/organisms/RecipeRecommandation";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { cardOfCarouselProps, columnsFromTable } from "@customTypes/CarouselTypes";
import { debugRecipeColNames, recipeTableElement, recipeTableName, recipedatabaseName, convertQueryToElementOfTable, convertQueryToArrayOfElementOfTable } from "@customTypes/DatabaseElementTypes";
import DatabaseManipulation from "@utils/DatabaseManipulation";
import { launchImageLibrary } from "react-native-image-picker";
import RNFS from 'react-native-fs';


let RecipeDatabase = new DatabaseManipulation(recipedatabaseName, recipeTableName, debugRecipeColNames);

const dbTest: Array<recipeTableElement> = [
  {
    image_Source: '../assets/images/architecture.jpg',
    title: "Architecture take from far away",
    description: "This is an architecture",
    ingredients: "A photograph",
    preparation: "Go on a good spot and take the picture",
  },
  {
    image_Source: '../assets/images/bike.jpg',
    title: "Bike on a beach",
    description: `For all our 'bobo', here is your partner in crime : a bike. On a beach beacause why not`,
    ingredients: "A beach, a bike",
    preparation: "Go to the beach with your bike. Park it and that's it !",
  },
  {
    image_Source: '../assets/images/cat.jpg',
    title: "Beatiful cat",
    description: "It's a cat you know ...",
    ingredients: "A cat ... obviously",
    preparation: "Harm with patience and wait for him to look at you",
  },
  {
    image_Source: '../assets/images/child.jpg',
    title: "Child wearing a purple coat",
    description: "On a purple room, this child is centered with its own purple coat",
    ingredients: "The room, the child, the coat",
    preparation: "But the coat on the child, place him front to the camera",
  },
  {
    image_Source: '../assets/images/church.jpg',
    title: "Inside the church",
    description: "Coupole inside the church",
    ingredients: "A church, you neck",
    preparation: "Got to the chruch and look up",
  },
  {
    image_Source: '../assets/images/coffee.jpg',
    title: "Wanna take a coffee break ?",
    description: "Set of coffee with everything you can possibly need",
    ingredients: "Cup of coffee",
    preparation: "Nothing",
  },
  {
    image_Source: '../assets/images/crimson.jpg',
    title: "Is this King Crimson ?",
    description: "Little bird call Crimson on its branch",
    ingredients: "A very good objective",
    preparation: "Wait for it and good luck",
  },
  {
    image_Source: '../assets/images/dog.jpg',
    title: "Cute dog",
    description: "Look a him, he is sooooooo cute",
    ingredients: "Dog",
    preparation: "Put the dog inside a flower garden",
  },
  {
    image_Source: '../assets/images/monastery.jpg',
    title: "Monastery",
    description: "Picture of a monastery during a sunset",
    ingredients: "Monastery, sunset",
    preparation: "When time is ok, take this masterpiece",
  },
  {
    image_Source: '../assets/images/motocross.jpg',
    title: "Biker during a drift",
    description: "Fabulous drift",
    ingredients: "A good biker",
    preparation: "During a hard virage, take this while a drift in ongoing",
  },
  {
    image_Source: '../assets/images/mushrooms.jpg',
    title: "Brown mushrooms",
    description: "Mushrooms that's grows to much",
    ingredients: "This kind of mushromms all packed togethers",
    preparation: "If you find it while randonning, don't wait !",
  },
  {
    image_Source: '../assets/images/scooter.jpg',
    title: "Parisians riding",
    description: "Look a those parisians with theirs scooters. What is this seriously",
    ingredients: "Parisians, Scooters",
    preparation: "It should be easy to find them in Paris.\nBe prepared to be insulted",
  },
  {
    image_Source: '../assets/images/strawberries.jpg',
    title: "Strawberries verrine",
    description: "Beautiful and appetizing strawberries verrine",
    ingredients: "Strawberries",
    preparation: "Cook the verrrine",
  },
  {
    image_Source: '../assets/images/tree.jpg',
    title: "Tree in the snow",
    description: "In a snow valley, those trees are rising",
    ingredients: "Trees, Snow",
    preparation: "Find this valley, look hard for thos trees",
  },
  {
    image_Source: '../assets/images/waves.jpg',
    title: "Waves on the rock",
    description: "Riple waves arriving to the rocks",
    ingredients: "Rocks, Waves",
    preparation: "On a rainy day, go to these rocks",
  },

]

export default function Home ({ navigation }) {

  const [elementsForCarousel, setElementsForCarousel] = useState<cardOfCarouselProps[]>([]);

  const initializeTables = async () => {
    await RecipeDatabase.openDatabase();
    await RecipeDatabase.deleteTable();
    await RecipeDatabase.createTable();
    await RecipeDatabase.insertElement(dbTest);

    let res1 = convertQueryToElementOfTable(await RecipeDatabase.searchElementById(5));
    
    console.warn("Search element give ", res1, ". Take the title for exemple : ", res1.title);
    
    let searchTest = new Map<string, string> ();
    searchTest.set(debugRecipeColNames[0].name, dbTest[0].image_Source);

    let tmpStr = await RecipeDatabase.searchElement(searchTest);
    if(Array.isArray(tmpStr)) {
      // forEach etc
      console.warn("Multiple items")
    }else{
      let res2 = convertQueryToElementOfTable(tmpStr);
      console.warn("Search element give ", res2, ". Take the title for exemple : ", res2.title);
    }
    
  }
  
  const randomlySearchElements = async () => {
    
    const _image = await launchImageLibrary({ mediaType: 'mixed'},     async (response) => {
      console.log('Response = ', response.assets);

      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      console.log('base64 -> ', response.assets[0].base64);
      console.log('uri -> ', response.assets[0].uri);
      console.log('width -> ', response.assets[0].width);
      console.log('height -> ', response.assets[0].height);
      console.log('fileSize -> ', response.assets[0].fileSize);
      console.log('type -> ', response.assets[0].type);
      console.log('fileName -> ', response.assets[0].fileName);
  });
  
  console.log('uri -> ', _image.assets[0].uri);


  //   let image2: string;
//   const dir = RNFS.PicturesDirectoryPath;
//   const dirContent = await RNFS.readDir(dir)
//   console.log("DEBUG : dir =  ", dir, " and read = ", dirContent);
// const image = dirContent.find((file) => file.name === 'child.jpg');
// console.log("Image : ", image);


  // let img = '/storage/emulated/0/Pictures/child.jpg';
  // RNFS.exists(img)
  // .then((exists) => {
  //   if (exists) {
  //     console.log("Find image");
      
  //   } else {
  //     console.log("L'image n'existe pas.");
  //   }
  // })
  // .catch((error) => {
  //   console.log('Erreur lors de la vérification de l\'existence de l\'image:', error);
  // });

    let elementsReturned = await convertQueryToArrayOfElementOfTable(await RecipeDatabase.searchRandomlyElement(10, columnsFromTable));

    let newRand: Array<cardOfCarouselProps> = elementsReturned.map((el) => ({
      title: el.title,
      image: {uri: ''},
      // image: el.image_Source,
    }));
    newRand.forEach(element => {
      element.image = {uri: _image.assets[0].uri};
      // element.image = {uri: `file://${img}`};
    });

    await setElementsForCarousel(newRand);
    // console.log("For carousel : ", newRand);
  
  }
  
  useEffect(() => {
    initializeTables().then(() => {
      randomlySearchElements();
    }

    )
  }, [])

    return (
        <View>
          {(elementsForCarousel.length > 0) ? 
            <View>
              <RecipeRecommandation carouselProps={elementsForCarousel} titleRecommandation="Recommandation 1"/>
              {/* <RecipeRecommandation carouselProps={elementsForCarousel} titleRecommandation="Recommandation 2"/> */}
              {/* <RecipeRecommandation carouselProps={elementsForCarousel} titleRecommandation="Recommandation 3"/> */}
            </View>
          : null}
        </View>
    )
}