
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Search, Building, Users, DollarSign, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ApartmentCard from '@/components/ApartmentCard';
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

// Mock extended apartments data
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
  }
];

const AdminApartments: React.FC = () => {
  const { buildings } = useAuth();
  const [apartments, setApartments] = useState<ExtendedApartment[]>(mockExtendedApartments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showApartmentForm, setShowApartmentForm] = useState(false);
  const [editingApartment, setEditingApartment] = useState<ExtendedApartment | null>(null);

  // Group apartments by building
  const apartmentsByBuilding = useMemo(() => {
    let filtered = apartments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.buildingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.owners?.some(owner => owner.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by building
    if (selectedBuilding !== 'all') {
      filtered = filtered.filter(apt => apt.buildingId === selectedBuilding);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === selectedStatus);
    }

    // Group by building
    const grouped: Record<string, ExtendedApartment[]> = {};
    filtered.forEach(apt => {
      if (!grouped[apt.buildingName]) {
        grouped[apt.buildingName] = [];
      }
      grouped[apt.buildingName].push(apt);
    });

    return grouped;
  }, [apartments, searchTerm, selectedBuilding, selectedStatus]);

  const handleCreateApartment = () => {
    setEditingApartment(null);
    setShowApartmentForm(true);
  };

  const handleEditApartment = (apartment: ExtendedApartment) => {
    setEditingApartment(apartment);
    setShowApartmentForm(true);
  };

  const handleSaveApartment = (apartmentData: ExtendedApartment) => {
    if (editingApartment) {
      setApartments(prev => prev.map(apt => 
        apt.id === editingApartment.id ? { ...apartmentData, id: editingApartment.id } : apt
      ));
    } else {
      const newApartment = {
        ...apartmentData,
        id: `apt-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setApartments(prev => [...prev, newApartment]);
    }
    setShowApartmentForm(false);
    setEditingApartment(null);
  };

  const handleUpdateApartment = (updatedApartment: ExtendedApartment) => {
    setApartments(prev => prev.map(apt => 
      apt.id === updatedApartment.id ? updatedApartment : apt
    ));
  };

  const totalApartments = apartments.length;
  const occupiedApartments = apartments.filter(apt => apt.status === 'occupied').length;
  const vacantApartments = apartments.filter(apt => apt.status === 'vacant').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Apartamentos</h1>
          <p className="text-gray-600 mt-1">Administra todos los apartamentos de los edificios</p>
        </div>
        <Button onClick={handleCreateApartment} className="bg-codomi-navy hover:bg-codomi-navy-dark">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Apartamento
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Apartamentos</p>
                <p className="text-2xl font-bold text-gray-900">{totalApartments}</p>
              </div>
              <Building className="h-8 w-8 text-codomi-navy" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ocupados</p>
                <p className="text-2xl font-bold text-green-600">{occupiedApartments}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disponibles</p>
                <p className="text-2xl font-bold text-blue-600">{vacantApartments}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por número, edificio o propietario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
              <SelectTrigger className="w-full sm:w-48">
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
        </CardContent>
      </Card>

      {/* Apartments by Building */}
      <div className="space-y-4">
        {Object.entries(apartmentsByBuilding).length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron apartamentos con los filtros aplicados</p>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="multiple" defaultValue={Object.keys(apartmentsByBuilding)} className="space-y-4">
            {Object.entries(apartmentsByBuilding).map(([buildingName, buildingApartments]) => (
              <AccordionItem key={buildingName} value={buildingName}>
                <Card>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center justify-between w-full mr-4">
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-codomi-navy" />
                        <span className="text-lg font-semibold">{buildingName}</span>
                      </div>
                      <Badge variant="secondary">
                        {buildingApartments.length} apartamentos
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-6 pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {buildingApartments.map(apartment => (
                          <ApartmentCard
                            key={apartment.id}
                            apartment={apartment}
                            aliquotTypes={mockAliquotTypes}
                            owners={mockOwners}
                            onEdit={handleEditApartment}
                            onUpdate={handleUpdateApartment}
                          />
                        ))}
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
          buildings={buildings}
          aliquotTypes={mockAliquotTypes}
          onClose={() => {
            setShowApartmentForm(false);
            setEditingApartment(null);
          }}
          onSave={handleSaveApartment}
        />
      )}
    </div>
  );
};

export default AdminApartments;
