import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import TransactionList from '@/components/TransactionList';
import TransactionDialog from '@/components/TransactionDialog';
import { Transaction } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { deleteTransactionAsync } from '@/store/transactionsSlice';

export default function Transactions() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const transactions = useSelector((state: RootState) => state.transactions)
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteTransactionAsync(id));
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTransaction(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
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
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(transaction)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(transaction.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TransactionDialog
        open={open}
        onOpenChange={handleClose}
        transaction={editingTransaction}
      />
    </div>
  );
}