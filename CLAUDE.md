# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start Expo dev server
npx expo start

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios

# Run on web
npx expo start --web
```

There is no lint or test configuration — no ESLint, no Jest setup in this project.

## Environment

Requires a `.env` file at the root with:
- `EXPO_PUBLIC_FIREBASE_*` keys for Firestore
- `EXPO_PUBLIC_SPOONACULAR_API_KEY` for recipe search

These are loaded via `dotenv` in `app.config.js` and exposed to the app through `expo-constants` via `appConfig.js`.

## Architecture

**Three-tab app:** Shopping List, Pantry, Recipes — all connected through shared state.

**Navigation (`App.js`):**
- `StackNavigator` wraps `BottomTabNavigator` (Shopping List, Pantry, Recipes)
- Modal/detail screens on the stack: Settings, Presets, About, RecipeContent
- Hamburger menu (top-right header) routes to the modal screens

**State Management:**
- Redux (`redux/pantryStore.js`) manages `groceryItems`, `pantryItems`, `currentPage`, and `loaded`
- No middleware/thunk — all reducers are synchronous
- ThemeContext (`context/ThemeContext.js`) provides light/dark mode
- SaveContext (`context/SaveContext.js`) coordinates the save indicator

**Persistence (dual-layer):**
- `services/persistence.js` — AsyncStorage (local), keys `@simplepantry_grocery` / `@simplepantry_pantry`
- Firestore collections: `shopping`, `pantry` (no auth — open read/write)
- App auto-loads from both on startup; debounced (500ms) save to AsyncStorage on state changes; Firestore sync when app goes to background

**Recipe Feature:**
- `screens/RecipesScreen.js` calls Spoonacular `/recipes/findByIngredients` using pantry items
- Recipe details fetched via `/recipes/{id}/information` and opened as a web URL
- `services/spoonacularCache.js` caches recipe list (5 min TTL) and recipe info (1 hour TTL) in AsyncStorage

**UI:**
- React Native Paper components throughout
- Theme colors defined in `constants/theme.js` (primary green: `#4F7942` light, `#6B9B5A` dark)
- Spacing constants (`xs`, `sm`, `md`, `lg`) also in `constants/theme.js`
- Icons from `@expo/vector-icons` (Ionicons)

**Item shape** (both grocery and pantry):
```js
{ id: string, name: string, quantity: string }
```
IDs are generated in `utils/idGenerator.js` for stability across renders.
