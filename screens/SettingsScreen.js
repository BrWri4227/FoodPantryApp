import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { clearGroceryItems, clearPantryItems } from '../redux/pantryStore';
import { ThemeContext } from '../context/ThemeContext';

const Settings = () => {
  const dispatch = useDispatch();
  const { theme, setTheme, colors: themeColors } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  const [selectedUnit, setSelectedUnit] = useState('metric');
  const [isMetricDefault, setIsMetricDefault] = useState(true);

  const handleToggleDarkMode = (value) => {
    setTheme(value ? 'dark' : 'light');
  };

  const handleClearPresets = () => {
    Alert.alert(
      'Clear all lists',
      'This will clear your Shopping List and Pantry. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear all', style: 'destructive', onPress: () => {
          dispatch(clearGroceryItems());
          dispatch(clearPantryItems());
        } },
      ]
    );
  };

  const handleToggleMetricDefault = () => {
    setIsMetricDefault((prev) => !prev);
    setSelectedUnit(prev => prev === 'metric' ? 'imperial' : 'metric');
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.settingItem, { borderColor: themeColors.border }]}>
        <Text style={{ color: themeColors.text }}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={handleToggleDarkMode}
          style={styles.toggleSwitch}
        />
      </View>

      <View style={[styles.settingItem, { borderColor: themeColors.border }]}>
        <Text style={[styles.metricLabel, { color: themeColors.text }]}>Metric</Text>
        <Switch
          value={!isMetricDefault}
          onValueChange={handleToggleMetricDefault}
          style={styles.toggleSwitch}
        />
        <Text style={[styles.imperialLabel, { color: themeColors.text }]}>Imperial</Text>
      </View>

      <TouchableOpacity onPress={handleClearPresets} style={[styles.settingItem, { borderColor: themeColors.border }]}>
        <Text style={{ color: themeColors.text }}>Clear Presets</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  toggleSwitch: {
    marginLeft: 10,
  },
  metricLabel: {
    marginRight: 5,
  },
  imperialLabel: {
    marginLeft: 5,
  },
});

export default Settings;
