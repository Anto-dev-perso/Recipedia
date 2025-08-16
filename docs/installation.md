# Installation Guide

This guide will help you set up the Recipedia development environment and get the app running on your local machine.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Development Environment Setup](#development-environment-setup)
- [Project Installation](#project-installation)
- [Platform-Specific Setup](#platform-specific-setup)
- [Running the App](#running-the-app)
- [Troubleshooting](#troubleshooting)
- [Development Tools](#development-tools)

## ✅ Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

- **Node.js** (v18.0.0 or higher)
    - Download from [nodejs.org](https://nodejs.org/)
    - Verify installation: `node --version`

- **npm** (comes with Node.js) or **Yarn**
    - Verify npm: `npm --version`
    - Or install Yarn: `npm install -g yarn`

- **Git**
    - Download from [git-scm.com](https://git-scm.com/)
    - Verify installation: `git --version`

- **Expo CLI**
  ```bash
  npm install -g @expo/cli
  ```

### System Requirements

| Platform    | Minimum          | Recommended      |
|-------------|------------------|------------------|
| **macOS**   | 10.15 (Catalina) | 12.0+ (Monterey) |
| **Windows** | Windows 10       | Windows 11       |
| **Linux**   | Ubuntu 18.04+    | Ubuntu 20.04+    |
| **RAM**     | 8GB              | 16GB+            |
| **Storage** | 10GB free        | 20GB+ free       |

## 🔧 Development Environment Setup

### Android Development

#### 1. Install Android Studio

1. Download [Android Studio](https://developer.android.com/studio)
2. Run the installer and follow the setup wizard
3. Install the following components:
    - Android SDK
    - Android SDK Platform-Tools
    - Android Virtual Device (AVD)

#### 2. Configure Android SDK

1. Open Android Studio
2. Go to **SDK Manager** (Settings → Appearance & Behavior → System Settings → Android SDK)
3. Install the following:
    - **SDK Platforms**: Android 13 (API Level 33) or higher
    - **SDK Tools**:
        - Android SDK Build-Tools
        - Android Emulator
        - Android SDK Platform-Tools

#### 3. Set Environment Variables

Add these to your shell profile (`~/.bash_profile`, `~/.zshrc`, etc.):

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
# export ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk  # Windows
# export ANDROID_HOME=$HOME/Android/Sdk  # Linux

export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Reload your shell: `source ~/.zshrc` (or restart terminal)

#### 4. Create an Android Virtual Device (AVD)

1. Open Android Studio
2. Go to **AVD Manager** (Tools → AVD Manager)
3. Click **Create Virtual Device**
4. Choose a device (recommend Pixel 6)
5. Select system image (API 33 or higher)
6. Configure AVD settings and finish

### iOS Development (macOS only)

#### 1. Install Xcode

1. Download Xcode from the Mac App Store
2. Launch Xcode and accept the license agreement
3. Install additional components when prompted

#### 2. Install Command Line Tools

```bash
xcode-select --install
```

#### 3. Install CocoaPods

```bash
sudo gem install cocoapods
```

#### 4. iOS Simulator Setup

iOS Simulator is included with Xcode. You can manage simulators through:

- Xcode → Window → Devices and Simulators
- Or through command line: `xcrun simctl list devices`

## 📱 Project Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Anto-dev-perso/Recipedia.git
cd Recipedia
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Using Yarn:

```bash
yarn install
```

### 3. Verify Installation

Check that all dependencies are installed correctly:

```bash
npm ls
# or
yarn list
```

## 🚀 Platform-Specific Setup

### Android Setup

#### 1. Start Android Emulator

Option A - Through Android Studio:

1. Open Android Studio
2. Click **AVD Manager**
3. Click **Play** button next to your AVD

Option B - Command Line:

```bash
emulator -avd YOUR_AVD_NAME
```

#### 2. Verify ADB Connection

```bash
adb devices
```

You should see your emulator listed.

### iOS Setup (macOS only)

#### 1. Install iOS Dependencies

```bash
cd ios && pod install && cd ..
```

#### 2. Start iOS Simulator

```bash
open -a Simulator
```

Or through Xcode:

1. Open Xcode
2. Window → Devices and Simulators
3. Select simulator and click **Start**

## 🏃‍♂️ Running the App

### Start Development Server

```bash
npm start
# or
expo start
```

This will start the Expo development server and open a web browser with the Expo DevTools.

### Run on Android

Option A - Through Expo DevTools:

1. Click **Run on Android device/emulator** in the web interface

Option B - Command Line:

```bash
npm run android
# or
expo run:android
```

### Run on iOS

Option A - Through Expo DevTools:

1. Click **Run on iOS simulator** in the web interface

Option B - Command Line:

```bash
npm run ios
# or
expo run:ios
```

### Development Builds

For testing features that require device capabilities:

#### Android Development Build

```bash
npm run build:android
npm run install:android
```

#### iOS Development Build

```bash
npm run build:ios
```

## 🔍 Troubleshooting

### Common Issues

#### Metro Bundle Issues

```bash
# Clear Metro cache
npx expo start --clear

# Clear npm cache
npm start -- --reset-cache
```

#### Android Emulator Issues

**Emulator won't start:**

- Check available disk space (need 2GB+)
- Increase emulator RAM in AVD settings
- Enable hardware acceleration in BIOS

**App won't install:**

```bash
# Check ADB connection
adb devices

# Restart ADB server
adb kill-server
adb start-server

# Reinstall app
adb uninstall com.Recipedia
```

#### iOS Simulator Issues

**Simulator not found:**

```bash
# List available simulators
xcrun simctl list devices

# Reset simulator
xcrun simctl erase all
```

**Build errors:**

```bash
# Clean iOS build
cd ios && xcodebuild clean && cd ..

# Reinstall pods
cd ios && pod install && cd ..
```

#### Node.js Issues

**Version conflicts:**

```bash
# Check Node version
node --version

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Permission Issues (Linux/macOS)

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Fix Android SDK permissions
sudo chown -R $(whoami) $ANDROID_HOME
```

### Performance Issues

#### Slow Metro bundling:

- Close unnecessary applications
- Increase Node.js heap size: `export NODE_OPTIONS="--max-old-space-size=8192"`
- Use development build instead of Expo Go

#### Slow emulator:

- Allocate more RAM to emulator
- Enable hardware acceleration
- Use x86_64 system images
- Close other virtual machines

### Platform-Specific Troubleshooting

#### Windows-Specific

**PowerShell execution policy:**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Long path support:**

- Enable long path support in Windows settings
- Use shorter directory names

#### Linux-Specific

**Missing dependencies:**

```bash
# Ubuntu/Debian
sudo apt-get install android-tools-adb android-tools-fastboot

# Install Java 11
sudo apt-get install openjdk-11-jdk
```

**Watchman issues:**

```bash
# Install Watchman
sudo apt-get install watchman

# Or build from source
git clone https://github.com/facebook/watchman.git
cd watchman
./autogen.sh
./configure
make
sudo make install
```

## 📚 Next Steps

After successful installation:

1. **Read the [User Guide](user-guide.md)** to understand app features
2. **Check [Contributing Guidelines](../CONTRIBUTING.md)** for development workflow
3. **Review [Component Documentation](components.md)** for UI development
4. **Explore [API Documentation](api.md)** for backend integration

## 💡 Tips for Better Development Experience

### Performance Optimization

- Use development builds for testing device features
- Enable Fast Refresh for instant updates
- Use Metro cache for faster rebuilds

### Workflow Optimization

- Use Expo DevTools for easy device switching
- Set up multiple simulator/emulator configurations
- Use VS Code workspaces for project organization

## 📞 Getting Help

If you encounter issues not covered in this guide:

1. Check [GitHub Issues](https://github.com/Anto-dev-perso/Recipedia/issues)
2. Search [Stack Overflow](https://stackoverflow.com) with relevant tags
3. Join the [Expo Discord](https://discord.gg/4gtbPAdpaE)
4. Check [React Native Community](https://reactnative.dev/help)

## ✅ Installation Checklist

- [ ] Node.js 18+ installed
- [ ] Git installed and configured
- [ ] Expo CLI installed globally
- [ ] Android Studio installed (for Android development)
- [ ] Xcode installed (for iOS development, macOS only)
- [ ] Project cloned and dependencies installed
- [ ] Environment variables configured
- [ ] Emulator/Simulator set up and working
- [ ] App successfully runs on target platform
- [ ] Development tools configured

Congratulations! You're now ready to develop with Recipedia. 🎉
