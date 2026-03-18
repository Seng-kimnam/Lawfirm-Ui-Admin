export interface DocumentInterface {
  docId: number;
  title: string;
  fileCover: string;
  fileUrl: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRequestInterface {
  title: string;
  fileCover: string;
  fileUrl: string;
  categoryId: number;
}

export type DocumentFormData = {
  docId: number;
  title: string;
  categoryId: number;
  categoryName: string;
  fileCover: File | null;
  fileUrl: File | null;
};

export interface ClientDocumentInterface {
  id: number;
  clientId: number;
  clientName: string;
  documents: DocumentObject[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

type DocumentObject = {
  name: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
};
