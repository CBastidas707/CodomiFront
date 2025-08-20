
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Edit3, 
  Users, 
  DollarSign, 
  MoreVertical, 
  Eye, 
  Trash2,
  Plus,
  ExternalLink,
  Check,
  X
} from 'lucide-react';
import { ExtendedApartment, AliquotType } from '@/types/apartment';
import { Owner } from '@/types/owner';
import { useNavigate } from 'react-router-dom';
import ApartmentOwnerManager from '@/components/ApartmentOwnerManager';

interface ApartmentCardProps {
  apartment: ExtendedApartment;
  aliquotTypes: AliquotType[];
  owners: Owner[];
  onEdit: (apartment: ExtendedApartment) => void;
  onUpdate: (apartment: ExtendedApartment) => void;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({
  apartment,
  aliquotTypes,
  owners,
  onEdit,
  onUpdate
}) => {
  const navigate = useNavigate();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [showOwnerManager, setShowOwnerManager] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-green-100 text-green-800';
      case 'vacant': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'occupied': return 'Ocupado';
      case 'vacant': return 'Vacante';
      case 'maintenance': return 'Mantenimiento';
      default: return status;
    }
  };

  const handleFieldEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleFieldSave = (field: string) => {
    const updatedApartment = { ...apartment };
    
    switch (field) {
      case 'number':
        updatedApartment.number = tempValue;
        break;
      case 'squareMeters':
        updatedApartment.squareMeters = parseFloat(tempValue) || 0;
        break;
      case 'aliquotType':
        const selectedType = aliquotTypes.find(type => type.id === tempValue);
        if (selectedType) {
          updatedApartment.aliquotTypeId = tempValue;
          updatedApartment.aliquotType = selectedType;
        }
        break;
    }
    
    updatedApartment.updatedAt = new Date().toISOString();
    onUpdate(updatedApartment);
    setEditingField(null);
    setTempValue('');
  };

  const handleFieldCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handlePaymentStatusClick = () => {
    navigate(`/admin/finance?apartment=${apartment.id}`);
  };

  const handleOwnerUpdate = (updatedApartment: ExtendedApartment) => {
    onUpdate(updatedApartment);
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {editingField === 'number' ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="h-8 w-20 text-sm"
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={() => handleFieldSave('number')}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleFieldCancel}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => handleFieldEdit('number', apartment.number)}
                  className="flex items-center gap-1 hover:bg-gray-100 rounded px-2 py-1 transition-colors"
                >
                  <span className="text-lg font-semibold">Apt {apartment.number}</span>
                  <Edit3 className="h-3 w-3 text-gray-400" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(apartment.status)}>
                {getStatusLabel(apartment.status)}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(apartment)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(apartment)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <p className="text-sm text-gray-600">Piso {apartment.floor}</p>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Square Meters */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Metros cuadrados:</span>
            {editingField === 'squareMeters' ? (
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="h-8 w-20 text-sm"
                  autoFocus
                />
                <Button size="sm" variant="ghost" onClick={() => handleFieldSave('squareMeters')}>
                  <Check className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleFieldCancel}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <button
                onClick={() => handleFieldEdit('squareMeters', apartment.squareMeters?.toString() || '0')}
                className="flex items-center gap-1 hover:bg-gray-100 rounded px-2 py-1 transition-colors"
              >
                <span className="text-sm font-medium">
                  {apartment.squareMeters || 0} m²
                </span>
                <Edit3 className="h-3 w-3 text-gray-400" />
              </button>
            )}
          </div>

          {/* Aliquot Type */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tipo de alícuota:</span>
            {editingField === 'aliquotType' ? (
              <div className="flex items-center gap-1">
                <Select value={tempValue} onValueChange={setTempValue}>
                  <SelectTrigger className="h-8 w-32 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {aliquotTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name} ({type.percentage}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" variant="ghost" onClick={() => handleFieldSave('aliquotType')}>
                  <Check className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleFieldCancel}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <button
                onClick={() => handleFieldEdit('aliquotType', apartment.aliquotTypeId)}
                className="flex items-center gap-1 hover:bg-gray-100 rounded px-2 py-1 transition-colors"
              >
                <span className="text-sm font-medium">
                  {apartment.aliquotType?.name} ({apartment.aliquotType?.percentage}%)
                </span>
                <Edit3 className="h-3 w-3 text-gray-400" />
              </button>
            )}
          </div>

          {/* Owners */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Propietarios:</span>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setShowOwnerManager(true)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {apartment.owners && apartment.owners.length > 0 ? (
                apartment.owners.map(owner => (
                  <Badge key={owner.id} variant="outline" className="text-xs">
                    {owner.name}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-gray-400">Sin propietarios</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handlePaymentStatusClick}
              className="w-full"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Estado de Pago
              <ExternalLink className="h-3 w-3 ml-auto" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowOwnerManager(true)}
              className="w-full"
            >
              <Users className="h-4 w-4 mr-2" />
              Gestionar Propietarios
            </Button>
          </div>

          {/* Monthly Fee */}
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm text-gray-600">Cuota mensual:</span>
            <span className="text-sm font-medium">
              ${apartment.monthlyFee?.toLocaleString() || 0}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Owner Manager Modal */}
      {showOwnerManager && (
        <ApartmentOwnerManager
          apartment={apartment}
          availableOwners={owners}
          onClose={() => setShowOwnerManager(false)}
          onUpdate={handleOwnerUpdate}
        />
      )}
    </>
  );
};

export default ApartmentCard;
