import React, { useState, useContext } from 'react';
import { View, Modal, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert, ToastAndroid, KeyboardAvoidingView } from 'react-native';
import EditMenu from './EditMenu';
import { ThemeContext } from '../context/ThemeContext';

import { useSelector, useDispatch } from 'react-redux';
import { addGroceryItem, addPantryItem } from '../redux/pantryStore';
import { generateStableId } from '../utils/id';


const AddModal = ({ visible = true, onClose }) => {
  const { colors: themeColors } = useContext(ThemeContext);
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
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
      <View style={styles.modalContainer}>
        <View style={[styles.componentContainer, { backgroundColor: themeColors.surface }]}>
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
        <View style={[styles.modalContent, { backgroundColor: themeColors.surface }]}>
          <TouchableOpacity onPress={handleDecrease} style={styles.touchTarget}>
            <View style={[styles.circleButton, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
              <Text style={[styles.minus, { color: themeColors.error }]}>-</Text>
            </View>
          </TouchableOpacity>

          <TextInput
            style={[styles.input, { color: themeColors.text }]}
            value={number.toString()}
            onChangeText={(text) => setNumber(parseInt(text, 10) || 0)}
            keyboardType="numeric"
            placeholderTextColor={themeColors.textSecondary}
          />

          <TouchableOpacity onPress={handleIncrease} style={styles.touchTarget}>
            <View style={[styles.circleButton, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
              <Text style={[styles.plus, { color: themeColors.primary }]}>+</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomButtons}>
          <View style={[styles.cancelButtonContainer, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}> 
            <TouchableOpacity onPress={handleCancel}>
              <Text style={[styles.cancelButton, { color: themeColors.primary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.buttonSeparator}></Text>
          
          <View style={[styles.confirmButtonContainer, { backgroundColor: themeColors.primary }]}> 
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.confirmButton}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};


const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
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
    padding: 20,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    marginHorizontal: 10,
  },
  touchTarget: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minus: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  plus: {
    fontSize: 24,
    fontWeight: 'bold',
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
  },
  componentContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 5,
  },
  confirmButtonContainer: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cancelButtonContainer: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
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
