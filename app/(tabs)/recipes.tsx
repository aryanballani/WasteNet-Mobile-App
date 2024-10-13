import { Image, StyleSheet, View, Text, FlatList, Button } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import React, { useState } from 'react';

export default function HomeScreen() {
    //For backend, randomize this state so more recipes can be made.
    const [items, setItem] = useState([
        {name: 'Eggs and spam',
         ingredients: "Eggs, spam",
         recipe: '10/10/2021'
        },
        {name: 'Rice seaweed',
         ingredients: "Rice, seaweed",
         recipe: '10/10/2021'
        },
        {name: 'Dominic',
         ingredients: "Rice, seaweed",
         recipe: '10/10/2021'
        }
      ])

  const removeItem = (item: string): void => {
    const newItems = items.filter(i => i.name !== item);
    setItem(newItems);
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Image/>}>
      <View>
        
        <View style={styles.recipeBox}>
        <View id='recipes-box'>
          <Text style={styles.recipesText}>Recipes</Text>
        </View>
      <View style={styles.lowerBoxes}>
          <FlatList data={items}
        renderItem={({item}: {item: {name: string, ingredients: string, recipe: string}}) =>
            <View style={styles.recipes}>
                <Button onPress={() => {removeItem(item.name);}} title={item.name}/>
      <Text style={styles.ingredients}>Ingredients: {item.ingredients}</Text>
      <Text style={styles.ingredients}>Recipe: {item.recipe}</Text>
            </View>}/>
      </View>
      <Button
        title="Generate More"
        onPress={() => alert('Simple Button pressed')}
        />
        </View>
        
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  ingredients: {
    marginLeft: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepContainer: {
    gap: 4,
    marginBottom: 4,
  },
  recipes: {
    marginTop: 30,
    width: 270,
    borderWidth: 3,
    height: 200,
  },
  title: {
    textAlign: 'right',
    marginTop: 20,
    position: 'relative',
    fontSize: 30,
  },
  first: {
    marginTop: -10,
  },
  recipeBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  recipesText: {
    fontSize: 50,
    color: "black"
  },
  exp: {
    fontSize: 30,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: 'white',
    width: 130,
    borderWidth: 3,
    padding: 5,
  }, 
  lowerBoxes: {
    marginLeft: 30,
    marginTop: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  lower: {
    fontSize: 20
  }, list: {
    fontSize: 18,
  }
});
