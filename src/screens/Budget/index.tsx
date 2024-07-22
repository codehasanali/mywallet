import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import useBalanceStore from '../../store/balanceStore';
import Bucket from './Budget';
import { faCar, faCashRegister, faDumbbell, faGamepad, faGift, faHome, faShoppingCart, faUmbrellaBeach, faUtensils } from '@fortawesome/free-solid-svg-icons';

const categories = [
  { name: "Konaklama", icon: faHome, color: '#5856D6', budget: 500 },
  { name: "Dışarıda Yemek", icon: faUtensils, color: '#34C759', budget: 300 },
  { name: "Alışveriş", icon: faShoppingCart, color: '#FF9500', budget: 400 },
  { name: "Eğlence", icon: faGamepad, color: '#FF2D55', budget: 200 },
  { name: "Ulaşım", icon: faCar, color: '#007AFF', budget: 250 },
  { name: "Hediye", icon: faGift, color: '#FF3B30', budget: 100 },
  { name: "Spor", icon: faDumbbell, color: '#4CD964', budget: 150 },
  { name: "Tatil", icon: faUmbrellaBeach, color: '#FF9500', budget: 1000 },
  { name: "Diğer", icon: faCashRegister, color: '#8E8E93', budget: 200 }
];

const BudgetScreen = () => {
  const { expenses, categoryLimits, updateCategoryLimit, addExpense } = useBalanceStore();
  const [bucketData, setBucketData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newLimit, setNewLimit] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  useEffect(() => {
    const updatedBucketData = categories.map(category => {
      const limit = categoryLimits.find(cl => cl.name === category.name)?.limit || category.budget;
      const spent = expenses
        .filter(exp => exp.category === category.name)
        .reduce((total, exp) => total + exp.amount, 0);

      return {
        ...category,
        spent,
        limit,
      };
    });

    setBucketData(updatedBucketData);
  }, [expenses, categoryLimits]);

  const handleBucketPress = (category) => {
    setSelectedCategory(category);
    const currentLimit = categoryLimits.find(cl => cl.name === category)?.limit || categories.find(cat => cat.name === category)?.budget || 0;
    setNewLimit(currentLimit.toString());
    setModalVisible(true);
  };

  const handleLimitChange = () => {
    if (selectedCategory) {
      const limitValue = parseFloat(newLimit);
      if (!isNaN(limitValue) && limitValue >= 0) {
        updateCategoryLimit(selectedCategory, limitValue);
        setModalVisible(false);
      } else {
        Alert.alert("Hata", "Lütfen geçerli bir limit girin.");
      }
    }
  };

  const handleAddExpense = () => {
    if (selectedCategory) {
      const amountValue = parseFloat(expenseAmount);
      if (!isNaN(amountValue) && amountValue > 0) {
        const limit = categoryLimits.find(cl => cl.name === selectedCategory)?.limit || categories.find(cat => cat.name === selectedCategory)?.budget || 0;
        const totalSpent = expenses
          .filter(exp => exp.category === selectedCategory)
          .reduce((total, exp) => total + exp.amount, 0);

        if (totalSpent + amountValue > limit) {
          Alert.alert(
            "Uyarı",
            "Bu kategori için belirlenen bütçeyi aşıyorsunuz. Yine de bu harcamayı eklemek istiyor musunuz?",
            [
              { text: "Hayır", style: "cancel" },
              { text: "Evet", onPress: () => {
                addExpense(selectedCategory, amountValue);
                setExpenseAmount('');
              } }
            ]
          );
        } else {
          addExpense(selectedCategory, amountValue);
          setExpenseAmount('');
        }
      } else {
        Alert.alert("Hata", "Lütfen geçerli bir harcama miktarı girin.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {bucketData.map((bucket, index) => (
          <TouchableOpacity key={index} style={styles.bucketContainer} onPress={() => handleBucketPress(bucket.name)}>
            <View style={styles.bucketHeader}>
              <FontAwesomeIcon icon={bucket.icon} size={24} color={bucket.color} />
              <Text style={styles.bucketName}>{bucket.name}</Text>
            </View>
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                {bucket.spent.toFixed(2)} / {bucket.limit.toFixed(2)} TL
              </Text>
              <View style={styles.progressBarBackground}>
                <View style={[
                  styles.progressBarFill,
                  { width: `${Math.min((bucket.spent / bucket.limit) * 100, 100)}%`, backgroundColor: bucket.color }
                ]} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bütçe Limiti Ayarla</Text>
            <TextInput
              style={styles.limitInput}
              keyboardType="numeric"
              value={newLimit}
              onChangeText={setNewLimit}
              placeholder="Yeni limit girin"
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleLimitChange}>
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    padding: 16,
  },
  bucketContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  bucketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bucketName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EEEEEE',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  limitInput: {
    width: '100%',
    height: 40,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 16,
  },
  expenseContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  expenseInput: {
    height: 40,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BudgetScreen;