/**
 * TODO to fill
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';


export { default as YoutubeCamera} from './src/components/YoutubeCamera';
export { default as OCRComponent} from './src/components/OCRComponent';
export { default as RecipeList} from './src/components/RecipeList';
export { default as RecipeDetails} from './src/components/RecipeDetails';
export { default as Calendar} from './src/components/CalendarComponent';

AppRegistry.registerComponent(appName, () => App);
