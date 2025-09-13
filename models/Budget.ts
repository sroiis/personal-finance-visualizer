import mongoose, { Schema, model, models } from "mongoose";

const BudgetSchema = new Schema({
  month: {
    type: String,
    required: true, // YYYY-MM format
  },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
//  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default models.Budget || model("Budget", BudgetSchema);
