
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExtendedApartment, AliquotType } from '@/types/apartment';
import { Building } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ApartmentFormProps {
  apartment?: ExtendedApartment | null;
  buildings: Building[];
  aliquotTypes: AliquotType[];
  onClose: () => void;
  onSave: (apartment: ExtendedApartment) => void;
}

const ApartmentForm: React.FC<ApartmentFormProps> = ({
  apartment,
  buildings,
  aliquotTypes,
  onClose,
  onSave
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    buildingId: apartment?.buildingId || '',
    number: apartment?.number || '',
    floor: apartment?.floor || '',
    squareMeters: apartment?.squareMeters?.toString() || '',
    measurementType: apartment?.measurementType || 'area' as 'area' | 'percentage',
    aliquotTypeId: apartment?.aliquotTypeId || '',
    status: apartment?.status || 'vacant' as 'occupied' | 'vacant' | 'maintenance',
    monthlyFee: apartment?.monthlyFee?.toString() || ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.buildingId) {
      newErrors.buildingId = 'El edificio es obligatorio';
    }

    if (!formData.number.trim()) {
      newErrors.number = 'El número de apartamento es obligatorio';
    } else if (formData.number.trim().length < 1) {
      newErrors.number = 'El número debe tener al menos 1 carácter';
    }

    if (!formData.aliquotTypeId) {
      newErrors.aliquotTypeId = 'El tipo de alícuota es obligatorio';
    }

    if (formData.squareMeters && (parseFloat(formData.squareMeters) <= 0 || isNaN(parseFloat(formData.squareMeters)))) {
      newErrors.squareMeters = 'Los metros cuadrados deben ser un número mayor a 0';
    }

    if (formData.monthlyFee && (parseFloat(formData.monthlyFee) < 0 || isNaN(parseFloat(formData.monthlyFee)))) {
      newErrors.monthlyFee = 'La cuota mensual debe ser un número válido';
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
    const selectedBuilding = buildings.find(b => b.id === formData.buildingId);
    const selectedAliquotType = aliquotTypes.find(at => at.id === formData.aliquotTypeId);

    const newApartment: ExtendedApartment = {
      id: apartment?.id || `apt-${Date.now()}`,
      number: formData.number.trim(),
      floor: formData.floor.trim() || '1',
      buildingId: formData.buildingId,
      buildingName: selectedBuilding?.name || '',
      squareMeters: formData.squareMeters ? parseFloat(formData.squareMeters) : undefined,
      measurementType: formData.measurementType,
      aliquotTypeId: formData.aliquotTypeId,
      aliquotType: selectedAliquotType,
      ownerIds: apartment?.ownerIds || [],
      owners: apartment?.owners || [],
      status: formData.status,
      monthlyFee: formData.monthlyFee ? parseFloat(formData.monthlyFee) : 0,
      createdAt: apartment?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(newApartment);
    toast({
      title: apartment ? 'Apartamento actualizado' : 'Apartamento creado',
      description: `Apartamento ${formData.number} ha sido ${apartment ? 'actualizado' : 'creado'} exitosamente.`
    });
    setShowSaveConfirm(false);
  };

  const selectedBuilding = buildings.find(b => b.id === formData.buildingId);

  return (
    <>
      <Dialog open={true} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {apartment ? 'Editar Apartamento' : 'Crear Nuevo Apartamento'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="buildingId" className="text-sm font-medium">
                      Edificio *
                    </Label>
                    <Select 
                      value={formData.buildingId} 
                      onValueChange={(value) => setFormData({ ...formData, buildingId: value })}
                      disabled={!!apartment} // Read-only when editing
                    >
                      <SelectTrigger className={errors.buildingId ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Seleccionar edificio" />
                      </SelectTrigger>
                      <SelectContent>
                        {buildings.map(building => (
                          <SelectItem key={building.id} value={building.id}>
                            {building.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.buildingId && (
                      <p className="text-red-500 text-xs mt-1">{errors.buildingId}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="number" className="text-sm font-medium">
                      Número de Apartamento *
                    </Label>
                    <Input
                      id="number"
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      placeholder="101, A-3, etc."
                      className={errors.number ? 'border-red-500' : ''}
                    />
                    {errors.number && (
                      <p className="text-red-500 text-xs mt-1">{errors.number}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="floor" className="text-sm font-medium">Piso</Label>
                    <Input
                      id="floor"
                      value={formData.floor}
                      onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                      placeholder="1, 2, PB, etc."
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Estado *</Label>
                    <RadioGroup 
                      value={formData.status} 
                      onValueChange={(value: 'occupied' | 'vacant' | 'maintenance') => 
                        setFormData({ ...formData, status: value })
                      }
                      className="flex flex-row space-x-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="occupied" id="occupied" />
                        <Label htmlFor="occupied" className="text-sm">Ocupado</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="vacant" id="vacant" />
                        <Label htmlFor="vacant" className="text-sm">Vacante</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="maintenance" id="maintenance" />
                        <Label htmlFor="maintenance" className="text-sm">Mantenimiento</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información Técnica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="squareMeters" className="text-sm font-medium">
                      {formData.measurementType === 'area' ? 'Metros Cuadrados' : 'Porcentaje'}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="squareMeters"
                        type="number"
                        step="0.01"
                        value={formData.squareMeters}
                        onChange={(e) => setFormData({ ...formData, squareMeters: e.target.value })}
                        placeholder={formData.measurementType === 'area' ? '85.5' : '3.2'}
                        className={errors.squareMeters ? 'border-red-500' : ''}
                      />
                      <Select 
                        value={formData.measurementType} 
                        onValueChange={(value: 'area' | 'percentage') => 
                          setFormData({ ...formData, measurementType: value })
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="area">m²</SelectItem>
                          <SelectItem value="percentage">%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {errors.squareMeters && (
                      <p className="text-red-500 text-xs mt-1">{errors.squareMeters}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Tipo de Alícuota *</Label>
                    <Select 
                      value={formData.aliquotTypeId} 
                      onValueChange={(value) => setFormData({ ...formData, aliquotTypeId: value })}
                    >
                      <SelectTrigger className={errors.aliquotTypeId ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {aliquotTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name} ({type.percentage}%)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.aliquotTypeId && (
                      <p className="text-red-500 text-xs mt-1">{errors.aliquotTypeId}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="monthlyFee" className="text-sm font-medium">Cuota Mensual (USD)</Label>
                    <Input
                      id="monthlyFee"
                      type="number"
                      step="0.01"
                      value={formData.monthlyFee}
                      onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                      placeholder="25000.00"
                      className={errors.monthlyFee ? 'border-red-500' : ''}
                    />
                    {errors.monthlyFee && (
                      <p className="text-red-500 text-xs mt-1">{errors.monthlyFee}</p>
                    )}
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
              ¿Está seguro de que desea {apartment ? 'actualizar' : 'crear'} el apartamento {formData.number} en {selectedBuilding?.name}?
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
