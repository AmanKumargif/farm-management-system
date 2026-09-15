import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/crops', label: 'Crops' },
  { to: '/expenses', label: 'Expenses' },
  { to: '/income', label: 'Income' },
  { to: '/equipment', label: 'Equipment' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-parchment">
      <aside className="w-64 shrink-0 bg-forest text-parchment flex flex-col justify-between">
        <div>
          <div className="px-6 py-7 border-b border-forest-light/60">
            <h1 className="font-display text-2xl leading-tight">Kheti Khata</h1>
            <p className="text-sage text-xs mt-1 tracking-wide">Field &amp; ledger records</p>
          </div>
          <nav className="mt-4 flex flex-col">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `relative px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-forest-dark text-wheat-light'
                      : 'text-parchment/80 hover:bg-forest-light/40 hover:text-parchment'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-0 h-full w-1 bg-wheat" />
                    )}
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="px-6 py-5 border-t border-forest-light/60">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <p className="text-xs text-sage truncate">{user?.farmName || user?.email}</p>
          <button
            onClick={handleLogout}
            className="mt-3 text-xs text-parchment/70 hover:text-wheat-light underline underline-offset-2"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
