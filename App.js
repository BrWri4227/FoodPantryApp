import React, { useEffect, useCallback, useRef, useState } from 'react';
import { StatusBar, AppState, ActivityIndicator, View, Text } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ShoppingList from './screens/ShoppingListScreen';
import Pantry from './screens/PantryScreen';
import Recipes from './screens/RecipesScreen';
import Presets from './screens/PresetScreen';
import Settings from './screens/SettingsScreen';
import About from './screens/AboutScreen';
import HamburgerMenu from './components/HamburgerMenu';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, setCurrentPage, setLoad, setGroceryItems, setPantryItems } from './redux/pantryStore';
import RecipeContent from './components/RecipeContent';
import { getFirestore, collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import app from './firebaseConfig';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { SaveContext } from './context/SaveContext';
import { loadFromAsyncStorage, saveToAsyncStorage } from './services/persistence';

const db = getFirestore(app);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ASYNC_SAVE_DEBOUNCE_MS = 500;

const BottomTabNavigator = () => {
  const dispatch = useDispatch();
  const loaded = useSelector((state) => state.loaded);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessVisible, setSaveSuccessVisible] = useState(false);
  const saveTimeoutRef = useRef(null);

  const groceryCollectionRef = collection(db, 'shopping');
  const pantryCollectionRef = collection(db, 'pantry');

  const uploadGroceryItemsToFirestore = useCallback(async () => {
    const items = store.getState().groceryItems;
    try {
      const batch = writeBatch(db);
      const snapshot = await getDocs(groceryCollectionRef);
      snapshot.docs.forEach((d) => batch.delete(d.ref));
      items.forEach((item) => {
        batch.set(doc(groceryCollectionRef), item);
      });
      await batch.commit();
    } catch (err) {
      console.error('Failed to upload grocery items:', err);
    }
  }, []);

  const uploadPantryItemsToFirestore = useCallback(async () => {
    const items = store.getState().pantryItems;
    try {
      const batch = writeBatch(db);
      const snapshot = await getDocs(pantryCollectionRef);
      snapshot.docs.forEach((d) => batch.delete(d.ref));
      items.forEach((item) => {
        batch.set(doc(pantryCollectionRef), item);
      });
      await batch.commit();
    } catch (err) {
      console.error('Failed to upload pantry items:', err);
    }
  }, []);

  const saveBothToFirestore = useCallback(async () => {
    setIsSaving(true);
    try {
      await Promise.all([uploadGroceryItemsToFirestore(), uploadPantryItemsToFirestore()]);
      setSaveSuccessVisible(true);
    } finally {
      setIsSaving(false);
    }
  }, [uploadGroceryItemsToFirestore, uploadPantryItemsToFirestore]);

  useEffect(() => {
    if (loaded !== 'false') return;
    let cancelled = false;

    const loadData = async () => {
      try {
        const { groceryItems: localGrocery, pantryItems: localPantry } = await loadFromAsyncStorage();
        if (cancelled) return;

        dispatch(setGroceryItems(localGrocery));
        dispatch(setPantryItems(localPantry));
        if (!cancelled) dispatch(setLoad('true'));

        const [pantrySnap, grocerySnap] = await Promise.all([
          getDocs(collection(db, 'pantry')),
          getDocs(collection(db, 'shopping')),
        ]);
        if (cancelled) return;

        const pantryData = pantrySnap.docs.map((d) => ({ ...d.data(), id: d.data().id ?? d.id }));
        const groceryData = grocerySnap.docs.map((d) => ({ ...d.data(), id: d.data().id ?? d.id }));

        if (pantryData.length > 0 || groceryData.length > 0) {
          dispatch(setGroceryItems(groceryData));
          dispatch(setPantryItems(pantryData));
        }
      } catch (err) {
        console.error('Failed to load:', err);
        if (!cancelled) dispatch(setLoad('true'));
      }
    };

    loadData();
    return () => { cancelled = true; };
  }, [dispatch, loaded]);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const { groceryItems: g, pantryItems: p } = store.getState();
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveToAsyncStorage(g, p);
        saveTimeoutRef.current = null;
      }, ASYNC_SAVE_DEBOUNCE_MS);
    });
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        saveBothToFirestore();
      }
    });
    return () => sub.remove();
  }, [saveBothToFirestore]); 

  const handleScreenChange = (routeName) => {
    dispatch(setCurrentPage(routeName));
  };

  const { colors: themeColors } = React.useContext(ThemeContext);

  const showLoading = loaded === 'false';

  return (
    <SaveContext.Provider value={{ saveBothToFirestore, isSaving }}>
    <View style={{ flex: 1 }}>
    {showLoading && (
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.background, zIndex: 100 }}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={{ marginTop: 12, color: themeColors.textSecondary }}>Loading...</Text>
      </View>
    )}
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
    <Snackbar
      visible={saveSuccessVisible}
      onDismiss={() => setSaveSuccessVisible(false)}
      duration={2500}
      style={{ backgroundColor: themeColors.primary }}
    >
      Lists saved
    </Snackbar>
    </View>
    </SaveContext.Provider>
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
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusBarWithTheme />
          <PaperProvider settings={{ icon: PaperIcon }}>
            <NavigationContainer>
              <StackNavigatorWithTheme />
            </NavigationContainer>
          </PaperProvider>
        </ThemeProvider>
      </SafeAreaProvider>
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
