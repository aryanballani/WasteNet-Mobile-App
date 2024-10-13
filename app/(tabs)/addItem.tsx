import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; // Import Picker for dropdown
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddItemScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false); // Control modal visibility
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [unitOfMeasurement, setUnitOfMeasurement] = useState('units'); // Default unit

  const handleSubmit = async () => {
    if (!itemName || !quantity || !expiryDate || !unitOfMeasurement) {
      Alert.alert('Missing Fields', 'Please fill out all fields.');
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('user');
      if (!userId) {
        Alert.alert('Error', 'Unable to find user ID.');
        return;
      }

      // API call to the backend to add the item
      const response = await fetch('http://127.0.0.1:5001/inventory/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: itemName,
          quantity: parseInt(quantity),
          expiry_date: expiryDate,
          unit_of_measurement: unitOfMeasurement,
          user_id: userId, // Parse the stored user_id
        }),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', result.message);
        setModalVisible(false); // Close modal after submission
      } else {
        Alert.alert('Error', result.message || 'Failed to add the item.');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<View style={styles.headerImage} />}
    >
      <View style={styles.container}>
        <View style={styles.recipeBox}>
          <Text style={styles.heading}>Add New Item</Text>

          {/* Button to manually add an item */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)} // Open modal
          >
            <Ionicons name="pencil-outline" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Manually Add Item</Text>
          </TouchableOpacity>

          {/* Button to take a picture */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/addItemPhoto')}
          >
            <Ionicons name="camera-outline" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Take Picture</Text>
          </TouchableOpacity>
        </View>

        {/* Modal for manual input */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Item Details</Text>

              <TextInput
                style={styles.input}
                placeholder="Item Name"
                value={itemName}
                onChangeText={setItemName}
              />
              <TextInput
                style={styles.input}
                placeholder="Quantity"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
              <TextInput
                style={styles.input}
                placeholder="Expiry Date (YYYY-MM-DD)"
                value={expiryDate}
                onChangeText={setExpiryDate}
              />

              {/* Picker for unit of measurement */}
              <Picker
                selectedValue={unitOfMeasurement}
                style={styles.picker}
                onValueChange={(itemValue: React.SetStateAction<string>) => setUnitOfMeasurement(itemValue)}
              >
                <Picker.Item label="Units" value="units" />
                <Picker.Item label="Kilograms" value="kgs" />
                <Picker.Item label="Grams" value="grams" />
              </Picker>

              <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={() => setModalVisible(false)} />
                <Button title="Submit" onPress={handleSubmit} />
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  recipeBox: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    maxWidth: 400,
  },
  heading: {
    fontSize: 28,
    fontFamily: 'Roboto_700Bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 16,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
    marginLeft: 8,
  },
  headerImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#A1CEDC',
  },
  // Modal Styles
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
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
