import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard, BedDouble, CalendarCheck, CreditCard,
  BarChart3, Users, LogOut, Hotel,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'staff', 'customer'] },
  { to: '/rooms', label: 'Rooms', icon: BedDouble, roles: ['admin', 'staff', 'customer'] },
  { to: '/bookings', label: 'Bookings', icon: CalendarCheck, roles: ['admin', 'staff', 'customer'] },
  { to: '/payments', label: 'Payments', icon: CreditCard, roles: ['admin', 'staff'] },
  { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'staff'] },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();
  const dashboardPath = user?.role ? `/dashboard/${user.role}` : '/dashboard';

  return (
    <aside className="w-64 bg-hotel-dark min-h-screen text-white flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <Hotel className="w-8 h-8 text-hotel-accent" />
        <span className="text-xl font-bold">HotelMS</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems
          .filter((item) => item.roles.includes(user?.role || ''))
          .map((item) => {
            const Icon = item.icon;
            const targetPath = item.to === '/dashboard' ? dashboardPath : item.to;
            const active = item.to === '/dashboard' ? pathname.startsWith('/dashboard') : pathname === item.to;
            return (
              <Link
                key={item.to}
                to={targetPath}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="text-sm text-gray-400 mb-2">
          {user?.name} <span className="text-hotel-accent capitalize">({user?.role})</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
