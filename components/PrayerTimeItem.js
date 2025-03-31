import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { useTimeFormat } from '../contexts/TimeFormatContext';

const { width } = Dimensions.get('window');
const scale = width / 375;

const responsiveFontSize = (size) => {
  return Math.round(size * scale);
};

export default function PrayerTimeItem({ prayer }) {
  const { is24Hour } = useTimeFormat();

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);

    if (is24Hour) {
      return `${hours}:${minutes}`;
    } else {
      const period = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${period}`;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{prayer.name}</Text>
      <Text style={styles.time}>{formatTime(prayer.time)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: width * 0.05, // 5% of screen width
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  name: {
    fontSize: responsiveFontSize(16),
    color: '#4CAF50',
    fontWeight: '600',
  },
  time: {
    fontSize: responsiveFontSize(16),
    color: '#333',
  },
}); 