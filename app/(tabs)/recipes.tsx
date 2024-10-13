import { Image, StyleSheet, View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import React, { useState } from 'react';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

export default function HomeScreen() {
    const [items, setItem] = useState([
        { name: 'Eggs and Spam', ingredients: "Eggs, Spam", recipe: '10/10/2021' },
        { name: 'Rice Seaweed', ingredients: "Rice, Seaweed", recipe: '10/10/2021' },
        { name: 'Dominic', ingredients: "Rice, Seaweed", recipe: '10/10/2021' }
    ]);

    const removeItem = (item: string): void => {
        const newItems = items.filter(i => i.name !== item);
        setItem(newItems);
    };

    const renderItem = ({ item }: { item: { name: string; ingredients: string; recipe: string } }) => (
        <View style={styles.recipeItem}>
            <TouchableOpacity onPress={() => removeItem(item.name)}>
                <Text style={styles.recipeName}>{item.name}</Text>
            </TouchableOpacity>
            <Text style={styles.ingredients}>Ingredients: {item.ingredients}</Text>
            <Text style={styles.recipeDate}>Recipe Date: {item.recipe}</Text>
        </View>
    );

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={<Image style={styles.headerImage} source={{ uri: 'your-image-url-here' }} />}
        >
            <View style={styles.container}>
                <Text style={styles.recipesText}>Recipes</Text>
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.name}
                    contentContainerStyle={styles.listContainer}
                />
                <Button
                    title="Generate More"
                    onPress={() => alert('Generate More button pressed')}
                    color="#5AB9EA" // Button color
                />
            </View>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
    },
    headerImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    recipesText: {
        fontSize: 32,
        fontFamily: 'Roboto_700Bold',
        marginVertical: 20,
        color: "#333333",
    },
    listContainer: {
        paddingBottom: 20,
    },
    recipeItem: {
        width: '100%',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 2,
    },
    recipeName: {
        fontSize: 20,
        fontFamily: 'Roboto_700Bold',
        color: '#4A90E2',
    },
    ingredients: {
        fontSize: 16,
        fontFamily: 'Roboto_400Regular',
        color: '#666666',
        marginTop: 4,
    },
    recipeDate: {
        fontSize: 14,
        fontFamily: 'Roboto_400Regular',
        color: '#888888',
        marginTop: 4,
    },
});
