import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import useBalanceStore from '../../store/balanceStore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowUp, faArrowDown, faCalendarDay, faCalendarWeek, faCalendarAlt, faShoppingCart, faUtensils, faHome, faCar } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

type Expense = {
    id: string;
    date: string;
    amount: number;
    name: string;
    category: 'Income' | 'Expense';
};

type GroupedExpense = {
    total: number;
    items: Expense[];
};

type GroupedData = Record<string, GroupedExpense>;

type BalanceStore = {
    expenses: Expense[];
    income: number;
    expense: number;
    balance: number;
    loadBalanceData: () => Promise<void>;
};

const History: React.FC = () => {
    const { expenses, income, expense, balance, loadBalanceData } = useBalanceStore() as BalanceStore;
    const [viewType, setViewType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const [groupedData, setGroupedData] = useState<GroupedData>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await loadBalanceData();
            setIsLoading(false);
        };
        fetchData();
    }, [loadBalanceData]);

    useEffect(() => {
        const grouped = groupExpensesByPeriod(expenses, viewType);
        setGroupedData(grouped);
    }, [expenses, viewType]);

    const groupExpensesByPeriod = (expenses: Expense[], viewType: 'daily' | 'weekly' | 'monthly'): GroupedData => {
        return expenses.reduce((acc: GroupedData, curr) => {
            const date = new Date(curr.date);
            let key: string;
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

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'shopping': return faShoppingCart;
            case 'food': return faUtensils;
            case 'housing': return faHome;
            case 'transport': return faCar;
            default: return faArrowDown;
        }
    };

    const renderItem = ({ item }: { item: { period: string; total: number; items: Expense[] } }) => (
        <View style={styles.groupContainer}>
            <Text style={styles.groupTitle}>{item.period}</Text>
            <Text style={styles.groupTotal}>Toplam: ₺{item.total.toFixed(2)}</Text>
            {item.items.map((expense, index) => (
                <View key={`${item.period}-${expense.id}-${index}`} style={styles.expenseItem}>
                    <View style={styles.expenseInfo}>
                        <FontAwesomeIcon 
                            icon={expense.category === 'Income' ? faArrowUp : getCategoryIcon(expense.category)}
                            size={20} 
                            color={expense.category === 'Income' ? '#4CAF50' : '#F44336'} 
                        />
                        <View style={styles.expenseTextContainer}>
                            <Text style={styles.expenseName}>{expense.name}</Text>
                            <Text style={styles.expenseDate}>{new Date(expense.date).toLocaleDateString()}</Text>
                        </View>
                    </View>
                    <Text style={[styles.expenseAmount, expense.category === 'Income' ? styles.incomeAmount : styles.expenseAmount]}>
                        {expense.category === 'Income' ? '+' : '-'}₺{expense.amount.toFixed(2)}
                    </Text>
                </View>
            ))}
        </View>
    );

    const chartData = {
        labels: Object.keys(groupedData),
        datasets: [
            {
                data: Object.values(groupedData).map(group => group.total),
            },
        ],
    };

    if (chartData.labels.length === 0) {
        chartData.labels = ['No Data'];
        chartData.datasets[0].data = [0];
    }

    const shortenLabel = (label: string) => {
        switch (viewType) {
            case 'daily':
                return label.split('-').slice(1).join('-');
            case 'weekly':
                return `W${moment(label).week()}`;
            case 'monthly':
                return moment(label).format('MMM YY');
            default:
                return label;
        }
    };

    return (
        <ScrollView style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#512DA8" style={styles.loader} />
            ) : (
                <>
                    <View style={styles.summaryContainer}>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Toplam Gelir</Text>
                            <Text style={[styles.summaryValue, styles.incomeValue]}>₺{income.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Toplam Gider</Text>
                            <Text style={[styles.summaryValue, styles.expenseValue]}>₺{expense.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Bakiye</Text>
                            <Text style={[styles.summaryValue, balance >= 0 ? styles.incomeValue : styles.expenseValue]}>
                                ₺{balance.toFixed(2)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.chartContainer}>
                        <LineChart
                            data={{
                                labels: chartData.labels.map(shortenLabel),
                                datasets: chartData.datasets
                            }}
                            width={Dimensions.get('window').width - 40}
                            height={220}
                            yAxisLabel="₺"
                            chartConfig={{
                                backgroundColor: '#ffffff',
                                backgroundGradientFrom: '#f5f5f5',
                                backgroundGradientTo: '#f5f5f5',
                                decimalPlaces: 2,
                                color: (opacity = 1) => `rgba(81, 45, 168, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: "#512DA8"
                                }
                            }}
                            bezier
                            style={styles.chart}
                        />
                    </View>

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
                                onPress={() => setViewType(type as 'daily' | 'weekly' | 'monthly')}
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
                        renderItem={renderItem}
                        keyExtractor={(item) => item.period}
                        style={styles.listContainer}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateText}>Henüz işlem yok</Text>
                            </View>
                        }
                    />
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0EAF9',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    loader: {
        marginTop: 50,
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    summaryCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 15,
        width: '30%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#512DA8',
        marginBottom: 5,
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    incomeValue: {
        color: '#4CAF50',
    },
    expenseValue: {
        color: '#F44336',
    },
    chartContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    pieChartContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    chart: {
        borderRadius: 16,
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
    listContainer: {
        flexGrow: 1,
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
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#512DA8',
        marginBottom: 5,
    },
    groupTotal: {
        fontSize: 16,
        color: '#757575',
        marginBottom: 10,
    },
    expenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E6E0F0',
    },
    expenseInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expenseTextContainer: {
        marginLeft: 10,
    },
    expenseName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#512DA8',
    },
    expenseDate: {
        fontSize: 14,
        color: '#757575',
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#F44336',
    },
    incomeAmount: {
        color: '#4CAF50',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    emptyStateText: {
        fontSize: 18,
        color: '#757575',
    },
});

export default History;