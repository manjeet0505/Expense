import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Other']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: Date,
    required: true,
    default: () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  },
  spent: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
BudgetSchema.index({ userId: 1, month: -1 });
BudgetSchema.index({ userId: 1, category: 1 });
BudgetSchema.index({ userId: 1, month: -1, category: 1 });

export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema); 