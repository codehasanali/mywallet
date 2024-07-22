import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faUtensils, faShoppingCart, faGamepad, faCar, faGift, faDumbbell, faUmbrellaBeach, faCashRegister } from '@fortawesome/free-solid-svg-icons';

interface Category {
  name: string;
  icon: any;
  color: string;
  budget: number;
}

interface BucketData extends Category {
  spent: number;
  limit: number;
}

const Bucket: React.FC<BucketData & { onPress: () => void }> = ({ name, icon, color, spent = 0, limit = 0, budget = 0, onPress }) => {
  const progress = budget > 0 ? (spent / budget) * 100 : 0;
  const isOverBudget = spent > limit && limit > 0;

  const spentAmount = (spent || 0).toFixed(2);
  const budgetAmount = (budget || 0).toFixed(2);
  const limitAmount = (limit || 0).toFixed(2);

  return (
    <TouchableOpacity style={styles.bucketContainer} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <FontAwesomeIcon icon={icon} size={24} color={color} />
      </View>
      <View style={styles.bucketInfo}>
        <Text style={styles.bucketName}>{name}</Text>
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${Math.min(progress, 100)}%`, backgroundColor: isOverBudget ? '#FF3B30' : color }
            ]} 
          />
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.spentAmount}>₺{spentAmount}</Text>
          <Text style={styles.budgetAmount}>/ ₺{budgetAmount}</Text>
        </View>
        {limit > 0 && (
          <Text style={styles.limitText}>Limit: ₺{limitAmount}</Text>
        )}
        {isOverBudget && (
          <Text style={styles.overBudgetText}>Bütçe aşıldı!</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bucketContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bucketInfo: {
    flex: 1,
  },
  bucketName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  spentAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  budgetAmount: {
    fontSize: 14,
    color: '#8E8E93',
  },
  limitText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  overBudgetText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
});

export default Bucket;
