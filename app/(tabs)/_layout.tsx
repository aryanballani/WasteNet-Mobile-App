import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      {/* Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerText}>My App Name</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="index" // Assuming this is your Home screen
            options={{
              title: 'Home',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="m"
            options={{
              title: 'Menu',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="login" // Change this to lowercase
            options={{
              title: 'Login',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'black', // Header background color
    width: '100%', // Stretch across the width of the screen
    paddingVertical: 15, // You can adjust this if needed
    alignItems: 'flex-end', // Align text to the right
    justifyContent: 'center',
    position: 'absolute', // Ensure the header stays at the top
    top: 0, // Position at the top of the screen
    zIndex: 1, // Ensure the header appears above other components
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    paddingRight: 20, // Optional padding for right alignment
  },
  tabsContainer: {
    marginTop: 70, // Adjust this based on the height of your header
    flex: 1, // Allow tabs to take the remaining space
  },
});
