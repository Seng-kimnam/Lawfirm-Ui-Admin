export interface ClientInterface {
  clientId: number;
  clientName: string;
  email: string;
  status: string;
  phoneNumber: string;
  address: string;
  complaint: string;
  clientImage: string;
  createdAt: string;
  updatedAt: string;
}



export interface ClientRequest {
  clientName: string;
  email: string;
  status: string;
  phoneNumber: string;
  address: string;
  complaint: string;
  clientImage: string;
}

export interface ClientStatus {
  statusId: number;
  key: string;
  value: string;
}


export interface ClientRequestInterface {

  email: string;
  clientName: string;
  requestCount: number;
}

export interface clientStatistic {
  categories: string[];
  data: number[];
}