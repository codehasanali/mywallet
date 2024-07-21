import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home';
import History from '../screens/History';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const Tab = createBottomTabNavigator();

const TeacherTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Ana Sayfa') {
                        iconName = faHome;
                    } else if (route.name === 'Tarih') {
                        iconName = faCalendarAlt;
                    }

                    // You can return any component that you like here!
                    return <FontAwesomeIcon icon={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: '#f5f5f5',
                    borderTopColor: '#e0e0e0',
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                },
                tabBarIconStyle: {
                    marginBottom: 0,
                },
            })}
        >
            <Tab.Screen
                name='Ana Sayfa'
                component={HomeScreen}
                options={{ title: 'Ana Sayfa' }}
            />
            <Tab.Screen
                name='Tarih'
                component={History}
                options={{ title: 'Tarih' }}
            />
        </Tab.Navigator>
    );
};

export default TeacherTabs;
