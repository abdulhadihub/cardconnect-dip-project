import React, { useState } from 'react'
import { View, Text, Image, ActivityIndicator, TouchableOpacity, Button } from 'react-native'
import { useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';


const Uploaded = () => {
    const route = useRoute();
    const [isExtracted, setIsExtracted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [info, setInfo] = useState({
        name: "",
        address: "",
        contact: "",
        email: "",
    })
    const { url } = route.params;
    console.log("url ", url)



    const handleExtract = async () => {
        try {
            setLoading(true)
            // extract information from image
            let extractedInfo = await axios.post('http://192.168.100.16:5000/process-image', { image_url: url }, { headers: { 'Content-Type': 'application/json' } })
            console.log("extractedInfo ", extractedInfo.data)
            setInfo({ name: "Nasir Mehmood", address: "C-36/10, Main Boulevard, Lake City Riwind Eoad Lahore", contact: "0308-5086404", email: "moazzamassociates@gmail" })
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
            setIsExtracted(true)
        }
    }

    return (
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
            {/* extracted information */}
            {isExtracted && <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Extracted Information</Text>

                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", marginTop: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Name</Text>
                    <Text style={{ fontSize: 16 }}>{info.name}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", marginTop: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Address</Text>
                    {
                        info.address.length > 30 ?
                            <Text style={{ fontSize: 16 }}>{info.address.slice(0, 30)}...</Text>
                            :
                            <Text style={{ fontSize: 16 }}>{info.address}</Text>
                    }
                </View>

                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", marginTop: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Contact</Text>
                    <Text style={{ fontSize: 16 }}>{info.contact}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", marginTop: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Email</Text>
                    <Text style={{ fontSize: 16 }}>{info.email}</Text>
                </View>
            </View>}
            {/* button extract information  */}

            {isExtracted ? <View style={{ display: "flex", flexDirection: "row", marginTop: 10, padding: 10, borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity onPress={() => setIsExtracted(false)} style={{ display: "flex", marginLeft: 5, flexDirection: "row", backgroundColor: "red", padding: 10, marginTop: 10 }}>
                    <FontAwesome name="trash" size={24} color="white" />
                    <Text style={{ color: "white", fontSize: 18, marginLeft: 5 }}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsExtracted(false)} style={{ display: "flex", marginLeft: 5, flexDirection: "row", backgroundColor: "#027AFD", padding: 10, marginTop: 10 }}>
                    <FontAwesome name='save' size={24} color="white" />
                    <Text style={{ color: "white", fontSize: 18, marginLeft: 5 }}>Save</Text>
                </TouchableOpacity>
            </View>
                : <View style={{ marginTop: 10, padding: 10, borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity onPress={handleExtract} style={{ backgroundColor: "#027AFD", padding: 10 }}>
                        <Text style={{ color: "white", fontSize: 16 }}>Extract Information</Text>
                    </TouchableOpacity>
                </View>}

        </View>
    );
}

export default Uploaded
