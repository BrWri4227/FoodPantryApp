import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import { ScrollView, TouchableOpacity, ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RecipeListing from '../components/RecipeListing';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { spoonacularApiKey } from '../appConfig';
import { ThemeContext } from '../context/ThemeContext';
import { getCachedRecipeList, setCachedRecipeList } from '../services/spoonacularCache';

const MAX_INGREDIENTS = 12;
const FETCH_DEBOUNCE_MS = 600;

const convertToCSV = (recipeJSON) =>
  recipeJSON.map((item) => item.name.replace(/\s+/g, '+')).join(',');

const Recipes = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { colors: themeColors } = useContext(ThemeContext);
  const pantryItems = useSelector((state) => state.pantryItems);
  const [loading, setLoading] = useState(false);
  const [recipeData, setRecipeData] = useState([]);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);
  const fetchIdRef = useRef(0);

  const fetchRecipes = useCallback(async (items) => {
    if (!items || items.length === 0) return;
    const cached = getCachedRecipeList(items);
    if (cached) {
      setRecipeData(cached);
      setError(null);
      return;
    }
    const id = ++fetchIdRef.current;
    setLoading(true);
    setError(null);
    const limited = items.slice(0, MAX_INGREDIENTS);
    const ingredientCSV = convertToCSV(limited);
    const apiURL = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientCSV}&number=5&ranking=1&apiKey=${spoonacularApiKey}`;
    try {
      const response = await fetch(apiURL);
      if (!response.ok) throw new Error('Could not load recipes');
      const data = await response.json();
      const recipes = Array.isArray(data) ? data : [];
      if (id !== fetchIdRef.current) return;
      setCachedRecipeList(items, recipes);
      setRecipeData(recipes);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      if (id !== fetchIdRef.current) return;
      setError(err.message || 'Something went wrong');
      setRecipeData([]);
    } finally {
      if (id === fetchIdRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (pantryItems.length === 0) {
      setRecipeData([]);
      setError(null);
      setLoading(false);
      return;
    }
    if (!isFocused) return;

    const cached = getCachedRecipeList(pantryItems);
    if (cached) {
      fetchIdRef.current += 1;
      setRecipeData(cached);
      setError(null);
      setLoading(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchRecipes(pantryItems);
      debounceRef.current = null;
    }, FETCH_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [pantryItems, isFocused, fetchRecipes]);

  const handlePress = useCallback(
    (recipe) => {
      navigation.navigate('RecipeContent', { recipeData: recipe });
    },
    [navigation]
  );

  if (pantryItems.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: themeColors.background }]}>
        <Ionicons name="restaurant-outline" size={64} color={themeColors.textSecondary} style={styles.emptyIcon} />
        <Text style={[styles.message, { color: themeColors.textSecondary }]}>Add items to your Pantry to see recipe suggestions.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: themeColors.background }]}>
        <Ionicons name="cloud-offline-outline" size={64} color={themeColors.error} style={styles.emptyIcon} />
        <Text style={[styles.errorText, { color: themeColors.error }]}>{error}</Text>
        <Text style={[styles.hint, { color: themeColors.textSecondary }]}>Check your connection and try again.</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: themeColors.primary }]}
          onPress={() => fetchRecipes(pantryItems)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (recipeData.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.message, { color: themeColors.textSecondary }]}>No recipes found for your current pantry items.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: themeColors.background }}>
      {recipeData.map((recipe) => (
        <TouchableOpacity key={recipe.id} onPress={() => handlePress(recipe)}>
          <RecipeListing recipeData={recipe} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Recipes;
