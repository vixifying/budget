import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '@/lib/types';
import { transactionApi } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async () => {
    const response = await transactionApi.getAll();
    return response.data;
  }
);

export const addTransactionAsync = createAsyncThunk(
  'transactions/add',
  async (transaction: Omit<Transaction, 'id'>) => {
    const response = await transactionApi.create(transaction);
    toast({
      title: 'Success',
      description: 'Transaction added successfully',
    });
    return response.data;
  }
);

export const updateTransactionAsync = createAsyncThunk(
  'transactions/update',
  async ({ id, data }: { id: string; data: Partial<Transaction> }) => {
    const response = await transactionApi.update(id, data);
    toast({
      title: 'Success',
      description: 'Transaction updated successfully',
    });
    return response.data;
  }
);

export const deleteTransactionAsync = createAsyncThunk(
  'transactions/delete',
  async (id: string) => {
    await transactionApi.delete(id);
    toast({
      title: 'Success',
      description: 'Transaction deleted successfully',
    });
    return id;
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: [] as Transaction[],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(addTransactionAsync.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(updateTransactionAsync.fulfilled, (state, action) => {
        const index = state.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state[index] = action.payload;
        }
      })
      .addCase(deleteTransactionAsync.fulfilled, (state, action) => {
        return state.filter((t) => t.id !== action.payload);
      });
  },
});

export default transactionsSlice.reducer;