import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ExpenseItem {
    id: string;
    name: string;
    amount: number;
    date: string;
    category: string;
}

export interface CategoryLimit {
    name: string;
    limit: number;
}

interface BalanceState {
    balance: number;
    income: number;
    expense: number;
    expenses: ExpenseItem[];
    categoryLimits: CategoryLimit[];
    setBalance: (amount: number) => void;
    setIncome: (amount: number) => void;
    setExpense: (amount: number) => void;
    addExpense: (expense: ExpenseItem) => void;
    addIncome: (incomeEntry: Omit<ExpenseItem, 'id'>) => void;
    removeExpense: (index: number) => void;
    updateCategoryLimit: (category: string, limit: number) => void;
    loadBalanceData: () => Promise<void>;
    clearBalanceData: () => Promise<void>;
}

const saveBalanceData = async (balance: number, income: number, expense: number, expenses: ExpenseItem[], categoryLimits: CategoryLimit[]) => {
    try {
        await AsyncStorage.setItem('balance', balance.toString());
        await AsyncStorage.setItem('income', income.toString());
        await AsyncStorage.setItem('expense', expense.toString());
        await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
        await AsyncStorage.setItem('categoryLimits', JSON.stringify(categoryLimits));
    } catch (error) {
        console.error('Save balance data error:', error);
    }
};

const useBalanceStore = create<BalanceState>((set) => ({
    balance: 0,
    income: 0,
    expense: 0,
    expenses: [],
    categoryLimits: [
        { name: "Konaklama", limit: 500 },
        { name: "Dışarıda Yemek", limit: 300 },
        { name: "Alışveriş", limit: 400 },
        { name: "Eğlence", limit: 200 },
        { name: "Ulaşım", limit: 250 },
        { name: "Hediye", limit: 100 },
        { name: "Spor", limit: 150 },
        { name: "Tatil", limit: 1000 },
        { name: "Diğer", limit: 200 }
    ],
    setBalance: (amount: number) => set({ balance: amount }),
    setIncome: (amount: number) => set({ income: amount }),
    setExpense: (amount: number) => set({ expense: amount }),
    addExpense: (expense: ExpenseItem) => set((state) => {
        const categoryLimit = state.categoryLimits.find(cat => cat.name === expense.category)?.limit ?? Infinity;

        if (expense.amount > categoryLimit) {
            alert(`Harcamanız ${expense.category} kategorisi için belirlenen limiti aşıyor! Limit: ₺${categoryLimit}`);
            return state; // Do not update state if the limit is exceeded
        }

        const updatedExpenses = [...state.expenses, expense];
        let updatedIncome = state.income;
        let updatedExpense = state.expense;
        let updatedBalance = state.balance;

        if (expense.category === 'Income') {
            updatedIncome += expense.amount;
            updatedBalance += expense.amount;
        } else {
            updatedExpense += expense.amount;
            updatedBalance -= expense.amount;
        }

        saveBalanceData(updatedBalance, updatedIncome, updatedExpense, updatedExpenses, state.categoryLimits);

        return {
            expenses: updatedExpenses,
            income: updatedIncome,
            expense: updatedExpense,
            balance: updatedBalance,
        };
    }),
    addIncome: (incomeEntry: Omit<ExpenseItem, 'id'>) => set((state) => {
        const newIncome: ExpenseItem = {
            ...incomeEntry,
            id: Math.random().toString(36).substring(7),
        };

        const updatedExpenses = [...state.expenses, newIncome];
        const updatedIncome = state.income + newIncome.amount;
        const updatedBalance = state.balance + newIncome.amount;

        saveBalanceData(updatedBalance, updatedIncome, state.expense, updatedExpenses, state.categoryLimits);

        return {
            income: updatedIncome,
            balance: updatedBalance,
            expenses: updatedExpenses,
        };
    }),
    removeExpense: (index: number) => set((state) => {
        const removedExpense = state.expenses[index];
        const updatedExpenses = state.expenses.filter((_, i) => i !== index);
        let updatedIncome = state.income;
        let updatedExpense = state.expense;
        let updatedBalance = state.balance;

        if (removedExpense.category === 'Income') {
            updatedIncome -= removedExpense.amount;
            updatedBalance -= removedExpense.amount;
        } else {
            updatedExpense -= removedExpense.amount;
            updatedBalance += removedExpense.amount;
        }

        saveBalanceData(updatedBalance, updatedIncome, updatedExpense, updatedExpenses, state.categoryLimits);

        return {
            expenses: updatedExpenses,
            income: updatedIncome,
            expense: updatedExpense,
            balance: updatedBalance,
        };
    }),
    updateCategoryLimit: (category: string, limit: number) => set((state) => {
        const updatedCategoryLimits = state.categoryLimits.map(cat => 
            cat.name === category ? { ...cat, limit } : cat
        );
        if (!updatedCategoryLimits.some(cat => cat.name === category)) {
            updatedCategoryLimits.push({ name: category, limit });
        }
        saveBalanceData(state.balance, state.income, state.expense, state.expenses, updatedCategoryLimits);
        return { categoryLimits: updatedCategoryLimits };
    }),
    loadBalanceData: async () => {
        try {
            const balance = parseFloat(await AsyncStorage.getItem('balance') || '0');
            const income = parseFloat(await AsyncStorage.getItem('income') || '0');
            const expense = parseFloat(await AsyncStorage.getItem('expense') || '0');
            const expensesString = await AsyncStorage.getItem('expenses');
            const expenses: ExpenseItem[] = expensesString ? JSON.parse(expensesString) : [];
            const categoryLimitsString = await AsyncStorage.getItem('categoryLimits');
            const categoryLimits: CategoryLimit[] = categoryLimitsString ? JSON.parse(categoryLimitsString) : [
                { name: "Konaklama", limit: 500 },
                { name: "Dışarıda Yemek", limit: 300 },
                { name: "Alışveriş", limit: 400 },
                { name: "Eğlence", limit: 200 },
                { name: "Ulaşım", limit: 250 },
                { name: "Hediye", limit: 100 },
                { name: "Spor", limit: 150 },
                { name: "Tatil", limit: 1000 },
                { name: "Diğer", limit: 200 }
            ];
            set({ balance, income, expense, expenses, categoryLimits });
        } catch (error) {
            console.error('Load balance data error:', error);
        }
    },
    clearBalanceData: async () => {
        try {
            await AsyncStorage.removeItem('balance');
            await AsyncStorage.removeItem('income');
            await AsyncStorage.removeItem('expense');
            await AsyncStorage.removeItem('expenses');
            await AsyncStorage.removeItem('categoryLimits');
            set({
                balance: 0,
                income: 0,
                expense: 0,
                expenses: [],
                categoryLimits: [
                    { name: "Konaklama", limit: 500 },
                    { name: "Dışarıda Yemek", limit: 300 },
                    { name: "Alışveriş", limit: 400 },
                    { name: "Eğlence", limit: 200 },
                    { name: "Ulaşım", limit: 250 },
                    { name: "Hediye", limit: 100 },
                    { name: "Spor", limit: 150 },
                    { name: "Tatil", limit: 1000 },
                    { name: "Diğer", limit: 200 }
                ],
            });
        } catch (error) {
            console.error('Clear balance data error:', error);
        }
    },
}));

export default useBalanceStore;
