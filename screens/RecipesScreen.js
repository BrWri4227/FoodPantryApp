import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import RecipeListing from '../components/RecipeListing';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const Recipes = () => {
    const apiKey = `a7e807b2f5f845f0874815c6508f2044`
    const navigation = useNavigation();
    const pantryItems = useSelector(state => state.pantryItems);
    const [loading, setLoading] = useState(true);
    const [recipeData, setRecipeData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Set loading to true when starting to fetch data
            const ingredientCSV = convertToCSV(pantryItems);
            const apiURL = getAPIURL(ingredientCSV);
            try {
                const response = await fetch(apiURL);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setRecipeData(data);
            } catch (error) {
                console.error('Error fetching API:', error);
            } finally {
                setLoading(false); // Set loading to false when data fetching is done
            }
        };

        fetchData();

    }, [pantryItems]);

    const handlePress = (recipe) => {
        navigation.navigate('RecipeContent', { recipeData: recipe });
    }

    const convertToCSV = (recipeJSON) => {
        return recipeJSON.map(item => item.name.replace(/\s+/g, '+')).join(',');
    };

    const getAPIURL = (ingredientList) => {
        return `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientList}&number=5&ranking=1&apiKey=${apiKey}`;
    }

    return (
        <ScrollView>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                recipeData.map((recipe) => (
                    <TouchableOpacity key={recipe.id} onPress={() => handlePress(recipe)}>
                        <RecipeListing key={recipe.id} recipeData={recipe} />
                    </TouchableOpacity>
                ))
            )}
        </ScrollView>
    );
};

export default Recipes;
