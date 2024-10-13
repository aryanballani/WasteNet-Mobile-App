import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const router = useRouter();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePhoto = async () => {
    try {
        if (cameraRef.current) {
            console.log("Camera reference is not null");
            const photo = await cameraRef.current.takePictureAsync(); // Take a photo using the camera
            setPhotoUri(photo.uri); // Store the photo URI
            console.log("Photo URI: ", photoUri);
        } else {
          console.error("Camera reference is null");
        }
        // setPhotoUri(photo.uri); // Store the photo URI
    } catch (error) {
        console.error("Error taking photo: ", error);   
    }
  };

  return (
    photoUri ? (
        <View style={styles.container}>
            <Text style={styles.message}>Photo taken!</Text>
            <Button onPress={() => setPhotoUri(null)} title="Take another photo" />
            <Button onPress={() => {
                AsyncStorage.setItem('photoUri', photoUri);
                router.push('/addItem');
            }} title="Confirm Photo" />
            <Image source={{ uri: photoUri }} style={styles.preview} />
        </View>
      ) : (
        <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
                <Text style={styles.text}>Click Photo</Text>
                </TouchableOpacity>
        </View>
        </CameraView>
      )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
