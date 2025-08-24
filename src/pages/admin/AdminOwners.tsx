import React, { useState, useMemo } from 'react';
import { Plus, Search, User, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import OwnerForm from '@/components/OwnerForm';
import { Owner, Apartment } from '@/types/owner';

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

// Mock apartments data
const mockApartments: Apartment[] = [
  {
    id: '1',
    number: '101',
    floor: '1',
    buildingId: '1',
    buildingName: 'Torre Norte',
    ownerId: '1',
    ownerName: 'Carlos Mendoza',
    status: 'occupied',
    monthlyFee: 25000
  },
  {
    id: '2',
    number: '102',
    floor: '1',
    buildingId: '1',
    buildingName: 'Torre Norte',
    ownerId: '2',
    ownerName: 'María López',
    status: 'occupied',
    monthlyFee: 27000
  },
  {
    id: '3',
    number: '201',
    floor: '2',
    buildingId: '1',
    buildingName: 'Torre Norte',
    ownerId: '3',
    ownerName: 'Ana García',
    status: 'vacant',
    monthlyFee: 26000
  },
  {
    id: '4',
    number: '301',
    floor: '3',
    buildingId: '2',
    buildingName: 'Torre Sur',
    status: 'maintenance',
    monthlyFee: 22000
  },
  {
    id: '5',
    number: '302',
    floor: '3',
    buildingId: '2',
    buildingName: 'Torre Sur',
    ownerId: '1',
    ownerName: 'Carlos Mendoza',
    status: 'occupied',
    monthlyFee: 28000
  },
  {
    id: '6',
    number: '101',
    floor: '1',
    buildingId: '3',
    buildingName: 'Torre Este',
    status: 'vacant',
    monthlyFee: 28000
  },
  {
    id: '7',
    number: '201',
    floor: '2',
    buildingId: '4',
    buildingName: 'Torre Oeste',
    status: 'maintenance',
    monthlyFee: 30000
  },
  {
    id: '8',
    number: '101',
    floor: '1',
    buildingId: '5',
    buildingName: 'Edificio Central',
    ownerId: '3',
    ownerName: 'Ana García',
    status: 'vacant',
    monthlyFee: 35000
  }
];

const AdminOwners: React.FC = () => {
  const { buildings, selectedBuilding } = useAuth();
  const [owners, setOwners] = useState<Owner[]>(mockOwners);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOwnerForm, setShowOwnerForm] = useState(false);
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);

  const handleCreateOwner = () => {
    setEditingOwner(null);
    setShowOwnerForm(true);
  };

  const handleEditOwner = (owner: Owner) => {
    setEditingOwner(owner);
    setShowOwnerForm(true);
  };

  const handleSaveOwner = (ownerData: Owner) => {
    if (editingOwner) {
      // Update existing owner
      setOwners(prev => prev.map(owner => owner.id === editingOwner.id ? { ...owner, ...ownerData } : owner));
    } else {
      // Create new owner with proper ID conversion
      const newOwner: Owner = { 
        ...ownerData, 
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setOwners(prev => [...prev, newOwner]);
    }
    setShowOwnerForm(false);
    setEditingOwner(null);
  };

  const formatDocumentNumber = (owner: Owner) => {
    // Extraer solo el número/letra del documento y formatearlo correctamente
    const docNumber = owner.documentNumber;
    
    // Si ya está en el formato correcto (con guión), devolverlo tal como está
    if (docNumber.includes('-')) {
      return docNumber;
    }
    
    // Si comienza con V, E, J, G, P, etc. y no tiene guión, agregarlo
    if (/^[VEJGP]\d+/.test(docNumber)) {
      return docNumber.replace(/^([VEJGP])(\d+)/, '$1-$2');
    }
    
    // Para otros casos, devolver el documento tal como está
    return docNumber;
  };

  // Filter owners based on search term and selected building
  const filteredOwners = useMemo(() => {
    let filteredOwners = [...owners];
    
    // Filter by search term
    if (searchTerm) {
      filteredOwners = filteredOwners.filter(owner => 
        owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.documentNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by selected building
    if (selectedBuilding) {
      const ownerIdsInBuilding = new Set(
        mockApartments
          .filter(apt => apt.buildingId === selectedBuilding.id && apt.ownerId)
          .map(apt => apt.ownerId)
          .filter((id): id is string => id !== undefined)
      );
      filteredOwners = filteredOwners.filter(owner => ownerIdsInBuilding.has(owner.id));
    }

    return filteredOwners;
  }, [searchTerm, selectedBuilding, owners]);

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-full">
        {/* Header - Improved responsivity */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="space-y-2 min-w-0">
            <h1 className="text-2xl font-bold tracking-tight lg:text-3xl truncate">
              Gestión de Propietarios
            </h1>
            <p className="text-sm text-muted-foreground lg:text-base">
              Administra todos los propietarios
              {selectedBuilding && (
                <span className="block text-primary font-medium lg:inline lg:ml-2 truncate">
                  • {selectedBuilding.name}
                </span>
              )}
            </p>
            {!selectedBuilding && (
              <p className="text-sm text-yellow-600 font-medium">
                ⚠️ Selecciona un edificio para ver sus propietarios específicos
              </p>
            )}
          </div>
          <Button 
            onClick={handleCreateOwner} 
            className="w-full bg-primary hover:bg-primary/90 lg:w-auto flex-shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Propietario
          </Button>
        </div>

        {/* Filters - Better responsive layout */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por nombre, email o documento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Owners Display - Enhanced responsive design */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Propietarios</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mobile Cards */}
            <div className="grid gap-4 md:hidden">
              {filteredOwners.map(owner => (
                <Card key={owner.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <User className="h-8 w-8 p-1 bg-primary/10 text-primary rounded-full flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold truncate">{owner.name}</h4>
                        <p className="text-sm text-muted-foreground font-mono truncate">
                          {formatDocumentNumber(owner)}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex-shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditOwner(owner)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <a href={`mailto:${owner.email}`} className="text-sm hover:underline truncate">
                        {owner.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <a href={`tel:${owner.phone}`} className="text-sm hover:underline truncate">
                        {owner.phone}
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Nombre</TableHead>
                      <TableHead className="min-w-[150px]">Documento</TableHead>
                      <TableHead className="min-w-[200px]">Email</TableHead>
                      <TableHead className="min-w-[150px]">Teléfono</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOwners.map(owner => (
                      <TableRow key={owner.id}>
                        <TableCell className="min-w-0">
                          <div className="flex items-center gap-3 min-w-0">
                            <User className="h-8 w-8 p-1 bg-primary/10 text-primary rounded-full flex-shrink-0" />
                            <span className="font-medium truncate">{owner.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {formatDocumentNumber(owner)}
                        </TableCell>
                        <TableCell className="min-w-0">
                          <a href={`mailto:${owner.email}`} className="hover:underline text-primary truncate block">
                            {owner.email}
                          </a>
                        </TableCell>
                        <TableCell className="min-w-0">
                          <a href={`tel:${owner.phone}`} className="hover:underline text-primary truncate block">
                            {owner.phone}
                          </a>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditOwner(owner)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
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

            {/* Empty state */}
            {filteredOwners.length === 0 && (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {selectedBuilding 
                    ? `No se encontraron propietarios en ${selectedBuilding.name}`
                    : "No se encontraron propietarios con los filtros aplicados"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Owner Form Modal */}
        {showOwnerForm && (
          <OwnerForm
            owner={editingOwner}
            availableApartments={mockApartments}
            onClose={() => {
              setShowOwnerForm(false);
              setEditingOwner(null);
            }}
            onSave={handleSaveOwner}
          />
        )}
      </div>
    </div>
  );
};

export default AdminOwners;
