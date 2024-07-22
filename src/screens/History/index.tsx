import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import useBalanceStore from '../../store/balanceStore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowUp, faArrowDown, faCalendarDay, faCalendarWeek, faCalendarAlt, faShoppingCart, faUtensils, faHome, faCar } from '@fortawesome/free-solid-svg-icons';

const History = () => {
    const { expenses, income, expense, loadBalanceData } = useBalanceStore();
    const [viewType, setViewType] = useState('daily');
    const [groupedData, setGroupedData] = useState({});

    useEffect(() => {
        loadBalanceData();
    }, [loadBalanceData]);

    useEffect(() => {
        const grouped = groupExpensesByPeriod(expenses, viewType);
        setGroupedData(grouped);
    }, [expenses, viewType]);

    const groupExpensesByPeriod = (expenses, viewType) => {
        return expenses.reduce((acc, curr) => {
            const date = new Date(curr.date);
            let key;
            switch (viewType) {
                case 'daily':
                    key = date.toISOString().split('T')[0];
                    break;
                case 'weekly':
                    const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
                    key = weekStart.toISOString().split('T')[0];
                    break;
                case 'monthly':
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    break;
                default:
                    key = '';
            }
            if (!acc[key]) {
                acc[key] = { total: 0, items: [] };
            }
            acc[key].total += curr.amount * (curr.category === 'Income' ? 1 : -1);
            acc[key].items.push(curr);
            return acc;
        }, {});
    };

    const getCategoryIcon = (category) => {
        switch (category.toLowerCase()) {
            case 'shopping': return faShoppingCart;
            case 'food': return faUtensils;
            case 'housing': return faHome;
            case 'transport': return faCar;
            default: return faArrowDown;
        }
    };

    const renderListItem = ({ item }) => (
        <View style={styles.groupContainer}>
            <Text style={styles.groupTitle}>{item.period}</Text>
            <Text style={styles.groupTotal}>Toplam: ₺{item.total.toFixed(0)}</Text>
            {item.items.map((expense) => (
                <View key={expense.id} style={styles.expenseItem}>
                    <View style={styles.expenseInfo}>
                        <FontAwesomeIcon 
                            icon={expense.category === 'Income' ? faArrowUp : getCategoryIcon(expense.category)}
                            size={20} 
                            color={expense.category === 'Income' ? '#4CAF50' : '#F44336'} 
                        />
                        <View style={styles.expenseTextContainer}>
                            <Text style={styles.expenseName}>{expense.name}</Text>
                            <Text style={styles.expenseDate}>{new Date(expense.date).toLocaleDateString('tr-TR')}</Text>
                        </View>
                    </View>
                    <Text style={[styles.expenseAmount, expense.category === 'Income' ? styles.incomeAmount : styles.expenseAmount]}>
                        {expense.category === 'Income' ? '+' : '-'}₺{expense.amount.toFixed(0)}
                    </Text>
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.pieChartContainer}>
                <PieChart
                    data={[
                        { name: 'Gelir', population: income, color: '#4CAF50' },
                        { name: 'Gider', population: expense, color: '#F44336' },
                    ]}
                    width={Dimensions.get('window').width - 40}
                    height={220}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                />
            </View>

            <View style={styles.tabContainer}>
                {['daily', 'weekly', 'monthly'].map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[styles.tab, viewType === type && styles.activeTab]}
                        onPress={() => setViewType(type)}
                    >
                        <FontAwesomeIcon 
                            icon={type === 'daily' ? faCalendarDay : type === 'weekly' ? faCalendarWeek : faCalendarAlt} 
                            size={20} 
                            color={viewType === type ? '#FFF' : '#512DA8'} 
                        />
                        <Text style={[styles.tabText, viewType === type && styles.activeTabText]}>
                            {type === 'daily' ? 'Günlük' : type === 'weekly' ? 'Haftalık' : 'Aylık'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={Object.keys(groupedData).map((key) => ({
                    period: key,
                    total: groupedData[key].total,
                    items: groupedData[key].items,
                }))}
                renderItem={renderListItem}
                keyExtractor={(item) => item.period}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>Henüz işlem yok</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    pieChartContainer: {
        borderRadius: 16,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 16,
        backgroundColor: '#E6E0F0',
        width: '30%',
        justifyContent: 'center',
    },
    activeTab: {
        backgroundColor: '#512DA8',
    },
    tabText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#512DA8',
        fontWeight: '600',
    },
    activeTabText: {
        color: '#FFF',
    },
    input: {
        height: 40,
        borderColor: '#E6E0F0',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: '#F9F9F9',
        color: '#512DA8',
    },
    groupContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#E6E0F0',
    },
    groupTitle: {
        fontSize: 20, // Increased font size
        fontWeight: '700', // Slightly bolder font weight
        color: '#512DA8',
        marginBottom: 5,
    },
    groupTotal: {
        fontSize: 18, // Slightly larger font size
        color: '#757575',
        marginBottom: 10,
    },
    expenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12, // Increased padding for better spacing
        borderBottomWidth: 1,
        borderBottomColor: '#E6E0F0',
        borderRadius: 8,
        backgroundColor: '#F9F9F9',
        marginBottom: 10,
    },
    expenseInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expenseTextContainer: {
        marginLeft: 12, // Increased margin for better spacing
    },
    expenseName: {
        fontSize: 18, // Slightly larger font size
        fontWeight: '600',
        color: '#512DA8',
    },
    expenseDate: {
        fontSize: 15, // Slightly larger font size
        color: '#757575',
    },
    expenseAmount: {
        fontSize: 18,
        fontWeight: '700',
        color: '#F44336',
    },
    incomeAmount: {
        color: '#4CAF50',
    },
   
    emptyState: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#757575',
    },
});


export default History;
