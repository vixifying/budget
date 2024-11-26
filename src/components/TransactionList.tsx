import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface TransactionListProps {
  limit?: number;
}

export default function TransactionList({ limit }: TransactionListProps) {
  const transactions = useSelector((state: RootState) => state.transactions)
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{format(new Date(transaction.date), 'PP')}</TableCell>
            <TableCell>{transaction.category}</TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell className="text-right">
              {formatCurrency(transaction.amount)}
            </TableCell>
            <TableCell>
              <Badge
                variant={transaction.type === 'income' ? 'success' : 'destructive'}
              >
                {transaction.type}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}