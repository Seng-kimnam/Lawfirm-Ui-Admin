export interface CourtInterface {
  courtId: number;
  courtName: string;
  courtType: string;
  location: string;
  contactNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourtRequest {
  courtName: string;
  courtType: string;
  location: string;
  contactNumber: string;
}

export interface CourtTypeInterface {
  typeId: number;
  key: string;
  value: string;
}
