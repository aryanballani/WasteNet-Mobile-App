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
            setTopInventory(data.data);
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

  const renderInventoryItem = ({ item }: { item: { name: string; quantity: number; unit_of_measurement: string; expiry_date: string; _id: string } }) => (
    <TouchableOpacity style={styles.inventoryItem}>
      <View style={styles.inventoryItemContent}>
        <Text style={styles.inventoryItemName}>{item.name}</Text>
        <View style={styles.inventoryItemDetails}>
          <Text style={styles.inventoryItemText}>
            {item.quantity} {item.unit_of_measurement} 
          </Text>
          <Text style={styles.inventoryItemText}>
            Expires: {formatExpiryDate(item.expiry_date)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const formatExpiryDate = (dateString: string | number | Date) => {
    console.log("1")
    console.log(dateString);
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ dark: "#000000", light: "#FFFFFF" }}
      headerImage={
        <View style={styles.headerContainer}>
          <SvgXml xml={headerSvg} width="100%" height="100%" />
        </View>
      }
    >
      <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Recipes</Text>
            <TouchableOpacity
              style={styles.recipeButton}
              onPress={() => router.push('/recipes')}
            >
              <Text style={styles.recipeButtonText}>Discover New Recipes</Text>
              <Ionicons name="fast-food-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={[styles.section, styles.halfWidth]}>
              <Text style={styles.sectionTitle}>Upcoming Exp.</Text>
              {topInventory.length > 0 ? (
              <FlatList
                data={topInventory}
                renderItem={renderInventoryItem}
                keyExtractor={(item) => item._id.toString()}
              />
            ) : (
              <Text style={styles.emptyInventoryText}>Add items to see them here!</Text>
            )}
            </View>

            <View style={[styles.section, styles.halfWidth]}>
              <Text style={styles.sectionTitle}>Got Groceries?</Text>
              <TouchableOpacity
                style={styles.addItemButton}
                onPress={() => router.push('/addItem')}
              >
                <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
                <Text style={styles.addItemButtonText}>Add New Items</Text>
              </TouchableOpacity>
              <Text style={styles.groceryHelperText}>
                Add your groceries to keep track of your pantry and get recommendations!
              </Text>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  inventoryItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inventoryItemName: {
    fontSize: 16,
    fontFamily: 'Roboto_700Bold',
    color: '#333333',
    flex: 1,
  },
  inventoryItemDetails: {
    alignItems: 'flex-end',
  },
  inventoryItemText: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: '#666666',
  },
  emptyInventoryText: {
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
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
  groceryHelperText: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
  recipeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5AB9EA',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 8,
  },
  recipeButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    marginRight: 8,
  },
});
