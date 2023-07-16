# RecipesManager

## Run
How to run : 
- In a terminal, run 'npx react-native start' (--reset-cache in case of trouble) to have Metro to start
- Open another terminal and run 'npx react-native run-android --active-arch-only'
- Go back to metro and select 'run on Android' (with a)

To reload the app, tap 2 times R

## Testing

### Unit and integration testing
To launch unit tests, run 'npx jest'; If you want (and you should) run the test while edtiting code, run 'npx jest --watch'


### E2E testing
For End-2-End tests : 
- Build using 'detox build --configuration android.emu.debug' for a debug binary of 'detox build --configuration android.emu.release' for a release binary
- For debug only, launch metro with npx react-native start
- Run 'detox test --configuration android.emu.debug' for debug and 'detox test --configuration android.emu.release' for release


# Notes

- Developer mode permet de faire du debug ou d'afficher les perfs de l'appli
- RN-Tutorial-Main pour avoir toutes les sources des tutos (github)
- Bien vérifier les props des composants pour les style
- Les StyleSheet ont des méthodes comme compose qui peut fusionner plusieurs styles
- flex et flexDirection permet de placer dynamiquement les composants
- Pour les cards, utiliser ScrollView avec la props horizontal (pb de perfo au refresh) ou une FlatList avec horizontal prop
- SectionList peut être intéressant pour la fiche recette

- Alert peut être très utile. Modal intéressant pour la peronnalisation

- Pour utiliser une image des sources, faire source={require('path')}

- Considére des images en fond avec ImageBackground 
- React Navigation pour naviguer entre des pages ? Rien de plus moderne ? Tab Navigator ok mais material bottom tab navigator a des animations
- react-native-vector-icons conseilée pour des icones
- font awesome utile aussi
- route.params peut permettre de passer des éléments entre les pages

- Pour ajouter des fonts, les mettre dans les dossier fonts et faire npx react-native link. Dans stylesheet, utiliser l'argument fontFamily et mettre le nom de la font

- AsyncStorage pour faire passer des données ? A considérer mais peu probable. Sert surtout à conserver des données locales (paramètres ?)

- DB browser peut servir à créer et éditer les SQL database. A creuser

- Redux sert à garder des States en global
- jest -u pour mettre à jour les snapshot  
- App icon generator pour générer les icones
- Android studios pour les assets
- Nom de l'application android dans android/app/src/main/values/strings.xml + Ne pas oublier de changer le nom affiché dans AndroidManifest (FInd & replace car présent plusieurs fois dans le dossier android)
- Prévoir des tests sur tablette