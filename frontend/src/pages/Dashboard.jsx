import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import api from '../utils/api';
import StatCard from '../components/StatCard';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PIE_COLORS = ['#24402E', '#7A4E32', '#C99A3B', '#8FA382', '#A6432D', '#345943', '#E0B85C', '#9C6B48'];

function mergeMonthly(expenseArr, incomeArr) {
  const map = {};
  expenseArr.forEach((e) => {
    const key = `${e._id.y}-${e._id.m}`;
    map[key] = { key, label: `${MONTHS[e._id.m - 1]} ${e._id.y}`, expense: e.total, income: 0 };
  });
  incomeArr.forEach((i) => {
    const key = `${i._id.y}-${i._id.m}`;
    if (!map[key]) map[key] = { key, label: `${MONTHS[i._id.m - 1]} ${i._id.y}`, expense: 0, income: 0 };
    map[key].income = i.total;
  });
  return Object.values(map).sort((a, b) => (a.key > b.key ? 1 : -1));
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard/summary')
      .then((res) => setData(res.data))
      .catch(() => setError('Could not load dashboard data.'));
  }, []);

  if (error) return <p className="text-rust">{error}</p>;
  if (!data) return <p className="text-ink/60">Loading your farm's numbers...</p>;

  const trend = mergeMonthly(data.monthlyExpense, data.monthlyIncome);
  const categoryData = data.expenseByCategory.map((c) => ({ name: c._id, value: c.total }));
  const yieldData = data.cropYield.map((c) => ({ name: c._id, yieldQuantity: c.totalYield }));

  return (
    <div>
      <header className="mb-8">
        <h2 className="font-display text-3xl text-ink">Dashboard</h2>
        <p className="text-ink/60 text-sm mt-1">A running account of this season's farm.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total income" value={`₹${data.totalIncome.toLocaleString('en-IN')}`} accent="forest" />
        <StatCard label="Total expense" value={`₹${data.totalExpense.toLocaleString('en-IN')}`} accent="soil" />
        <StatCard
          label="Profit / loss"
          value={`₹${data.profitLoss.toLocaleString('en-IN')}`}
          accent={data.profitLoss >= 0 ? 'forest' : 'rust'}
        />
        <StatCard label="Active crops" value={data.cropCount} accent="wheat" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <section className="bg-white/50 p-5">
          <h3 className="font-display text-lg mb-4">Income vs. expense, month by month</h3>
          {trend.length === 0 ? (
            <p className="text-sm text-ink/50">No entries yet — add expenses and income to see the trend.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trend}>
                <CartesianGrid stroke="#8FA38240" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#2A2823" />
                <YAxis tick={{ fontSize: 12 }} stroke="#2A2823" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#24402E" strokeWidth={2} name="Income" />
                <Line type="monotone" dataKey="expense" stroke="#A6432D" strokeWidth={2} name="Expense" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="bg-white/50 p-5">
          <h3 className="font-display text-lg mb-4">Where the money goes</h3>
          {categoryData.length === 0 ? (
            <p className="text-sm text-ink/50">No expenses logged yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {categoryData.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="bg-white/50 p-5 lg:col-span-2">
          <h3 className="font-display text-lg mb-4">Crop yield by crop (harvested)</h3>
          {yieldData.length === 0 ? (
            <p className="text-sm text-ink/50">Mark a crop as "harvested" with a yield to see this chart.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={yieldData}>
                <CartesianGrid stroke="#8FA38240" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#2A2823" />
                <YAxis tick={{ fontSize: 12 }} stroke="#2A2823" />
                <Tooltip />
                <Bar dataKey="yieldQuantity" fill="#C99A3B" name="Yield" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>
      </div>

      {data.equipmentNeedingRepair > 0 && (
        <div className="border-l-4 border-rust bg-rust/5 px-4 py-3 text-sm text-ink">
          {data.equipmentNeedingRepair} piece(s) of equipment need repair. Check the Equipment page.
        </div>
      )}
    </div>
  );
}
