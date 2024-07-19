import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ExpenseItem {
    name: string;
    amount: number;
    category: string;
    date: string;
}

interface BalanceState {
    balance: number;
    income: number;
    expense: number;
    expenses: ExpenseItem[];
    setBalance: (amount: number) => void;
    setIncome: (amount: number) => void;
    setExpense: (amount: number) => void;
    addExpense: (expense: ExpenseItem) => void;
    removeExpense: (index: number) => void;
    loadBalanceData: () => Promise<void>;
}

const saveBalanceData = async (balance: number, income: number, expense: number, expenses: ExpenseItem[]) => {
    try {
        await AsyncStorage.setItem('balance', balance.toString());
        await AsyncStorage.setItem('income', income.toString());
        await AsyncStorage.setItem('expense', expense.toString());
        await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
    } catch (error) {
        console.error('Save balance data error:', error);
    }
};

const useBalanceStore = create<BalanceState>((set) => ({
    balance: 0,
    income: 0,
    expense: 0,
    expenses: [],
    setBalance: (amount: number) => set({ balance: amount }),
    setIncome: (amount: number) => set({ income: amount }),
    setExpense: (amount: number) => set({ expense: amount }),
    addExpense: (expense: ExpenseItem) => set((state) => {
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

        saveBalanceData(updatedBalance, updatedIncome, updatedExpense, updatedExpenses);

        return {
            expenses: updatedExpenses,
            income: updatedIncome,
            expense: updatedExpense,
            balance: updatedBalance,
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

        saveBalanceData(updatedBalance, updatedIncome, updatedExpense, updatedExpenses);

        return {
            expenses: updatedExpenses,
            income: updatedIncome,
            expense: updatedExpense,
            balance: updatedBalance,
        };
    }),
    loadBalanceData: async () => {
        try {
            const balance = parseFloat(await AsyncStorage.getItem('balance') || '0');
            const income = parseFloat(await AsyncStorage.getItem('income') || '0');
            const expense = parseFloat(await AsyncStorage.getItem('expense') || '0');
            const expensesString = await AsyncStorage.getItem('expenses');
            const expenses = expensesString ? JSON.parse(expensesString).map((item: any) => ({
                ...item,
                date: new Date(item.date),
            })) : [];
            set({ balance, income, expense, expenses });
        } catch (error) {
            console.error('Load balance data error:', error);
        }
    },
}));

export default useBalanceStore;