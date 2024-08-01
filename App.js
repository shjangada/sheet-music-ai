import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { WebView } from 'react-native-webview';

export default function App() {
  const [image, setImage] = useState(null);
  const [isSheetMusic, setIsSheetMusic] = useState(false);
  const [midiUrl, setMidiUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showWebView, setShowWebView] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      uploadFile(uri);
    }
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
    });

    if (result.type === 'success') {
      setImage(result.uri);
      uploadFile(result.uri);
    }
  };

  const uploadFile = async (uri) => {
    if (!uri) {
      Alert.alert('Error', 'No file URI provided.');
      return;
    }

    setLoading(true);
    console.log('Uploading file...');

    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });

    try {
      const response = await fetch('http://192.168.4.55:3000/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (response.ok) {
        console.log('File uploaded and processed successfully');
        setIsSheetMusic(true);
        setImageUrl(data.files[0]); // Assuming the first file is the image
        setMidiUrl(data.files.find(file => file.endsWith('.midi'))); // Find MIDI file
      } else {
        console.log('Processing failed');
        setIsSheetMusic(false);
        setImageUrl(null);
        Alert.alert('Not Sheet Music', data.error || 'The uploaded image is not recognized as sheet music.');
      }
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const openMidiPlayback = () => {
    if (midiUrl) {
      setShowWebView(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Finger Suggestions</Text>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload Music Image</Text>
      </TouchableOpacity>
      {loading && <Text style={styles.loadingText}>Generating XML...</Text>}
      {isSheetMusic && (
        <View style={styles.audioContainer}>
          <Text>Music Preview:</Text>
          <TouchableOpacity style={styles.button} onPress={openMidiPlayback}>
            <Text style={styles.buttonText}>Play Music</Text>
          </TouchableOpacity>
        </View>
      )}
      {showWebView && midiUrl && (
        <WebView
          source={{ uri: `http://192.168.4.55:3000/playback.html?midiUrl=${encodeURIComponent(midiUrl)}` }}
          style={{ flex: 1, width: '100%', height: 400 }} // Adjust height as needed
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8eb0e8',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  image: {
    width: 300,
    height: 400,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  audioContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: 'blue',
  },
});
