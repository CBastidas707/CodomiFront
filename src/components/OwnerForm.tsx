
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X, Plus, Unlink } from 'lucide-react';
import { Owner, Apartment } from '@/types/owner';
import { useToast } from '@/hooks/use-toast';

interface OwnerFormProps {
  owner?: Owner | null;
  availableApartments: Apartment[];
  onClose: () => void;
  onSave: (owner: Owner) => void;
}

const OwnerForm: React.FC<OwnerFormProps> = ({
  owner,
  availableApartments,
  onClose,
  onSave
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: owner?.name || '',
    documentType: owner?.documentType || 'cedula' as 'cedula' | 'rif',
    documentNumber: owner?.documentNumber || '',
    email: owner?.email || '',
    phone: owner?.phone || ''
  });
  const [linkedApartments, setLinkedApartments] = useState<Apartment[]>([]);
  const [apartmentSearch, setApartmentSearch] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [apartmentToUnlink, setApartmentToUnlink] = useState<string | null>(null);

  useEffect(() => {
    if (owner) {
      const ownerApartments = availableApartments.filter(apt => 
        owner.apartmentIds.includes(apt.id)
      );
      setLinkedApartments(ownerApartments);
    }
  }, [owner, availableApartments]);

  const validateDocument = (type: 'cedula' | 'rif', number: string) => {
    if (type === 'cedula') {
      const cedulaRegex = /^[VE]-\d{8}$/;
      return cedulaRegex.test(number);
    } else {
      const rifRegex = /^[JVE]-\d{8}-\d$/;
      return rifRegex.test(number);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.documentNumber.trim()) {
      newErrors.documentNumber = 'El documento es obligatorio';
    } else if (!validateDocument(formData.documentType, formData.documentNumber)) {
      newErrors.documentNumber = formData.documentType === 'cedula' 
        ? 'Formato de cédula inválido (Ej: V-12345678)'
        : 'Formato de RIF inválido (Ej: J-12345678-9)';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
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
    const newOwner: Owner = {
      id: owner?.id || `owner-${Date.now()}`,
      ...formData,
      apartmentIds: linkedApartments.map(apt => apt.id),
      createdAt: owner?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(newOwner);
    toast({
      title: owner ? 'Propietario actualizado' : 'Propietario creado',
      description: `${formData.name} ha sido ${owner ? 'actualizado' : 'creado'} exitosamente.`
    });
    setShowSaveConfirm(false);
  };

  const handleLinkApartment = (apartment: Apartment) => {
    if (!linkedApartments.find(apt => apt.id === apartment.id)) {
      setLinkedApartments([...linkedApartments, apartment]);
    }
    setApartmentSearch('');
  };

  const handleUnlinkApartment = (apartmentId: string) => {
    setApartmentToUnlink(apartmentId);
    setShowUnlinkConfirm(true);
  };

  const confirmUnlinkApartment = () => {
    if (apartmentToUnlink) {
      setLinkedApartments(linkedApartments.filter(apt => apt.id !== apartmentToUnlink));
      setApartmentToUnlink(null);
    }
    setShowUnlinkConfirm(false);
  };

  const filteredApartments = availableApartments.filter(apt => 
    !linkedApartments.find(linked => linked.id === apt.id) &&
    (apt.number.toLowerCase().includes(apartmentSearch.toLowerCase()) ||
     apt.buildingName.toLowerCase().includes(apartmentSearch.toLowerCase()))
  );

  const apartmentToUnlinkData = linkedApartments.find(apt => apt.id === apartmentToUnlink);

  return (
    <>
      <Dialog open={true} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {owner ? 'Editar Propietario' : 'Crear Nuevo Propietario'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Nombre *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Tipo de Documento *</Label>
                    <Select 
                      value={formData.documentType} 
                      onValueChange={(value: 'cedula' | 'rif') => 
                        setFormData({ ...formData, documentType: value, documentNumber: '' })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cedula">Cédula</SelectItem>
                        <SelectItem value="rif">RIF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="documentNumber" className="text-sm font-medium">
                      Número de {formData.documentType === 'cedula' ? 'Cédula' : 'RIF'} *
                    </Label>
                    <Input
                      id="documentNumber"
                      placeholder={formData.documentType === 'cedula' ? 'V-12345678' : 'J-12345678-9'}
                      value={formData.documentNumber}
                      onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                      className={errors.documentNumber ? 'border-red-500' : ''}
                    />
                    {errors.documentNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.documentNumber}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Teléfono</Label>
                    <Input
                      id="phone"
                      placeholder="+58-412-1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Apartment Management */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gestión de Apartamentos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Linked Apartments */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Apartamentos Vinculados ({linkedApartments.length})
                  </Label>
                  {linkedApartments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {linkedApartments.map(apartment => (
                        <div key={apartment.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{apartment.buildingName}</p>
                            <p className="text-xs text-gray-600">Apartamento {apartment.number}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnlinkApartment(apartment.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Unlink className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No hay apartamentos vinculados</p>
                  )}
                </div>

                {/* Search and Link Apartments */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Buscar y Vincular Apartamentos
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por número de apartamento o edificio..."
                      value={apartmentSearch}
                      onChange={(e) => setApartmentSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {apartmentSearch && (
                    <div className="mt-2 max-h-32 overflow-y-auto border rounded">
                      {filteredApartments.length > 0 ? (
                        filteredApartments.map(apartment => (
                          <div
                            key={apartment.id}
                            className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleLinkApartment(apartment)}
                          >
                            <div>
                              <p className="text-sm font-medium">{apartment.buildingName}</p>
                              <p className="text-xs text-gray-600">Apartamento {apartment.number}</p>
                            </div>
                            <Plus className="h-4 w-4 text-green-500" />
                          </div>
                        ))
                      ) : (
                        <p className="p-2 text-sm text-gray-500">No se encontraron apartamentos</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button type="submit" className="bg-codomi-navy hover:bg-codomi-navy-dark">
                {owner ? 'Actualizar Propietario' : 'Crear Propietario'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Unlink Apartment Confirmation */}
      <AlertDialog open={showUnlinkConfirm} onOpenChange={setShowUnlinkConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Desvinculación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro de que desea desvincular el apartamento {apartmentToUnlinkData?.number} del edificio {apartmentToUnlinkData?.buildingName}?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowUnlinkConfirm(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmUnlinkApartment} className="bg-red-600 hover:bg-red-700">
              Desvincular
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Save Confirmation */}
      <AlertDialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Cambios</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro de que desea {owner ? 'actualizar' : 'crear'} los datos del propietario {formData.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowSaveConfirm(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave} className="bg-codomi-navy hover:bg-codomi-navy-dark">
              {owner ? 'Actualizar' : 'Crear'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OwnerForm;
