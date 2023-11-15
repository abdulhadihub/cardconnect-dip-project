import React from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';


const TextAvatar = ({ backgroundColor, textColor, children }) => {
    return (
        <View
            style={{
                backgroundColor,
                width: 45,
                height: 45,
                borderRadius: 25,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text style={{ color: textColor, fontSize: 20, fontWeight: 'bold' }}>
                {/* first letter of first name and last name */}
                {children.charAt(0).toUpperCase()}{children.charAt(children.indexOf(' ') + 1).toUpperCase()}
            </Text>
        </View>
    );
};
const Contact = ({ navigation }) => {
    // Dummy contact data for demonstration
    const contacts = [
        { id: '1', name: 'John Doe', phone: '123-456-7890', email:"text@test.com" },
        { id: '1', name: 'Doe Boe', phone: '123-456-7890', email:"text@test.com" },
        { id: '2', name: 'Ali Raza', phone: '987-654-3210', email:"text@test.com" },
        { id: '3', name: 'Abdul Hadi', phone: '987-654-3210', email:"text@test.com" },
        { id: '4', name: 'Najam Ul Hassan', phone: '987-654-3210', email:"text@test.com" },
        { id: '5', name: 'jami Smith', phone: '987-654-3210', email:"text@test.com" },
        { id: '6', name: 'june Smith', phone: '987-654-3210', email:"text@test.com" },
        { id: '7', name: 'kainat Smith', phone: '987-654-3210', email:"text@test.com" },
        { id: '8', name: 'Ayesha Nadeem', phone: '987-654-3210', email:"text@test.com" },
        { id: '9', name: 'jimi Smith', phone: '987-654-3210', email:"text@test.com" },
        { id: '10', name: 'baloch Smith', phone: '987-654-3210', email:"text@test.com" },
        { id: '11', name: 'abdul Smith', phone: '987-654-3210', email:"text@test.com" },
        { id: '12', name: 'hadi Smith', phone: '987-654-3210', email:"text@test.com" },
        { id: '13', name: 'najam Smith', phone: '987-654-3210', email:"text@test.com" },
        { id: '14', name: 'John Doe', phone: '123-456-7890', email:"text@test.com" },
        { id: '15', name: 'Jane Smith', phone: '987-654-3210', email:"text@test.com" },
        { id: '16', name: 'Alice Adams', phone: '555-1234-5678', email:"text@test.com" },
        { id: '17', name: 'Bob Brown', phone: '555-9876-5432', email:"text@test.com" },
        // Add more contacts as needed
    ];

    // sort contacts by name
    contacts.sort((a, b) => a.name.localeCompare(b.name));

    // Convert contacts data into sections based on the first letter of the name
    const sections = contacts.reduce((acc, contact) => {
        const firstLetter = contact.name.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(contact);
        return acc;
    }, {});

    // Sort each section alphabetically by name
    Object.keys(sections).forEach((key) => {
        sections[key].sort((a, b) => a.name.localeCompare(b.name));
    });

    const sectionsArray = Object.entries(sections).map(([letter, data]) => ({
        title: letter,
        data,
    }));

    const renderContactItem = ({ item }) => (
        <TouchableOpacity
            style={styles.contactItem}
            onPress={() => navigation.navigate('Contact Details', { contact: item })}
        >
            <TextAvatar
                backgroundColor={'#' + Math.floor(Math.random() * 16777215).toString(16)}
                textColor={'#ffffff'}
            >{item.name}</TextAvatar>
            <View style={styles.between}>
                <Text style={{ fontSize: 20, marginLeft: 10, textTransform: 'capitalize' }}>{item.name}</Text>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    <TouchableOpacity style={{marginRight:10}} onPress={() => Linking.openURL(`mailto:${item?.email}`)}>
                        <Feather name="mail" size={25} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${item?.phone}`)}>
                        <Feather name="phone" size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderSectionHeader = ({ section: { title } }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <SectionList
                sections={sectionsArray}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderContactItem}
                renderSectionHeader={renderSectionHeader}
                stickySectionHeadersEnabled={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    contactItem: {
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        // width: '100%',
    },
    sectionHeader: {
        backgroundColor: '#f0f0f0',
        padding: 10,
    },
    sectionHeaderText: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    between: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '85%',
    },
});

export default Contact;
