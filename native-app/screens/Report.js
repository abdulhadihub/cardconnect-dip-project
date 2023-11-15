import React, { useState } from 'react'
import { View, Text, ActivityIndicator, FlatList, Image, StyleSheet } from 'react-native'
import FAB from 'react-native-fab';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system";
import { storage } from "../config/firebase.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const Storage = getStorage(storage)



const Report = ({ navigation }) => {
    const data = [
        {
            id: '1',
            image: 'https://th.bing.com/th/id/R.6af6fd9c37f0de4abb34ea0fd20acce3?rik=55mqMmrTutVR0Q&pid=ImgRaw&r=0',
            name: 'John Doe',
            contact: '+1234567890',
            email: 'john.doe@example.com',
        },
        {
            id: '2',
            image: 'https://th.bing.com/th/id/R.6af6fd9c37f0de4abb34ea0fd20acce3?rik=55mqMmrTutVR0Q&pid=ImgRaw&r=0', // Replace with the actual image source
            name: 'Jane Smith',
            contact: '+9876543210',
            email: 'jane.smith@example.com',
        },
        {
            id: '1',
            image: 'https://th.bing.com/th/id/R.6af6fd9c37f0de4abb34ea0fd20acce3?rik=55mqMmrTutVR0Q&pid=ImgRaw&r=0',
            name: 'John Doe',
            contact: '+1234567890',
            email: 'john.doe@example.com',
        },
        {
            id: '2',
            image: 'https://th.bing.com/th/id/R.6af6fd9c37f0de4abb34ea0fd20acce3?rik=55mqMmrTutVR0Q&pid=ImgRaw&r=0', // Replace with the actual image source
            name: 'Jane Smith',
            contact: '+9876543210',
            email: 'jane.smith@example.com',
        },
        {
            id: '1',
            image: 'https://th.bing.com/th/id/R.6af6fd9c37f0de4abb34ea0fd20acce3?rik=55mqMmrTutVR0Q&pid=ImgRaw&r=0',
            name: 'John Doe',
            contact: '+1234567890',
            email: 'john.doe@example.com',
        },
        {
            id: '2',
            image: 'https://th.bing.com/th/id/R.6af6fd9c37f0de4abb34ea0fd20acce3?rik=55mqMmrTutVR0Q&pid=ImgRaw&r=0', // Replace with the actual image source
            name: 'Jane Smith',
            contact: '+9876543210',
            email: 'jane.smith@example.com',
        },
        {
            id: '1',
            image: 'https://th.bing.com/th/id/R.6af6fd9c37f0de4abb34ea0fd20acce3?rik=55mqMmrTutVR0Q&pid=ImgRaw&r=0',
            name: 'John Doe',
            contact: '+1234567890',
            email: 'john.doe@example.com',
        },
        {
            id: '2',
            image: 'https://th.bing.com/th/id/R.6af6fd9c37f0de4abb34ea0fd20acce3?rik=55mqMmrTutVR0Q&pid=ImgRaw&r=0', // Replace with the actual image source
            name: 'Jane Smith',
            contact: '+9876543210',
            email: 'jane.smith@example.com',
        },
        {
            id: '1',
            image: 'https://th.bing.com/th/id/R.6af6fd9c37f0de4abb34ea0fd20acce3?rik=55mqMmrTutVR0Q&pid=ImgRaw&r=0',
            name: 'John Doe',
            contact: '+1234567890',
            email: 'john.doe@example.com',
        },
        {
            id: '2',
            image: 'https://th.bing.com/th/id/R.6af6fd9c37f0de4abb34ea0fd20acce3?rik=55mqMmrTutVR0Q&pid=ImgRaw&r=0', // Replace with the actual image source
            name: 'Jane Smith',
            contact: '+9876543210',
            email: 'jane.smith@example.com',
        },
        {
            id: '1',
            image: 'https://th.bing.com/th/id/R.6af6fd9c37f0de4abb34ea0fd20acce3?rik=55mqMmrTutVR0Q&pid=ImgRaw&r=0',
            name: 'John Doe',
            contact: '+1234567890',
            email: 'john.doe@example.com',
        },
        {
            id: '2',
            image: 'https://th.bing.com/th/id/R.6af6fd9c37f0de4abb34ea0fd20acce3?rik=55mqMmrTutVR0Q&pid=ImgRaw&r=0', // Replace with the actual image source
            name: 'Jane Smith',
            contact: '+9876543210',
            email: 'jane.smith@example.com',
        },

        // Add more data as needed
    ];
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
            // aspect: [4, 3],
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
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            let url = await uploadMedia(result.assets[0].uri);
            console.log("image uploaded ", url)
            navigation.navigate('Uploaded Image', { url: url })
        }
    };
    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.avatar} />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text>{item.contact}</Text>
                <Text>{item.email}</Text>
            </View>
        </View>
    );

    return (
        <>
            {loading ? (
                // Loader component
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
                :
                <>
                    <View >
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                        />
                    </View>
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

                </>}
        </>
    )
}

export default Report

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    avatar: {
        width: 80,
        height: 60,
        // borderRadius: 25,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});
