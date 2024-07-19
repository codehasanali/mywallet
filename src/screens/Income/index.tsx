import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import useBalanceStore from '../../store/balanceStore';
import { useNavigation } from '@react-navigation/native';

const Income = () => {
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { balance, income, setBalance, setIncome, expenses, addExpense } = useBalanceStore();
    const navigation = useNavigation();

    const handleSave = () => {
        const parsedAmount = parseFloat(amount);
        if (!isNaN(parsedAmount) && amount.trim() !== '') {
            const newIncome = income + parsedAmount;
            const newBalance = balance + parsedAmount;
            setIncome(newIncome);
            setBalance(newBalance);

            // Tarihi string olarak sakla
            const dateString = date.toISOString(); // ISO formatı kullanabilirsiniz

            // Yeni gider ekle
            const expense = {
                name: 'Income',
                amount: parsedAmount,
                category: 'Income',
                date: dateString, // Tarih bilgisini string formatında sakla
            };

            addExpense(expense); // useBalanceStore'daki addExpense fonksiyonunu çağır
            navigation.goBack();
        }
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Amount</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Date</Text>
                    <TouchableOpacity
                        style={styles.dateInputContainer}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <FontAwesomeIcon icon={faCalendar} size={20} color="#91919F" style={styles.calendarIcon} />
                        <Text style={styles.dateInput}>
                            {date.toLocaleDateString()}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )}
                </View>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleSave}>
                <Text style={styles.addButtonText}>Add money</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#91919F',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F1F1FA',
        borderRadius: 16,
        padding: 16,
        color: '#000',
        fontSize: 16,
    },
    dateInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F1FA',
        borderRadius: 16,
        padding: 16,
    },
    calendarIcon: {
        marginRight: 10,
    },
    dateInput: {
        color: '#000',
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#7F3DFF',
        borderRadius: 16,
        padding: 16,
        margin: 16,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Income;
