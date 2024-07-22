import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, SafeAreaView, Image, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRightFromBracket, faArrowUp, faArrowDown, faChartPie, faWallet, faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import useAuthStore from '../../store/authStore';
import useBalanceStore from '../../store/balanceStore';
import { useAppNavigation } from '../../types/navigation';

const HomeScreen: React.FC = () => {
    const { user, logout } = useAuthStore();
    const { balance, income, expense, loadBalanceData, clearBalanceData } = useBalanceStore();
    const navigation = useAppNavigation();

    useEffect(() => {
        loadBalanceData();
    }, [loadBalanceData]);

    const handleIncomePress = () => navigation.navigate('Gelir');
    const handleExpensePress = () => navigation.navigate('Harcama');
    const handleLogout = async () => {
        await clearBalanceData();
        logout();
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('tr-TR').format(num);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Merhaba,</Text>
                        <Text style={styles.name}>{user || 'Kullanıcı'}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleLogout}
                        style={styles.logoutButton}
                        accessibilityLabel="Çıkış Yap"
                    >
                        <FontAwesomeIcon icon={faRightFromBracket} size={20} color="" />
                    </TouchableOpacity>
                </View>

                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Toplam Bakiye</Text>
                    <Text style={styles.balanceAmount}>₺{formatNumber(balance)}</Text>
                    <Image
                        source={{ uri: 'https://www.w3schools.com/w3images/avatar2.png' }}
                        style={styles.avatar}
                    />
                </View>

                <View style={styles.transactionCards}>
                    <TouchableOpacity
                        style={[styles.card, styles.incomeCard]}
                        onPress={handleIncomePress}
                        accessibilityLabel="Gelir Bilgileri"
                    >
                        <View style={[styles.iconContainer, styles.incomeIconContainer]}>
                            <FontAwesomeIcon icon={faArrowUp} size={20} color="#00A86B" />
                        </View>
                        <View>
                            <Text style={styles.cardLabel}>Gelir</Text>
                            <Text style={[styles.cardAmount, styles.incomeAmount]}>₺{formatNumber(income)}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.card, styles.expenseCard]}
                        onPress={handleExpensePress}
                        accessibilityLabel="Harcama Bilgileri"
                    >
                        <View style={[styles.iconContainer, styles.expenseIconContainer]}>
                            <FontAwesomeIcon icon={faArrowDown} size={20} color="#FD3C4A" />
                        </View>
                        <View>
                            <Text style={styles.cardLabel}>Harcama</Text>
                            <Text style={[styles.cardAmount, styles.expenseAmount]}>₺{formatNumber(expense)}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    greeting: {
        fontSize: 16,
        color: '#91919F',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#161719',
    },
    logoutButton: {
        padding: 10,
        backgroundColor: '#F1E6FF',
        borderRadius: 12,
    },
    balanceCard: {
        backgroundColor: '#7F3DFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        alignItems: 'center',
        position: 'relative',
    },
    balanceLabel: {
        color: '#E0D1FF',
        fontSize: 16,
        marginBottom: 8,
    },
    balanceAmount: {
        color: '#FFF',
        fontSize: 40,
        fontWeight: 'bold',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        position: 'absolute',
        top: -30,
        right: 24,
        borderWidth: 4,
        borderColor: '#FFF',
    },
    transactionCards: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        flex: 1,
        marginHorizontal: 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    incomeIconContainer: {
        backgroundColor: '#E6FFF3',
    },
    expenseIconContainer: {
        backgroundColor: '#FFF2F2',
    },
    incomeCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#00A86B',
    },
    expenseCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#FD3C4A',
    },
    cardLabel: {
        fontSize: 14,
        color: '#91919F',
        marginBottom: 4,
    },
    cardAmount: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    incomeAmount: {
        color: '#00A86B',
    },
    expenseAmount: {
        color: '#FD3C4A',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#161719',
        marginTop: 24,
        marginBottom: 16,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    quickActionItem: {
        alignItems: 'center',
        flex: 1,
    },
    quickActionIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F1E6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickActionText: {
        fontSize: 14,
        color: '#7F3DFF',
    },
});

export default HomeScreen;
