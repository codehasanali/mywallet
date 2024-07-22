import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home';
import History from '../screens/History';
import BudgetScreen from '../screens/Budget';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faCalendarAlt, faBullseye } from '@fortawesome/free-solid-svg-icons';

const Tab = createBottomTabNavigator();

const TeacherTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let iconColor = color;

                    // Belirli tab'lar için ikonları ayarla
                    if (route.name === 'Ana Sayfa') {
                        iconName = faHome;
                    } else if (route.name === 'Tarih') {
                        iconName = faCalendarAlt;
                    } else if (route.name === 'Hedef') {
                        iconName = faBullseye;
                    }

                    // Seçili tab'ın rengi
                    if (focused) {
                        iconColor = 'blue'; 
                    }

                    return <FontAwesomeIcon icon={iconName} size={size} color={iconColor} />;
                },
                tabBarActiveTintColor: 'blue',
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
            <Tab.Screen
                name='Hedef'
                component={BudgetScreen}
                options={{ title: 'Hedef' }}
            />
        </Tab.Navigator>
    );
};

export default TeacherTabs;
