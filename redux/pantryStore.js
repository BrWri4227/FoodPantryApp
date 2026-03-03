import { createStore } from 'redux';
//import groceryArray from '../groceries.json';

const initialState = {
  currentPage: 'Shopping List',
  loaded: 'false',
  groceryItems: [

  ],
  pantryItems: [

  ]
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload,
      };
    case 'ADD_GROCERY_ITEM':
      return {
        ...state,
        groceryItems: [...state.groceryItems, action.payload],
      };
    case 'REMOVE_GROCERY_ITEM':
      return {
        ...state,
        groceryItems: state.groceryItems.filter(item => item.id !== action.payload),
      };
    case 'ADD_PANTRY_ITEM':
      return {
        ...state,
        pantryItems: [...state.pantryItems, action.payload],
      };
    case 'REMOVE_PANTRY_ITEM':
      return {
        ...state,
        pantryItems: state.pantryItems.filter(item => item.id !== action.payload),
      };
      case 'INCREMENT_ITEM_QUANTITY':
        const { item, addedQuantity, itemType } = action.payload;
        const itemsKey = itemType === 'grocery' ? 'groceryItems' : 'pantryItems';
        const targetId = item.id;
        return {
          ...state,
          [itemsKey]: state[itemsKey].map(it =>
            it.id === targetId
              ? { ...it, quantity: String(parseInt(it.quantity, 10) + addedQuantity) }
              : it
          ),
        };
        case 'SET_ITEM_QUANTITY':
          const { itemName, newQuantity, currentPage } = action.payload;
          const itemsKey2 = currentPage === 'Shopping List' ? 'groceryItems' : 'pantryItems';
        
          // find the item in the list
          const updatedItems = state[itemsKey2].map(item =>
            item.name === itemName ?
              { ...item, quantity: String(newQuantity) } :
              item
          );
        
          // remove from list if quantity is zero
          const filteredItems = updatedItems.filter(item => item.quantity !== '0');
        
          return {
            ...state,
            [itemsKey2]: filteredItems,
          };
          case 'LOADED':
            return {
              ...state,
              loaded: action.payload,
            };
          case 'CLEAR_GROCERY_ITEMS':
            return { ...state, groceryItems: [] };
          case 'CLEAR_PANTRY_ITEMS':
            return { ...state, pantryItems: [] };
          case 'SET_GROCERY_ITEMS':
            return { ...state, groceryItems: action.payload };
          case 'SET_PANTRY_ITEMS':
            return { ...state, pantryItems: action.payload };
        default:
      return state;
  }
};


const setCurrentPage = (page) => ({ type: 'SET_CURRENT_PAGE', payload: page });
const addGroceryItem = (item) => ({ type: 'ADD_GROCERY_ITEM', payload: item });
const removeGroceryItem = (item) => ({ type: 'REMOVE_GROCERY_ITEM', payload: item.id });
const addPantryItem = (item) => ({ type: 'ADD_PANTRY_ITEM', payload: item });
const removePantryItem = (item) => ({ type: 'REMOVE_PANTRY_ITEM', payload: item.id });
const incrementItemQuantity = (item, addedQuantity, itemType) => ({ type: 'INCREMENT_ITEM_QUANTITY', payload: { item, addedQuantity, itemType }, });
const setItemQuantity = (itemName, newQuantity, currentPage) => ({ type: 'SET_ITEM_QUANTITY', payload: { itemName, newQuantity, currentPage }, });
const setLoad = (value) => ({ type: 'LOADED', payload: value });
const clearGroceryItems = () => ({ type: 'CLEAR_GROCERY_ITEMS' });
const clearPantryItems = () => ({ type: 'CLEAR_PANTRY_ITEMS' });
const setGroceryItems = (items) => ({ type: 'SET_GROCERY_ITEMS', payload: items });
const setPantryItems = (items) => ({ type: 'SET_PANTRY_ITEMS', payload: items });

const store = createStore(reducer);

export { store, setCurrentPage, setItemQuantity, addGroceryItem, removeGroceryItem, addPantryItem, removePantryItem, incrementItemQuantity, setLoad, clearGroceryItems, clearPantryItems, setGroceryItems, setPantryItems };
