import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Card } from '@/components/ui/card';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import TransactionList from '@/components/TransactionList';
import TopCategories from '@/components/TopCategories';
import { formatCurrency } from '@/lib/utils';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const transactions = useSelector((state: RootState) => state.transactions);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const donutData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ['hsl(var(--chart-1))', 'hsl(var(--chart-2))'],
        borderColor: ['hsl(var(--chart-1))', 'hsl(var(--chart-2))'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Income</h3>
          <p className="text-2xl font-bold text-[hsl(var(--chart-1))]">
            {formatCurrency(totalIncome)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Expense</h3>
          <p className="text-2xl font-bold text-[hsl(var(--chart-2))]">
            {formatCurrency(totalExpense)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Balance</h3>
          <p className="text-2xl font-bold text-[hsl(var(--chart-3))]">
            {formatCurrency(totalIncome - totalExpense)}
          </p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Income vs Expense</h3>
          <div className="h-64">
            <Doughnut data={donutData} options={{ maintainAspectRatio: false }} />
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
          <TopCategories />
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <TransactionList limit={5} />
      </Card>
    </div>
  );
}