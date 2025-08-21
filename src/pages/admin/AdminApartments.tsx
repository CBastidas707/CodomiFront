import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Search, Building, Users, DollarSign, MoreVertical, Edit, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ApartmentForm from '@/components/ApartmentForm';
import { ExtendedApartment, AliquotType } from '@/types/apartment';
import { Owner } from '@/types/owner';

// Mock data for aliquot types
export const mockAliquotTypes: AliquotType[] = [
  { id: '1', name: 'Tipo A', percentage: 18.0 },
  { id: '2', name: 'Tipo B', percentage: 17.5 },
  { id: '3', name: 'Tipo C', percentage: 16.0 },
  { id: '4', name: 'Tipo D', percentage: 15.5 },
  { id: '5', name: 'Tipo E', percentage: 14.0 },
];

// Mock owners data
const mockOwners: Owner[] = [
  {
    id: '1',
    name: 'Carlos Mendoza',
    documentType: 'cedula',
    documentNumber: 'V-12345678',
    email: 'carlos@email.com',
    phone: '+58-412-1234567',
    apartmentIds: ['1', '5'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'María López',
    documentType: 'cedula',
    documentNumber: 'V-87654321',
    email: 'maria@email.com',
    phone: '+58-414-7654321',
    apartmentIds: ['2'],
    createdAt: '2024-01-16T09:30:00Z',
    updatedAt: '2024-01-16T09:30:00Z'
  },
  {
    id: '3',
    name: 'Ana García',
    documentType: 'rif',
    documentNumber: 'J-40123456-7',
    email: 'ana@email.com',
    phone: '+58-426-9876543',
    apartmentIds: ['3', '8'],
    createdAt: '2024-01-17T14:15:00Z',
    updatedAt: '2024-01-17T14:15:00Z'
  }
];

// Mock extended apartments data with proper building associations
const mockExtendedApartments: ExtendedApartment[] = [
  {
    id: '1',
    number: '101',
    floor: '1',
    buildingId: '1',
    buildingName: 'Torre Norte',
    squareMeters: 85,
    measurementType: 'area',
    aliquotTypeId: '1',
    aliquotType: mockAliquotTypes[0],
    ownerIds: ['1'],
    owners: [mockOwners[0]],
    status: 'occupied',
    monthlyFee: 25000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    number: '102',
    floor: '1',
    buildingId: '1',
    buildingName: 'Torre Norte',
    squareMeters: 92,
    measurementType: 'area',
    aliquotTypeId: '2',
    aliquotType: mockAliquotTypes[1],
    ownerIds: ['2'],
    owners: [mockOwners[1]],
    status: 'occupied',
    monthlyFee: 27000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    number: '201',
    floor: '2',
    buildingId: '1',
    buildingName: 'Torre Norte',
    squareMeters: 88,
    measurementType: 'area',
    aliquotTypeId: '1',
    aliquotType: mockAliquotTypes[0],
    ownerIds: ['3'],
    owners: [mockOwners[2]],
    status: 'vacant',
    monthlyFee: 26000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    number: '301',
    floor: '3',
    buildingId: '2',
    buildingName: 'Torre Sur',
    squareMeters: 75,
    measurementType: 'area',
    aliquotTypeId: '3',
    aliquotType: mockAliquotTypes[2],
    ownerIds: [],
    owners: [],
    status: 'maintenance',
    monthlyFee: 22000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    number: '302',
    floor: '3',
    buildingId: '2',
    buildingName: 'Torre Sur',
    squareMeters: 95,
    measurementType: 'area',
    aliquotTypeId: '2',
    aliquotType: mockAliquotTypes[1],
    ownerIds: ['1'],
    owners: [mockOwners[0]],
    status: 'occupied',
    monthlyFee: 28000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    number: '101',
    floor: '1',
    buildingId: '3',
    buildingName: 'Torre Este',
    squareMeters: 90,
    measurementType: 'area',
    aliquotTypeId: '1',
    aliquotType: mockAliquotTypes[0],
    ownerIds: [],
    owners: [],
    status: 'vacant',
    monthlyFee: 28000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '7',
    number: '201',
    floor: '2',
    buildingId: '4',
    buildingName: 'Torre Oeste',
    squareMeters: 85,
    measurementType: 'area',
    aliquotTypeId: '2',
    aliquotType: mockAliquotTypes[1],
    ownerIds: [],
    owners: [],
    status: 'maintenance',
    monthlyFee: 30000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '8',
    number: '101',
    floor: '1',
    buildingId: '5',
    buildingName: 'Edificio Central',
    squareMeters: 100,
    measurementType: 'area',
    aliquotTypeId: '1',
    aliquotType: mockAliquotTypes[0],
    ownerIds: [],
    owners: [],
    status: 'vacant',
    monthlyFee: 35000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const AdminApartments: React.FC = () => {
  const { buildings, selectedBuilding } = useAuth();
  const [apartments, setApartments] = useState<ExtendedApartment[]>(mockExtendedApartments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showApartmentForm, setShowApartmentForm] = useState(false);
  const [editingApartment, setEditingApartment] = useState<ExtendedApartment | null>(null);

  // Filter apartments by selected building automatically
  const filteredApartments = useMemo(() => {
    let filtered = apartments;

    // First filter by selected building
    if (selectedBuilding) {
      filtered = filtered.filter(apt => apt.buildingId === selectedBuilding.id);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.buildingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.owners?.some(owner => owner.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === selectedStatus);
    }

    return filtered;
  }, [apartments, searchTerm, selectedStatus, selectedBuilding]);

  // Group apartments by building for display
  const apartmentsByBuilding = useMemo(() => {
    const grouped: Record<string, ExtendedApartment[]> = {};
    filteredApartments.forEach(apt => {
      if (!grouped[apt.buildingName]) {
        grouped[apt.buildingName] = [];
      }
      grouped[apt.buildingName].push(apt);
    });
    return grouped;
  }, [filteredApartments]);

  const handleCreateApartment = () => {
    setEditingApartment(null);
    setShowApartmentForm(true);
  };

  const handleEditApartment = (apartment: ExtendedApartment) => {
    setEditingApartment(apartment);
    setShowApartmentForm(true);
  };

  const handleViewPayments = (apartmentId: string) => {
    // TODO: Navigate to financial management with apartment filter
    console.log('Navigate to payments for apartment:', apartmentId);
  };

  const handleSaveApartment = (apartmentData: any) => {
    const extendedApartmentData: ExtendedApartment = {
      ...apartmentData,
      buildingName: buildings.find(b => b.id === apartmentData.buildingId)?.name || 'Edificio Desconocido',
      squareMeters: typeof apartmentData.squareMeters === 'string' ? parseFloat(apartmentData.squareMeters) || 0 : (apartmentData.squareMeters as number) || 0,
      measurementType: 'area' as const,
      aliquotTypeId: apartmentData.aliquotTypeId || '1',
      aliquotType: mockAliquotTypes.find(type => type.id === (apartmentData.aliquotTypeId || '1')),
      ownerIds: [],
      owners: [],
      monthlyFee: typeof apartmentData.monthlyFee === 'string' ? parseFloat(apartmentData.monthlyFee) || 0 : (apartmentData.monthlyFee as number) || 0,
      createdAt: apartmentData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingApartment) {
      setApartments(prev => prev.map(apt => 
        apt.id === editingApartment.id ? { ...extendedApartmentData, id: editingApartment.id } : apt
      ));
    } else {
      const newApartment = {
        ...extendedApartmentData,
        id: `apt-${Date.now()}`
      };
      setApartments(prev => [...prev, newApartment]);
    }
    setShowApartmentForm(false);
    setEditingApartment(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'occupied':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Ocupado</Badge>;
      case 'vacant':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Vacante</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Mantenimiento</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Calculate statistics based on filtered apartments
  const totalApartments = filteredApartments.length;
  const occupiedApartments = filteredApartments.filter(apt => apt.status === 'occupied').length;
  const vacantApartments = filteredApartments.filter(apt => apt.status === 'vacant').length;

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="w-full max-w-none p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              Gestión de Apartamentos
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
              Administra todos los apartamentos
              {selectedBuilding && (
                <span className="block sm:inline sm:ml-2 text-primary font-medium">
                  • {selectedBuilding.name}
                </span>
              )}
            </p>
            {!selectedBuilding && (
              <p className="text-xs sm:text-sm text-yellow-600 mt-1 font-medium">
                ⚠️ Selecciona un edificio para ver sus apartamentos específicos
              </p>
            )}
          </div>
          <Button 
            onClick={handleCreateApartment} 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Apartamento
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Total Apartamentos
                    {selectedBuilding && (
                      <span className="block text-xs text-muted-foreground">
                        en {selectedBuilding.name}
                      </span>
                    )}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{totalApartments}</p>
                </div>
                <Building className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Ocupados</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{occupiedApartments}</p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Disponibles</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{vacantApartments}</p>
                </div>
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="w-full">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar por número o propietario..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      size="sm"
                    />
                  </div>
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="occupied">Ocupado</SelectItem>
                    <SelectItem value="vacant">Vacante</SelectItem>
                    <SelectItem value="maintenance">Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Apartments by Building */}
        <div className="space-y-4">
          {Object.entries(apartmentsByBuilding).length === 0 ? (
            <Card>
              <CardContent className="p-6 sm:p-8 text-center">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-sm sm:text-base">
                  {selectedBuilding 
                    ? `No se encontraron apartamentos en ${selectedBuilding.name} con los filtros aplicados`
                    : "No se encontraron apartamentos con los filtros aplicados"
                  }
                </p>
                {!selectedBuilding && (
                  <p className="text-muted-foreground text-xs sm:text-sm mt-2">
                    Selecciona un edificio específico para ver sus apartamentos.
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <Accordion type="multiple" defaultValue={Object.keys(apartmentsByBuilding)} className="space-y-4">
              {Object.entries(apartmentsByBuilding).map(([buildingName, buildingApartments]) => (
                <AccordionItem key={buildingName} value={buildingName}>
                  <Card>
                    <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full mr-4">
                        <div className="flex items-center gap-3">
                          <Building className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          <span className="text-sm sm:text-lg font-semibold">{buildingName}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {buildingApartments.length} apartamentos
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="px-4 sm:px-6 pb-4">
                        {/* Mobile view - List */}
                        <div className="block md:hidden space-y-3">
                          {buildingApartments.map(apartment => (
                            <Card key={apartment.id} className="p-3 sm:p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold text-sm sm:text-base">
                                    Apartamento {apartment.number}
                                  </h4>
                                  <p className="text-xs sm:text-sm text-muted-foreground">
                                    Piso {apartment.floor}
                                  </p>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditApartment(apartment)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleViewPayments(apartment.id)}>
                                      <CreditCard className="h-4 w-4 mr-2" />
                                      Ver Pagos
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs sm:text-sm text-muted-foreground">Estado:</span>
                                  {getStatusBadge(apartment.status)}
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs sm:text-sm text-muted-foreground">Área:</span>
                                  <span className="text-xs sm:text-sm">
                                    {apartment.squareMeters} {apartment.measurementType === 'area' ? 'm²' : '%'}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs sm:text-sm text-muted-foreground">Alícuota:</span>
                                  <span className="text-xs sm:text-sm">
                                    {apartment.aliquotType?.name} ({apartment.aliquotType?.percentage}%)
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs sm:text-sm text-muted-foreground">Propietarios:</span>
                                  <span className="text-xs sm:text-sm">{apartment.owners?.length || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs sm:text-sm text-muted-foreground">Cuota:</span>
                                  <span className="text-xs sm:text-sm font-medium">
                                    Bs. {apartment.monthlyFee.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>

                        {/* Desktop view - Table */}
                        <div className="hidden md:block overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Apartamento</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Área</TableHead>
                                <TableHead>Alícuota</TableHead>
                                <TableHead>Propietarios</TableHead>
                                <TableHead>Cuota Mensual</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {buildingApartments.map(apartment => (
                                <TableRow key={apartment.id}>
                                  <TableCell>
                                    <div>
                                      <p className="font-medium">Apartamento {apartment.number}</p>
                                      <p className="text-sm text-muted-foreground">Piso {apartment.floor}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {getStatusBadge(apartment.status)}
                                  </TableCell>
                                  <TableCell>
                                    {apartment.squareMeters ? 
                                      `${apartment.squareMeters} ${apartment.measurementType === 'area' ? 'm²' : '%'}` 
                                      : '-'
                                    }
                                  </TableCell>
                                  <TableCell>
                                    <div>
                                      <p className="text-sm">{apartment.aliquotType?.name}</p>
                                      <p className="text-xs text-muted-foreground">{apartment.aliquotType?.percentage}%</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                      {apartment.owners && apartment.owners.length > 0 ? (
                                        apartment.owners.map(owner => (
                                          <Badge key={owner.id} variant="outline" className="text-xs">
                                            {owner.name.split(' ')[0]}
                                          </Badge>
                                        ))
                                      ) : (
                                        <span className="text-sm text-muted-foreground">Sin propietario</span>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <span className="font-medium">Bs. {apartment.monthlyFee.toLocaleString()}</span>
                                  </TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEditApartment(apartment)}>
                                          <Edit className="h-4 w-4 mr-2" />
                                          Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleViewPayments(apartment.id)}>
                                          <CreditCard className="h-4 w-4 mr-2" />
                                          Ver Pagos
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        {/* Apartment Form Modal */}
        {showApartmentForm && (
          <ApartmentForm
            apartment={editingApartment}
            onClose={() => {
              setShowApartmentForm(false);
              setEditingApartment(null);
            }}
            onSave={handleSaveApartment}
          />
        )}
      </div>
    </div>
  );
};

export default AdminApartments;
