import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal, Pressable, Platform, SafeAreaView, StatusBar,Alert } from 'react-native';
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
    const [modalVisible, setModalVisible] = useState<boolean>(false);
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
        if (isim.trim() && !isNaN(miktarNum)) {
            const yeniHarcama: any = {
                name: isim.trim(),
                amount: miktarNum,
                category: kategori,
                 date: selectedDate.toISOString(),
            };
            addExpense(yeniHarcama);
            setIsim('');
            setMiktar('');
            setSelectedDate(new Date());
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

    const harcamaGoster = ({ item, index }: { item: any; index: number }) => (
        <View style={styles.harcamaItem}>
            <View style={styles.harcamaIconContainer}>
                <FontAwesomeIcon icon={getCategoryIcon(item.category as Category)} size={24} color="#007AFF" />
            </View>
            <View style={styles.harcamaDetay}>
                <Text style={styles.harcamaIsim}>{item.name}</Text>
                <Text style={styles.harcamaKategori}>{item.category}</Text>
                <Text style={styles.harcamaTarih}>{moment(item.date).format('LL')}</Text>
            </View>
            <View style={styles.harcamaMiktar}>
                <Text style={styles.harcamaMiktarText}>₺{item.amount.toFixed(2)}</Text>
                <TouchableOpacity onPress={() => removeExpense(index)}>
                    <FontAwesomeIcon icon={faTrashAlt} size={24} color="#FF3B30" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Harcama Yöneticisi</Text>
                <Text style={styles.bakiyeText}>Bakiye: ₺{balance?.toFixed(2) ?? '0.00'}</Text>
            </View>

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

                <TouchableOpacity style={styles.pickerButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.pickerButtonText}>{kategori}</Text>
                    <FontAwesomeIcon icon={faChevronDown} size={24} color="#007AFF" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.pickerButton} onPress={() => setDatePickerVisible(true)}>
                    <Text style={styles.pickerButtonText}>{moment(selectedDate).format('LL')}</Text>
                    <FontAwesomeIcon icon={faCalendarAlt} size={24} color="#007AFF" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.ekleButon} onPress={harcamaEkle}>
                    <Text style={styles.ekleButonText}>Harcama Ekle</Text>
                </TouchableOpacity>
            </View>


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
                                onPress={() => {
                                    setKategori(cat);
                                    setModalVisible(false);
                                }}
                                style={({ pressed }) => [
                                    styles.modalItem,
                                    pressed && styles.modalItemPressed,
                                ]}
                            >
                                <Text style={styles.modalItemText}>{cat}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </Modal>

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
        backgroundColor: '#F2F2F7',
       
    },
    header: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
         fontFamily:'PublicSans-Medium'
    },
    bakiyeText: {
        fontSize: 18,
        color: '#007AFF',
        marginTop: 5,
    },
    formContainer: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderColor: '#E5E5EA',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#FFFFFF',
    },
    pickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        borderColor: '#E5E5EA',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
    },
    pickerButtonText: {
        fontSize: 16,
        color: '#000000',
    },
    ekleButon: {
        backgroundColor: '#7F3DFF',
        paddingVertical: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ekleButonText: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    liste: {
        flex: 1,
    },
    harcamaItem: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
        backgroundColor: '#FFFFFF',
    },
    harcamaIconContainer: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    harcamaDetay: {
        flex: 1,
        paddingHorizontal: 10,
    },
    harcamaIsim: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    harcamaKategori: {
        fontSize: 14,
        color: '#7F8C8D',
    },
    harcamaTarih: {
        fontSize: 12,
        color: '#BDC3C7',
    },
    harcamaMiktar: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    harcamaMiktarText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4008',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        width: '80%',
        padding: 20,
        elevation: 5,
    },
    modalItem: {
        padding: 15,
    },
    modalItemPressed: {
        backgroundColor: '#F0F0F0',
    },
    modalItemText: {
        fontSize: 16,
    },
    datePicker: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#FFFFFF',
    },
});

export default HarcamaYoneticisi;
