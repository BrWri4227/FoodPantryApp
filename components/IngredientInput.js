import React, { useRef, useCallback, useContext } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, UIManager, findNodeHandle } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

import ingredientList from './top-1k-ingredients.json';

const DEBOUNCE_MS = 120;
const MAX_SUGGESTIONS = 8;

/** Match query: prefer "starts with", then "word starts with", then "contains". */
function sortByRelevance(list, queryLower) {
  const q = queryLower;
  return [...list].sort((a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    const aStarts = aLower.startsWith(q) ? 0 : 1;
    const bStarts = bLower.startsWith(q) ? 0 : 1;
    if (aStarts !== bStarts) return aStarts - bStarts;
    const aWordStarts = aLower.split(/\s+/).some((w) => w.startsWith(q)) ? 0 : 1;
    const bWordStarts = bLower.split(/\s+/).some((w) => w.startsWith(q)) ? 0 : 1;
    if (aWordStarts !== bWordStarts) return aWordStarts - bWordStarts;
    return aLower.indexOf(q) - bLower.indexOf(q);
  });
}

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
  const { colors: themeColors } = useContext(ThemeContext);
  const inputRef = useRef(null);
  const suggestionsContainerRef = useRef(null);
  const debounceRef = useRef(null);

  const handleInputChange = useCallback((text) => {
    setInput(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const lower = text.trim().toLowerCase();
      if (!lower) {
        setSuggestions([]);
        return;
      }
      const filtered = ingredientList.filter(
        (ingredient) => ingredient.toLowerCase().indexOf(lower) !== -1
      );
      const sorted = sortByRelevance(filtered, lower);
      setSuggestions(sorted.slice(0, MAX_SUGGESTIONS));
      debounceRef.current = null;
    }, DEBOUNCE_MS);
  }, [setInput, setSuggestions]);

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setSuggestions([]); // Clear suggestions
  };

  const measureInput = () => {
    const node = inputRef.current;
    if (node && findNodeHandle(node)) {
      UIManager.measure(findNodeHandle(node), (x, y, width, height) => {
        setInputFieldHeight(height);
      });
    }
  };

  const measureSuggestionsContainer = () => {
    const node = suggestionsContainerRef.current;
    if (node && findNodeHandle(node)) {
      UIManager.measure(findNodeHandle(node), (x, y, width, height) => {
        setSuggestionContainerHeight(height);
      });
    }
  };

  const handleTouchablePress = () => {
    setSuggestions([]); // Clear suggestions on touch outside
  };

  return (
    <TouchableWithoutFeedback onPress={handleTouchablePress}>
      <View style={styles.container}>
        <TextInput
          ref={inputRef}
          style={[styles.input, { borderColor: themeColors.border, color: themeColors.text }]}
          onChangeText={handleInputChange}
          value={input}
          placeholder="Type here..."
          placeholderTextColor={themeColors.textSecondary}
          onLayout={measureInput}
        />
        {suggestions.length > 0 && (
          <View
            ref={suggestionsContainerRef}
            style={[
              styles.suggestionsContainer,
              { top: inputFieldHeight + 10, borderColor: themeColors.border, backgroundColor: themeColors.surface }
            ]}
            onLayout={measureSuggestionsContainer}
          >
            <FlatList
              data={suggestions}
              keyExtractor={(item, index) => `${item}-${index}`}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.suggestionItem, { borderBottomColor: themeColors.border }]}
                  onPress={() => handleSuggestionClick(item)}
                  activeOpacity={0.7}>
                  <Text style={{ color: themeColors.text }}>{item}</Text>
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
    borderRadius: 5,
    maxHeight: 260,
    overflow: 'hidden',
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
});

export default IngredientInput;
