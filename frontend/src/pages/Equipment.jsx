import { useEffect, useState } from 'react';
import api from '../utils/api';

const emptyForm = {
  name: '',
  type: '',
  purchaseDate: '',
  purchaseCost: '',
  condition: 'good',
  lastServiceDate: '',
  nextServiceDue: '',
  notes: '',
};

const CONDITIONS = ['excellent', 'good', 'fair', 'needs_repair', 'retired'];

export default function Equipment() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = () => api.get('/equipment').then((res) => setItems(res.data));

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setForm({
      ...item,
      purchaseDate: item.purchaseDate?.slice(0, 10) || '',
      lastServiceDate: item.lastServiceDate?.slice(0, 10) || '',
      nextServiceDue: item.nextServiceDue?.slice(0, 10) || '',
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/equipment/${editingId}`, form);
      } else {
        await api.post('/equipment', form);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save equipment.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this equipment record?')) return;
    await api.delete(`/equipment/${id}`);
    load();
  };

  const conditionColor = {
    excellent: 'text-forest',
    good: 'text-forest',
    fair: 'text-wheat',
    needs_repair: 'text-rust',
    retired: 'text-ink/50',
  };

  return (
    <div>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl text-ink">Equipment</h2>
          <p className="text-ink/60 text-sm mt-1">Keep tabs on machinery and service schedules.</p>
        </div>
        <button onClick={openNew} className="bg-forest text-parchment px-4 py-2 text-sm font-medium hover:bg-forest-dark">
          + Add equipment
        </button>
      </header>

      <div className="overflow-x-auto ledger-scroll bg-white/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sage/40 text-left text-ink/60 text-xs uppercase tracking-wide">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Condition</th>
              <th className="px-4 py-3">Purchase cost</th>
              <th className="px-4 py-3">Next service due</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id} className="border-b border-sage/20">
                <td className="px-4 py-3 font-medium">{it.name}</td>
                <td className="px-4 py-3">{it.type || '—'}</td>
                <td className={`px-4 py-3 font-medium capitalize ${conditionColor[it.condition]}`}>
                  {it.condition.replace('_', ' ')}
                </td>
                <td className="px-4 py-3">{it.purchaseCost ? `₹${it.purchaseCost.toLocaleString('en-IN')}` : '—'}</td>
                <td className="px-4 py-3">{it.nextServiceDue ? it.nextServiceDue.slice(0, 10) : '—'}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => openEdit(it)} className="text-forest underline underline-offset-2 mr-3">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(it._id)} className="text-rust underline underline-offset-2">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink/50">
                  No equipment logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-10">
          <form onSubmit={handleSubmit} className="bg-parchment max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-xl mb-4">{editingId ? 'Edit equipment' : 'Add equipment'}</h3>
            {error && <p className="text-rust text-sm mb-3">{error}</p>}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <Field label="Type" value={form.type} onChange={(v) => setForm({ ...form, type: v })} />
              <Field label="Purchase date" type="date" value={form.purchaseDate} onChange={(v) => setForm({ ...form, purchaseDate: v })} />
              <Field label="Purchase cost (₹)" type="number" value={form.purchaseCost} onChange={(v) => setForm({ ...form, purchaseCost: v })} />
              <div>
                <label className="block text-xs font-medium text-ink/70 mb-1">Condition</label>
                <select
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-sage/60 text-sm capitalize"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <Field label="Last service" type="date" value={form.lastServiceDate} onChange={(v) => setForm({ ...form, lastServiceDate: v })} />
              <Field label="Next service due" type="date" value={form.nextServiceDue} onChange={(v) => setForm({ ...form, nextServiceDue: v })} />
            </div>
            <label className="block text-xs font-medium text-ink/70 mt-3 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-sage/60 text-sm"
              rows={2}
            />
            <div className="flex justify-end gap-3 mt-5">
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

function Field({ label, value, onChange, type = 'text', required = false }) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink/70 mb-1">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-white border border-sage/60 text-sm"
      />
    </div>
  );
}
