/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const {getDefaultConfig} = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];


defaultConfig.resolver.assetExts.push('db');

module.exports = defaultConfig;
