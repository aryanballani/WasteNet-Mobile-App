import { useRouter, Slot } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';

export default function TabLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar}>
          <Text style={styles.headerText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.appName}>WasteNet</Text>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={sidebarVisible}
        onRequestClose={toggleSidebar}
      >
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>WasteNet</Text>
          <Pressable onPress={() => {
            toggleSidebar();
            router.push("/home");
          }}>
            <Text style={styles.sidebarItem}>Home</Text>
          </Pressable>
          {/* <Pressable onPress={() => {
            toggleSidebar();
            router.push("/login");
          }}>
            <Text style={styles.sidebarItem}>Login</Text>
          </Pressable> */}
          <Pressable onPress={() => {
            toggleSidebar();
            router.push("/addItem");
          }}>
            <Text style={styles.sidebarItem}>Add Items</Text>
          </Pressable>
          <Pressable onPress={() => {
            toggleSidebar();
            router.push('/recipes');
          }}>
            <Text style={styles.sidebarItem}>Recipes</Text>
          </Pressable>
          <Pressable onPress={() => {
            toggleSidebar();
            router.push('/inventory');
          }}>
            <Text style={styles.sidebarItem}>Inventory</Text>
          </Pressable>
          {/* <Pressable onPress={() => {
            toggleSidebar();
            router.push('/signup');
          }}>
            <Text style={styles.sidebarItem}>Sign Up</Text>
          </Pressable> */}
          <Pressable onPress={toggleSidebar} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </Modal>

      <View style={styles.mainContent}>
        <Slot />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'black',
    width: '100%',
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 30,
  },
  appName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sidebar: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sidebarItem: {
    fontSize: 18,
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'black',
    alignItems: 'center',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
  },
});