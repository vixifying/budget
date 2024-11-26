import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { formatCurrency } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function TopCategories() {
  const transactions = useSelector((state: RootState) => state.transactions);

  const categoryTotals = transactions.reduce((acc, transaction) => {
    const { category, amount, type } = transaction;
    if (!acc[category]) {
      acc[category] = { total: 0, type };
    }
    acc[category].total += amount;
    return acc;
  }, {} as Record<string, { total: number; type: 'income' | 'expense' }>);

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, 5);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topCategories.map(([category, { total, type }]) => (
          <TableRow key={category}>
            <TableCell className="font-medium">{category}</TableCell>
            <TableCell>{type}</TableCell>
            <TableCell className="text-right">{formatCurrency(total)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}