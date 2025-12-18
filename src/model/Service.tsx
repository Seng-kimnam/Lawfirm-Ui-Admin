export interface ServiceType {
  id?: number;
  // screated_at
}

export interface Service {
  id: number;
  service_name: string;
  servicetype_id: number;
  file: string;
  status: string;
  description: string;
  created_by: string;

  servicetype?: {
    servicetype_name: string;
  };
  created_at?: string;
  updated_at?: string;
}

// src/models/service.ts

export interface ServiceItem {
  serviceId: number;
  serviceName: string;
  expertiseId: number;
  expertiseName?: string;
  description: string;
  basePrice: number;
  createdAt: string;
  updatedAt: string;
}

// export interface ServiceTypeOption {
//   value: string ;
//   option: number;
//   label: string;
// }
export interface Pageable {
  pageNumber: number;
  pageSize: number;
}

export interface Payload {
  content: ServiceItem[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  status: string;
  code: number;
  payload: Payload;
  timestamps: string;
}
