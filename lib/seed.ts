import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log('MONGODB_URI:', process.env.MONGODB_URI); 

import mongoose from 'mongoose';
import Transaction from '@/models/Transaction';
import { connectDB } from './mongodb';

const expenseCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment'];
const incomeCategories = ['Salary', 'Work'];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to DB.');

    await Transaction.deleteMany({});
    console.log('Cleared old transactions.');

    const now = new Date();
    const lastMonth = new Date(now);
    lastMonth.setMonth(now.getMonth() - 1);

    const dummyTransactions = [];

    for (let i = 0; i < 5; i++) {
      dummyTransactions.push({
        amount: Math.floor(Math.random() * 3000) + 100,
        description: `This month expense ${i + 1}`,
        date: new Date(now.getFullYear(), now.getMonth(), Math.floor(Math.random() * 28) + 1),
        category: expenseCategories[Math.floor(Math.random() * expenseCategories.length)],
        type: 'expense',
      });
    }

    dummyTransactions.push({
      amount: 25000,
      description: 'Monthly Salary',
      date: new Date(now.getFullYear(), now.getMonth(), 1),
      category: 'Salary',
      type: 'income',
    });

    for (let i = 0; i < 4; i++) {
      dummyTransactions.push({
        amount: Math.floor(Math.random() * 2000) + 200,
        description: `Last month expense ${i + 1}`,
        date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), Math.floor(Math.random() * 28) + 1),
        category: expenseCategories[Math.floor(Math.random() * expenseCategories.length)],
        type: 'expense',
      });
    }

    dummyTransactions.push({
      amount: 22000,
      description: 'Freelance Project',
      date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 3),
      category: 'Work',
      type: 'income',
    });

    await Transaction.insertMany(dummyTransactions);
    console.log('Inserted dummy transactions ✅');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error inserting dummy data:', err);
    process.exit(1);
  }
}

seed();
