import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not log in.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-parchment">Kheti Khata</h1>
          <p className="text-sage mt-2 text-sm">Your farm's records, in one ledger.</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-parchment px-7 py-8">
          <h2 className="font-display text-xl text-ink mb-5">Log in</h2>
          {error && (
            <p className="text-rust text-sm mb-4 border-l-2 border-rust pl-2">{error}</p>
          )}
          <label className="block text-xs font-medium text-ink/70 mb-1">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full mb-4 px-3 py-2 bg-white border border-sage/60 focus:outline-none focus:border-forest text-sm"
          />
          <label className="block text-xs font-medium text-ink/70 mb-1">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full mb-6 px-3 py-2 bg-white border border-sage/60 focus:outline-none focus:border-forest text-sm"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-forest text-parchment py-2.5 font-medium hover:bg-forest-dark transition-colors disabled:opacity-60"
          >
            {busy ? 'Logging in...' : 'Log in'}
          </button>
          <p className="text-xs text-ink/60 mt-5 text-center">
            New here?{' '}
            <Link to="/register" className="text-forest font-medium underline underline-offset-2">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
