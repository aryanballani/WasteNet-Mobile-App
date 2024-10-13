import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, View, Text, FlatList } from 'react-native';
import "../../assets/styles/styles.css"

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  return (
    <View>
      <ThemedView>
        <View> 
          <Text>Name</Text>
          <View style={styles.topBar}>
          <Collapsible title="">
          <ul id='nav'>
            <li>Recipe</li>
            <li>Add Items</li>
            <li>Inventory</li>
          </ul>
          </Collapsible>
          </View>
        </View>
      </ThemedView>
      <View>
        
        <View style={styles.recipeBox}>
        <View id='recipes-box' style={styles.topRecipes}>
          <Text>Top Recipes</Text>
          <FlatList
        data={[
          {key: 'Devin'},
          {key: 'Dan'},
          {key: 'Dominic'},
          {key: 'Jackson'},
          {key: 'James'},
          {key: 'Joel'},
          {key: 'John'},
          {key: 'Jillian'},
          {key: 'Jimmy'},
          {key: 'Julie'},
        ]}
        renderItem={({item}: {item: {key: string}}) => <Text>{item.key}</Text>}
      />
        </View>
      <View id="lower-boxes">
      <View id='exp-box' style={styles.exp}>
          <Text>Upcoming Exp.</Text>
          <FlatList
        data={[
          {key: 'Devin'},
          {key: 'Dan'},
          {key: 'Dominic'},
          {key: 'Jackson'},
          {key: 'James'},
          {key: 'Joel'},
          {key: 'John'},
          {key: 'Jillian'},
          {key: 'Jimmy'},
          {key: 'Julie'},
        ]}
        renderItem={({item}: {item: {key: string}}) => <Text>{item.key}</Text>}
        />
        </View>


      </View>
        </View>
        
      </View>
      </View>
  );
}

//Decided to switch to CSS files later.
const styles = StyleSheet.create({
  title: {
    textAlign: 'right',
    marginRight: 10,
    marginTop: 7,
    position: 'relative'
  },
  topBar: {
    position: "relative",
    
  },
  first: {
    marginTop: -10,
  },
  menu: {
    fontSize: 30
  },
  recipeBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topRecipes: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 30,
    marginTop: 20,
    backgroundColor: 'white',
    width: 280,
  }, 
  exp: {
    fontSize: 30,
    marginTop: 20,
    backgroundColor: 'white',
    width: 110,
  }, 
  recipeText: {
    fontSize: 30,
    color: "black"
  }
});
