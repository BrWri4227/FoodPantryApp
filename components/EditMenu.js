import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import IngredientInput from './IngredientInput';

const EditMenu = ({ input, setInput, suggestions, setSuggestions, suggestionContainerHeight, setSuggestionContainerHeight, inputFieldHeight, setInputFieldHeight }) => {
  return (
    <View style={styles.editMenuContainer}>
      <Text style={styles.ingredientName}>Ingredient Name:</Text>
      <IngredientInput
        input={input}
        setInput={setInput}
        suggestions={suggestions}
        setSuggestions={setSuggestions}
        suggestionContainerHeight={suggestionContainerHeight}
        setSuggestionContainerHeight={setSuggestionContainerHeight}
        inputFieldHeight={inputFieldHeight}
        setInputFieldHeight={setInputFieldHeight}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  editMenuContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-start',
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  ingredientName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditMenu;
