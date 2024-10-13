import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, Text, FlatList, Button, Alert } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Recipe {
  name: string;
  ingredients: string;
  recipe: string;
}

export default function HomeScreen() {
  const [items, setItems] = useState<Recipe[]>([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      const userId = user ? JSON.parse(user) : null;
      if (!userId) {
        Alert.alert('Error', 'User ID not found');
        return;
      }

      const response = await fetch('http://127.0.0.1:5001/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        console.error('Unexpected data format:', data);
        Alert.alert('Error', 'Unexpected data format received');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      Alert.alert('Error', 'Failed to fetch recipes');
    }
  };

  const removeItem = (itemName: string) => {
    const newItems = items.filter(item => item.name !== itemName);
    setItems(newItems);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Image />}
    >
      <View style={styles.container}>
        <View style={styles.recipeBox}>
          <Text style={styles.recipesText}>Recipes</Text>

          <FlatList
            data={items}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <View style={styles.recipeCard}>
                <Button onPress={() => removeItem(item.name)} title={item.name} />
                <Text style={styles.ingredients}>Ingredients: {item.ingredients}</Text>
                <Text style={styles.ingredients}>Recipe: {item.recipe}</Text>
              </View>
            )}
            contentContainerStyle={styles.lowerBoxes}
          />

          <Button
            title="Generate More"
            onPress={fetchItems}
          />
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  // ... (styles remain the same)
});