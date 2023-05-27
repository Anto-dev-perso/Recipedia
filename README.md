# RecipesManager

## Run
How to run : 
- In a terminal, run 'npx react-native start' to have Metro to start
- Open another terminal and run 'npx react-native run-android'
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
