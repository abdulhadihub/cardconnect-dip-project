import React, { useState } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, TextInput, ScrollView } from 'react-native'; // Include Picker component
import { useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Uploaded = ({ navigation }) => {
    const route = useRoute();
    const [isExtracted, setIsExtracted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState({
        names: [],      // Store arrays of names
        addresses: [],  // Store arrays of addresses
        contacts: [],   // Store arrays of phone numbers
        emails: [],     // Store arrays of emails
    });
    const [selectedInfo, setSelectedInfo] = useState({
        name: '',
        address: '',
        contact: '',
        email: '',
    });
    const { url } = route.params;

    const getAsyncData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('allReports')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.log(e);
        }
    }
    const saveAsyncData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('allReports', jsonValue)
        } catch (e) {
            console.log(e);
        }
    }
    const getAsyncFinal = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('allContacts')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.log(e);
        }
    }
    const saveAsyncFinal = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('allContacts', jsonValue)
        } catch (e) {
            console.log(e);
        }
    }
    const handleExtract = async () => {
        try {
            setLoading(true);
            // Extract information from the image
            try {
                let extractedInfo = await axios.post('http://192.168.100.4:5000/process-image', { image_url: url });
                console.log("extractedInfonam ", extractedInfo.data.names);
                console.log("extractedInfo ", extractedInfo.data.addresses);
                console.log("extractedInfo ", extractedInfo.data.phone);
                console.log("extractedInfo ", extractedInfo.data.email);

                // Assuming the response contains arrays of names, addresses, contacts, and emails
                setInfo({
                    names: extractedInfo.data.names || [],
                    addresses: extractedInfo.data.addresses || [],
                    contacts: extractedInfo.data.phone || [],
                    emails: extractedInfo.data.email || [],
                });


                const allReports = await getAsyncData();
                console.log("allReports ", allReports);
                if (allReports) {

                    allReports.push({
                        names: extractedInfo.data.names || [],
                        addresses: extractedInfo.data.addresses || [],
                        contacts: extractedInfo.data.phone || [],
                        emails: extractedInfo.data.email || [],
                    });
                    await saveAsyncData(allReports);
                }
                else {
                    await saveAsyncData({
                        names: extractedInfo.data.names || [],
                        addresses: extractedInfo.data.addresses || [],
                        contacts: extractedInfo.data.phone || [],
                        emails: extractedInfo.data.email || [],
                    });
                }


            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setIsExtracted(true);
        }
    };



    const renderButtons = (category, selectedCategory) => {
        return info[category].map((value, index) => (
            <TouchableOpacity
                key={index}
                onPress={() => setSelectedInfo({ ...selectedInfo, [selectedCategory]: value })}
                style={{ backgroundColor: selectedInfo[selectedCategory] === value ? '#027AFD' : '#ccc', padding: 10, margin: 5, borderRadius: 5 }}
            >
                <Text style={{ color: 'white', fontSize: 16 }}>{value}</Text>
            </TouchableOpacity>
        ));
    };
    const [newInfo, setNewInfo] = useState({
        name: '',
        address: '',
        email: '',
        contact: '',
    });
    const handleSave = async () => {
        let data = {
            name: newInfo.name || selectedInfo.name,
            address: newInfo.address || selectedInfo.address,
            email: newInfo.email || selectedInfo.email,
            contact: newInfo.contact || selectedInfo.contact,
            image: url,
        }
        // saving the data to the AsyncStorage 
        const allContacts = await getAsyncFinal();
        console.log("allContacts ", allContacts);
        if (allContacts) {
            allContacts.push(data);
            await saveAsyncFinal(allContacts);
        }
        else {
            const newContact = [data];
            await saveAsyncFinal(newContact);
        }
        setIsExtracted(false);
        navigation.navigate('Contacts')

    };
    return (
        <ScrollView >
            <View>
                <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Image source={{ uri: url }} style={{
                        width: 380, height: 250
                        , resizeMode: "stretch", borderRadius: 10,
                    }} />
                </View>
                {/* ActivityIndicator */}
                {loading && <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>}

                {isExtracted && (
                    <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Extracted Information</Text>

                        {/* Display arrays of names */}
                        <View style={{ width: '90%', marginTop: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Name</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {info.names.map((value, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => setSelectedInfo({ ...selectedInfo, name: value })}
                                        style={{ backgroundColor: selectedInfo.name === value ? '#027AFD' : '#ccc', padding: 10, margin: 5, borderRadius: 5 }}
                                    >
                                        <Text style={{ color: 'white', fontSize: 16 }}>{value}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {/* Allow manual input */}
                            {!selectedInfo.name && <TextInput
                                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 5, padding: 5 }}
                                placeholder="Enter new name"
                                value={newInfo.name}
                                onChangeText={(text) => setNewInfo({ ...newInfo, name: text })}
                            />}
                        </View>

                        {/* Display arrays of addresses */}
                        <View style={{ width: '90%', marginTop: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Address</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {info.addresses.map((value, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => setSelectedInfo({ ...selectedInfo, address: value })}
                                        style={{ backgroundColor: selectedInfo.address === value ? '#027AFD' : '#ccc', padding: 10, margin: 5, borderRadius: 5 }}
                                    >
                                        <Text style={{ color: 'white', fontSize: 16 }}>{value}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {/* Allow manual input */}
                            {!selectedInfo.address && <TextInput
                                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 5, padding: 5 }}
                                placeholder="Enter new address"
                                value={newInfo.address}
                                onChangeText={(text) => setNewInfo({ ...newInfo, address: text })}
                            />}
                        </View>

                        {/* Display arrays of phone numbers */}
                        <View style={{ width: '90%', marginTop: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Contact</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {info.contacts.map((value, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => setSelectedInfo({ ...selectedInfo, contact: value })}
                                        style={{ backgroundColor: selectedInfo.contact === value ? '#027AFD' : '#ccc', padding: 10, margin: 5, borderRadius: 5 }}
                                    >
                                        <Text style={{ color: 'white', fontSize: 16 }}>{value}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {/* Allow manual input */}
                            {!selectedInfo.contact && <TextInput
                                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 5, padding: 5 }}
                                placeholder="Enter new contact"
                                value={newInfo.contact}
                                onChangeText={(text) => setNewInfo({ ...newInfo, contact: text })}
                            />}
                        </View>

                        {/* Display arrays of emails */}
                        <View style={{ width: '90%', marginTop: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Email</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {info.emails.map((value, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => setSelectedInfo({ ...selectedInfo, email: value })}
                                        style={{ backgroundColor: selectedInfo.email === value ? '#027AFD' : '#ccc', padding: 10, margin: 5, borderRadius: 5 }}
                                    >
                                        <Text style={{ color: 'white', fontSize: 16 }}>{value}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {/* Allow manual input */}
                            {!selectedInfo.email && <TextInput
                                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 5, padding: 5 }}
                                placeholder="Enter new email"
                                value={newInfo.email}
                                onChangeText={(text) => setNewInfo({ ...newInfo, email: text })}
                            />}
                        </View>
                    </View>
                )}
                {/* button extract information  */}
                {isExtracted ? (
                    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10, padding: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => setIsExtracted(false)} style={{ display: 'flex', marginLeft: 5, flexDirection: 'row', backgroundColor: 'red', padding: 10, marginTop: 10 }}>
                            <FontAwesome name="trash" size={24} color="white" />
                            <Text style={{ color: 'white', fontSize: 18, marginLeft: 5 }}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSave} style={{ display: 'flex', marginLeft: 5, flexDirection: 'row', backgroundColor: '#027AFD', padding: 10, marginTop: 10 }}>
                            <FontAwesome name='save' size={24} color='white' />
                            <Text style={{ color: 'white', fontSize: 18, marginLeft: 5 }}>Save</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={{ marginTop: 10, padding: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={handleExtract} style={{ backgroundColor: '#027AFD', padding: 10 }}>
                            <Text style={{ color: 'white', fontSize: 16 }}>Extract Information</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

export default Uploaded;
