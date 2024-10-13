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