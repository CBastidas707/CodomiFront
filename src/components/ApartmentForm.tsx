
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
                    <RadioGroup
                      value={formData.status}
                      onValueChange={(value: 'occupied' | 'vacant' | 'maintenance') => 
                        setFormData({ ...formData, status: value })
                      }
                      className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="vacant" id="vacant" />
                        <Label htmlFor="vacant" className="text-sm cursor-pointer">
                          Vacante
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="occupied" id="occupied" />
                        <Label htmlFor="occupied" className="text-sm cursor-pointer">
                          Ocupado
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="maintenance" id="maintenance" />
                        <Label htmlFor="maintenance" className="text-sm cursor-pointer">
                          Mantenimiento
                        </Label>
                      </div>
                    </RadioGroup>
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
