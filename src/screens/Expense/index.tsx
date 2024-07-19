import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import useBalanceStore from '../../store/balanceStore';

const categories = [
    "Konaklama",
    "Dışarıda Yemek",
    "Alışveriş",
    "Eğlence",
    "Ulaşım",
    "Hediye",
    "Spor",
    "Tatil",
    "Diğer"
];

interface ExpenseItem {
    name: string;
    amount: number;
    category: string;
    date: Date;
}

const HarcamaYoneticisi: React.FC = () => {
    const { balance, expenses, addExpense, removeExpense } = useBalanceStore();
    const [isim, setIsim] = useState<string>('');
    const [miktar, setMiktar] = useState<string>('');
    const [kategori, setKategori] = useState<string>('Diğer');
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [datePickerVisible, setDatePickerVisible] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || new Date();
        setDatePickerVisible(Platform.OS === 'ios');
        setSelectedDate(currentDate);
    };

    const harcamaEkle = () => {
        const miktarNum = parseFloat(miktar);
        if (isim.trim() && !isNaN(miktarNum)) {
            const yeniHarcama: ExpenseItem = {
                name: isim.trim(),
                amount: miktarNum,
                category: kategori,
                date: selectedDate,
            };
            addExpense(yeniHarcama);
            setIsim('');
            setMiktar('');
            setSelectedDate(new Date());
        } else {
            alert('Lütfen geçerli bir isim ve miktar girin.');
        }
    };

    const harcamaGoster = ({ item, index }: { item: ExpenseItem; index: number }) => (
        <View style={styles.harcamaItem}>
            <Text style={styles.harcamaText}>
                {item.name} - {item.amount.toFixed(2)} ({item.category}) - {item.date.toLocaleDateString()}
            </Text>
            <TouchableOpacity onPress={() => removeExpense(index)}>
                <Text style={styles.silButon}>Sil</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.bakiyeText}>Mevcut Bakiye: {balance?.toFixed(2) ?? '0.00'} TRY</Text>

            <TextInput
                style={styles.input}
                placeholder="Harcama Adı"
                value={isim}
                onChangeText={setIsim}
            />
            <TextInput
                style={styles.input}
                placeholder="Miktar"
                value={miktar}
                onChangeText={setMiktar}
                keyboardType="numeric"
            />

            <TouchableOpacity style={styles.pickerButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.pickerButtonText}>{kategori}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pickerButton} onPress={() => setDatePickerVisible(true)}>
                <Text style={styles.pickerButtonText}>{selectedDate.toDateString()}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ekleButon} onPress={harcamaEkle}>
                <Text style={styles.ekleButonText}>Harcama Ekle</Text>
            </TouchableOpacity>

            <FlatList
                data={expenses}
                renderItem={harcamaGoster}
                keyExtractor={(item, index) => index.toString()}
            />

            {/* Kategori Seçim Modali */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {categories.map((cat, index) => (
                            <Pressable
                                key={index}
                                style={styles.categoryItem}
                                onPress={() => {
                                    setKategori(cat);
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={styles.categoryText}>{cat}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </Modal>

            {/* Tarih Seçici */}
            {datePickerVisible && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    bakiyeText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        height: 50,
        borderColor: '#DDDDDD',
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 10,
        paddingHorizontal: 15,
        backgroundColor: '#FFFFFF',
    },
    pickerButton: {
        height: 50,
        borderColor: '#DDDDDD',
        borderWidth: 1,
        borderRadius: 12,
        justifyContent: 'center',
        paddingHorizontal: 15,
        backgroundColor: '#FFFFFF',
        marginBottom: 20,
    },
    pickerButtonText: {
        fontSize: 16,
        color: '#333',
    },
    ekleButon: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    ekleButonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    harcamaItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#DDDDDD',
    },
    harcamaText: {
        fontSize: 16,
        color: '#333',
    },
    silButon: {
        color: '#dc3545',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    categoryItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD',
    },
    categoryText: {
        fontSize: 16,
        color: '#333',
    },
});

export default HarcamaYoneticisi;
