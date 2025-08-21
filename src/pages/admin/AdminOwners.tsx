import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, User, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Building } from 'lucide-react';
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
      // Create new owner
      setOwners(prev => [...prev, { ...ownerData, id: Date.now().toString() }]);
    }
    setShowOwnerForm(false);
    setEditingOwner(null);
  };

  // Filter owners based on search term and selected building
  const filteredOwners = useMemo(() => {
    let owners = [...mockOwners];
    
    // Filter by search term
    if (searchTerm) {
      owners = owners.filter(owner => 
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
          .filter((id): id is string => typeof id === 'string' && id !== null && id !== undefined)
      );
      owners = owners.filter(owner => ownerIdsInBuilding.has(owner.id));
    }

    return owners;
  }, [searchTerm, selectedBuilding]);

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="w-full max-w-none p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              Gestión de Propietarios
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
              Administra todos los propietarios
              {selectedBuilding && (
                <span className="block sm:inline sm:ml-2 text-primary font-medium">
                  • {selectedBuilding.name}
                </span>
              )}
            </p>
            {!selectedBuilding && (
              <p className="text-xs sm:text-sm text-yellow-600 mt-1 font-medium">
                ⚠️ Selecciona un edificio para ver sus propietarios específicos
              </p>
            )}
          </div>
          <Button 
            onClick={handleCreateOwner} 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Propietario
          </Button>
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
                      placeholder="Buscar por nombre, email o documento..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Owners Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Propietarios</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOwners.map(owner => (
                  <TableRow key={owner.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{owner.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{owner.documentNumber}</TableCell>
                    <TableCell>
                      <a href={`mailto:${owner.email}`} className="hover:underline">
                        {owner.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      <a href={`tel:${owner.phone}`} className="hover:underline">
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
          </CardContent>
        </Card>

        {/* Owner Form Modal */}
        {showOwnerForm && (
          <OwnerForm
            owner={editingOwner}
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
