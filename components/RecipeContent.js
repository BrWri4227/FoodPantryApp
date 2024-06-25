import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { addGroceryItem, store } from '../redux/pantryStore';
const RecipeContent = () => {
  const route = useRoute();
  const { recipeData } = route.params;
  // console.log(recipeData);
  // const apiKey = `d0eb5aa1af624179b18615d5122b9d27`
  const apiKey = `a7e807b2f5f845f0874815c6508f2044`
  const apiURL = `https://api.spoonacular.com/recipes/${recipeData.id}/information?apiKey=${apiKey}&includeNutrition=false`;
  const [recipeInfo, setRecipeInfo] = useState({});
  const [sourceURL, setSourceURL] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const getRecipeInfo = async () => {
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      // console.log(data);
      // console.log(data.sourceUrl);
      setRecipeInfo(data);
      setSourceURL(data.sourceUrl);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }
  // const addMissingIngredients = () => {
  const addMissingIngredients = () => {
    recipeData.missedIngredients.forEach(ingredient => {
      // console.log(ingredient.original, ingredient.amount);
      // console.log(ingredientName);
      store.dispatch(addGroceryItem({
        id: Math.random().toString(),
        name: ingredient.name,
        quantity: ingredient.amount,
      }));
    }
    );

  }

  useEffect(() => {
    getRecipeInfo();
  }, []); 
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
        {recipeData.missedIngredients.map((ingredient, index) => (
          
          <View key={index} style={styles.ingredientContainer}>
    <Ionicons name="close-circle-outline" size={24} color="red" style={styles.icon} />
    <Text style={styles.ingredient}>
      {ingredient.original}
    </Text>
  </View>
        ))}
        {recipeData.usedIngredients.map((ingredient, index) => (
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
          <ActivityIndicator size="large" color="#0000ff" />
        ) : sourceURL ? (
          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(sourceURL)}>
            <Text style={styles.buttonText}>View Instructions</Text>
          </TouchableOpacity>
        ) : (
          <Text>No instructions available</Text>
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
});

export default RecipeContent;
