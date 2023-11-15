import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';
import { View, Text, ActivityIndicator } from 'react-native';
import FAB from 'react-native-fab';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system";
import { storage } from "./config/firebase.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Uploaded from './screens/Uploaded.js';
import Report from './screens/Report.js';
import ContactNavigator from './screens/ContactNavigator.js';
const Storage = getStorage(storage)


const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const uploadMedia = async (image) => {
    setLoading(true);
    try {
      const { uri } = await FileSystem.getInfoAsync(image);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      }
      );
      const fileName = uri.split("/").pop();
      const name = `${Date.now()}_${fileName}`;
      const storageRef = ref(Storage, name);
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setLoading(false);
      return downloadURL;
    }
    catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need gallery permissions to make this work!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      let url = await uploadMedia(result.assets[0].uri);
      console.log("image uploaded ", url)
      navigation.navigate('Uploaded Image', { url: url })
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEdit456rzing: true,
      quality: 1,
    });

    if (!result.canceled) {
      let url = await uploadMedia(result.assets[0].uri);
      console.log("image uploaded ", url)
      navigation.navigate('Uploaded Image', { url: url })
    }
  };

  return (
    <>
      {loading ? (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
        :
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Home Screen</Text>
          <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
            <FAB
              buttonColor="red"
              iconTextColor="#FFFFFF"
              onClickAction={takePhoto}
              visible={true}
              iconTextComponent={<FontAwesome name="camera" />}
            />
          </View>
          <View style={{ position: 'absolute', bottom: 60, right: 0 }}>
            <FAB
              buttonColor="#027AFD"
              iconTextColor="#FFFFFF"
              onClickAction={pickImage}
              visible={true}
              iconTextComponent={<FontAwesome name="photo" />}
            />
          </View>
        </View>}
    </>
  );
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName='Homee'
    >
      <Tab.Screen
        name="Report"
        component={Report}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="file" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Homee"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="address-book" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Uploaded Image" component={Uploaded} />
    </Stack.Navigator>
  );
};


const App = () => {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
};

export default App;
