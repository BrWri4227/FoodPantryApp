import React, { useRef, useState, useContext } from 'react';
import { Animated, View, StyleSheet, PanResponder } from 'react-native';
import { FAB } from 'react-native-paper';
import AddModal from './AddModal';
import { ThemeContext } from '../context/ThemeContext';

const AddButton = () => {
  const { colors: themeColors } = useContext(ThemeContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // const pan = useRef(new Animated.ValueXY()).current;

  // const panResponder = useRef(
  //   PanResponder.create({
  //     onMoveShouldSetPanResponder: () => true,
  //     onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
  //       useNativeDriver: false,
  //     }),
  //     onPanResponderRelease: (_, gestureState) => {
  //       pan.extractOffset();
  //       const distance = Math.sqrt(
  //           gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy
  //         );
  
  //         if (distance < 10) {
  //           openModal();
  //           console.log('Click detected');
  //         }
  //     },
  //   }),
  // ).current;

  return (
    <View style={styles.container}>
      {isModalVisible && <AddModal onClose={closeModal} />}
      <Animated.View>
        <FAB
          style={[styles.fab, { backgroundColor: themeColors.primary }]}
          icon="plus"
          color="white"
          onPress={openModal}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 10,
    zIndex: 15,
  },
  fab: {},
});

export default AddButton;
