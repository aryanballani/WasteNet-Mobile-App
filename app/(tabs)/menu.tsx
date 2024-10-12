import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, View } from 'react-native';
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
          <h2 id="title">Name</h2>
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
          <h1>Top Recipes</h1>
      <ul id='recipes-list'>
      <li className="recipe">new</li>
      <li className="recipe">hi</li>
      <li className="recipe">1</li>

      </ul>
        </View>
      <div id="lower-boxes">
      <View id='exp-box' style={styles.exp}>
          <h1 className='lower'>Upcoming Exp.</h1>
      <ul id='exp-list'>
      <li className="recipe">new</li>
      </ul>
        </View>

        <View id='grocery-box' style={styles.exp}>
          <h1 className='lower'>Got Groceries?</h1>
      <div className="flex">
      <button id="menu-add">Add Item</button>
      </div>
        </View>
      </div>
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
