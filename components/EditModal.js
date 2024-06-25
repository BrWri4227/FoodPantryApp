import React, { useState } from 'react';
import { View, Modal, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import EditItemListing from './EditItemListing';

import { useSelector, useDispatch } from 'react-redux';
import { store, setItemQuantity, addGroceryItem, removeGroceryItem, addPantryItem, removePantryItem } from '../redux/pantryStore';

const EditModal = ({ visible, onClose, name, quantity}) => {
  const [number, setNumber] = useState(parseInt(quantity, 10) || 0);

  const currentPage = useSelector(state => state.currentPage);

  const dispatch = useDispatch();

  const handleQuantityChange = (itemName, newQuantity, currentPage) => {
    dispatch(setItemQuantity(itemName, newQuantity, currentPage));
  };

  const handleDecrease = () => {
    setNumber((prevNumber) => Math.max(prevNumber - 1, 0));
  };

  const handleIncrease = () => {
    setNumber((prevNumber) => prevNumber + 1);
  };

  const handleConfirm = () => {
    console.log('Confirm clicked. Details below');
    console.log(name+' '+number);
    console.log('Current page: ' + currentPage);
    handleQuantityChange(name, number, currentPage);


    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.componentContainer}>
          <EditItemListing name={name} quantity={quantity}/>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
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
});

export default EditModal;
