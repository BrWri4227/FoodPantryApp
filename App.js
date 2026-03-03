import React, { useEffect, useCallback } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PaperProvider } from 'react-native-paper';

import ShoppingList from './screens/ShoppingListScreen';
import Pantry from './screens/PantryScreen';
import Recipes from './screens/RecipesScreen';
import Presets from './screens/PresetScreen';
import Settings from './screens/SettingsScreen';
import About from './screens/AboutScreen';
import HamburgerMenu from './components/HamburgerMenu';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, setCurrentPage, addPantryItem, addGroceryItem, setLoad, setGroceryItems, setPantryItems } from './redux/pantryStore';
import RecipeContent from './components/RecipeContent';
import { getFirestore, collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import app from './firebaseConfig';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';

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

  const groceryCollectionRef = collection(db, 'shopping');
  const pantryCollectionRef = collection(db, 'pantry');

  const uploadGroceryItemsToFirestore = async () => {
    try {
      const batch = writeBatch(db);
      const snapshot = await getDocs(groceryCollectionRef);
      snapshot.docs.forEach((d) => batch.delete(d.ref));
      groceryItems.forEach((item) => {
        batch.set(doc(groceryCollectionRef), item);
      });
      await batch.commit();
    } catch (err) {
      console.error('Failed to upload grocery items:', err);
    }
  };

  const uploadPantryItemsToFirestore = async () => {
    try {
      const batch = writeBatch(db);
      const snapshot = await getDocs(pantryCollectionRef);
      snapshot.docs.forEach((d) => batch.delete(d.ref));
      pantryItems.forEach((item) => {
        batch.set(doc(pantryCollectionRef), item);
      });
      await batch.commit();
    } catch (err) {
      console.error('Failed to upload pantry items:', err);
    }
  };

  useEffect(() => {
    const fetchRecentEntries = async () => {
      if (loaded !== 'false') return;
      try {
        const [pantrySnap, grocerySnap] = await Promise.all([
          getDocs(collection(db, 'pantry')),
          getDocs(collection(db, 'shopping')),
        ]);
        const pantryData = pantrySnap.docs.map((d) => ({ ...d.data(), id: d.data().id ?? d.id }));
        const groceryData = grocerySnap.docs.map((d) => ({ ...d.data(), id: d.data().id ?? d.id }));
        pantryData.forEach((obj) => loadPantryItem(obj));
        groceryData.forEach((obj) => loadGroceryItem(obj));
        dispatch(setLoad('true'));
      } catch (err) {
        console.error('Failed to load data from Firestore:', err);
      }
    };
    fetchRecentEntries();
  }, [dispatch, loaded]); 

  const handleScreenChange = (routeName) => {
    dispatch(setCurrentPage(routeName));
  };

  const { colors: themeColors } = React.useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Shopping List') iconName = focused ? 'list' : 'list-outline';
          else if (route.name === 'Pantry') iconName = focused ? 'archive' : 'archive-outline';
          else if (route.name === 'Recipes') iconName = focused ? 'book' : 'book-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#C5C6D0',
        tabBarStyle: { backgroundColor: themeColors.tabBar },
        tabBarLabelStyle: { fontSize: 12 },
        headerStyle: { backgroundColor: themeColors.tabBar },
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

const StackNavigatorWithTheme = () => {
  const { colors: themeColors } = React.useContext(ThemeContext);
  return (
    <Stack.Navigator
      initialRouteName="StartUp"
      screenOptions={{
        headerStyle: { backgroundColor: themeColors.tabBar },
        headerTintColor: 'white',
      }}
    >
          <Stack.Screen name="StartUp" component={BottomTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Presets" component={Presets} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="About" component={About} />
          <Stack.Screen name="RecipeContent" component={RecipeContent} />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <StatusBarWithTheme />
        <PaperProvider settings={{ icon: PaperIcon }}>
          <NavigationContainer>
            <StackNavigatorWithTheme />
          </NavigationContainer>
        </PaperProvider>
      </ThemeProvider>
    </Provider>
  );
};

const StatusBarWithTheme = () => {
  const { theme } = React.useContext(ThemeContext);
  return (
    <StatusBar
      barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      backgroundColor={theme === 'dark' ? '#121212' : '#f8f8f8'}
    />
  );
};

export default App;
