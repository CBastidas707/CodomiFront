
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Apartment {
  id?: string;
  number: string;
  floor: string;
  buildingId: string;
  buildingName?: string;
  status: 'occupied' | 'vacant' | 'maintenance';
  monthlyFee: number;
  ownerId?: string | null;
  ownerName?: string | null;
}

interface ApartmentFormProps {
  apartment?: Apartment | null;
  onClose: () => void;
  onSave: (apartment: Apartment) => void;
}

const ApartmentForm: React.FC<ApartmentFormProps> = ({
  apartment,
  onClose,
  onSave
}) => {
  const { toast } = useToast();
  const { selectedBuilding } = useAuth();

  const [formData, setFormData] = useState({
    number: apartment?.number || '',
    floor: apartment?.floor || '',
    buildingId: apartment?.buildingId || selectedBuilding?.id || '',
    status: apartment?.status || 'vacant' as 'occupied' | 'vacant' | 'maintenance',
    monthlyFee: apartment?.monthlyFee || 0
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  useEffect(() => {
    if (selectedBuilding && !formData.buildingId) {
      setFormData(prev => ({ ...prev, buildingId: selectedBuilding.id }));
    }
  }, [selectedBuilding, formData.buildingId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.number.trim()) {
      newErrors.number = 'El número de apartamento es obligatorio';
    }

    if (!formData.floor.trim()) {
      newErrors.floor = 'El piso es obligatorio';
    }

    if (!formData.buildingId) {
      newErrors.buildingId = 'Debe seleccionar un edificio';
    }

    if (formData.monthlyFee <= 0) {
      newErrors.monthlyFee = 'La cuota mensual debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setShowSaveConfirm(true);
  };

  const confirmSave = () => {
    const newApartment: Apartment = {
      id: apartment?.id || `apt-${Date.now()}`,
      ...formData,
      buildingName: selectedBuilding?.name || 'Edificio Desconocido'
    };

    onSave(newApartment);
    toast({
      title: apartment ? 'Apartamento actualizado' : 'Apartamento creado',
      description: `Apartamento ${formData.number} ha sido ${apartment ? 'actualizado' : 'creado'} exitosamente.`
    });
    setShowSaveConfirm(false);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'Ocupado';
      case 'vacant':
        return 'Vacante';
      case 'maintenance':
        return 'Mantenimiento';
      default:
        return status;
    }
  };

  const getStatusButtonClass = (status: string, currentStatus: string) => {
    const isSelected = status === currentStatus;
    const baseClasses = "flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 font-medium text-sm";
    
    if (isSelected) {
      switch (status) {
        case 'occupied':
          return `${baseClasses} bg-green-50 border-green-500 text-green-700`;
        case 'vacant':
          return `${baseClasses} bg-blue-50 border-blue-500 text-blue-700`;
        case 'maintenance':
          return `${baseClasses} bg-yellow-50 border-yellow-500 text-yellow-700`;
        default:
          return `${baseClasses} bg-gray-50 border-gray-500 text-gray-700`;
      }
    } else {
      return `${baseClasses} bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50`;
    }
  };

  return (
    <>
      <Dialog open={true} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {apartment ? 'Editar Apartamento' : 'Crear Nuevo Apartamento'}
              {selectedBuilding && (
                <Badge variant="outline" className="ml-2">
                  <Building className="h-3 w-3 mr-1" />
                  {selectedBuilding.name}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información del Apartamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="number" className="text-sm font-medium">
                      Número de Apartamento *
                    </Label>
                    <Input
                      id="number"
                      placeholder="101, 201A, etc."
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      className={errors.number ? 'border-red-500' : ''}
                    />
                    {errors.number && (
                      <p className="text-red-500 text-xs mt-1">{errors.number}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="floor" className="text-sm font-medium">
                      Piso *
                    </Label>
                    <Input
                      id="floor"
                      placeholder="1, 2, PB, etc."
                      value={formData.floor}
                      onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                      className={errors.floor ? 'border-red-500' : ''}
                    />
                    {errors.floor && (
                      <p className="text-red-500 text-xs mt-1">{errors.floor}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="monthlyFee" className="text-sm font-medium">
                      Cuota Mensual (Bs.) *
                    </Label>
                    <Input
                      id="monthlyFee"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="25000.00"
                      value={formData.monthlyFee || ''}
                      onChange={(e) => setFormData({ ...formData, monthlyFee: parseFloat(e.target.value) || 0 })}
                      className={errors.monthlyFee ? 'border-red-500' : ''}
                    />
                    {errors.monthlyFee && (
                      <p className="text-red-500 text-xs mt-1">{errors.monthlyFee}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <Label className="text-sm font-medium mb-3 block">
                      Estado del Apartamento *
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {(['vacant', 'occupied', 'maintenance'] as const).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setFormData({ ...formData, status })}
                          className={getStatusButtonClass(status, formData.status)}
                        >
                          {getStatusLabel(status)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button type="submit" className="bg-codomi-navy hover:bg-codomi-navy-dark">
                {apartment ? 'Actualizar Apartamento' : 'Crear Apartamento'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Save Confirmation */}
      <AlertDialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Cambios</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro de que desea {apartment ? 'actualizar' : 'crear'} el apartamento {formData.number}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowSaveConfirm(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave} className="bg-codomi-navy hover:bg-codomi-navy-dark">
              {apartment ? 'Actualizar' : 'Crear'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ApartmentForm;
