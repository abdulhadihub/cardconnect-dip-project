import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Contact from './Contacts.js';
import ContactDetails from './ContactDetails.js';

const Stack = createStackNavigator();

const ContactNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Contacts" component={Contact} />
            <Stack.Screen name="Contact Details" component={ContactDetails} />
        </Stack.Navigator>
    );
}

export default ContactNavigator
