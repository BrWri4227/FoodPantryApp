import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const EditItemListing = ({ name, quantity }) => {
  const { colors: themeColors } = useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: themeColors.surface }]}>
      <Text style={[styles.ingredient_name, { color: themeColors.text }]}>{name}</Text>
      <Text style={[styles.quantity_text, { color: themeColors.text }]}>Qty:{quantity}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    padding: 30,
    marginBottom: 5,
    borderRadius: 5,
  },
  ingredient_name: {

    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',

  },
  quantity_text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'right', 
  }
});

export default EditItemListing;
