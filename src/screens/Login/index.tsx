import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import useAuthStore from '../../store/authStore';

const LoginScreen: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const login = useAuthStore((state) => state.login);

    const handleLogin = () => {
        if (username) {
            login(username);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hoş Geldiniz</Text>
            <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Kullanıcı adı"
                placeholderTextColor="#A0AEC0"
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#Ffff',
    },
    title: {
        fontFamily: 'PublicSans-Bold',
        fontSize: 32,
        color: '#40080',
        marginBottom: 40,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#40080',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        padding: 15,
        fontFamily: 'PublicSans-Regular',
        fontSize: 16,
        color: '#333333',
        backgroundColor: '#FFFFFF',
    },
    button: {
        backgroundColor: '#400080',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontFamily: 'PublicSans-SemiBold',
        fontSize: 18,
    },
});

export default LoginScreen;