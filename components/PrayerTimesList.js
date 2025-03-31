import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, ActivityIndicator, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import PrayerTimeItem from './PrayerTimeItem';
import { fetchPrayerTimes } from '../services/prayerTimesAPI';
import Calendar from './Calendar';

const { width, height } = Dimensions.get('window');
const scale = width / 375;

const responsiveFontSize = (size) => {
  return Math.round(size * scale);
};

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function PrayerTimesList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState([]);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    setupLocationAndNotifications();
  }, []);

  useEffect(() => {
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = midnight - new Date();

    // Update prayer times at midnight
    const midnightTimer = setTimeout(() => {
      if (location) {
        updatePrayerTimes(location);
      }
    }, msUntilMidnight);

    return () => clearTimeout(midnightTimer);
  }, [location]);

  useEffect(() => {
    // Listen for notifications being received
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    return () => subscription.remove();
  }, []);

  const setupLocationAndNotifications = async () => {
    try {
      // Request location permissions
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        setError('Location permission is required to get accurate prayer times.');
        return;
      }

      // Request notification permissions
      const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
      if (notificationStatus !== 'granted') {
        setError('Notification permission is required for prayer time alerts.');
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Fetch prayer times
      await updatePrayerTimes(location);
    } catch (err) {
      setError('Error setting up the app: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePrayerTimes = async (location) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const times = await fetchPrayerTimes(
        location.coords.latitude,
        location.coords.longitude,
        today
      );

      const formattedTimes = Object.entries(times).map(([name, time], index) => {
        // Ensure time is in 24-hour format
        const [hours, minutes] = time.split(':');
        return {
          id: String(index + 1),
          name: name.charAt(0).toUpperCase() + name.slice(1),
          time: `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`,
        };
      });

      console.log('Formatted prayer times:', formattedTimes);
      setPrayerTimes(formattedTimes);
      await scheduleNotifications(formattedTimes);
    } catch (err) {
      setError('Error fetching prayer times: ' + err.message);
      console.error('Error in updatePrayerTimes:', err);
    }
  };

  const scheduleNotifications = async (times) => {
    try {
      // Cancel existing notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Get current date and time
      const now = new Date();

      // Schedule new notifications for each prayer time
      for (const prayer of times) {
        const [hours, minutes] = prayer.time.split(':');
        const scheduledTime = new Date();
        scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // If prayer time has passed today, schedule for tomorrow
        if (scheduledTime.getTime() <= now.getTime()) {
          scheduledTime.setDate(scheduledTime.getDate() + 1);
        }

        // Only schedule if it's a future time
        if (scheduledTime.getTime() > now.getTime()) {
          try {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: 'Prayer Time',
                body: `It's time for ${prayer.name} prayer`,
              },
              trigger: {
                date: scheduledTime,
                // Add some tolerance to prevent immediate triggering
                tolerance: 60000, // 1 minute tolerance
              },
            });
            console.log(`Scheduled ${prayer.name} for ${scheduledTime.toLocaleString()}`);
          } catch (error) {
            console.error(`Error scheduling ${prayer.name}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error in scheduleNotifications:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size={width * 0.1} color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Calendar />
      <FlatList
        data={prayerTimes}
        renderItem={({ item }) => <PrayerTimeItem prayer={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05,
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#ff0000',
    textAlign: 'center',
    fontSize: responsiveFontSize(14),
  },
  listContent: {
    flexGrow: 1,
  },
}); 