/**
 * In-memory cache for Spoonacular API responses.
 * Reduces API calls to stay within free tier limits (50 points/day).
 */

const RECIPE_LIST_TTL_MS = 5 * 60 * 1000; // 5 minutes
const RECIPE_INFO_TTL_MS = 60 * 60 * 1000; // 1 hour

const recipeListCache = new Map();
const recipeInfoCache = new Map();

/** Stable key from pantry items (sorted names + quantities) */
export function getPantryCacheKey(pantryItems) {
  const parts = pantryItems
    .filter((i) => (i.name || '').trim())
    .map((i) => `${(i.name || '').trim().toLowerCase()}:${String(i.quantity || '1')}`)
    .sort();
  return parts.join('|');
}

/** Get cached recipe list or null if expired/missing */
export function getCachedRecipeList(pantryItems) {
  const key = getPantryCacheKey(pantryItems);
  const entry = recipeListCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > RECIPE_LIST_TTL_MS) {
    recipeListCache.delete(key);
    return null;
  }
  return entry.data;
}

/** Store recipe list in cache */
export function setCachedRecipeList(pantryItems, data) {
  const key = getPantryCacheKey(pantryItems);
  recipeListCache.set(key, { data, timestamp: Date.now() });
}

/** Get cached recipe info or null */
export function getCachedRecipeInfo(recipeId) {
  const entry = recipeInfoCache.get(recipeId);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > RECIPE_INFO_TTL_MS) {
    recipeInfoCache.delete(recipeId);
    return null;
  }
  return entry.data;
}

/** Store recipe info in cache */
export function setCachedRecipeInfo(recipeId, data) {
  recipeInfoCache.set(recipeId, { data, timestamp: Date.now() });
}
