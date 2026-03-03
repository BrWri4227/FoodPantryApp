/**
 * Runtime config from app.config.js extra (env vars).
 * Used for API keys so they are not hardcoded.
 */
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

export const firebaseConfig = extra.firebase ?? {};
export const spoonacularApiKey = extra.spoonacularApiKey ?? '';
