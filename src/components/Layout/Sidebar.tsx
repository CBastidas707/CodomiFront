import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  User, 
  Calendar,
  MessageSquare,
  Plus,
  Search,
  Megaphone,
  Building2
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const adminMenuItems = [
    { icon: Home, label: 'Panel de Control', path: '/admin' },
    { icon: User, label: 'Gestión de Propietarios', path: '/admin/owners' },
    { icon: Building2, label: 'Gestión de Apartamentos', path: '/admin/apartments' },
    { icon: Calendar, label: 'Gestión Financiera', path: '/admin/finance' },
    { icon: Search, label: 'Gestión de Recibos', path: '/admin/receipts' },
    { icon: Plus, label: 'Análisis de Datos', path: '/admin/analytics' },
    { icon: Home, label: 'Gestión de Edificio', path: '/admin/buildings' },
    { icon: Megaphone, label: 'Anuncios', path: '/admin/announcements' },
    { icon: MessageSquare, label: 'Comunicación', path: '/admin/communication' },
  ];

  const ownerMenuItems = [
    { icon: Home, label: 'Panel de Control', path: '/owner' },
    { icon: Megaphone, label: 'Anuncios', path: '/owner/announcements' },
    { icon: MessageSquare, label: 'Comunicación', path: '/owner/communication' },
    { icon: Search, label: 'Historial de Facturas', path: '/owner/invoices' },
    { icon: Calendar, label: 'Portal de Pagos', path: '/owner/payments' },
  ];

  const juntaMenuItems = [
    { icon: Home, label: 'Panel de Control', path: '/junta' },
    { icon: Megaphone, label: 'Anuncios', path: '/junta/announcements' },
    { icon: MessageSquare, label: 'Comunicación', path: '/junta/communication' },
  ];

  const getMenuItems = () => {
    if (user?.role === 'admin') return adminMenuItems;
    if (user?.role === 'junta') return juntaMenuItems;
    return ownerMenuItems;
  };

  const menuItems = getMenuItems();

  return (
    <aside className="hidden md:block w-64 bg-white shadow-lg border-r border-gray-200 rounded-lg my-4">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-codomi-navy text-white'
                      : 'text-gray-700 hover:bg-codomi-gray hover:text-codomi-navy'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
