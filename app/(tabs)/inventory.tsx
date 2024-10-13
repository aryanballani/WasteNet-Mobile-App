import { Image, StyleSheet, View, Text, FlatList, Button } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import React, { useState } from 'react';

export default function HomeScreen() {
    const [items, setItem] = useState([
        {name: 'Devin',
         quantity: 1,
         expiration: '10/10/2021'
        },
        {name: 'Dan',
         quantity: 2,
         expiration: '10/10/2021'
        },
        {name: 'Dominic',
         quantity: 9,
         expiration: '10/10/2021'
        },
        {name: 'Jackson',
         expiration: '10/10/2021',
         quantity: 1
        },
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
          <Text style={styles.recipesText}>Inventory</Text>
        </View>
        <Text>(Check to remove item)</Text>
      <View style={styles.lowerBoxes}>
          <FlatList
        data={items}
        renderItem={({item}: {item: {name: string, quantity: number, expiration: string}}) => 
            <View style={styles.remove}>
                <Button 
                onPress={() => {
                    removeItem(item.name);
                }}
        title={item.name + " (Q:" + item.quantity + ", Exp:" + item.expiration + ")"}/>
        </View>}/>
      </View>
        </View>
        
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepContainer: {
    gap: 4,
    marginBottom: 4,
  },
  remove: {
    marginRight: 200,
    width: 200,
  },
  title: {
    textAlign: 'right',
    marginTop: 20,
    position: 'relative',
    fontSize: 30,
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
    marginTop: 10,
    marginLeft: 70,
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
