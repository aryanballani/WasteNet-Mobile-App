import { Image, StyleSheet, View, Text, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { CameraView, Camera, CameraType, useCameraPermissions } from 'expo-camera'; // Correctly import Camera
import ParallaxScrollView from '@/components/ParallaxScrollView'; // Assuming this is your custom component
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }} headerImage={<View style={styles.headerImage} />}>
      <View style={styles.container}>
        
        <View style={styles.recipeBox}>
          <View id="recipes-box" style={styles.topRecipes}>
            <Text style={styles.recipesText}>Add Item</Text>
          </View>

          <View>  
            <Button
              title="Manually Add Item"
              onPress={() => alert('Simple Button pressed')}
            />

            <Button
              title="Take Picture"
              onPress={async () => {
                  router.push('/addItemPhoto');
              }}
            />
          </View>
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    height: 400,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  preview: {
    height: 400,
    width: 300,
  },
  recipeBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topRecipes: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 30,
    marginTop: 20,
    backgroundColor: 'white',
    width: 320,
  }, 
  recipesText: {
    fontSize: 50,
    color: "black"
  },
  headerImage: {
    width: '100%',
    height: 200,
  }
});
