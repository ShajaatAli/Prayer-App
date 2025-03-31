import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const scale = width / 375; // Using 375 as base width (iPhone X)

// Function to calculate responsive font size
const responsiveFontSize = (size) => {
  return Math.round(size * scale);
};

export default function Calendar() {
  const getGregorianDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getIslamicDate = () => {
    // Convert current date to Islamic calendar in English
    const today = new Date();
    const options = {
      calendar: 'islamic',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return today.toLocaleDateString('en-US-u-ca-islamic', options);
  };

  return (
    <View style={styles.calendarContainer}>
      <Text style={styles.gregorianDate}>{getGregorianDate()}</Text>
      <Text style={styles.islamicDate}>{getIslamicDate()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: '#4CAF50', // Green background
    padding: width * 0.04, // 4% of screen width
    alignItems: 'center',
    width: '100%',
  },
  gregorianDate: {
    color: '#fff',
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    marginBottom: height * 0.01, // 1% of screen height
  },
  islamicDate: {
    color: '#fff',
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    textAlign: 'center',
  },
}); 