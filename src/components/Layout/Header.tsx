
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from '@/components/NotificationDropdown';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-codomi-navy text-white shadow-xl border-b-4 border-codomi-navy-dark w-full min-w-0 relative z-10">
      <div className="w-full min-w-0 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 min-w-0">
          <div className="flex items-center min-w-0 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 bg-white/30 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-bold font-montserrat truncate">
                  CODOMI
                </h1>
                <span className="text-xs md:text-sm opacity-90 hidden sm:block truncate">
                  Gestión de Condominios
                </span>
              </div>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-shrink-0">
              {/* Notificaciones */}
              <NotificationDropdown />
              
              <button
                onClick={handleProfileClick}
                className="flex items-center space-x-2 md:space-x-3 text-white hover:bg-white/20 rounded-xl p-2 md:p-3 transition-all duration-200 cursor-pointer border border-white/30 hover:border-white/50 min-w-0 shadow-sm hover:shadow-md"
              >
                <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div className="text-left hidden lg:block min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs opacity-80 capitalize truncate">
                    {user.role === 'admin' ? 'Administrador' : 'Propietario'}
                    {user.apartment && ` - ${user.apartment}`}
                  </p>
                </div>
              </button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="bg-white/20 border-white/40 text-white hover:bg-white/30 hover:border-white/60 transition-all duration-200 hover:shadow-lg flex-shrink-0"
              >
                <LogOut className="h-4 w-4 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
