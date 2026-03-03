/**
 * Local persistence for pantry and grocery lists.
 * Ensures data survives app restarts even when offline.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const GROCERY_KEY = '@simplepantry_grocery';
const PANTRY_KEY = '@simplepantry_pantry';

export async function loadFromAsyncStorage() {
  try {
    const [groceryJson, pantryJson] = await Promise.all([
      AsyncStorage.getItem(GROCERY_KEY),
      AsyncStorage.getItem(PANTRY_KEY),
    ]);
    const groceryItems = groceryJson ? JSON.parse(groceryJson) : [];
    const pantryItems = pantryJson ? JSON.parse(pantryJson) : [];
    return { groceryItems, pantryItems };
  } catch (err) {
    console.error('Failed to load from AsyncStorage:', err);
    return { groceryItems: [], pantryItems: [] };
  }
}

export async function saveToAsyncStorage(groceryItems, pantryItems) {
  try {
    await Promise.all([
      AsyncStorage.setItem(GROCERY_KEY, JSON.stringify(groceryItems)),
      AsyncStorage.setItem(PANTRY_KEY, JSON.stringify(pantryItems)),
    ]);
  } catch (err) {
    console.error('Failed to save to AsyncStorage:', err);
  }
}
