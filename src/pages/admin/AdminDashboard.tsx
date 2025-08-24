import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import BuildingSelector from '@/components/BuildingSelector';
import CondominiumSelector from '@/components/CondominiumSelector';
const AdminDashboard: React.FC = () => {
  const {
    toast
  } = useToast();
  const {
    selectedBuilding,
    selectedCondominium,
    buildings,
    selectBuilding,
    selectCondominium
  } = useAuth();
  const [showBuildingSelector, setShowBuildingSelector] = useState(false);
  const [showCondominiumSelector, setShowCondominiumSelector] = useState(false);
  const metrics = [{
    title: 'Morosidad',
    value: '12%',
    change: '-2%',
    type: 'negative'
  }, {
    title: 'Ingresos del Mes',
    value: '$45,200',
    change: '+8%',
    type: 'positive'
  }, {
    title: 'Gastos Pendientes',
    value: '$8,500',
    change: '0%',
    type: 'neutral'
  }, {
    title: 'Unidades al Día',
    value: '88%',
    change: '+5%',
    type: 'positive'
  }];
  const handleBuildingChange = () => {
    // Reset selections and start with condominium selection
    selectCondominium(null as any);
    selectBuilding(null as any);
    setShowCondominiumSelector(true);
    setShowBuildingSelector(false);
  };
  const handleCondominiumSelected = () => {
    setShowCondominiumSelector(false);
    setShowBuildingSelector(true);
  };
  const handleBuildingSelected = () => {
    setShowBuildingSelector(false);
    setShowCondominiumSelector(false);
    toast({
      title: "Edificio seleccionado",
      description: `Ahora estás gestionando ${selectedBuilding?.name}`
    });
  };
  if (showCondominiumSelector) {
    return <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-codomi-navy">Panel de Control</h1>
          <Badge variant="outline" className="text-sm">
            Administrador
          </Badge>
        </div>
        <CondominiumSelector onSelect={handleCondominiumSelected} />
      </div>;
  }
  if (showBuildingSelector) {
    return <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-codomi-navy">Panel de Control</h1>
          <Badge variant="outline" className="text-sm">
            Administrador
          </Badge>
        </div>
        <BuildingSelector onSelect={handleBuildingSelected} />
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-codomi-navy px-[5px]">Panel de Control</h1>
          {selectedBuilding && <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-codomi-navy" />
              <span className="text-base md:text-lg font-medium text-codomi-navy">{selectedBuilding.name}</span>
            </div>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleBuildingChange} className="flex items-center gap-2 text-sm">
            <RefreshCw className="h-4 w-4" />
            Cambiar Edificio
          </Button>
          <Badge variant="outline" className="text-sm">
            Administrador
          </Badge>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => <Card key={index}>
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium">
                {metric.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-codomi-navy">
                {metric.value}
              </div>
              <div className={`text-sm flex items-center mt-1 ${metric.type === 'positive' ? 'text-green-600' : metric.type === 'negative' ? 'text-red-600' : 'text-gray-600'}`}>
                {metric.change} vs mes anterior
              </div>
            </CardContent>
          </Card>)}
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-codomi-navy">Transacciones Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[{
            owner: 'María López',
            apt: 'Apt 201',
            amount: '$420',
            type: 'Pago',
            date: '10/12/2024'
          }, {
            owner: 'Juan Pérez',
            apt: 'Apt 305',
            amount: '$380',
            type: 'Pago',
            date: '09/12/2024'
          }, {
            owner: 'Ana Martínez',
            apt: 'Apt 102',
            amount: '$420',
            type: 'Pago',
            date: '08/12/2024'
          }].map((transaction, index) => <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium">{transaction.owner}</p>
                  <p className="text-sm text-gray-600">{transaction.apt}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{transaction.amount}</p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default AdminDashboard;