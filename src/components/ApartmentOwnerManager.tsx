
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X, Plus, UserPlus, ExternalLink } from 'lucide-react';
import { ExtendedApartment } from '@/types/apartment';
import { Owner } from '@/types/owner';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ApartmentOwnerManagerProps {
  apartment: ExtendedApartment;
  availableOwners: Owner[];
  onClose: () => void;
  onUpdate: (apartment: ExtendedApartment) => void;
}

const ApartmentOwnerManager: React.FC<ApartmentOwnerManagerProps> = ({
  apartment,
  availableOwners,
  onClose,
  onUpdate
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false);
  const [ownerToUnlink, setOwnerToUnlink] = useState<Owner | null>(null);

  const currentOwners = apartment.owners || [];
  const currentOwnerIds = apartment.ownerIds || [];

  const filteredAvailableOwners = availableOwners.filter(owner => 
    !currentOwnerIds.includes(owner.id) &&
    (owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     owner.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
     owner.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleLinkOwner = (owner: Owner) => {
    const updatedApartment: ExtendedApartment = {
      ...apartment,
      ownerIds: [...currentOwnerIds, owner.id],
      owners: [...currentOwners, owner],
      updatedAt: new Date().toISOString()
    };
    
    onUpdate(updatedApartment);
    toast({
      title: 'Propietario vinculado',
      description: `${owner.name} ha sido vinculado al apartamento ${apartment.number}.`
    });
  };

  const handleUnlinkOwner = (owner: Owner) => {
    setOwnerToUnlink(owner);
    setShowUnlinkConfirm(true);
  };

  const confirmUnlinkOwner = () => {
    if (ownerToUnlink) {
      const updatedApartment: ExtendedApartment = {
        ...apartment,
        ownerIds: currentOwnerIds.filter(id => id !== ownerToUnlink.id),
        owners: currentOwners.filter(owner => owner.id !== ownerToUnlink.id),
        updatedAt: new Date().toISOString()
      };
      
      onUpdate(updatedApartment);
      toast({
        title: 'Propietario desvinculado',
        description: `${ownerToUnlink.name} ha sido desvinculado del apartamento ${apartment.number}.`
      });
      
      setOwnerToUnlink(null);
    }
    setShowUnlinkConfirm(false);
  };

  const handleCreateNewOwner = () => {
    navigate(`/admin/owners?apartment=${apartment.id}&action=create`);
    onClose();
  };

  return (
    <>
      <Dialog open={true} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Gestionar Propietarios - Apartamento {apartment.number}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Owners */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Propietarios Actuales
                  <Badge variant="secondary">{currentOwners.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentOwners.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentOwners.map(owner => (
                      <div key={owner.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{owner.name}</p>
                          <p className="text-xs text-gray-600">{owner.documentNumber}</p>
                          {owner.email && (
                            <p className="text-xs text-gray-600">{owner.email}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnlinkOwner(owner)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <UserPlus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No hay propietarios vinculados a este apartamento</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add New Owner */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vincular Propietario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar propietarios por nombre, documento o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Create New Owner Button */}
                <Button 
                  onClick={handleCreateNewOwner}
                  className="w-full bg-codomi-navy hover:bg-codomi-navy-dark"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Nuevo Propietario
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </Button>

                {/* Available Owners */}
                {searchTerm && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredAvailableOwners.length > 0 ? (
                      filteredAvailableOwners.map(owner => (
                        <div
                          key={owner.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleLinkOwner(owner)}
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">{owner.name}</p>
                            <p className="text-xs text-gray-600">{owner.documentNumber}</p>
                            {owner.email && (
                              <p className="text-xs text-gray-600">{owner.email}</p>
                            )}
                          </div>
                          <Plus className="h-4 w-4 text-green-500" />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <p className="text-sm">No se encontraron propietarios</p>
                        <p className="text-xs">Intenta con otros términos de búsqueda</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unlink Confirmation */}
      <AlertDialog open={showUnlinkConfirm} onOpenChange={setShowUnlinkConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Desvinculación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro de que desea desvincular a {ownerToUnlink?.name} del apartamento {apartment.number}?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowUnlinkConfirm(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmUnlinkOwner} className="bg-red-600 hover:bg-red-700">
              Desvincular
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ApartmentOwnerManager;
