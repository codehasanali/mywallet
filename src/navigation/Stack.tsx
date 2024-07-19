import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import useAuthStore from '../store/authStore';
import LoginScreen from '../screens/Login';
import Income from '../screens/Income';
import UserTabs from './UserTabs';
import Expense from '../screens/Expense';

export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    Income: undefined;
    Expense: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const CustomBackButton = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={{ marginLeft: 10 }}>
        <FontAwesomeIcon icon={faChevronLeft} size={20} color="black" />
    </TouchableOpacity>
);

export default function Stacks() {
    const { user, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <Stack.Navigator
            screenOptions={{
                headerShadowVisible: false
            }}
        >
            {user ? (
                <Stack.Screen

                    name="Home" component={UserTabs}
                    options={{
                        headerShown: false,
                    }}


                />
            ) : (
                <Stack.Screen name="Login" component={LoginScreen} />
            )}
            <Stack.Screen
                name="Income"
                component={Income}
                options={({ navigation }) => ({
                    headerShown: true,
                    headerBackVisible: false,
                    headerLeft: () => (
                        <CustomBackButton onPress={() => navigation.goBack()} />
                    ),
                })}
            />
            <Stack.Screen
                name="Expense"
                component={Expense}
                options={({ navigation }) => ({
                    headerShown: true,
                    headerBackVisible: false,
                    headerLeft: () => (
                        <CustomBackButton onPress={() => navigation.goBack()} />
                    ),
                })}
            />
        </Stack.Navigator>
    );
}
