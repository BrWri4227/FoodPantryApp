import { React, useEffect } from 'react';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PaperProvider } from 'react-native-paper';

/* Bottom Tab Navigation Screens */
import ShoppingList from './screens/ShoppingListScreen';
import Pantry from './screens/PantryScreen';
import Recipes from './screens/RecipesScreen';

/* Dropdown Screens */
import Presets from './screens/PresetScreen';
import Settings from './screens/SettingsScreen';
import About from './screens/AboutScreen';

/* Components */
import HamburgerMenu from './components/HamburgerMenu';

/* redux */
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, setCurrentPage, addPantryItem, addGroceryItem, setLoad } from './redux/pantryStore';
import RecipeContent from './components/RecipeContent';

/* firebase */
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs, deleteDoc } from 'firebase/firestore';
import app from './firebaseConfig';

const db = getFirestore(app);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTabNavigator = () => {
  const dispatch = useDispatch();
  const loaded = useSelector(state => state.loaded); 
  const groceryItems = useSelector(state => state.groceryItems);
  const pantryItems = useSelector(state => state.pantryItems);

  const loadPantryItem = (item) => {
    dispatch(addPantryItem({ id: item.id, name: item.name, quantity: item.quantity }));
  }

  const loadGroceryItem = (item) => {
    dispatch(addGroceryItem({ id: item.id, name: item.name, quantity: item.quantity }));
  }

  const uploadGroceryItemsToFirestore = async () => {
    try {
      const groceryCollectionRef = collection(db, 'shopping');
      const querySnapshot = await getDocs(groceryCollectionRef);
      await Promise.all(querySnapshot.docs.map((doc) => deleteDoc(doc.ref)));
      await Promise.all(
        groceryItems.map((item) => addDoc(groceryCollectionRef, item))
      );
    } catch (err) {
      console.error('Failed to upload grocery items:', err);
    }
  };

  const uploadPantryItemsToFirestore = async () => {
    try {
      const pantryCollectionRef = collection(db, 'pantry');
      const querySnapshot = await getDocs(pantryCollectionRef);
      await Promise.all(querySnapshot.docs.map((doc) => deleteDoc(doc.ref)));
      await Promise.all(
        pantryItems.map((item) => addDoc(pantryCollectionRef, item))
      );
    } catch (err) {
      console.error('Failed to upload pantry items:', err);
    }
  };

  useEffect(() => {
    const fetchRecentEntries = async () => {
      const pantryQuery = query(collection(db, 'pantry'));
      const querySnapshot = await getDocs(pantryQuery);
      const pantryData = [];
      querySnapshot.forEach((doc) => {
        pantryData.push({ id: doc.id, ...doc.data() });
      });

      const groceryQuery = query(collection(db, 'shopping'));
      const querySnapshot2 = await getDocs(groceryQuery);
      const groceryData = [];
      querySnapshot2.forEach((doc) => {
        groceryData.push({ id: doc.id, ...doc.data() });
      });

      if (loaded === 'false') {
        pantryData.forEach((obj) => loadPantryItem(obj));
        groceryData.forEach((obj) => loadGroceryItem(obj));
        dispatch(setLoad('true'));
      }
    };

    fetchRecentEntries();
  }, [dispatch, loaded]); 

  const handleScreenChange = (routeName) => {
    dispatch(setCurrentPage(routeName));
  };

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Shopping List') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Pantry') {
            iconName = focused ? 'archive' : 'archive-outline';
          } else if (route.name === 'Recipes') {
            iconName = focused ? 'book' : 'book-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#C5C6D0',
        tabBarStyle: {
          backgroundColor: '#4F7942',
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: '#4F7942',
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        headerRight: () => <HamburgerMenu navigation={navigation} />,
      })}
    >
      <Tab.Screen
        name="Shopping List"
        component={ShoppingList}
        listeners={({ navigation, route }) => ({
          tabPress: () => uploadPantryItemsToFirestore(),
          focus: () => handleScreenChange(route.name),
        })}
      />
      <Tab.Screen
        name="Pantry"
        component={Pantry}
        listeners={({ navigation, route }) => ({
          tabPress: () => uploadGroceryItemsToFirestore(),
          focus: () => handleScreenChange(route.name),
        })}
      />
      <Tab.Screen
        name="Recipes"
        component={Recipes}
        listeners={({ navigation, route }) => ({
          focus: () => handleScreenChange(route.name),
        })}
      />
    </Tab.Navigator>
  );
};

const PaperIcon = (props) => <MaterialCommunityIcons {...props} />;

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider settings={{ icon: PaperIcon }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartUp"
          screenOptions={{
          headerStyle: {
            backgroundColor: '#4F7942',
          },
          headerTintColor: 'white',
          }}>
          <Stack.Screen name="StartUp" component={BottomTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Presets" component={Presets} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="About" component={About} />
          <Stack.Screen name="RecipeContent" component={RecipeContent} />
        </Stack.Navigator>
      </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;
