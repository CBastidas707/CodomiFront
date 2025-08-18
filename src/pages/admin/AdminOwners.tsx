
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

// Mock data for owners
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
    apartmentIds: ['apt4', 'apt5', 'apt6'],
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01'
  }
];

// Mock data for apartments
const mockApartments: Apartment[] = [
  { id: 'apt1', number: '101', floor: '1', buildingId: '1', buildingName: 'Torre Norte', ownerId: '1', ownerName: 'Juan Pérez', status: 'occupied', monthlyFee: 25000 },
  { id: 'apt2', number: '201', floor: '2', buildingId: '1', buildingName: 'Torre Norte', ownerId: '1', ownerName: 'Juan Pérez', status: 'occupied', monthlyFee: 25000 },
  { id: 'apt3', number: '301', floor: '3', buildingId: '1', buildingName: 'Torre Norte', ownerId: '2', ownerName: 'María González', status: 'occupied', monthlyFee: 25000 },
  { id: 'apt4', number: '102', floor: '1', buildingId: '2', buildingName: 'Torre Sur', ownerId: '3', ownerName: 'Empresa ABC C.A.', status: 'occupied', monthlyFee: 30000 },
  { id: 'apt5', number: '202', floor: '2', buildingId: '2', buildingName: 'Torre Sur', ownerId: '3', ownerName: 'Empresa ABC C.A.', status: 'occupied', monthlyFee: 30000 },
  { id: 'apt6', number: '302', floor: '3', buildingId: '2', buildingName: 'Torre Sur', ownerId: '3', ownerName: 'Empresa ABC C.A.', status: 'occupied', monthlyFee: 30000 }
];

const AdminOwners: React.FC = () => {
  const { buildings } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('all');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('all');
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [showOwnerForm, setShowOwnerForm] = useState(false);
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);

  const getOwnerApartments = (ownerId: string) => {
    return mockApartments.filter(apt => apt.ownerId === ownerId);
  };

  const filteredOwners = useMemo(() => {
    return mockOwners.filter(owner => {
      const matchesSearch = owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getOwnerApartments(owner.id).some(apt => apt.number.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesBuilding = buildingFilter === 'all' || 
        getOwnerApartments(owner.id).some(apt => apt.buildingId === buildingFilter);

      const matchesDocType = documentTypeFilter === 'all' || owner.documentType === documentTypeFilter;

      return matchesSearch && matchesBuilding && matchesDocType;
    });
  }, [searchTerm, buildingFilter, documentTypeFilter]);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Propietarios</h1>
          <p className="text-gray-600">Administra los propietarios y sus apartamentos</p>
        </div>
        <Button onClick={handleAddOwner} className="bg-codomi-navy hover:bg-codomi-navy-dark">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Propietario
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, documento o apartamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={buildingFilter} onValueChange={setBuildingFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por edificio" />
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
              <Select value={documentTypeFilter} onValueChange={setDocumentTypeFilter}>
                <SelectTrigger className="w-40">
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

      {/* Owners List */}
      <Card>
        <CardHeader>
          <CardTitle>Propietarios ({filteredOwners.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOwners.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Propietario</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Apartamentos</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOwners.map(owner => {
                  const apartments = getOwnerApartments(owner.id);
                  return (
                    <TableRow key={owner.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{owner.name}</p>
                            <p className="text-sm text-gray-500">
                              Creado: {new Date(owner.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {owner.documentType.toUpperCase()}: {owner.documentNumber}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {owner.email && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Mail className="h-3 w-3" />
                              {owner.email}
                            </div>
                          )}
                          {owner.phone && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Phone className="h-3 w-3" />
                              {owner.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{apartments.length} apartamento(s)</p>
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
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOwner(owner)}
                          >
                            Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditOwner(owner)}
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
          ) : (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron propietarios con los filtros seleccionados.</p>
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
          availableApartments={mockApartments.filter(apt => !apt.ownerId || apt.ownerId === editingOwner?.id)}
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
  );
};

export default AdminOwners;
