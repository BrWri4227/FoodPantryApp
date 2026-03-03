import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import IngredientInput from './IngredientInput';
import { ThemeContext } from '../context/ThemeContext';

const EditMenu = ({ input, setInput, suggestions, setSuggestions, suggestionContainerHeight, setSuggestionContainerHeight, inputFieldHeight, setInputFieldHeight }) => {
  const { colors: themeColors } = React.useContext(ThemeContext);
  return (
    <View style={[styles.editMenuContainer, { backgroundColor: themeColors.surface }]}>
      <Text style={[styles.ingredientName, { color: themeColors.text }]}>Ingredient Name:</Text>
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
