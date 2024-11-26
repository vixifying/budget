import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CategoryList from '@/components/CategoryList';
import CategoryDialog from '@/components/CategoryDialog';
import { Category } from '@/lib/types';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export default function Settings() {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>('income');
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(undefined);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>

      <Tabs defaultValue="income" className="space-y-4">
        <TabsList>
          <TabsTrigger value="income" onClick={() => setSelectedType('income')}>
            Income Categories
          </TabsTrigger>
          <TabsTrigger value="expense" onClick={() => setSelectedType('expense')}>
            Expense Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </div>
          <CategoryList type="income" onEdit={handleEdit} />
        </TabsContent>

        <TabsContent value="expense" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </div>
          <CategoryList type="expense" onEdit={handleEdit} />
        </TabsContent>
      </Tabs>

      <CategoryDialog
        open={open}
        onOpenChange={handleClose}
        type={selectedType}
        category={editingCategory}
      />
    </div>
  );
}