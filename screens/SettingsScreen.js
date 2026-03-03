import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
        {
          text: 'Clear all',
          style: 'destructive',
          onPress: () => {
            dispatch(clearGroceryItems());
            dispatch(clearPantryItems());
          },
        },
      ]
    );
  };

  const handleToggleMetricDefault = () => {
    setIsMetricDefault((prev) => !prev);
    setSelectedUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.section, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
        <View style={[styles.settingRow, styles.settingRowBorder, { borderColor: themeColors.border }]}>
          <Ionicons name="moon-outline" size={22} color={themeColors.textSecondary} style={styles.rowIcon} />
          <Text style={[styles.settingLabel, { color: themeColors.text }]}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={handleToggleDarkMode}
            trackColor={{ false: themeColors.border, true: themeColors.primaryLight }}
            thumbColor={isDarkMode ? themeColors.primary : themeColors.textSecondary}
          />
        </View>
        <View style={[styles.settingRow, { borderColor: themeColors.border }]}>
          <Ionicons name="resize-outline" size={22} color={themeColors.textSecondary} style={styles.rowIcon} />
          <View style={styles.unitContainer}>
            <Text style={[styles.settingLabel, { color: themeColors.text }]}>Units</Text>
            <Text style={[styles.settingHint, { color: themeColors.textSecondary }]}>Metric / Imperial</Text>
          </View>
          <View style={styles.unitToggle}>
            <Text style={[styles.unitLabel, { color: isMetricDefault ? themeColors.text : themeColors.textSecondary }]}>Metric</Text>
            <Switch
              value={!isMetricDefault}
              onValueChange={handleToggleMetricDefault}
              trackColor={{ false: themeColors.border, true: themeColors.primaryLight }}
              thumbColor={!isMetricDefault ? themeColors.primary : themeColors.textSecondary}
            />
            <Text style={[styles.unitLabel, { color: !isMetricDefault ? themeColors.text : themeColors.textSecondary }]}>Imperial</Text>
          </View>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
        <TouchableOpacity
          onPress={handleClearPresets}
          style={[styles.settingRow, styles.dangerRow, { borderColor: themeColors.border }]}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={22} color={themeColors.error} style={styles.rowIcon} />
          <Text style={[styles.settingLabel, { color: themeColors.error }]}>Clear all lists</Text>
          <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
  },
  rowIcon: {
    marginRight: 12,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  settingHint: {
    fontSize: 13,
    marginTop: 2,
  },
  unitContainer: {
    flex: 1,
  },
  unitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unitLabel: {
    fontSize: 14,
  },
  dangerRow: {
    borderBottomWidth: 0,
  },
});

export default Settings;
