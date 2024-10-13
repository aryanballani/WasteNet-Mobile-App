import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { Collapsible } from '@/components/Collapsible';
import { SvgXml } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const headerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#4A90E2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#5AB9EA;stop-opacity:1" />
    </linearGradient>
  </defs>
  <text x="10" y="30" font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="url(#gradient)">
    WasteNet
  </text>
</svg>
`;

export default function HomeScreen() {
  const router = useRouter();
  const [topInventory, setTopInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem('user');
        if (userId) {
          const response = await fetch(`http://127.0.0.1:5000/inventory/user/${JSON.parse(userId)}`);
          if (response.ok) {
            const data = await response.json();
            setTopInventory(data);
          } else if (response.status === 404) {
            setTopInventory([]);
          } else {
            console.error('Error fetching inventory:', response.status);
          }
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!fontsLoaded || isLoading) {
    return null; // or a loading component
  }

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => router.push(`/${item.key.toLowerCase().replace(' ', '')}`)}
    >
      <Ionicons name={item.icon} size={24} color="#4A90E2" />
      <Text style={styles.menuItemText}>{item.key}</Text>
    </TouchableOpacity>
  );

  const renderInventoryItem = ({ item }) => (
    <TouchableOpacity style={styles.inventoryItem}>
      <Text style={styles.inventoryItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor="#FFFFFF"
      headerImage={
        <View style={styles.headerContainer}>
          <SvgXml xml={headerSvg} width="100%" height="100%" />
        </View>
      }
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Inventory Items</Text>
            <Text style={styles.emptyInventoryText}>Feeling Hungry? Generate some Recipes for you!</Text>
          </View>

          <View style={styles.row}>
            <View style={[styles.section, styles.halfWidth]}>
              <Text style={styles.sectionTitle}>Upcoming Exp.</Text>
              {topInventory.length > 0 ? (
              <FlatList
                data={topInventory}
                renderItem={renderInventoryItem}
                keyExtractor={(item) => item.id.toString()}
              />
            ) : (
              <Text style={styles.emptyInventoryText}>Add items to see them here!</Text>
            )}
            </View>

            <View style={[styles.section, styles.halfWidth]}>
              <Text style={styles.sectionTitle}>Got Groceries?</Text>
              <TouchableOpacity
                style={styles.addItemButton}
                onPress={() => router.push('/additem')}
              >
                <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
                <Text style={styles.addItemButtonText}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Roboto_700Bold',
    marginBottom: 12,
    color: '#333333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  inventoryItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  inventoryItemText: {
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
  },
  emptyInventoryText: {
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  listItem: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    marginBottom: 4,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 8,
  },
  addItemButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    marginLeft: 8,
  },
});