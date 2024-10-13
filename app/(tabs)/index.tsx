import { Image, StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useRouter } from 'expo-router';

const router = useRouter();

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image/>
      }>
            <View>
          <Text style={styles.topTitle}>Home</Text>     
        <View style={styles.recipeBox}>
        <View id='recipes-box' style={styles.topRecipes}>
          <Text style={styles.recipesText}>Top Recipes</Text>
          <FlatList
        data={[
          {key: 'Devin'},
          {key: 'Dan'},
          {key: 'Dominic'},
        ]}
        renderItem={({item}: {item: {key: string}}) => <Text style={styles.list}>{item.key}</Text>}/>
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
        renderItem={({item}: {item: {key: string}}) => <Text style={styles.expList}>{item.key}</Text>}
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
  title: {
    textAlign: 'right',
    marginTop: 20,
    position: 'relative',
    fontSize: 30,
  },
  topBar: {
    position: "relative",
    color: 'white',
    backgroundColor: '#000000',
  },
  first: {
    marginTop: -10,
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
  }, expList: {
    fontSize: 18,
    color: "red"
  },
  signupButton: {
    marginTop: 20,
    alignItems: 'center', // Center the text
  },
  signupText: {
    color: 'blue', // Change to your preferred color
    fontSize: 18,
    textDecorationLine: "underline"
  },
});