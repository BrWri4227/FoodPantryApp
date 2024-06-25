import React from 'react';
import { View, Text } from 'react-native';
import ListHandler from '../components/ListHandler';
//import groceryArray from '../groceries.json';
import { useSelector } from 'react-redux'; 

const ShoppingList = () => {
  const groceryArray = useSelector(state => state.items);

  return (

    <ListHandler ingredients={"grocery"} />

  );
};

export default ShoppingList;
