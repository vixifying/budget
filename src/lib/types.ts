export interface Subcategory {
  name: string;
  icon?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  subcategories?: Subcategory[];
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  subcategory?: string;
  date: string;
  description?: string;
}

export interface RootState {
  transactions: Transaction[];
  categories: Category[];
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
}