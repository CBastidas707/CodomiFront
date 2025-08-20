import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, X, Plus, Unlink, Building } from 'lucide-react';
import { Owner, Apartment } from '@/types/owner';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Mock buildings data for testing
const mockBuildings = [
  { id: '1', name: 'Torre Norte' },
  { id: '2', name: 'Torre Sur' },
  { id: '3', name: 'Torre Este' },
  { id: '4', name: 'Torre Oeste' }
];

// Mock apartments data for testing
const mockApartmentsData: Apartment[] = [
  { id: 'apt1', number: '101', floor: '1', buildingId: '1', buildingName: 'Torre Norte', ownerId: '1', ownerName: 'Juan Pérez', status: 'occupied', monthlyFee: 25000 },
  { id: 'apt2', number: '201', floor: '2', buildingId: '1', buildingName: 'Torre Norte', ownerId: '1', ownerName: 'Juan Pérez', status: 'occupied', monthlyFee: 25000 },
  { id: 'apt3', number: '301', floor: '3', buildingId: '1', buildingName: 'Torre Norte', ownerId: '2', ownerName: 'María González', status: 'occupied', monthlyFee: 25000 },
  { id: 'apt4', number: '102', floor: '1', buildingId: '2', buildingName: 'Torre Sur', ownerId: '3', ownerName: 'Empresa ABC C.A.', status: 'occupied', monthlyFee: 30000 },
  { id: 'apt5', number: '202', floor: '2', buildingId: '2', buildingName: 'Torre Sur', ownerId: '3', ownerName: 'Empresa ABC C.A.', status: 'occupied', monthlyFee: 30000 },
  { id: 'apt6', number: '302', floor: '3', buildingId: '2', buildingName: 'Torre Sur', ownerId: '3', ownerName: 'Empresa ABC C.A.', status: 'occupied', monthlyFee: 30000 },
  { id: 'apt7', number: '401', floor: '4', buildingId: '1', buildingName: 'Torre Norte', ownerId: '4', ownerName: 'Carlos Rodríguez', status: 'occupied', monthlyFee: 25000 },
  { id: 'apt8', number: '103', floor: '1', buildingId: '3', buildingName: 'Torre Este', ownerId: '5', ownerName: 'Ana Martínez', status: 'occupied', monthlyFee: 28000 },
  { id: 'apt9', number: '203', floor: '2', buildingId: '3', buildingName: 'Torre Este', ownerId: '5', ownerName: 'Ana Martínez', status: 'occupied', monthlyFee: 28000 },
  { id: 'apt10', number: '303', floor: '3', buildingId: '3', buildingName: 'Torre Este', ownerId: null, ownerName: null, status: 'vacant', monthlyFee: 28000 },
  { id: 'apt11', number: '403', floor: '4', buildingId: '3', buildingName: 'Torre Este', ownerId: null, ownerName: null, status: 'vacant', monthlyFee: 28000 },
  { id: 'apt12', number: '104', floor: '1', buildingId: '4', buildingName: 'Torre Oeste', ownerId: null, ownerName: null, status: 'vacant', monthlyFee: 32000 },
  { id: 'apt13', number: '204', floor: '2', buildingId: '4', buildingName: 'Torre Oeste', ownerId: null, ownerName: null, status: 'maintenance', monthlyFee: 32000 },
  { id: 'apt14', number: '304', floor: '3', buildingId: '4', buildingName: 'Torre Oeste', ownerId: null, ownerName: null, status: 'vacant', monthlyFee: 32000 },
  { id: 'apt15', number: '404', floor: '4', buildingId: '4', buildingName: 'Torre Oeste', ownerId: null, ownerName: null, status: 'vacant', monthlyFee: 32000 }
];

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
  const { buildings: authBuildings } = useAuth();
  
  // Use mock data if auth buildings are empty or use real data if available
  const buildings = authBuildings.length > 0 ? authBuildings : mockBuildings;
  const allApartments = availableApartments.length > 0 ? availableApartments : mockApartmentsData;

  const [formData, setFormData] = useState({
    name: owner?.name || '',
    documentType: owner?.documentType || 'cedula' as 'cedula' | 'rif',
    documentNumber: owner?.documentNumber || '',
    email: owner?.email || '',
    phone: owner?.phone || ''
  });
  const [linkedApartments, setLinkedApartments] = useState<Apartment[]>([]);
  const [apartmentSearch, setApartmentSearch] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [searchMode, setSearchMode] = useState<'free' | 'structured'>('free');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [apartmentToUnlink, setApartmentToUnlink] = useState<string | null>(null);

  useEffect(() => {
    if (owner) {
      const ownerApartments = allApartments.filter(apt => 
        owner.apartmentIds.includes(apt.id)
      );
      setLinkedApartments(ownerApartments);
    }
  }, [owner, allApartments]);

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

  // Filter apartments based on search mode
  const getFilteredApartments = () => {
    let filtered = allApartments.filter(apt => 
      !linkedApartments.find(linked => linked.id === apt.id) && 
      (!apt.ownerId || apt.ownerId === owner?.id)
    );

    if (searchMode === 'structured') {
      // First filter by building if selected
      if (selectedBuilding !== 'all') {
        filtered = filtered.filter(apt => apt.buildingId === selectedBuilding);
      }
      // Then by apartment search if any
      if (apartmentSearch) {
        filtered = filtered.filter(apt =>
          apt.number.toLowerCase().includes(apartmentSearch.toLowerCase())
        );
      }
    } else {
      // Free search mode - search across both building and apartment
      if (apartmentSearch) {
        filtered = filtered.filter(apt =>
          apt.number.toLowerCase().includes(apartmentSearch.toLowerCase()) ||
          apt.buildingName.toLowerCase().includes(apartmentSearch.toLowerCase())
        );
      }
    }

    return filtered;
  };

  const filteredApartments = getFilteredApartments();
  const apartmentToUnlinkData = linkedApartments.find(apt => apt.id === apartmentToUnlink);

  return (
    <>
      <Dialog open={true} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
              <CardContent className="space-y-6">
                {/* Linked Apartments */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Apartamentos Vinculados ({linkedApartments.length})
                  </Label>
                  {linkedApartments.length > 0 ? (
                    <div className="space-y-2">
                      {linkedApartments.map(apartment => (
                        <div key={apartment.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{apartment.buildingName}</span>
                              <Badge variant="outline">Apt. {apartment.number}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Piso {apartment.floor} • Bs. {apartment.monthlyFee.toLocaleString()}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnlinkApartment(apartment.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Unlink className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No hay apartamentos vinculados</p>
                  )}
                </div>

                {/* Search and Link Apartments */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Buscar y Vincular Apartamentos
                  </Label>
                  
                  {/* Search Mode Tabs */}
                  <Tabs value={searchMode} onValueChange={(value: 'free' | 'structured') => {
                    setSearchMode(value);
                    setApartmentSearch('');
                    setSelectedBuilding('all');
                  }} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="free">Búsqueda Libre</TabsTrigger>
                      <TabsTrigger value="structured">Por Edificio</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="free" className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Buscar por edificio o apartamento..."
                          value={apartmentSearch}
                          onChange={(e) => setApartmentSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="structured" className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar edificio" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos los edificios</SelectItem>
                            {buildings.map(building => (
                              <SelectItem key={building.id} value={building.id}>
                                {building.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            placeholder="Buscar apartamento..."
                            value={apartmentSearch}
                            onChange={(e) => setApartmentSearch(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Search Results - Improved list format */}
                  {(apartmentSearch || selectedBuilding !== 'all') && (
                    <div className="mt-3 max-h-48 overflow-y-auto border rounded-lg bg-card">
                      {filteredApartments.length > 0 ? (
                        <div className="divide-y">
                          {filteredApartments.map(apartment => (
                            <div
                              key={apartment.id}
                              className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                              onClick={() => handleLinkApartment(apartment)}
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Building className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{apartment.buildingName}</span>
                                  <Badge variant="outline">Apt. {apartment.number}</Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>Piso {apartment.floor}</span>
                                  <span>Bs. {apartment.monthlyFee.toLocaleString()}</span>
                                  <Badge 
                                    variant={apartment.status === 'vacant' ? 'secondary' : 'outline'}
                                    className="text-xs"
                                  >
                                    {apartment.status === 'occupied' ? 'Ocupado' : 
                                     apartment.status === 'vacant' ? 'Vacante' : 'Mantenimiento'}
                                  </Badge>
                                </div>
                              </div>
                              <Plus className="h-4 w-4 text-green-500 flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="p-4 text-sm text-muted-foreground text-center">
                          No se encontraron apartamentos disponibles
                        </p>
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
