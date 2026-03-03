  import React, {useRef, useState} from 'react';
  import { View, Text, StyleSheet, TouchableOpacity, Image  } from 'react-native';
  import { RectButton } from 'react-native-gesture-handler';

  import Swipeable from 'react-native-gesture-handler/Swipeable';
  import EditModal from './EditModal';

  import { Ionicons } from '@expo/vector-icons';
  import { useSelector } from 'react-redux';


  const IngredientListing = ({ name, quantity, onDelete, sendToPantry, list }) => {
    const swipeableRef = useRef(null);

    const [isModalVisible, setModalVisible] = useState(false);
    const openModal = () => {
      setModalVisible(true);
    };

    const closeModal = () => {
      setModalVisible(false);
    };

    let leftText;
    let rightText;

    var pantryStock = "";
    

    if (list === 'pantry') {
      const groceryItems = useSelector(state => state.groceryItems);
      const fetchedItem = groceryItems.find(item => item.name.toLowerCase() === name.toLowerCase());
      pantryStock = (fetchedItem?.quantity ?? '0') + ' in shopping list';
    } else {
      const pantryItems = useSelector(state => state.pantryItems);
      const fetchedItem = pantryItems.find(item => item.name.toLowerCase() === name.toLowerCase());
      pantryStock = (fetchedItem?.quantity ?? '0') + ' in pantry';
    }


    if (list === 'pantry') {
      leftText = ' Remove from pantry';
      rightText = 'Add to grocery list';
    } else {
      leftText = ' Remove from list';
      rightText = 'Add to pantry';
    }


    const renderLeftActions = () => {
      return (
        <RectButton style={styles.leftAction} onPress={onDelete}>
          <Text style={styles.actionText}>{leftText}</Text>
        </RectButton>
      );
    };

    const renderRightActions = () => {
      return (
        <RectButton style={styles.rightAction} onPress={sendToPantry}>
          <Text style={styles.actionText}>{rightText}</Text>
        </RectButton>
      );
    };

    const handleRightSwipe = () => {
      sendToPantry();
      swipeableRef.current?.close();
    };

    return (
      <Swipeable
        ref={swipeableRef}
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        onSwipeableLeftOpen={onDelete}
        onSwipeableRightOpen={handleRightSwipe}

      >
        <TouchableOpacity activeOpacity={1} onPress={() => openModal()}>
        {isModalVisible && <EditModal visible={true} onClose={closeModal} name={name} quantity={quantity} />}
        <View style={styles.container}>
          <Text style={styles.ingredient_name}>{name}</Text>
            <View style={styles.qtyContainer}>
              <View>
                <Text style={styles.quantity_text}>Qty:{quantity}</Text>
                <Text style={styles.stock_text}>{pantryStock}</Text>
              </View>
              <Image
            source={require('../assets/swipe.png')}
            style={styles.icon}
          />
          </View>
        </View>
        </TouchableOpacity>
      </Swipeable>
      );
    };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      width: '100%',
      backgroundColor: '#FFFFFF',
      justifyContent: 'space-between',
      padding: 22,
      marginBottom: 5,
      borderRadius: 5,
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
    rightAction: {
      width: '100%',
      backgroundColor: '#4F7942',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingRight: 20,
      borderRadius: 5,
      marginBottom: 5,
    },
    leftAction: {
      width: '100%',
      backgroundColor: '#990F02',
      justifyContent: 'center',
      textAlign: 'left',
      paddingRight: 20,
      borderRadius: 5,
      marginBottom: 5,
    },
    actionText: {
      color: 'white',
      fontWeight: 'bold',
    },
    icon: {
      width: 40,
      height: 40,
    },
    qtyContainer: {
      flexDirection: 'row',
    },
    stock_text: {
      fontSize: 12,
      textAlign: 'right',
    },
  });

  export default IngredientListing;
