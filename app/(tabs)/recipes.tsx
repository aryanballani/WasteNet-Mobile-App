import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, Text, FlatList, Button, Alert } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get_gen_ai_reponse } from '../../backend/model/aws';
import {suggest_recipes} from '../../backend/model/recipe';

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

          const response = suggest_recipes(userId);
          setItems(response);
        } catch (error) {
          Alert.alert('Error', 'Failed to fetch items');
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