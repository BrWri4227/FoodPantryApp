import React, { useState, useContext } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import IngredientListing from './IngredientListing';
import { useSelector, useDispatch } from 'react-redux';
import { addGroceryItem, removeGroceryItem, addPantryItem, removePantryItem, setItemQuantity } from '../redux/pantryStore';
import AddButton from './addButton';
import { Snackbar } from 'react-native-paper';
import { ThemeContext } from '../context/ThemeContext';
import { generateStableId } from '../utils/id';


const ListHandler = ({ listType }) => {
  //redux stuff
  const dispatch = useDispatch();

  const [snackbarVisible, setSnackbarVisible] = useState({ visible: false, item: null });
  const toggleSnackbar = (item) => {
    setSnackbarVisible({ visible: true, item });
  };

  const handleUndoPress = (item) => () => {
    if (!item) return;
    const id = generateStableId();
    if (listType === 'pantry') {
      dispatch(addPantryItem({ id, name: item.name, quantity: item.quantity }));
    } else {
      dispatch(addGroceryItem({ id, name: item.name, quantity: item.quantity }));
    }
    setSnackbarVisible({ visible: false, item: null });
  };

  let ingredientArray;
  let otherList;

  if (listType === 'pantry') {
    ingredientArray = useSelector(state => state.pantryItems);
    otherList = useSelector(state => state.groceryItems);
  } else {
    ingredientArray = useSelector(state => state.groceryItems);
    otherList = useSelector(state => state.pantryItems);
  }

  const removeFromList = (item) => {

    if (listType === 'pantry') {
      dispatch(removePantryItem(item));
    } else {
      dispatch(removeGroceryItem(item));
    }
  };

  
  const containsItem = (list, name) => {
    return list.some(item => item.name === name);
  }

  const handleQuantityChange = (itemName, newQuantity, currentPage) => {
    dispatch(setItemQuantity(itemName, newQuantity, currentPage));
  };



  const sendToPantry = (item) => {
    const id = generateStableId();
    if (listType === 'pantry') {
      const qty = parseInt(item.quantity, 10) || 1;
      if (containsItem(otherList, item.name)) {
        const matchedItem = otherList.find((listItem) => listItem.name === item.name);
        if (matchedItem) {
          handleQuantityChange(item.name, parseInt(matchedItem.quantity, 10) + qty, 'Shopping List');
        }
      } else {
        dispatch(addGroceryItem({ id, name: item.name, quantity: String(qty) }));
      }
      dispatch(removePantryItem(item));
    } else {
      if (containsItem(otherList, item.name)) {
        const matchedItem = otherList.find((listItem) => listItem.name === item.name);
        if (matchedItem) {
          handleQuantityChange(item.name, parseInt(matchedItem.quantity, 10) + parseInt(item.quantity, 10), 'Pantry');
        }
      } else {
        dispatch(addPantryItem({ id, name: item.name, quantity: item.quantity }));
      }
      dispatch(removeGroceryItem(item));
    }
  };

  const emptyMessage = listType === 'pantry'
    ? 'Your pantry is empty. Tap + to add items.'
    : 'Your shopping list is empty. Tap + to add items.';

  const emptyHint = 'Swipe items left or right for actions';

  const { colors: themeColors } = useContext(ThemeContext);

  const ListEmpty = () => (
    <View style={[styles.emptyContainer, { backgroundColor: themeColors.background }]}>
      <Ionicons name={listType === 'pantry' ? 'archive-outline' : 'cart-outline'} size={64} color={themeColors.textSecondary} style={styles.emptyIcon} />
      <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>{emptyMessage}</Text>
      <Text style={[styles.emptyHint, { color: themeColors.textSecondary }]}>{emptyHint}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <FlatList
        data={ingredientArray}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={ingredientArray.length > 0 ? styles.listContent : undefined}
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
          onDismiss={() => setSnackbarVisible({ visible: false, item: null })}
          action={{ label: 'Undo', onPress: handleUndoPress(snackbarVisible.item) }}
          style={{ backgroundColor: themeColors.surface }}
        >
          {snackbarVisible.item && `${snackbarVisible.item.name} has been deleted.`}
        </Snackbar>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});

export default ListHandler;
