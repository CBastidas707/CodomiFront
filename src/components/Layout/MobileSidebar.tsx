
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { 
  Home, 
  User, 
  Calendar,
  MessageSquare,
  Plus,
  Search,
  Menu,
  Megaphone,
  X,
  Building2
} from 'lucide-react';

const MobileSidebar: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden fixed top-3 left-3 z-50 bg-white shadow-lg border border-gray-200 text-codomi-navy hover:text-white hover:bg-codomi-navy transition-all duration-200 rounded-lg h-10 w-10"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-white p-0">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-codomi-navy rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div>
              <h2 className="font-bold text-codomi-navy text-lg">CODOMI</h2>
              <p className="text-xs text-gray-600">Gestión de Condominios</p>
            </div>
          </div>
          <SheetClose asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-white hover:bg-codomi-navy transition-colors rounded-md"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar menú</span>
            </Button>
          </SheetClose>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-codomi-navy text-white shadow-md'
                        : 'text-gray-700 hover:bg-codomi-gray hover:text-codomi-navy'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
