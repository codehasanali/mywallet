import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Alert } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import useBalanceStore from '../../store/balanceStore';
import { useNavigation } from '@react-navigation/native';

const generateId = () => Math.random().toString(36).substr(2, 9);

const Income = () => {
    const [amount, setAmount] = useState('');
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { addIncome } = useBalanceStore();
    const navigation = useNavigation();

    const handleSave = () => {
        const parsedAmount = parseFloat(amount);
        if (!isNaN(parsedAmount) && amount.trim() !== '' && name.trim() !== '') {
            const dateString = date.toISOString();

            const incomeEntry = {
                id: generateId(), 
                name: name.trim(),
                amount: parsedAmount,
                date: dateString,
                category: 'Income',
            };

            addIncome(incomeEntry);
            Alert.alert('Başarılı', 'Gelir başarıyla eklendi.');
            navigation.goBack();
        } else {
            Alert.alert('Hata', 'Lütfen geçerli bir isim ve miktar girin.');
        }
    }

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
                    <Text style={styles.label}>Gelir Adı</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Gelir adı"
                        value={name}
                        onChangeText={setName}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Miktar</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Tarih</Text>
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
                <Text style={styles.addButtonText}>Gelir Ekle</Text>
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
