import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home';
import History from '../screens/History';
const Tab = createBottomTabNavigator();
const TeacherTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Tab.Screen
                name='Home' component={HomeScreen} />
            <Tab.Screen
                name='Histroy' component={History} />

        </Tab.Navigator>
    );
};

export default TeacherTabs;