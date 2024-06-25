import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EditItemListing = ({ name, quantity }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.ingredient_name}>{name}</Text>
      <Text style={styles.quantity_text}>Qty:{quantity}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#FFFFFF',
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
