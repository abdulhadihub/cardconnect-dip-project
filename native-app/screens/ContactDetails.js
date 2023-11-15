import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';


const ContactDetails = () => {
    const [loading, setLoading] = useState(false)
    let info = {
        name: "John Doe",
        address: "1234 Main St",
        contact: "123-456-7890",
        email: "john.doe@gmail"
    }
    let url = "https://th.bing.com/th/id/R.6af6fd9c37f0de4abb34ea0fd20acce3?rik=55mqMmrTutVR0Q&pid=ImgRaw&r=0"
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
            <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Extracted Information</Text>

                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", marginTop: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Name</Text>
                    <Text style={{ fontSize: 16 }}>{info.name}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", marginTop: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Address</Text>
                    <Text style={{ fontSize: 16 }}>{info.address}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", marginTop: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Contact</Text>
                    <Text style={{ fontSize: 16 }}>{info.contact}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", marginTop: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Email</Text>
                    <Text style={{ fontSize: 16 }}>{info.email}</Text>
                </View>
            </View>
            {/* button extract information  */}

            <View style={{ display: "flex", flexDirection: "row", marginTop: 10, padding: 10, borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity onPress={() => setIsExtracted(false)} style={{ display: "flex", marginLeft: 5, flexDirection: "row", backgroundColor: "red", padding: 10, marginTop: 10 }}>
                    <FontAwesome name="trash" size={24} color="white" />
                    <Text style={{ color: "white", fontSize: 18, marginLeft: 5 }}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsExtracted(false)} style={{ display: "flex", marginLeft: 5, flexDirection: "row", backgroundColor: "#027AFD", padding: 10, marginTop: 10 }}>
                    <FontAwesome name='edit' size={24} color="white" />
                    <Text style={{ color: "white", fontSize: 18, marginLeft: 5 }}>Edit</Text>
                </TouchableOpacity>
            </View>


        </View>
    )
}

export default ContactDetails
