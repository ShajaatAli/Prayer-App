import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TimeFormatContext = createContext();

export function TimeFormatProvider({ children }) {
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
    loadTimeFormat();
  }, []);

  const loadTimeFormat = async () => {
    try {
      const timeFormat = await AsyncStorage.getItem('timeFormat');
      setIs24Hour(timeFormat === '24h');
    } catch (error) {
      console.error('Error loading time format:', error);
    }
  };

  const toggleTimeFormat = async (value) => {
    try {
      await AsyncStorage.setItem('timeFormat', value ? '24h' : '12h');
      setIs24Hour(value);
    } catch (error) {
      console.error('Error saving time format:', error);
    }
  };

  return (
    <TimeFormatContext.Provider value={{ is24Hour, toggleTimeFormat }}>
      {children}
    </TimeFormatContext.Provider>
  );
}

export function useTimeFormat() {
  const context = useContext(TimeFormatContext);
  if (context === undefined) {
    throw new Error('useTimeFormat must be used within a TimeFormatProvider');
  }
  return context;
} 