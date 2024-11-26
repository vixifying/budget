import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { addCategoryAsync, updateCategoryAsync } from '@/store/categoriesSlice';
import { Category } from '@/lib/types';
import { Circle } from 'lucide-react';

const AVAILABLE_ICONS = [
  'Wallet',
  'PiggyBank',
  'TrendingUp',
  'Gift',
  'Fuel',
  'Coffee',
  'Apple',
  'ShoppingCart',
  'Home',
  'Wrench',
  'Car',
  'ShoppingBag',
  'UtensilsCrossed',
  'MoreHorizontal',
  'Circle'
] as const;

const schema = z.object({
  name: z.string().min(1, 'Category name is required'),
  icon: z.enum(AVAILABLE_ICONS),
  subcategories: z.array(z.object({
    name: z.string(),
    icon: z.string().optional()
  })).optional()
});

type FormData = z.infer<typeof schema>;

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'income' | 'expense';
  category?: Category;
}

export default function CategoryDialog({
  open,
  onOpenChange,
  type,
  category
}: CategoryDialogProps) {
  const dispatch = useDispatch();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: category || {
      name: '',
      icon: 'Circle',
      subcategories: []
    }
  });

  const onSubmit = async (data: FormData) => {
    if (category) {
      await dispatch(updateCategoryAsync({
        id: category.id,
        data: { ...data, type }
      }));
    } else {
      await dispatch(addCategoryAsync({
        ...data,
        type
      }));
    }
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit' : 'Add'} {type} Category
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AVAILABLE_ICONS.map((iconName) => (
                        <SelectItem key={iconName} value={iconName}>
                          <span className="flex items-center gap-2">
                            <Circle className="h-4 w-4" />
                            {iconName}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {category ? 'Update' : 'Save'} Category
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}