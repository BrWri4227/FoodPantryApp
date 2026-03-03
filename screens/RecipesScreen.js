import React, { useEffect, useState, useCallback, useContext } from 'react';
import { ScrollView, TouchableOpacity, ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import RecipeListing from '../components/RecipeListing';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { spoonacularApiKey } from '../appConfig';
import { ThemeContext } from '../context/ThemeContext';

const convertToCSV = (recipeJSON) =>
  recipeJSON.map((item) => item.name.replace(/\s+/g, '+')).join(',');

const Recipes = () => {
  const navigation = useNavigation();
  const { colors: themeColors } = useContext(ThemeContext);
  const pantryItems = useSelector((state) => state.pantryItems);
  const [loading, setLoading] = useState(false);
  const [recipeData, setRecipeData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pantryItems.length === 0) {
      setRecipeData([]);
      setError(null);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const ingredientCSV = convertToCSV(pantryItems);
      const apiURL = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientCSV}&number=5&ranking=1&apiKey=${spoonacularApiKey}`;
      try {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error('Could not load recipes');
        const data = await response.json();
        setRecipeData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError(err.message || 'Something went wrong');
        setRecipeData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pantryItems]);

  const handlePress = useCallback(
    (recipe) => {
      navigation.navigate('RecipeContent', { recipeData: recipe });
    },
    [navigation]
  );

  if (pantryItems.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: themeColors.background }]}>
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
        <Text style={[styles.errorText, { color: themeColors.error }]}>{error}</Text>
        <Text style={[styles.hint, { color: themeColors.textSecondary }]}>Check your connection and try again.</Text>
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
    <ScrollView>
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
  },
});

export default Recipes;
