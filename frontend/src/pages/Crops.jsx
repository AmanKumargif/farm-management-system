import { useEffect, useState } from 'react';
import api from '../utils/api';

const emptyForm = {
  cropName: '',
  fieldName: '',
  areaInAcres: '',
  sowingDate: '',
  expectedHarvestDate: '',
  actualHarvestDate: '',
  yieldQuantity: '',
  yieldUnit: 'kg',
  status: 'planned',
  notes: '',
};

export default function Crops() {
  const [crops, setCrops] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = () => api.get('/crops').then((res) => setCrops(res.data));

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (crop) => {
    setForm({
      ...crop,
      sowingDate: crop.sowingDate?.slice(0, 10) || '',
      expectedHarvestDate: crop.expectedHarvestDate?.slice(0, 10) || '',
      actualHarvestDate: crop.actualHarvestDate?.slice(0, 10) || '',
    });
    setEditingId(crop._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/crops/${editingId}`, form);
      } else {
        await api.post('/crops', form);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save crop.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this crop record?')) return;
    await api.delete(`/crops/${id}`);
    load();
  };

  const statusColor = {
    planned: 'text-ink/60',
    growing: 'text-forest',
    harvested: 'text-wheat',
    failed: 'text-rust',
  };

  return (
    <div>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl text-ink">Crops</h2>
          <p className="text-ink/60 text-sm mt-1">Track what's sown, growing, and harvested.</p>
        </div>
        <button
          onClick={openNew}
          className="bg-forest text-parchment px-4 py-2 text-sm font-medium hover:bg-forest-dark"
        >
          + Add crop
        </button>
      </header>

      <div className="overflow-x-auto ledger-scroll bg-white/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sage/40 text-left text-ink/60 text-xs uppercase tracking-wide">
              <th className="px-4 py-3">Crop</th>
              <th className="px-4 py-3">Field</th>
              <th className="px-4 py-3">Area (acres)</th>
              <th className="px-4 py-3">Sowing date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Yield</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {crops.map((c) => (
              <tr key={c._id} className="border-b border-sage/20">
                <td className="px-4 py-3 font-medium">{c.cropName}</td>
                <td className="px-4 py-3">{c.fieldName || '—'}</td>
                <td className="px-4 py-3">{c.areaInAcres || '—'}</td>
                <td className="px-4 py-3">{c.sowingDate ? c.sowingDate.slice(0, 10) : '—'}</td>
                <td className={`px-4 py-3 font-medium capitalize ${statusColor[c.status]}`}>{c.status}</td>
                <td className="px-4 py-3">{c.yieldQuantity ? `${c.yieldQuantity} ${c.yieldUnit}` : '—'}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => openEdit(c)} className="text-forest underline underline-offset-2 mr-3">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(c._id)} className="text-rust underline underline-offset-2">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {crops.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink/50">
                  No crops yet. Add your first one to start tracking.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-10">
          <form onSubmit={handleSubmit} className="bg-parchment max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-xl mb-4">{editingId ? 'Edit crop' : 'Add crop'}</h3>
            {error && <p className="text-rust text-sm mb-3">{error}</p>}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Crop name" value={form.cropName} onChange={(v) => setForm({ ...form, cropName: v })} required />
              <Field label="Field name" value={form.fieldName} onChange={(v) => setForm({ ...form, fieldName: v })} />
              <Field label="Area (acres)" type="number" value={form.areaInAcres} onChange={(v) => setForm({ ...form, areaInAcres: v })} />
              <div>
                <label className="block text-xs font-medium text-ink/70 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-sage/60 text-sm"
                >
                  <option value="planned">Planned</option>
                  <option value="growing">Growing</option>
                  <option value="harvested">Harvested</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <Field label="Sowing date" type="date" value={form.sowingDate} onChange={(v) => setForm({ ...form, sowingDate: v })} />
              <Field label="Expected harvest" type="date" value={form.expectedHarvestDate} onChange={(v) => setForm({ ...form, expectedHarvestDate: v })} />
              <Field label="Actual harvest" type="date" value={form.actualHarvestDate} onChange={(v) => setForm({ ...form, actualHarvestDate: v })} />
              <Field label="Yield quantity" type="number" value={form.yieldQuantity} onChange={(v) => setForm({ ...form, yieldQuantity: v })} />
              <div>
                <label className="block text-xs font-medium text-ink/70 mb-1">Yield unit</label>
                <select
                  value={form.yieldUnit}
                  onChange={(e) => setForm({ ...form, yieldUnit: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-sage/60 text-sm"
                >
                  <option value="kg">kg</option>
                  <option value="quintal">quintal</option>
                  <option value="tonne">tonne</option>
                </select>
              </div>
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
