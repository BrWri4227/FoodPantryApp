import React, { useContext } from 'react';
import { View, Text, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';

const RecipeListing = ({ recipeData }) => {
    const recipe = recipeData;
    const { colors: themeColors } = useContext(ThemeContext);

    return (
        <View style={[styles.container, { backgroundColor: themeColors.surface }]}>
            <View>
                <View style={styles.ImageContainer}>
                    <Image style={styles.image} source={{ uri: recipe.image }} />
                    <View style={styles.overlay}></View>
                </View>
            </View>
            <View style={styles.InfoContainer}>
                <View>
                    <Text style={[styles.recipeName, { color: themeColors.text }]}>{recipe.title}</Text>
                </View>
                <View style={styles.detailsContainer}>
                    <View style={styles.detail}>
                        <Ionicons name="heart-outline" size={20} color={themeColors.textSecondary} />
                        <Text style={{ color: themeColors.textSecondary }}> {recipe.likes}</Text>
                    </View>
                    <View style={styles.detail}>
                        <Ionicons name="archive-outline" size={20} color={themeColors.textSecondary} />
                        <Text style={{ color: themeColors.textSecondary }}> {recipe.usedIngredientCount}</Text>
                    </View>
                    <View style={styles.detail}>
                        <Ionicons name="cart-outline" size={20} color={themeColors.textSecondary} />
                        <Text style={{ color: themeColors.textSecondary }}> {recipe.missedIngredientCount}</Text>
                    </View>
                </View>
                
            </View>
            
        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        padding: 0,
        marginBottom: 5,
    },
    recipeName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 60, // Adjust the width as needed
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    InfoContainer: {
        flex: 1,
        padding: 20,
    },
    ImageContainer: {
        marginRight: 10,
        marginLeft: 10,
        marginTop: 25,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 10,
        overflow: 'hidden',
    },
});


export default RecipeListing;