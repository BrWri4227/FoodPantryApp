import React from 'react';
import { View, Text, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import { useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const RecipeListing = ({ recipeData }) => {
    const recipe = recipeData;

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.ImageContainer}>
                    <Image style={styles.image} source={{ uri: recipe.image }} />
                    <View style={styles.overlay}></View>
                </View>
            </View>
            <View style={styles.InfoContainer}>
                <View>
                    <Text style={styles.recipeName}>{recipe.title}</Text>
                </View>
                <View style={styles.detailsContainer}>
                    <View style={styles.detail}>
                        <Image style={styles.icon} source={{ uri: 'https://freeiconshop.com/wp-content/uploads/edd/heart-outline.png' }}></Image>
                        
                        <View style={styles.detail}>
                            <Text> {recipe.likes}</Text>
                        </View>
                    </View>
                    <View style={styles.detail}>
                        
                        <Ionicons name='archive' size={20} color='black' />
                        {/* <Image style={styles.icon} source={{ uri: 'https://freeiconshop.com/wp-content/uploads/edd/cart-outline.png' }}></Image> */}

                        <Text> {recipe.usedIngredientCount}</Text>
                    </View>
                    <View style={styles.detail}>
                        {/* <Image style={styles.icon} source={{ uri: 'https://freeiconshop.com/wp-content/uploads/edd/home-var-outline.png' }}></Image> */}
                        <Image style={styles.icon} source={{ uri: 'https://freeiconshop.com/wp-content/uploads/edd/cart-outline.png' }}></Image>
                        <Text> {recipe.missedIngredientCount}</Text>
                    </View >
                </View>
                
            </View>
            
        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: 'white',
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
    icon: {
        width: 20,
        height: 20,
        backgroundColor: 'transparent',
        padding: 5,
        marginRight: 0, // Add margin to properly separate icons
    },
    iconText: {
        marginLeft: 0,
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
    detail: {
        alignItems: 'center',
        color: 'black',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 10,
        overflow: 'hidden',
    },
});


export default RecipeListing;