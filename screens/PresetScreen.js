import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from '../firebaseConfig';
import { setGroceryItems, setPantryItems } from '../redux/pantryStore';
import { ThemeContext } from '../context/ThemeContext';

const db = getFirestore(app);

const Presets = () => {
  const dispatch = useDispatch();
  const { colors: themeColors } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSyncFromCloud = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const [pantrySnap, grocerySnap] = await Promise.all([
        getDocs(collection(db, 'pantry')),
        getDocs(collection(db, 'shopping')),
      ]);
      const pantryData = pantrySnap.docs.map((d) => ({ ...d.data(), id: d.data().id ?? d.id }));
      const groceryData = grocerySnap.docs.map((d) => ({ ...d.data(), id: d.data().id ?? d.id }));
      dispatch(setGroceryItems(groceryData));
      dispatch(setPantryItems(pantryData));
      setMessage('Lists loaded from cloud');
    } catch (err) {
      console.error('Failed to load from cloud:', err);
      setError(err.message || 'Failed to load from cloud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
        <Ionicons name="cloud-download-outline" size={48} color={themeColors.primary} style={styles.icon} />
        <Text style={[styles.title, { color: themeColors.text }]}>Load from Cloud</Text>
        <Text style={[styles.description, { color: themeColors.textSecondary }]}>
          Sync your Pantry and Shopping List from the cloud. This will replace your current lists with the saved version.
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeColors.primary }]}
          onPress={handleSyncFromCloud}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="sync" size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Sync from Cloud</Text>
            </>
          )}
        </TouchableOpacity>
        {message && <Text style={[styles.feedback, { color: themeColors.primary }]}>{message}</Text>}
        {error && <Text style={[styles.feedback, { color: themeColors.error }]}>{error}</Text>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 180,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedback: {
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Presets;
