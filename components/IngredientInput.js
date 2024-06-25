import React from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, UIManager, findNodeHandle } from 'react-native';

import ingredientList from './top-1k-ingredients.json';

const IngredientInput = ({
  input,
  setInput,
  suggestions,
  setSuggestions,
  suggestionContainerHeight,
  setSuggestionContainerHeight,
  inputFieldHeight,
  setInputFieldHeight
}) => {

  const handleInputChange = (text) => {
    setInput(text);

    // Filter suggestions based on input value
    const filteredSuggestions = ingredientList.filter(
      (ingredient) =>
        ingredient.toLowerCase().indexOf(text.toLowerCase()) !== -1
    );
    setSuggestions(filteredSuggestions.slice(0, 3));
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setSuggestions([]); // Clear suggestions
  };

  const measureInput = () => {
    UIManager.measure(findNodeHandle(inputField), (x, y, width, height) => {
      setInputFieldHeight(height);
    });
  };

  const measureSuggestionsContainer = () => {
    UIManager.measure(findNodeHandle(suggestionsContainer), (x, y, width, height) => {
      setSuggestionContainerHeight(height);
    });
  };

  const handleTouchablePress = () => {
    setSuggestions([]); // Clear suggestions on touch outside
  };

  return (
    <TouchableWithoutFeedback onPress={handleTouchablePress}>
      <View style={styles.container}>
        <TextInput
          ref={(input) => { inputField = input; }}
          style={styles.input}
          onChangeText={handleInputChange}
          value={input}
          placeholder="Type here..."
          onLayout={measureInput}
        />
        {suggestions.length > 0 && (
          <View
            ref={(container) => { suggestionsContainer = container; }}
            style={[
              styles.suggestionsContainer,
              { top: inputFieldHeight + 10 } // Add some space between input and suggestions
            ]}
            onLayout={measureSuggestionsContainer}
          >
            {/* Display suggestions as a dropdown */}
            <FlatList
              data={suggestions}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionClick(item)}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    position: 'relative',
    width: 200,
    height: 60,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  suggestionsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: 'white',
    maxHeight: 170,
    overflow: 'hidden',
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
});

export default IngredientInput;
