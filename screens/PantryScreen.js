import React from 'react';
import { View, Text } from 'react-native';
import ListHandler from '../components/ListHandler';
import ingredientsArray from '../pantry.json';

const Pantry = () => {
  return (
    
    <ListHandler listType="pantry" />

  );
};

export default Pantry;