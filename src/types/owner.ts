
export interface Owner {
  id: string;
  name: string;
  documentType: 'cedula' | 'rif';
  documentNumber: string;
  email?: string;
  phone?: string;
  apartmentIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Apartment {
  id: string;
  number: string;
  floor: string;
  buildingId: string;
  buildingName: string;
  ownerId?: string;
  ownerName?: string;
  status: 'occupied' | 'vacant' | 'maintenance';
  monthlyFee: number;
}

export interface FinancialBalance {
  apartmentId: string;
  apartmentNumber: string;
  currentBalance: number;
  totalDebt: number;
  status: 'current' | 'overdue';
  lastPaymentDate?: string;
}
