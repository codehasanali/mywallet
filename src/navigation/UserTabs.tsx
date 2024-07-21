import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home';
import History from '../screens/History';
import { TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
const CustomBackButton = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={{ marginLeft: 10 }}>
        <FontAwesomeIcon icon={faChevronLeft} size={20} color="black" />
    </TouchableOpacity>
);

const Tab = createBottomTabNavigator();
const TeacherTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Tab.Screen
                name='Ana Sayfa' component={HomeScreen} />
            <Tab.Screen
                name='Tarih'

                component={History} />

        </Tab.Navigator>
    );
};

export default TeacherTabs;