import { Image, StyleSheet, View, Text, Button } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import React, { useState, useEffect } from 'react';
import { Camera, CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  if (permission === null) { return [];}

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  let file: string = "";

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Image/>}>
      <View>
        
        <View style={styles.recipeBox}>
        <View id='recipes-box' style={styles.topRecipes}>
          <Text style={styles.recipesText}>Add Item</Text>
        </View>
      <View>  

        <Button
        
        title="Manually Add Item"
        onPress={() => alert('Simple Button pressed')}
        />
        <CameraView ref={(ref: CameraView | null) => setCameraRef(ref)}>
        <Button
            title="Take Picture"
            onPress={async () => {
              if (cameraRef) {
                const photo = await cameraRef.takePictureAsync();
                if (photo === undefined) throw new Error('No photo taken');
                //THIS IS THE DATA TYPE for the photo
                //It's a react state, so use photoUri to reference
                setPhotoUri(photo.uri)
              }
            }}
          />
        </CameraView>
      </View>
        </View>
        {photoUri !== null ? <Image
        source={{uri: photoUri}}
        /> : ""}
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
  }, 
  recipesText: {
    fontSize: 50,
    color: "black"
  }
});
