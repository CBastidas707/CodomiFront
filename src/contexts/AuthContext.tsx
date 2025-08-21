import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'owner' | 'junta';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  apartment?: string; // Only for owners
  isBoardMember?: boolean; // Only for owners - Parte de la Junta de Condominio
  buildingId?: string; // For junta members - assigned building
}

export interface Building {
  id: string;
  name: string;
  address: string;
  condominiumId: string;
}

export interface Condominium {
  id: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  selectedBuilding: Building | null;
  selectedCondominium: Condominium | null;
  buildings: Building[];
  condominiums: Condominium[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  selectBuilding: (building: Building) => void;
  selectCondominium: (condominium: Condominium) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Enhanced mock condominiums for better testing
const mockCondominiums: Condominium[] = [
  { id: '1', name: 'Condominio Los Almendros' },
  { id: '2', name: 'Condominio Vista Hermosa' },
  { id: '3', name: 'Condominio El Paraíso' }
];

// Enhanced mock buildings for better testing
const mockBuildings: Building[] = [
  { id: '1', name: 'Torre Norte', address: 'Av. Principal 123', condominiumId: '1' },
  { id: '2', name: 'Torre Sur', address: 'Av. Secundaria 456', condominiumId: '1' },
  { id: '3', name: 'Torre Este', address: 'Calle Este 789', condominiumId: '1' },
  { id: '4', name: 'Torre Oeste', address: 'Calle Oeste 321', condominiumId: '1' },
  { id: '5', name: 'Edificio Central', address: 'Calle Central 789', condominiumId: '2' },
  { id: '6', name: 'Edificio Plaza', address: 'Plaza Mayor 654', condominiumId: '2' },
  { id: '7', name: 'Residencias Premium', address: 'Av. Premium 987', condominiumId: '3' },
  { id: '8', name: 'Torres Gemelas', address: 'Av. Gemelas 147', condominiumId: '3' }
];

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ana García',
    email: 'admin@codomi.com',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Carlos Mendoza',
    email: 'carlos@email.com',
    role: 'owner',
    apartment: 'Apt 301',
    isBoardMember: true
  },
  {
    id: '3',
    name: 'María López',
    email: 'maria@email.com',
    role: 'owner',
    apartment: 'Apt 205',
    isBoardMember: false
  },
  {
    id: '4',
    name: 'Roberto Silva',
    email: 'roberto@email.com',
    role: 'junta',
    buildingId: '1'
  }
];

// Helper function to get user's available buildings
const getUserBuildings = (user: User): Building[] => {
  if (user.role === 'admin') {
    return mockBuildings; // Admin can access all buildings
  }
  
  if (user.role === 'junta' && user.buildingId) {
    return mockBuildings.filter(b => b.id === user.buildingId);
  }
  
  // For owners, assume they belong to buildings in the first condominium for demo
  return mockBuildings.filter(b => b.condominiumId === '1');
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedCondominium, setSelectedCondominium] = useState<Condominium | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [condominiums, setCondominiums] = useState<Condominium[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('codomi_user');
    const savedBuilding = localStorage.getItem('codomi_selected_building');
    const savedCondominium = localStorage.getItem('codomi_selected_condominium');

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);


      const userBuildings = getUserBuildings(parsedUser);
      setBuildings(userBuildings);
      const userCondoIds = Array.from(new Set(userBuildings.map(b => b.condominiumId)));
      setCondominiums(
        mockCondominiums.filter(c => userCondoIds.includes(c.id))
      );

      if (savedCondominium) {
        const parsedCondo = JSON.parse(savedCondominium);
        if (userCondoIds.includes(parsedCondo.id)) {
          setSelectedCondominium(parsedCondo);
        }
      }

      if (savedBuilding) {
        const parsedBuilding = JSON.parse(savedBuilding);
        if (userBuildings.some(b => b.id === parsedBuilding.id)) {
          setSelectedBuilding(parsedBuilding);
        }
      }
    } else {
      setBuildings([]);
      setCondominiums([]);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === '123456') {
      setUser(foundUser);
      localStorage.setItem('codomi_user', JSON.stringify(foundUser));


      const userBuildings = getUserBuildings(foundUser);
      setBuildings(userBuildings);
      const userCondoIds = Array.from(new Set(userBuildings.map(b => b.condominiumId)));
      setCondominiums(
        mockCondominiums.filter(c => userCondoIds.includes(c.id))
      );


      // Clear previous selections so every user chooses again
      setSelectedCondominium(null);
      setSelectedBuilding(null);
      localStorage.removeItem('codomi_selected_condominium');
      localStorage.removeItem('codomi_selected_building');
      
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    setSelectedBuilding(null);
    setSelectedCondominium(null);
    setBuildings([]);
    setCondominiums([]);
    localStorage.removeItem('codomi_user');
    localStorage.removeItem('codomi_selected_building');
    localStorage.removeItem('codomi_selected_condominium');
  };

  const selectBuilding = (building: Building | null) => {
    setSelectedBuilding(building);
    if (building) {
      localStorage.setItem('codomi_selected_building', JSON.stringify(building));
    } else {
      localStorage.removeItem('codomi_selected_building');
    }
  };

  const selectCondominium = (condominium: Condominium | null) => {
    setSelectedCondominium(condominium);
    setSelectedBuilding(null); // Reset building selection when changing condominium
    if (condominium) {
      localStorage.setItem('codomi_selected_condominium', JSON.stringify(condominium));
    } else {
      localStorage.removeItem('codomi_selected_condominium');
    }
    localStorage.removeItem('codomi_selected_building');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      selectedBuilding, 
      selectedCondominium,
      buildings, 
      condominiums,
      login, 
      logout, 
      selectBuilding,
      selectCondominium, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
