import React, { useState } from 'react';
import { View, Modal, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert, ToastAndroid } from 'react-native';
import EditMenu from './EditMenu';

import { useSelector, useDispatch } from 'react-redux';
import { addGroceryItem, addPantryItem } from '../redux/pantryStore';
import { generateStableId } from '../utils/id';


const AddModal = ({ visible = true, onClose }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionContainerHeight, setSuggestionContainerHeight] = useState(0);
  const [inputFieldHeight, setInputFieldHeight] = useState(0);
  const [number, setNumber] = useState(0);

  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.currentPage);
  const groceryArray = useSelector((state) => state.groceryItems);
  const pantryArray = useSelector((state) => state.pantryItems);

  const resetState = () => {
    setInput('');
    setNumber(0);
    setSuggestions([]);
  };

  const handleDecrease = () => {
    setNumber((prevNumber) => Math.max(prevNumber - 1, 0));
  };

  const handleIncrease = () => {
    setNumber((prevNumber) => prevNumber + 1);
  };

  const handleConfirm = () => {

    /*console.log('Input value:', input);
    console.log('Quantity: '+number);
    console.log('Currently on: '+currentPage);*/


    const newId = generateStableId();
    const whitespaceRegex = /^\s*$/;
    const showMessage = (msg) => {
      if (Platform.OS === 'android' && typeof ToastAndroid !== 'undefined') {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
      } else {
        Alert.alert('', msg);
      }
    };

    if (whitespaceRegex.test(input)) {
      showMessage("Name can't be blank");
      return;
    }
    if (number <= 0) {
      showMessage('Quantity must be 1 or higher');
      return;
    }
    else if (currentPage === 'Shopping List') {
      dispatch(addGroceryItem({ id: newId, name: input.trim(), quantity: String(number) }));
    } else if (currentPage === 'Pantry') {
      dispatch(addPantryItem({ id: newId, name: input.trim(), quantity: String(number) }));
    }
    resetState();
    onClose();
  };

  const handleCancel = () => {
    resetState();
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible !== false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.componentContainer}>
          <EditMenu
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
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={handleDecrease}>
            <View style={styles.circleButton}>
              <Text style={styles.minus}>-</Text>
            </View>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={number.toString()}
            onChangeText={(text) => setNumber(parseInt(text, 10) || 0)}
            keyboardType="numeric"
          />

          <TouchableOpacity onPress={handleIncrease}>
            <View style={styles.circleButton}>
              <Text style={styles.plus}>+</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomButtons}>
          <View style={styles.cancelButtonContainer}> 
            <TouchableOpacity onPress={handleCancel}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.buttonSeparator}></Text>
          
          <View style={styles.confirmButtonContainer}> 
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.confirmButton}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingBottom: 50,
  },
  modalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    marginHorizontal: 10,
  },
  minus: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
  },
  plus: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  confirmButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonSeparator: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginHorizontal: 20,
  },
  cancelButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  componentContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 5,
  },
  confirmButtonContainer: {
    borderRadius: 10,
    backgroundColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cancelButtonContainer: {
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  editContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    padding: 30,
    marginBottom: 5,
    borderRadius: 5,
  },
});

export default AddModal;
