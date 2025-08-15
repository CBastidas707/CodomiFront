
import React, { useState } from 'react';
import { Bell, X, Clock, AlertTriangle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
  urgent?: boolean;
}

const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Mantenimiento de Ascensores',
      message: 'Programado para el próximo lunes',
      date: '2024-01-15',
      read: false,
      urgent: true
    },
    {
      id: 2,
      title: 'Reunión de Propietarios',
      message: 'Reunión ordinaria mensual',
      date: '2024-01-20',
      read: false,
      urgent: false
    },
    {
      id: 3,
      title: 'Corte de Agua Programado',
      message: 'De 9:00 AM a 2:00 PM',
      date: '2024-01-18',
      read: true,
      urgent: true
    },
    {
      id: 4,
      title: 'Pago de Gastos Comunes',
      message: 'Recordatorio de vencimiento',
      date: '2024-01-12',
      read: false,
      urgent: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const removeNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-200 text-white"
        >
          <Bell className="h-5 w-5 text-white transition-colors duration-200" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 border-2 border-white animate-pulse"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-96 bg-white shadow-2xl border border-gray-200 rounded-2xl overflow-hidden p-0"
        sideOffset={8}
      >
        {/* Header con barra azul que ocupa 100% del ancho */}
        <div className="bg-codomi-navy text-white p-4 w-full">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Notificaciones</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
                {unreadCount} nuevas
              </Badge>
            )}
          </div>
        </div>
        
        {/* Contenido de notificaciones */}
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Bell className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">No hay notificaciones</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification, index) => (
              <DropdownMenuItem
                key={notification.id}
                className="p-0 focus:bg-slate-50 border-b border-slate-100 last:border-b-0 cursor-pointer"
                onSelect={() => markAsRead(notification.id)}
              >
                <div className="w-full p-4 relative hover:bg-slate-50 transition-colors duration-150">
                  {/* Botón X más visible y claro */}
                  <button
                    onClick={(e) => removeNotification(notification.id, e)}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    title="Eliminar notificación"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  <div className="pr-10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${!notification.read ? 'bg-blue-500' : 'bg-slate-300'}`} />
                      <h4 className={`text-sm font-semibold flex-1 ${!notification.read ? 'text-slate-900' : 'text-slate-600'}`}>
                        {notification.title}
                      </h4>
                      {notification.urgent && (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                          <Badge variant="destructive" className="text-xs px-2 py-0 h-5">
                            Urgente
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>{notification.date}</span>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
