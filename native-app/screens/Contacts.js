import React from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
const getAsyncFinal = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('allContacts')
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log(e);
    }
}
const Contact = ({ navigation }) => {
    // Dummy contact data for demonstration
    const [contacts, setContacts] = React.useState([])
    React.useEffect(async() => {
        const data = await getAsyncFinal()
        console.log("datadadadada", data)
        setContacts(data)
    }, [navigation])

    // sort contacts by name
    contacts?.sort((a, b) => a.name.localeCompare(b.name));

    // Convert contacts data into sections based on the first letter of the name
    const sections = contacts?.reduce((acc, contact) => {
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
                <Text style={{ fontSize: 20, marginLeft: 10, textTransform: 'capitalize' }}>{item?.name}</Text>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    <TouchableOpacity style={{marginRight:10}} onPress={() => Linking.openURL(`mailto:${item?.email}`)}>
                        <Feather name="mail" size={25} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${item?.contact}`)}>
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
                keyExtractor={(item) => item?.image?.toString()}
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
