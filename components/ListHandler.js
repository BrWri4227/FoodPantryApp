import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import IngredientListing from './IngredientListing';

import { useSelector, useDispatch } from 'react-redux';
import { store, addGroceryItem, removeGroceryItem, addPantryItem, removePantryItem, setItemQuantity } from '../redux/pantryStore';
import AddButton from './addButton';

import { Snackbar } from 'react-native-paper';


const ListHandler = ({ listType }) => {
  //redux stuff
  const dispatch = useDispatch();

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const toggleSnackbar = (item) => {
    setSnackbarVisible({visible: true, item});
  };

  const handleUndoPress = (item) => () => {
     
    console.log(item.name)

    let newIndex = generateUniqueIndex([...ingredientArray.map(item => item.id), ...otherList.map(item => item.id)]);

    if(listType == "pantry"){
      dispatch(addPantryItem({ id: newIndex, name: item.name, quantity: item.quantity }));
    }
    else{
      dispatch(addGroceryItem({ id: newIndex, name: item.name, quantity: item.quantity }));
    }

    setSnackbarVisible(false);
  };

  let ingredientArray;
  let otherList;

  if (listType == "pantry") {
    ingredientArray = useSelector(state => state.pantryItems);
    otherList = useSelector(state => state.groceryItems);
  } else {
    ingredientArray = useSelector(state => state.groceryItems);
    otherList = useSelector(state => state.pantryItems);
  }

  const removeFromList = (item) => {

    if(listType == "pantry"){
      dispatch(removePantryItem(item));
    }
    else{
      dispatch(removeGroceryItem(item));
      
    }
  };

  
  const containsItem = (list, name) => {
    return list.some(item => item.name === name);
  }

  const handleQuantityChange = (itemName, newQuantity, currentPage) => {
    dispatch(setItemQuantity(itemName, newQuantity, currentPage));
  };



  const generateUniqueIndex = (existingIndices) => {
    let newIndex = existingIndices.length + 1;
    while (existingIndices.includes(newIndex)) {
      newIndex++; // increment until a unique index is found
    }
    return newIndex;
  };

  const sendToPantry = (item) => { // poor naming, but this function sends an item to the opposite list (groceries <---> pantry)


      
    let newIndex = generateUniqueIndex([...ingredientArray.map(item => item.id), ...otherList.map(item => item.id)]);

      if(listType == "pantry"){

        // if already exists, simply add the quantity
        if(containsItem(otherList, item.name)){

          const matchedItem = otherList.find((listItem) => listItem.name === item.name);
          if (matchedItem) {
            handleQuantityChange(item.name, parseInt(matchedItem.quantity)+1, 'Shopping List');
          }

        }
        else{ // if doesnt exist, add it to the list
          dispatch(addGroceryItem({ id: newIndex, name: item.name, quantity: 1 }));
        }

      }
      else{

        // if already exists, simply add the quantity
        if(containsItem(otherList, item.name)){

          const matchedItem = otherList.find((listItem) => listItem.name === item.name);
          if (matchedItem) {
            handleQuantityChange(item.name, parseInt(matchedItem.quantity)+parseInt(item.quantity), 'Pantry');
          }
          
        }
        else{ // if doesnt exist, add it to the list
          dispatch(addPantryItem({ id: newIndex, name: item.name, quantity: item.quantity }));
        }

        dispatch(removeGroceryItem(item));
      }
    };

  return (
    <View style={styles.container}>
      <FlatList
        data={ingredientArray}
        renderItem={({ item }) => (
          <IngredientListing
            name={item.name}
            quantity={item.quantity}
            onDelete={() => { 
              removeFromList(item)               
              toggleSnackbar(item);}
          }
            sendToPantry={() => {
              sendToPantry(item)}
            }
            list={listType}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.addButtonContainer}>
        <AddButton />
      </View>
      <View style={styles.snackContainer}>
        <Snackbar
          visible={snackbarVisible.visible}
          onDismiss={() => setSnackbarVisible({ ...snackbarVisible, visible: false })}
          action={{ label: 'Undo', onPress: handleUndoPress(snackbarVisible.item), }}>
          {snackbarVisible.item && `${snackbarVisible.item.name} has been deleted.`}
        </Snackbar>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  snackContainer: {
    zIndex: 20,
    width: '100%',

  }
});

export default ListHandler;
