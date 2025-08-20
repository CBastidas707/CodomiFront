
export interface AliquotType {
  id: string;
  name: string;
  percentage: number;
}

export interface ExtendedApartment {
  id: string;
  number: string;
  floor: string;
  buildingId: string;
  buildingName: string;
  squareMeters?: number;
  measurementType: 'area' | 'percentage';
  aliquotTypeId: string;
  aliquotType?: AliquotType;
  ownerIds: string[];
  owners?: import('./owner').Owner[];
  status: 'occupied' | 'vacant' | 'maintenance';
  monthlyFee: number;
  createdAt: string;
  updatedAt: string;
}
