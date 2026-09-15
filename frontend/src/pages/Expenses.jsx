import { useEffect, useState } from 'react';
import api from '../utils/api';
import { fileUrl } from '../utils/fileUrl';

const emptyForm = { category: 'seeds', description: '', amount: '', date: '', receipt: null };

const CATEGORIES = ['seeds', 'fertilizer', 'pesticide', 'labor', 'irrigation', 'equipment', 'fuel', 'other'];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = () => api.get('/expenses').then((res) => setExpenses(res.data));

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== '') data.append(k, v);
      });
      await api.post('/expenses', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add expense.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this expense?')) return;
    await api.delete(`/expenses/${id}`);
    load();
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl text-ink">Expenses</h2>
          <p className="text-ink/60 text-sm mt-1">
            Total logged: <span className="font-medium text-soil">₹{total.toLocaleString('en-IN')}</span>
          </p>
        </div>
        <button onClick={openNew} className="bg-forest text-parchment px-4 py-2 text-sm font-medium hover:bg-forest-dark">
          + Add expense
        </button>
      </header>

      <div className="overflow-x-auto ledger-scroll bg-white/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sage/40 text-left text-ink/60 text-xs uppercase tracking-wide">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Receipt</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e._id} className="border-b border-sage/20">
                <td className="px-4 py-3">{e.date?.slice(0, 10)}</td>
                <td className="px-4 py-3 capitalize">{e.category}</td>
                <td className="px-4 py-3">{e.description || '—'}</td>
                <td className="px-4 py-3 font-medium text-soil">₹{e.amount.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3">
                  {e.receiptUrl ? (
                    <a href={fileUrl(e.receiptUrl)} target="_blank" rel="noreferrer" className="text-forest underline underline-offset-2">
                      View
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(e._id)} className="text-rust underline underline-offset-2">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink/50">
                  No expenses yet. Add your first one to start tracking.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-10">
          <form onSubmit={handleSubmit} className="bg-parchment max-w-md w-full p-6">
            <h3 className="font-display text-xl mb-4">Add expense</h3>
            {error && <p className="text-rust text-sm mb-3">{error}</p>}
            <label className="block text-xs font-medium text-ink/70 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full mb-3 px-3 py-2 bg-white border border-sage/60 text-sm capitalize"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <label className="block text-xs font-medium text-ink/70 mb-1">Description</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full mb-3 px-3 py-2 bg-white border border-sage/60 text-sm"
            />
            <label className="block text-xs font-medium text-ink/70 mb-1">Amount (₹)</label>
            <input
              type="number"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full mb-3 px-3 py-2 bg-white border border-sage/60 text-sm"
            />
            <label className="block text-xs font-medium text-ink/70 mb-1">Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full mb-3 px-3 py-2 bg-white border border-sage/60 text-sm"
            />
            <label className="block text-xs font-medium text-ink/70 mb-1">Receipt (image or PDF, optional)</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,.webp"
              onChange={(e) => setForm({ ...form, receipt: e.target.files[0] })}
              className="w-full mb-4 text-sm"
            />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-ink/60">
                Cancel
              </button>
              <button type="submit" className="bg-forest text-parchment px-4 py-2 text-sm font-medium hover:bg-forest-dark">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
