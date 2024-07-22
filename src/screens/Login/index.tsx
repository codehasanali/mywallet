import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Dimensions
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import useAuthStore from '../../store/authStore';

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const login = useAuthStore((state) => state.login);

    const handleLogin = () => {
        if (username) {
            login(username);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1542596598-b7613d6e2b03' }}
                style={styles.backgroundImage}
                blurRadius={5}
            >
                <View style={styles.overlay}>
                    <Text style={styles.title}>MyWallet'e Hoşgeldiniz!</Text>
                    <Text style={styles.subtitle}>Başlamak için kayıt işlemini tamamlayın</Text>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <FontAwesomeIcon icon={faUser} size={24} color="#7F3DFF" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={username}
                                onChangeText={setUsername}
                                placeholder="Kullanıcı Adı"
                                placeholderTextColor="#999999"
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Oluştur</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    title: {
        fontSize: 24,
        color: '#4A4A4A',
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: 'PublicSans-Bold'
    },
    subtitle: {
        fontSize: 14,
        color: '#4A4A4A',
        textAlign: 'center',
        marginBottom: 30,
        fontFamily: 'PublicSans-MediumItalic'

    },
    inputContainer: {
        marginBottom: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F1F1',
        borderRadius: 8,
        paddingLeft: 10,
    },
    inputIcon: {
        padding: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#4A4A4A',
        paddingHorizontal: 10,
         fontFamily:'PublicSans-MediumItalic'
    },
    button: {
        backgroundColor: '#7F3DFF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'PublicSans-Medium'
    },
});

export default LoginScreen;
