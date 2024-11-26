import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { deleteCategoryAsync } from '@/store/categoriesSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Circle } from 'lucide-react';
import { Category } from '@/lib/types';

interface CategoryListProps {
  type: 'income' | 'expense';
  onEdit?: (category: Category) => void;
}

export default function CategoryList({ type, onEdit }: CategoryListProps) {
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) =>
    state.categories.filter((c) => c.type === type)
  );

  const handleDelete = (id: string) => {
    dispatch(deleteCategoryAsync(id));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Icon</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Subcategories</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>
              <Circle className="h-5 w-5" />
            </TableCell>
            <TableCell>{category.name}</TableCell>
            <TableCell>
              {category.subcategories?.map((sub) => sub.name).join(', ')}
            </TableCell>
            <TableCell className="space-x-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(category)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(category.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}