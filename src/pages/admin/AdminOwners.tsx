
import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, User, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { Owner, Apartment } from '@/types/owner';
import OwnerProfileDialog from '@/components/OwnerProfileDialog';
import OwnerForm from '@/components/OwnerForm';

// Enhanced mock data for owners
const mockOwners: Owner[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    documentType: 'cedula',
    documentNumber: 'V-12345678',
    email: 'juan.perez@email.com',
    phone: '+58-412-1234567',
    apartmentIds: ['apt1', 'apt2'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'María González',
    documentType: 'cedula',
    documentNumber: 'V-23456789',
    email: 'maria.gonzalez@email.com',
    phone: '+58-414-9876543',
    apartmentIds: ['apt3'],
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'Empresa ABC C.A.',
    documentType: 'rif',
    documentNumber: 'J-40123456-7',
    email: 'contacto@empresaabc.com',
    phone: '+58-212-5551234',
    apartmentIds: ['apt4', 'apt5', 'apt6'],
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01'
  },
  {
    id: '4',
    name: 'Carlos Rodríguez',
    documentType: 'cedula',
    documentNumber: 'V-87654321',
    email: 'carlos.rodriguez@email.com',
    phone: '+58-416-1122334',
    apartmentIds: ['apt7'],
    createdAt: '2024-02-05',
    updatedAt: '2024-02-05'
  },
  {
    id: '5',
    name: 'Ana Martínez',
    documentType: 'cedula',
    documentNumber: 'V-11223344',
    email: 'ana.martinez@email.com',
    phone: '+58-424-5566778',
    apartmentIds: ['apt8', 'apt9'],
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10'
  }
];

// Enhanced mock data for apartments with proper building associations
const mockApartments: Apartment[] = [
  { id: 'apt1', number: '101', floor: '1', buildingId: '1', buildingName: 'Torre Norte', ownerId: '1', ownerName: 'Juan Pérez', status: 'occupied', monthlyFee: 25000 },
  { id: 'apt2', number: '201', floor: '2', buildingId: '1', buildingName: 'Torre Norte', ownerId: '1', ownerName: 'Juan Pérez', status: 'occupied', monthlyFee: 25000 },
  { id: 'apt3', number: '301', floor: '3', buildingId: '1', buildingName: 'Torre Norte', ownerId: '2', ownerName: 'María González', status: 'occupied', monthlyFee: 25000 },
  { id: 'apt4', number: '102', floor: '1', buildingId: '2', buildingName: 'Torre Sur', ownerId: '3', ownerName: 'Empresa ABC C.A.', status: 'occupied', monthlyFee: 30000 },
  { id: 'apt5', number: '202', floor: '2', buildingId: '2', buildingName: 'Torre Sur', ownerId: '3', ownerName: 'Empresa ABC C.A.', status: 'occupied', monthlyFee: 30000 },
  { id: 'apt6', number: '302', floor: '3', buildingId: '2', buildingName: 'Torre Sur', ownerId: '3', ownerName: 'Empresa ABC C.A.', status: 'occupied', monthlyFee: 30000 },
  { id: 'apt7', number: '401', floor: '4', buildingId: '3', buildingName: 'Torre Este', ownerId: '4', ownerName: 'Carlos Rodríguez', status: 'occupied', monthlyFee: 25000 },
  { id: 'apt8', number: '103', floor: '1', buildingId: '3', buildingName: 'Torre Este', ownerId: '5', ownerName: 'Ana Martínez', status: 'occupied', monthlyFee: 28000 },
  { id: 'apt9', number: '203', floor: '2', buildingId: '3', buildingName: 'Torre Este', ownerId: '5', ownerName: 'Ana Martínez', status: 'occupied', monthlyFee: 28000 },
  { id: 'apt10', number: '303', floor: '3', buildingId: '4', buildingName: 'Torre Oeste', ownerId: null, ownerName: null, status: 'vacant', monthlyFee: 28000 },
  { id: 'apt11', number: '403', floor: '4', buildingId: '4', buildingName: 'Torre Oeste', ownerId: null, ownerName: null, status: 'vacant', monthlyFee: 28000 },
  { id: 'apt12', number: '104', floor: '1', buildingId: '5', buildingName: 'Edificio Central', ownerId: null, ownerName: null, status: 'vacant', monthlyFee: 32000 },
  { id: 'apt13', number: '204', floor: '2', buildingId: '5', buildingName: 'Edificio Central', ownerId: null, ownerName: null, status: 'maintenance', monthlyFee: 32000 },
];

const AdminOwners: React.FC = () => {
  const { buildings, selectedBuilding } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('all');
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [showOwnerForm, setShowOwnerForm] = useState(false);
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);

  const getOwnerApartments = (ownerId: string) => {
    let apartments = mockApartments.filter(apt => apt.ownerId === ownerId);
    
    // Filter by selected building if one is selected
    if (selectedBuilding) {
      apartments = apartments.filter(apt => apt.buildingId === selectedBuilding.id);
    }
    
    return apartments;
  };

  const filteredOwners = useMemo(() => {
    let owners = mockOwners;
    
    // First filter by selected building - only show owners who have apartments in the selected building
    if (selectedBuilding) {
      const ownerIdsInBuilding = new Set(
        mockApartments
          .filter(apt => apt.buildingId === selectedBuilding.id && apt.ownerId)
          .map(apt => apt.ownerId)
          .filter((id): id is string => id !== null && id !== undefined)
      );
      owners = owners.filter(owner => ownerIdsInBuilding.has(owner.id));
    }

    return owners.filter(owner => {
      const matchesSearch = owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getOwnerApartments(owner.id).some(apt => apt.number.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDocType = documentTypeFilter === 'all' || owner.documentType === documentTypeFilter;

      return matchesSearch && matchesDocType;
    });
  }, [searchTerm, documentTypeFilter, selectedBuilding]);

  const handleViewOwner = (owner: Owner) => {
    setSelectedOwner(owner);
  };

  const handleEditOwner = (owner: Owner) => {
    setEditingOwner(owner);
    setShowOwnerForm(true);
  };

  const handleAddOwner = () => {
    setEditingOwner(null);
    setShowOwnerForm(true);
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="w-full max-w-none p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header - Full width responsive */}
        <div className="w-full">
          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                Gestión de Propietarios
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
                Administra los propietarios y sus apartamentos
                {selectedBuilding && (
                  <span className="block sm:inline sm:ml-2 text-primary font-medium">
                    • {selectedBuilding.name}
                  </span>
                )}
              </p>
              {!selectedBuilding && (
                <p className="text-xs sm:text-sm text-yellow-600 mt-1 font-medium">
                  ⚠️ Selecciona un edificio para ver los propietarios específicos
                </p>
              )}
            </div>
            <div className="flex-shrink-0">
              <Button 
                onClick={handleAddOwner} 
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Propietario
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters - Full width responsive */}
        <Card className="w-full">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="space-y-3 sm:space-y-4">
              {/* Search bar */}
              <div className="w-full relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, documento o apartamento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10"
                  size="sm"
                />
              </div>
              
              {/* Filters - Responsive */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={documentTypeFilter} onValueChange={setDocumentTypeFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Tipo documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="cedula">Cédula</SelectItem>
                    <SelectItem value="rif">RIF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Owners List - Full width responsive */}
        <Card className="w-full">
          <CardHeader className="p-3 sm:p-4 md:p-6">
            <CardTitle className="text-base sm:text-lg">
              Propietarios ({filteredOwners.length})
              {selectedBuilding && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  en {selectedBuilding.name}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredOwners.length > 0 ? (
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Propietario</TableHead>
                      <TableHead className="hidden sm:table-cell min-w-[150px]">Documento</TableHead>
                      <TableHead className="hidden md:table-cell min-w-[200px]">Contacto</TableHead>
                      <TableHead className="min-w-[180px]">Apartamentos</TableHead>
                      <TableHead className="text-right min-w-[120px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOwners.map(owner => {
                      const apartments = getOwnerApartments(owner.id);
                      return (
                        <TableRow key={owner.id} className="hover:bg-muted/50">
                          <TableCell className="p-3 sm:p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-foreground text-sm sm:text-base">{owner.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Creado: {new Date(owner.createdAt).toLocaleDateString()}
                                </p>
                                {/* Show document on mobile */}
                                <div className="sm:hidden mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {owner.documentType.toUpperCase()}: {owner.documentNumber}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell p-3 sm:p-4">
                            <Badge variant="outline" className="text-xs">
                              {owner.documentType.toUpperCase()}: {owner.documentNumber}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell p-3 sm:p-4">
                            <div className="space-y-1">
                              {owner.email && (
                                <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  <span className="truncate max-w-[150px]">{owner.email}</span>
                                </div>
                              )}
                              {owner.phone && (
                                <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                                  <Phone className="h-3 w-3" />
                                  <span>{owner.phone}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="p-3 sm:p-4">
                            <div className="space-y-1">
                              <p className="text-xs sm:text-sm font-medium">{apartments.length} apartamento(s)</p>
                              <div className="flex flex-wrap gap-1">
                                {apartments.slice(0, 2).map(apt => (
                                  <Badge key={apt.id} variant="secondary" className="text-xs">
                                    {apt.buildingName} - {apt.number}
                                  </Badge>
                                ))}
                                {apartments.length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{apartments.length - 2} más
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right p-3 sm:p-4">
                            <div className="flex flex-col gap-1 sm:flex-row sm:gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewOwner(owner)}
                                className="text-xs w-full sm:w-auto"
                              >
                                Ver
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditOwner(owner)}
                                className="text-xs w-full sm:w-auto"
                              >
                                Editar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12 p-4">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-sm sm:text-base">
                  {selectedBuilding 
                    ? `No se encontraron propietarios en ${selectedBuilding.name} con los filtros seleccionados.`
                    : "No se encontraron propietarios con los filtros seleccionados."
                  }
                </p>
                {!selectedBuilding && (
                  <p className="text-muted-foreground text-xs sm:text-sm mt-2">
                    Selecciona un edificio específico para ver sus propietarios.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Owner Profile Dialog */}
        {selectedOwner && (
          <OwnerProfileDialog
            owner={selectedOwner}
            apartments={getOwnerApartments(selectedOwner.id)}
            onClose={() => setSelectedOwner(null)}
            onEdit={() => {
              handleEditOwner(selectedOwner);
              setSelectedOwner(null);
            }}
          />
        )}

        {/* Owner Form Dialog */}
        {showOwnerForm && (
          <OwnerForm
            owner={editingOwner}
            availableApartments={mockApartments.filter(apt => 
              (!apt.ownerId || apt.ownerId === editingOwner?.id) &&
              (!selectedBuilding || apt.buildingId === selectedBuilding.id)
            )}
            onClose={() => {
              setShowOwnerForm(false);
              setEditingOwner(null);
            }}
            onSave={() => {
              setShowOwnerForm(false);
              setEditingOwner(null);
              // Here you would typically refresh the data
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminOwners;
