import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, default: '' },
  date: { type: Date, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
 // userId: { type: String, required: true }, // New field for JWT-authenticated user
});

export default mongoose.models.Transaction ||
  mongoose.model('Transaction', TransactionSchema);
