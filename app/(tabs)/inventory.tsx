import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, Text, FlatList, TouchableOpacity, Modal, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from "expo-app-loading";
import { useFonts, Roboto_400Regular, Bangers_400Regular } from "@expo-google-fonts/dev";
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to handle data fetching
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<{ name: string; quantity: number; unit: string; expiration: string } | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");

  let [fontsLoaded] = useFonts({
    Bangers_400Regular,
    Roboto_400Regular
  });

  // Fetching inventory data when the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem('user');
        if (userId) {
          const response = await fetch(`http://192.168.137.183:5001/inventory/user/${JSON.parse(userId)}`);
          const data = await response.json();
          setItems(data.data);  // Assuming 'data' contains an array of inventory items
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };
    
    fetchData();
  }, []);

  if (!fontsLoaded) return <AppLoading />;

  // Function to update the quantity of an item
  const updateItemQuantity = () => {
    if (quantity && !isNaN(Number(quantity))) {
      const newItems = items
        .map((item) => {
          if (currentItem && item.name === currentItem.name) {
            let updatedQuantity =
              operation === 'add'
                ? item.quantity + parseInt(quantity)
                : item.quantity - parseInt(quantity);

            return { ...item, quantity: updatedQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0); // Remove items with zero or negative quantity

      setItems(newItems);
    } else {
      Alert.alert('Invalid Quantity', 'Please enter a valid number.');
    }
    setModalVisible(false);
  };

  const openModal = (item, op: string) => {
    setCurrentItem(item);
    setOperation(op);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemDetails}>Quantity: {item.quantity} {item.unit}</Text>
        <Text style={styles.itemDetails}>Expires: {item.expiration}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.addButton]}
          onPress={() => openModal(item, 'add')}
        >
          <Ionicons name="add-circle-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => openModal(item, 'remove')}
        >
          <Ionicons name="remove-circle-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Inventory</Text>

        {/* Display loading spinner while data is being fetched */}
        {loading ? (
          <ActivityIndicator size="large" color="#4A90E2" />
        ) : (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.name}
            contentContainerStyle={styles.listContainer}
          />
        )}

        {/* Quantity Input Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {operation === 'add' ? 'Add Quantity' : 'Remove Quantity'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter quantity"
                keyboardType="numeric"
                value={quantity}
                onChangeText={(text) => setQuantity(text)}
              />
              <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={() => setModalVisible(false)} />
                <Button title="OK" onPress={updateItemQuantity} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ParallaxScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },  
  reactLogo: {
    height: 1,
    width: 1,
    position: 'absolute',
  },
  heading: {
    fontSize: 36,
    fontFamily: 'Roboto_700Bold',
    textAlign: 'center',
    color: '#4A90E2',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  cardContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'Roboto_700Bold',
    color: '#333333',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: '#666666',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginLeft: 10,
    borderRadius: 8,
    padding: 8,
  },
  addButton: {
    backgroundColor: '#4A90E2',
  },
  deleteButton: {
    backgroundColor: '#FF5A5F',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Roboto_700Bold',
    marginBottom: 12,
    color: '#333333',
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
