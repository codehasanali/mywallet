import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, SafeAreaView, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell, faPlus, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import useAuthStore from '../../store/authStore';
import useBalanceStore from '../../store/balanceStore';
import { useAppNavigation } from '../../types/navigation';

const HomeScreen: React.FC = () => {
    const { user, logout } = useAuthStore();
    const { balance, income, expense, loadBalanceData } = useBalanceStore();
    const navigation = useAppNavigation();

    useEffect(() => {
        loadBalanceData();
    }, [loadBalanceData]);

    const handleIncomePress = () => {
        navigation.navigate('Income');
    };

    const handleExpensePress = () => {
        navigation.navigate('Expense');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>
                        Merhaba, <Text style={styles.name}>{user || 'Kullanıcı'}</Text>!
                    </Text>
                    <Text style={styles.subGreeting}>Finansal bilgilerin harika!</Text>
                </View>
                <TouchableOpacity onPress={logout}>
                    <FontAwesomeIcon icon={faRightFromBracket} size={24} color="#000" />
                </TouchableOpacity>
            </View>
            <View style={styles.balanceCard}>
                <Image
                    source={{ uri: `https://gravatar.com/avatar/${user || 'default'}` }}
                    style={styles.avatar}
                />
                <Text style={styles.balanceLabel}>Mevcut bakiyeniz</Text>
                <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
            </View>
            <View style={styles.transactionCards}>
                <TouchableOpacity style={styles.incomeCard} onPress={handleIncomePress}>
                    <Text style={styles.cardLabel}>Gelir</Text>
                    <Text style={styles.cardAmount}>${income.toFixed(2)}</Text>
                    <FontAwesomeIcon icon={faPlus} size={20} color="#FFF" style={styles.plusIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.expenseCard} onPress={handleExpensePress}>
                    <Text style={styles.cardLabel}>Harcama</Text>
                    <Text style={styles.cardAmount}>${expense.toFixed(2)}</Text>
                    <FontAwesomeIcon icon={faPlus} size={20} color="#FFF" style={styles.plusIcon} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    greeting: {
        fontSize: 24,
        fontFamily: 'PublicSans-Regular',
    },
    name: {
        color: '#7F3DFF',
        fontFamily: 'PublicSans-Bold',
        fontWeight: 'bold',
    },
    subGreeting: {
        fontSize: 14,
        color: '#91919F',
        marginTop: 4,
    },
    balanceCard: {
        backgroundColor: '#7F3DFF',
        borderRadius: 24,
        padding: 24,
        margin: 16,
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 16,
    },
    balanceLabel: {
        color: '#FFF',
        fontSize: 16,
        marginBottom: 8,
    },
    balanceAmount: {
        color: '#FFF',
        fontSize: 40,
        fontWeight: 'bold',
    },
    transactionCards: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 16,
    },
    incomeCard: {
        backgroundColor: '#1C0045',
        borderRadius: 24,
        padding: 16,
        flex: 1,
        marginRight: 8,
    },
    expenseCard: {
        backgroundColor: '#6F12F5',
        borderRadius: 24,
        padding: 16,
        flex: 1,
        marginLeft: 8,
    },
    cardLabel: {
        color: '#FFF',
        fontSize: 14,
        marginBottom: 8,
    },
    cardAmount: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
    },
    plusIcon: {
        position: 'absolute',
        right: 16,
        top: 16,
    },
});

export default HomeScreen;
