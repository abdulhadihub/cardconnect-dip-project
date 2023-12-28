import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';


const ContactDetails = () => {
    const route = useRoute()
    const data = route?.params?.contact
    console.log("data", data)
    return (
        <View>
            <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Image source={{ uri: data?.image }} style={{
                    width: 380, height: 250
                    , resizeMode: "stretch", borderRadius: 10,
                }} />
            </View>

            {/* extracted information */}
            <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Contact Details</Text>

                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", marginTop: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Name</Text>
                    <Text style={{ fontSize: 16 }}>{data?.name}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", marginTop: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Address</Text>
                    <Text style={{ fontSize: 16 }}>{data?.address}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", marginTop: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Contact</Text>
                    <Text style={{ fontSize: 16 }}>{data?.contact}</Text>
                </View>

                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", marginTop: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Email</Text>
                    <Text style={{ fontSize: 16 }}>{data?.email}</Text>
                </View>
            </View>
            {/* button extract information  */}



        </View>
    )
}

export default ContactDetails
