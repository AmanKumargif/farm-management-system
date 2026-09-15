import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', farmName: '', location: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create account.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-parchment">Kheti Khata</h1>
          <p className="text-sage mt-2 text-sm">Set up your farm's ledger.</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-parchment px-7 py-8">
          <h2 className="font-display text-xl text-ink mb-5">Create account</h2>
          {error && (
            <p className="text-rust text-sm mb-4 border-l-2 border-rust pl-2">{error}</p>
          )}
          <label className="block text-xs font-medium text-ink/70 mb-1">Your name</label>
          <input
            required
            value={form.name}
            onChange={update('name')}
            className="w-full mb-4 px-3 py-2 bg-white border border-sage/60 focus:outline-none focus:border-forest text-sm"
          />
          <label className="block text-xs font-medium text-ink/70 mb-1">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={update('email')}
            className="w-full mb-4 px-3 py-2 bg-white border border-sage/60 focus:outline-none focus:border-forest text-sm"
          />
          <label className="block text-xs font-medium text-ink/70 mb-1">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={update('password')}
            className="w-full mb-4 px-3 py-2 bg-white border border-sage/60 focus:outline-none focus:border-forest text-sm"
          />
          <label className="block text-xs font-medium text-ink/70 mb-1">Farm name (optional)</label>
          <input
            value={form.farmName}
            onChange={update('farmName')}
            className="w-full mb-4 px-3 py-2 bg-white border border-sage/60 focus:outline-none focus:border-forest text-sm"
          />
          <label className="block text-xs font-medium text-ink/70 mb-1">Location (optional)</label>
          <input
            value={form.location}
            onChange={update('location')}
            className="w-full mb-6 px-3 py-2 bg-white border border-sage/60 focus:outline-none focus:border-forest text-sm"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-forest text-parchment py-2.5 font-medium hover:bg-forest-dark transition-colors disabled:opacity-60"
          >
            {busy ? 'Creating account...' : 'Create account'}
          </button>
          <p className="text-xs text-ink/60 mt-5 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-forest font-medium underline underline-offset-2">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
