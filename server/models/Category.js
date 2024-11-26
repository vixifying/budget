import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  icon: {
    type: String,
    default: 'Circle'
  },
  subcategories: [{
    name: {
      type: String,
      trim: true
    },
    icon: String
  }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const Category = mongoose.model('Category', categorySchema);

// Default categories
const defaultCategories = [
  { name: 'Salary', type: 'income', icon: 'Wallet' },
  { name: 'Interest', type: 'income', icon: 'PiggyBank' },
  { name: 'Dividend', type: 'income', icon: 'TrendingUp' },
  { name: 'Cashback/Other', type: 'income', icon: 'Gift' },
  { name: 'Fuel', type: 'expense', icon: 'Fuel' },
  { name: 'Milk', type: 'expense', icon: 'Coffee' },
  { name: 'Fruits & Vegetables', type: 'expense', icon: 'Apple' },
  { name: 'Grocery', type: 'expense', icon: 'ShoppingCart' },
  { name: 'Rent', type: 'expense', icon: 'Home' },
  { name: 'Maintenance', type: 'expense', icon: 'Wrench' },
  { name: 'Travel/Transportation', type: 'expense', icon: 'Car' },
  { name: 'Shopping', type: 'expense', icon: 'ShoppingBag' },
  { name: 'Food', type: 'expense', icon: 'UtensilsCrossed' },
  { name: 'Other', type: 'expense', icon: 'MoreHorizontal' }
];

// Initialize default categories after ensuring connection
mongoose.connection.once('connected', async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany(defaultCategories);
      console.log('Default categories added successfully');
    }
  } catch (err) {
    console.error('Error initializing default categories:', err);
  }
});

export default Category;