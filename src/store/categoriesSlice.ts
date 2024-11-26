import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Category } from '@/lib/types';
import { categoryApi } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await categoryApi.getAll();
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch categories');
    }
  }
);

export const addCategoryAsync = createAsyncThunk(
  'categories/add',
  async (category: Omit<Category, 'id'>, { rejectWithValue }) => {
    try {
      const data = await categoryApi.create(category);
      toast({
        title: 'Success',
        description: 'Category added successfully',
      });
      return data;
    } catch (error) {
      toast({
        variant: "destructive",
        title: 'Error',
        description: 'Failed to add category',
      });
      return rejectWithValue('Failed to add category');
    }
  }
);

export const updateCategoryAsync = createAsyncThunk(
  'categories/update',
  async ({ id, data }: { id: string; data: Partial<Category> }, { rejectWithValue }) => {
    try {
      const response = await categoryApi.update(id, data);
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
      return response;
    } catch (error) {
      toast({
        variant: "destructive",
        title: 'Error',
        description: 'Failed to update category',
      });
      return rejectWithValue('Failed to update category');
    }
  }
);

export const deleteCategoryAsync = createAsyncThunk(
  'categories/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await categoryApi.delete(id);
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
      return id;
    } catch (error) {
      toast({
        variant: "destructive",
        title: 'Error',
        description: 'Failed to delete category',
      });
      return rejectWithValue('Failed to delete category');
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: [] as Category[],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(addCategoryAsync.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        const index = state.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state[index] = action.payload;
        }
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        return state.filter((c) => c.id !== action.payload);
      });
  },
});

export default categoriesSlice.reducer;