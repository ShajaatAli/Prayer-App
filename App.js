import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrayerTimesList from './components/PrayerTimesList';
import QiblaScreen from './components/QiblaScreen';
import SettingsScreen from './components/SettingsScreen';
import SplashScreen from './components/SplashScreen';
import { TimeFormatProvider } from './contexts/TimeFormatContext';

const Tab = createBottomTabNavigator();

const { width, height } = Dimensions.get('window');
const scale = width / 375;

const responsiveFontSize = (size) => {
  return Math.round(size * scale);
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      <SafeAreaView style={styles.topSafeArea} />
      <SafeAreaView style={styles.container}>
        <TimeFormatProvider>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === 'Prayer Times') {
                    iconName = focused ? 'time' : 'time-outline';
                  } else if (route.name === 'Qibla') {
                    iconName = focused ? 'compass' : 'compass-outline';
                  } else if (route.name === 'Settings') {
                    iconName = focused ? 'settings' : 'settings-outline';
                  }

                  return <Ionicons name={iconName} size={Math.round(width * 0.06)} color={color} />;
                },
                tabBarActiveTintColor: '#4CAF50',
                tabBarInactiveTintColor: '#757575',
                tabBarStyle: {
                  backgroundColor: '#fff',
                  height: Math.round(height * 0.08),
                  paddingBottom: Math.round(height * 0.01),
                  borderTopWidth: 0,
                },
                headerStyle: {
                  backgroundColor: '#4CAF50',
                  height: Math.round(height * 0.08),
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: responsiveFontSize(18),
                },
              })}
            >
              <Tab.Screen 
                name="Prayer Times" 
                component={PrayerTimesList}
                options={{
                  headerShown: false
                }}
              />
              <Tab.Screen name="Qibla" component={QiblaScreen} />
              <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </TimeFormatProvider>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  topSafeArea: {
    flex: 0,
    backgroundColor: '#4CAF50',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 