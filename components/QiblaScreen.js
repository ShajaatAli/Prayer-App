import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function QiblaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Qibla Direction</Text>
      <Text style={styles.comingSoon}>Coming Soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  comingSoon: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
}); 