# API keys setup

This app uses **Firebase** (Firestore) and **Spoonacular** (recipes). Keys are loaded from environment variables and must not be committed.

## 1. Create a `.env` file

Copy the example file and add your keys:

```bash
cp .env.example .env
```

Edit `.env` and fill in every value (see below for where to get them).

## 2. Firebase

1. Go to [Firebase Console](https://console.firebase.google.com).
2. Select your project (or create one).
3. Open **Project settings** (gear icon) → **Your apps**.
4. If you don’t have a web app, click **Add app** → **Web** (</> icon). Otherwise use the existing web app config.
5. Copy the `firebaseConfig` values into `.env`:

| `.env` variable | Firebase config field |
|-----------------|------------------------|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | `apiKey` |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | `projectId` |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | `appId` |

6. In **Firestore Database** → **Rules**, publish rules that allow read/write for the `pantry` and `shopping` collections (see `firestore.rules` in this repo), or use your own auth-based rules.

## 3. Spoonacular

1. Go to [Spoonacular Food API](https://spoonacular.com/food-api).
2. Sign up or log in and open the [API Console](https://spoonacular.com/food-api/console).
3. Copy your **API Key**.
4. Set in `.env`:

```env
EXPO_PUBLIC_SPOONACULAR_API_KEY=your_key_here
```

Free tier has a daily request limit.

## 4. Run the app

Restart the dev server so it picks up `.env`:

```bash
npx expo start --clear
```

Never commit `.env`; it is listed in `.gitignore`.
