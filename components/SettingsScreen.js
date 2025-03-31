import React from 'react';
import { View, Text, StyleSheet, Switch, Dimensions } from 'react-native';
import { useTimeFormat } from '../contexts/TimeFormatContext';

const { width } = Dimensions.get('window');
const scale = width / 375;

const responsiveFontSize = (size) => {
  return Math.round(size * scale);
};

export default function SettingsScreen() {
  const { is24Hour, toggleTimeFormat } = useTimeFormat();

  return (
    <View style={styles.container}>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>24-Hour Time Format</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#4CAF50' }}
          thumbColor={is24Hour ? '#fff' : '#f4f3f4'}
          ios_backgroundColor="#767577"
          onValueChange={toggleTimeFormat}
          value={is24Hour}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: width * 0.04,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingText: {
    fontSize: responsiveFontSize(16),
    color: '#333',
  },
}); 