import { Image, StyleSheet, View, Text, FlatList, Button } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  interface Recipe {
    name: string;
    ingredients: string;
    recipe: string;
  }

  const [items, setItems] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const userId = user ? JSON.parse(user) : null;
        if (!userId) {
          console.error('User ID not found in AsyncStorage');
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
          console.error('Error fetching items:', response.status);
          return;
        }

        const data = await response.json();
        setItems(data); // Assuming data is an array of items
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

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
            keyExtractor={(item) => item.name} // Add keyExtractor for unique keys
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
            onPress={() => alert('Generate More button pressed')}
          />
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
  recipeBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipesText: {
    fontSize: 50,
    color: 'black',
    marginBottom: 20,
  },
  recipeCard: {
    marginTop: 30,
    width: 300,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ingredients: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  lowerBoxes: {
    paddingBottom: 20,
  },
});
