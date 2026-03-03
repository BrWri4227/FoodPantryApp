// Load .env into process.env (optional; EXPO_PUBLIC_* can also be set in shell)
require('dotenv').config();

module.exports = {
  expo: {
    
    name: 'simplepantry',
    slug: 'simplepantry',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.anonymous.simplepantry',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: ['./plugins/splashscreen-drawable.js'],
    extra: {
      firebase: {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
      },
      spoonacularApiKey: process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY || '',
      eas: {
        projectId: '983f7de2-f74e-414c-bc93-0b1d7cadc403',
      },
    },
  },
};
