import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SaveContext } from '../context/SaveContext';
import { ThemeContext } from '../context/ThemeContext';

const HamburgerMenu = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const { saveBothToFirestore, isSaving } = useContext(SaveContext);
  const { colors: themeColors } = useContext(ThemeContext);

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleSaveList = () => {
    saveBothToFirestore();
    setModalVisible(false);
  };

  const handleNavigationPress = (routeName) => {
    setModalVisible(false);
    navigation.navigate(routeName);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Ionicons name="menu" size={24} style={[styles.menuIcon, { color: 'white' }]} />
      </TouchableOpacity>
      {modalVisible && (
        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalContent} onPress={handleClose}>
              {/* Empty View to capture touch outside the buttonContainer */}
            </TouchableOpacity>
            <View style={[styles.buttonContainer, { backgroundColor: themeColors.surface }]}>
              <TouchableOpacity onPress={handleSaveList} disabled={isSaving}>
                <Text style={[styles.menuItem, { color: themeColors.text }]}>{isSaving ? 'Saving...' : 'Save List'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleNavigationPress("Presets")}>
                <Text style={[styles.menuItem, { color: themeColors.text }]}>Load List</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleNavigationPress('Settings')}>
                <Text style={[styles.menuItem, { color: themeColors.text }]}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleNavigationPress('About')}>
                <Text style={[styles.menuItem, { color: themeColors.text }]}>About Us</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  menuIcon: {
    marginHorizontal: 10,
    padding: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  modalContent: {
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingLeft: 20,
    paddingBottom: 16,
    position: 'absolute',
    top: 0,
    right: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    ...(Platform.OS === 'android' ? {} : { borderRadius: 8 }),
  },
  menuItem: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default HamburgerMenu;
