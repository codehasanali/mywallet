import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, SafeAreaView, StatusBar, Alert, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import useBalanceStore from '../../store/balanceStore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faHome, faUtensils, faShoppingCart, faGamepad, faCar,
    faGift, faDumbbell, faUmbrellaBeach, faCashRegister,
    faCalendarAlt, faChevronDown, faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import moment from 'moment';
import 'moment/locale/tr';

// Define spending limits for each category
const categoryLimits: { [key: string]: number } = {
    "Konaklama": 1000,
    "Dışarıda Yemek": 500,
    "Alışveriş": 300,
    "Eğlence": 200,
    "Ulaşım": 150,
    "Hediye": 250,
    "Spor": 100,
    "Tatil": 1500,
    "Diğer": 100,
};

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
] as const;

interface Expense {
    name: string;
    amount: number;
    category: Category;
    date: string;
}

type Category = typeof categories[number];

const HarcamaYoneticisi: React.FC = () => {
    const { balance, expenses, addExpense, removeExpense } = useBalanceStore();
    const [isim, setIsim] = useState<string>('');
    const [miktar, setMiktar] = useState<string>('');
    const [kategori, setKategori] = useState<Category>('Diğer');
    const [datePickerVisible, setDatePickerVisible] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    moment.locale('tr');

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || new Date();
        setDatePickerVisible(Platform.OS === 'ios');
        setSelectedDate(currentDate);
    };

    const harcamaEkle = () => {
        const miktarNum = parseFloat(miktar);

        console.log('Harcama Ekle triggered');
        console.log(`Isim: ${isim}, Miktar: ${miktarNum}, Kategori: ${kategori}`);

        if (isim.trim() && !isNaN(miktarNum)) {
            const limit = categoryLimits[kategori];
            console.log(`Limit for ${kategori}: ₺${limit}`);

            if (miktarNum > limit) {
                console.log(`Miktar ₺${miktarNum} exceeds limit`);
                Alert.alert(
                    'Limit Aşıldı',
                    `Bu kategorideki limit ₺${limit} olup, girdiğiniz miktar ₺${miktarNum} limitin üzerinde. Devam etmek istiyor musunuz?`,
                    [
                        {
                            text: 'Hayır',
                            style: 'cancel',
                        },
                        {
                            text: 'Evet',
                            onPress: () => {
                                console.log('Adding expense with limit exceeded');
                                const yeniHarcama: Expense = {
                                    name: isim.trim(),
                                    amount: miktarNum,
                                    category: kategori,
                                    date: selectedDate.toISOString(),
                                };
                                addExpense(yeniHarcama);
                                setIsim('');
                                setMiktar('');
                                setSelectedDate(new Date());
                            },
                        },
                    ]
                );
            } else {
                console.log(`Miktar ₺${miktarNum} within limit`);
                const yeniHarcama: Expense = {
                    name: isim.trim(),
                    amount: miktarNum,
                    category: kategori,
                    date: selectedDate.toISOString(),
                };
                addExpense(yeniHarcama);
                setIsim('');
                setMiktar('');
                setSelectedDate(new Date());
            }
        } else {
            Alert.alert('Lütfen geçerli bir isim ve miktar girin.');
        }
    };

    const getCategoryIcon = (category: Category): IconDefinition => {
        switch (category) {
            case "Konaklama": return faHome;
            case "Dışarıda Yemek": return faUtensils;
            case "Alışveriş": return faShoppingCart;
            case "Eğlence": return faGamepad;
            case "Ulaşım": return faCar;
            case "Hediye": return faGift;
            case "Spor": return faDumbbell;
            case "Tatil": return faUmbrellaBeach;
            default: return faCashRegister;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />

            <View style={styles.formContainer}>
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

                <View style={styles.pickerButton}>
                    <Text style={styles.pickerButtonText}>{kategori}</Text>
                    <TouchableOpacity onPress={() => setKategori(prev => {
                        const currentIndex = categories.indexOf(prev);
                        const nextIndex = (currentIndex + 1) % categories.length;
                        return categories[nextIndex];
                    })}>
                        <FontAwesomeIcon icon={faChevronDown} size={24} color="#007AFF" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.pickerButton} onPress={() => setDatePickerVisible(true)}>
                    <Text style={styles.pickerButtonText}>{moment(selectedDate).format('LL')}</Text>
                    <FontAwesomeIcon icon={faCalendarAlt} size={24} color="#007AFF" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.ekleButon} onPress={harcamaEkle}>
                    <Text style={styles.ekleButonText}>Harcama Ekle</Text>
                </TouchableOpacity>
            </View>

            {datePickerVisible && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    style={styles.datePicker}
                    locale='tr-TR'
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    formContainer: {
        padding: 20,
    },
    input: {
        height: 50,
        borderColor: '#E5E5EA',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontFamily: 'PublicSans-Regular',
    },
    pickerButton: {
        height: 50,
        borderColor: '#E5E5EA',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        fontFamily: 'PublicSans-Regular',
    },
    pickerButtonText: {
        flex: 1,
        color: '#7F7F7F',
    },
    ekleButon: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ekleButonText: {
        color: 'white',
        fontFamily: 'PublicSans-Regular',
        fontSize: 16,
    },
    datePicker: {
        width: '100%',
    },
});

export default HarcamaYoneticisi;
