
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, FileText, CreditCard, Edit, Mail, Phone } from 'lucide-react';
import { Owner, Apartment } from '@/types/owner';

interface OwnerProfileDialogProps {
  owner: Owner;
  apartments: Apartment[];
  onClose: () => void;
  onEdit: () => void;
}

const OwnerProfileDialog: React.FC<OwnerProfileDialogProps> = ({
  owner,
  apartments,
  onClose,
  onEdit
}) => {
  const handleViewFinances = () => {
    // TODO: Redirect to financial management filtered by this owner
    console.log('Redirect to finances for owner:', owner.id);
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil del Propietario
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nombre</label>
                  <p className="text-gray-900 font-medium">{owner.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Documento</label>
                  <Badge variant="outline" className="mt-1">
                    {owner.documentType.toUpperCase()}: {owner.documentNumber}
                  </Badge>
                </div>
                {owner.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Email
                    </label>
                    <p className="text-gray-900">{owner.email}</p>
                  </div>
                )}
                {owner.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      Teléfono
                    </label>
                    <p className="text-gray-900">{owner.phone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Apartments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Apartamentos Vinculados ({apartments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {apartments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {apartments.map(apartment => (
                    <div key={apartment.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{apartment.buildingName}</p>
                          <p className="text-sm text-gray-600">Apartamento {apartment.number}</p>
                          <p className="text-sm text-gray-600">Piso {apartment.floor}</p>
                        </div>
                        <Badge 
                          variant={apartment.status === 'occupied' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {apartment.status === 'occupied' ? 'Ocupado' : 
                           apartment.status === 'vacant' ? 'Vacante' : 'Mantenimiento'}
                        </Badge>
                      </div>
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs text-gray-500">
                          Cuota mensual: Bs. {apartment.monthlyFee.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No hay apartamentos vinculados a este propietario
                </p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              onClick={handleViewFinances}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              disabled={apartments.length === 0}
            >
              <CreditCard className="h-4 w-4" />
              Ver Pagos y Deudas
            </Button>
            <Button
              onClick={onEdit}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar Propietario
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="sm:ml-auto"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OwnerProfileDialog;
