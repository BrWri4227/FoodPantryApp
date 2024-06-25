import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState('metric'); // 'metric' or 'imperial'
  const [isMetricDefault, setIsMetricDefault] = useState(true);

  const handleToggleDarkMode = () => {
    // Toggle dark/light mode logic
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleClearPresets = () => {
    // Clear presets logic
  };

  const handleToggleMetricDefault = () => {
    setIsMetricDefault((prev) => !prev);
    setSelectedUnit(prev => prev === 'metric' ? 'imperial' : 'metric');
  };

  return (
    <View style={styles.container}>
        
      <View style={styles.settingItem}>
        <Text>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={handleToggleDarkMode}
          style={styles.toggleSwitch}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.metricLabel}>Metric</Text>
        <Switch
          value={!isMetricDefault}
          onValueChange={handleToggleMetricDefault}
          style={styles.toggleSwitch}
        />
        <Text style={styles.imperialLabel}>Imperial</Text>
      </View>

      <TouchableOpacity onPress={handleClearPresets} style={styles.settingItem}>
        <Text>Clear Presets</Text>
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
