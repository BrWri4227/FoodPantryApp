import React, { useState, useContext } from 'react';
import { View, Modal, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert, ToastAndroid, KeyboardAvoidingView } from 'react-native';
import EditItemListing from './EditItemListing';
import { ThemeContext } from '../context/ThemeContext';

import { useSelector, useDispatch } from 'react-redux';
import { setItemQuantity } from '../redux/pantryStore';

const EditModal = ({ visible = true, onClose, name, quantity }) => {
  const { colors: themeColors } = useContext(ThemeContext);
  const [number, setNumber] = useState(Math.max(parseInt(quantity, 10) || 1, 1));

  const currentPage = useSelector(state => state.currentPage);

  const dispatch = useDispatch();

  const handleQuantityChange = (itemName, newQuantity, currentPage) => {
    dispatch(setItemQuantity(itemName, newQuantity, currentPage));
  };

  const showMessage = (msg) => {
    if (Platform.OS === 'android' && typeof ToastAndroid !== 'undefined') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('', msg);
    }
  };

  const handleDecrease = () => {
    setNumber((prevNumber) => Math.max(prevNumber - 1, 1));
  };

  const handleIncrease = () => {
    setNumber((prevNumber) => prevNumber + 1);
  };

  const handleConfirm = () => {
    if (number < 1) {
      showMessage('Quantity must be 1 or higher');
      return;
    }
    handleQuantityChange(name, number, currentPage);
    onClose();
  };

  const handleCancel = () => {
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
      <View style={styles.modalContainer}>
        <View style={[styles.componentContainer, { backgroundColor: themeColors.surface }]}>
          <EditItemListing name={name} quantity={quantity}/>
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
            onChangeText={(text) => setNumber(Math.max(parseInt(text, 10) || 1, 1))}
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
    justifyContent: 'flex-start',
    alignItems: 'center',
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
});

export default EditModal;
