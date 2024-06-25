import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HamburgerMenu = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleOptionPress = (routeName) => {
    setModalVisible(false);
    /* Put Save List */
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
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => handleOptionPress('SaveList')}>
                <Text style={styles.menuItem}>Save List</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleNavigationPress("Presets")}>
                <Text style={styles.menuItem}>Load List</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleNavigationPress('Settings')}>
                <Text style={styles.menuItem}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleNavigationPress('About')}>
                <Text style={styles.menuItem}>About Us</Text>
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
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingTop: 10,
    marginTop: 40,
    position: 'absolute',
    top: 0,
    right: 0,
    elevation: 5,
  },
  menuItem: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default HamburgerMenu;
