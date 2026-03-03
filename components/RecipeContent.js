import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { addGroceryItem } from '../redux/pantryStore';
import { spoonacularApiKey } from '../appConfig';
import { ThemeContext } from '../context/ThemeContext';
import { generateStableId } from '../utils/id';

const RecipeContent = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors: themeColors } = React.useContext(ThemeContext);
  const recipeData = route.params?.recipeData;
  const [sourceURL, setSourceURL] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (!recipeData?.id) return;
    const apiURL = `https://api.spoonacular.com/recipes/${recipeData.id}/information?apiKey=${spoonacularApiKey}&includeNutrition=false`;
    let cancelled = false;
    const fetchInfo = async () => {
      try {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error('Failed to load recipe');
        const data = await response.json();
        if (!cancelled) {
          setSourceURL(data.sourceUrl || '');
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setFetchError(err.message || 'Could not load instructions');
          setIsLoading(false);
        }
      }
    };
    fetchInfo();
    return () => { cancelled = true; };
  }, [recipeData?.id]);

  const addMissingIngredients = () => {
    if (!recipeData?.missedIngredients?.length) return;
    recipeData.missedIngredients.forEach((ingredient) => {
      dispatch(addGroceryItem({
        id: generateStableId(),
        name: ingredient.name,
        quantity: String(ingredient.amount ?? 1),
      }));
    });
  };

  if (!recipeData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Recipe not found.</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.primary }]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.mainImage} source={{ uri: recipeData.image }} />
        <View style={styles.overlay}></View>
      </View>

      <View style={styles.recipeInfo}>
        <View style={styles.titleContainer}>


          <Text style={styles.recipeTitle}>{recipeData.title}</Text>
        </View>
        <Text style={styles.sectionTitle}>Ingredients:</Text>
        {(recipeData.missedIngredients ?? []).map((ingredient, index) => (
          
          <View key={index} style={styles.ingredientContainer}>
    <Ionicons name="close-circle-outline" size={24} color="red" style={styles.icon} />
    <Text style={styles.ingredient}>
      {ingredient.original}
    </Text>
  </View>
        ))}
        {(recipeData.usedIngredients ?? []).map((ingredient, index) => (
          <View key={index} style={styles.ingredientContainer}>
          <Ionicons name="checkmark-circle-outline" size={24} color="green" style={styles.icon} />
          <Text style={styles.ingredient}>
            {ingredient.original}
          </Text>
        </View>
        ))}

        <TouchableOpacity onPress={() => addMissingIngredients()} style={styles.button}>
          <Text style={styles.buttonText}>Add Missing Ingredients to Shopping List</Text>
        </TouchableOpacity >

        <Text style={styles.sectionTitle}>Instructions:</Text>
        {/* <TouchableOpacity onPress={getRecipeInfo} style={styles.button}>
          <Text style={styles.buttonText}>Get Instructions</Text>
        </TouchableOpacity > */}
        {isLoading ? (
          <ActivityIndicator size="large" color={themeColors.primary} />
        ) : fetchError ? (
          <Text style={[styles.errorText, { color: themeColors.error }]}>{fetchError}</Text>
        ) : sourceURL ? (
          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(sourceURL)}>
            <Text style={styles.buttonText}>View Instructions</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.hint, { color: themeColors.textSecondary }]}>No instructions available</Text>
        )}

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  mainImage: {
    width: '100%',
    height: 200,
    marginBottom: 0,
    borderRadius: 10,
  },
  recipeInfo: {
    marginBottom: 20,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ingredientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  ingredient: {
    marginBottom: 5,
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageContainer: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4F7942',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  hint: {
    fontSize: 14,
  },
});

export default RecipeContent;
