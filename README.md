# RecipesManager

[//]: # (TODO to rewrite)

- Open _node_modules/react-native-sqlite-storage/react-native.config.js_
- Remove ios part

## Run

How to run :

- In a terminal, run 'npx react-native start' (--reset-cache in case of trouble) to have Metro to start
- Open another terminal and run 'npx react-native run-android --active-arch-only'
- Go back to metro and select 'run on Android' (with a)

To reload the app, tap 2 times R

## Testing

### CI Pipeline

This project uses GitHub Actions for continuous integration. The CI pipeline runs:
- Unit tests
- E2E tests with Maestro (split into three parts)

For more details on the CI setup, see the [CI Setup Documentation](docs/ci-setup.md).

### Unit and integration testing

To launch unit tests, run 'npx jest'; If you want (and you should) run the test while edtiting code, run 'npx jest
--watch'

### E2E testing

For End-to-End tests, we use Maestro:

1. Install Maestro:
   ```bash
   curl -Ls "https://get.maestro.mobile.dev" | bash
   ```

2. Build and install the app:
   ```bash
   npm run build:android
   npm run install:android
   ```

3. Run the tests:
   ```bash
   npm run test:e2e:android
   ```

For more details on E2E testing, see the [CI Setup Documentation](docs/ci-setup.md).

# Install from scratch

## Node and npm

- _sudo apt install npm_
- _sudo npm cache clean -f_
- _sudo npm install -g n_
- _sudo n stable_

## Java development kit

- _sudo apt-get install openjdk-11-jdk_

## Android development environment

### Android Studio

- Download last version from https://developer.android.com/studio/index.html
- _sudo apt-get install libc6:i386 libncurses5:i386 libstdc++6:i386 lib32z1 libbz2-1.0:i386_
- Unzip the tar of Android Studio in your /usr/local (for you only) or /opt (for all users)
- Go to android-studio/bin and launch _studio.sh_
- Follow the instructions. Make sure to to check following items :
    - Android Sdk
    - Android Sdk Platform
    - Android Virtual Device
- (Optional) It is recommanded to have Android Studio in the list of Applications. To do so, Select __Tools -> Create
  Desktop Entry__

### Sdk

Android Studio install the latest Android Sdk by default. You need _Android 13 (Tiramisu)_ Sdk in particular. You can
install it in Android Studio by doing :

- __Appearance & Behavior → System Settings → Android SDK__
- Select _Sdk Platforms tab_
- Check the box next _Show Package Details_
- Look for and expand _Android 13 (Tiramisu)_
- Make sure the following are checked :
    - _Android Sdk Platform 33_
    - _Intel x86 Atom_64 System Image_ or _Google APIs Intel x86 Atom System Image_
- Select the _SDK Tools Tab_
- Check the box next _Show Package Details_ here too
- Expand _Android SDK Build-Tools_
- Make sure _33.0.0_ is checked

### ANDROID_HOME

Add the following lines to your _$HOME/.bash_profile_ or _$HOME/.bashrc_

```
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## Watchman

- Download and extract the release for your system from the latest
  release: https://github.com/facebook/watchman/releases
- Run the following :

```
$ unzip watchman-*-linux.zip
$ cd watchman-vYYYY.MM.DD.00-linux
$ sudo mkdir -p /usr/local/{bin,lib} /usr/local/var/run/watchman
$ sudo cp bin/* /usr/local/bin
$ sudo cp lib/* /usr/local/lib
$ sudo chmod 755 /usr/local/bin/watchman
$ sudo chmod 2777 /usr/local/var/run/watchman
``` 

## KVM

- _sudo apt-get install cpu-checker_
- _egrep -c '(vmx|svm)' /proc/cpuinfo_
- If result is 0, stop here. You can't use KVM
- _kvm-ok_, check for _KVM acceleration can be used_
- _sudo apt-get install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils_

## Android device

### Virtual device

On Android Studio :

- Open the _Device Manager_
- Click on _Create Device_
- Configure the device you want

### Expo

- npx expo + Commands (run npx expo --help) :
    - start
    - export
    - export:web
    - run:ios
    - run:android:
    - prebuild
    - install
    - customize
    - confir

# Notes

- Developer mode permet de faire du debug ou d'afficher les perfs de l'appli
- RN-Tutorial-Main pour avoir toutes les sources des tutos (github)
- Bien vérifier les props des composants pour les style
- Les StyleSheet ont des méthodes comme compose qui peut fusionner plusieurs styles
- flex et flexDirection permet de placer dynamiquement les composants
- Pour les cards, utiliser ScrollView avec la props horizontal (pb de perfo au refresh) ou une FlatList avec horizontal
  prop
- SectionList peut être intéressant pour la fiche recette

- Alert peut être très utile. Modal intéressant pour la peronnalisation

- Pour utiliser une image des sources, faire source={require('path')}

- Considére des images en fond avec ImageBackground
- React Navigation pour naviguer entre des pages ? Rien de plus moderne ? Tab Navigator ok mais material bottom tab
  navigator a des animations
- react-native-vector-icons conseilée pour des icones
- font awesome utile aussi
- route.params peut permettre de passer des éléments entre les pages

- Pour ajouter des fonts, les mettre dans les dossier fonts et faire npx react-native link. Dans stylesheet, utiliser
  l'argument fontFamily et mettre le nom de la font

- AsyncStorage pour faire passer des données ? A considérer mais peu probable. Sert surtout à conserver des données
  locales (paramètres ?)

- DB browser peut servir à créer et éditer les SQL database. A creuser

- Redux sert à garder des States en global
- jest -u pour mettre à jour les snapshot
- App icon generator pour générer les icones
- Android studios pour les assets
- Nom de l'application android dans android/app/src/main/values/strings.xml + Ne pas oublier de changer le nom affiché
  dans AndroidManifest (FInd & replace car présent plusieurs fois dans le dossier android)
- Prévoir des tests sur tablette
