import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import useBalanceStore from '../../store/balanceStore';
interface ExpenseItem {
    id: string;
    name: string;
    amount: number;
    date: string;
}

const History: React.FC = () => {
    const { expenses, loadBalanceData } = useBalanceStore();
    const [viewType, setViewType] = useState<'daily' | 'weekly' | 'monthly'>('daily');

    useEffect(() => {
        loadBalanceData();
    }, [loadBalanceData]);

    useEffect(() => {
        console.log('Expenses:', expenses);
    }, [expenses]);

    const groupExpensesByPeriod = (expenses: ExpenseItem[], viewType: 'daily' | 'weekly' | 'monthly') => {
        const groupedExpenses = expenses.reduce((acc, expense) => {
            const date = new Date(expense.date);
            let period: string;

            switch (viewType) {
                case 'daily':
                    period = date.toISOString().split('T')[0];
                    break;
                case 'weekly':
                    const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
                    period = `${weekStart.toISOString().split('T')[0]} - ${date.toISOString().split('T')[0]}`;
                    break;
                case 'monthly':
                    period = `${date.getFullYear()}-${date.getMonth() + 1}`;
                    break;
            }

            if (!acc[period]) {
                acc[period] = [];
            }
            acc[period].push(expense);

            return acc;
        }, {} as { [key: string]: ExpenseItem[] });

        return Object.entries(groupedExpenses).map(([period, items]) => ({
            period,
            items,
        }));
    };

    const groupedExpenses = groupExpensesByPeriod(expenses, viewType);

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    onPress={() => setViewType('daily')}
                    style={[styles.tab, viewType === 'daily' && styles.activeTab]}
                >
                    <Text style={[styles.tabText, viewType === 'daily' && styles.activeTabText]}>Günlük</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setViewType('weekly')}
                    style={[styles.tab, viewType === 'weekly' && styles.activeTab]}
                >
                    <Text style={[styles.tabText, viewType === 'weekly' && styles.activeTabText]}>Haftalık</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setViewType('monthly')}
                    style={[styles.tab, viewType === 'monthly' && styles.activeTab]}
                >
                    <Text style={[styles.tabText, viewType === 'monthly' && styles.activeTabText]}>Aylık</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={groupedExpenses}
                keyExtractor={(item) => item.period}
                renderItem={({ item }) => (
                    <View style={styles.expenseCard}>
                        <Text style={styles.expensePeriod}>{item.period}</Text>
                        {item.items.map((expense, index) => (
                            <View key={index} style={styles.expenseItem}>
                                <View style={styles.expenseInfo}>
                                    <View style={styles.expenseTextContainer}>
                                        <Text style={styles.expenseName}>{expense.name}</Text>
                                        <Text style={styles.expenseDate}>{new Date(expense.date).toLocaleDateString()}</Text>
                                    </View>
                                </View>
                                <Text style={styles.expenseAmount}>₺{expense.amount.toFixed(2)}</Text>
                            </View>
                        ))}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        marginTop: 20
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 15,
        backgroundColor: '#FFFFFF',
        elevation: 2,
    },
    tab: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
    },
    activeTab: {
        backgroundColor: '#7F3DFF',
    },
    tabText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },
    activeTabText: {
        color: '#FFF',
    },
    expenseCard: {
        margin: 10,
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        elevation: 3,
    },
    expensePeriod: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    expenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    expenseInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expenseTextContainer: {
        marginLeft: 12,
    },
    expenseName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    expenseDate: {
        fontSize: 14,
        color: '#888',
        marginTop: 2,
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#7F3DFF',
    },
});

export default History;