import { Image, StyleSheet, Platform, View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import AppLoading from "expo-app-loading";
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Collapsible } from '@/components/Collapsible';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  useFonts,
  Roboto_400Regular,
  Bangers_400Regular,
  OpenSans_400Regular
} from "@expo-google-fonts/dev";
import { NavigationContainer, ParamListBase, RouteProp } from '@react-navigation/native';
import AddItem from './addItem';

const Stack = createNativeStackNavigator();

import { NavigationProp } from '@react-navigation/native';
import { ComponentType } from 'react';
import { useRouter } from 'expo-router';

const router = useRouter();

export default function HomeScreen({ navigation }: { navigation: NavigationProp<any> }) {
  let [fontsLoaded] = useFonts({
    Bangers_400Regular,
    Roboto_400Regular
  });

  if (!fontsLoaded) return <AppLoading/>

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
            <View>
          <Text style={styles.topTitle}>Home</Text>
        </View>
      <ThemedView>
        <View> 
          <View style={styles.topBar}>
          <Collapsible title="Menu">
          <FlatList
        data={[
          {key: 'Recipe'},
          {key: 'Add Item'},
          {key: 'Inventory'},
        ]}
        renderItem={({item}: {item: {key: string}}) => 
        <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/addItem')}>
        <Text style={styles.list}>{item.key}</Text>
        </TouchableOpacity>
        
        }
      />
          </Collapsible>
          </View>
        </View>
      </ThemedView>
      <View>
        
        <View style={styles.recipeBox}>
        <View id='recipes-box' style={styles.topRecipes}>
          <Text style={styles.recipesText}>Top Recipes</Text>
          <FlatList
        data={[
          {key: 'Devin'},
          {key: 'Dan'},
          {key: 'Dominic'},
        ]}
        renderItem={({item}: {item: {key: string}}) => <Text style={styles.list}>{item.key}</Text>}
      />
        </View>
      <View style={styles.lowerBoxes}>
      <View style={styles.exp}>
          <Text style={styles.lower}>Upcoming Exp.</Text>
          <FlatList
        data={[
          {key: 'Devin'},
          {key: 'Dan'},
          {key: 'Dominic'},
          {key: 'Jackson'},
        ]}
        renderItem={({item}: {item: {key: string}}) => <Text style={styles.list}>{item.key}</Text>}
        />
        </View>

        <View style={styles.exp}>
          <Text style={styles.lower}>Got Groceries?</Text>

          <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/addItem')}>
        <Text style={styles.signupText}>Add Item</Text>
      </TouchableOpacity>
        </View>


      </View>
        </View>
        
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  topTitle: {
    fontSize: 50,
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
  reactLogo: {
    height: 1,
    width:1,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  title: {
    textAlign: 'right',
    marginTop: 20,
    position: 'relative',
    fontSize: 30,
    fontFamily: "Roboto_400Regular"
  },
  topBar: {
    position: "relative",
    color: 'white',
    backgroundColor: '#000000',
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
    width: 320,
    borderStyle: "solid",
    borderWidth: 3,
  }, 
  recipesText: {
    fontSize: 30,
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
  recipeText: {
    fontSize: 30,
    color: "black"
  },
  lowerBoxes: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  lower: {
    fontSize: 20
  }, list: {
    fontSize: 18,
  },
  signupButton: {
    marginTop: 20,
    alignItems: 'center', // Center the text
  },
  signupText: {
    color: 'blue', // Change to your preferred color
    fontSize: 16,
  },
});

 function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Waste Net" component={HomeScreen} />
      <Stack.Screen name="Add Item" component={AddItem} />
    </Stack.Navigator>
  );
}