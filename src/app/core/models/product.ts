export interface Product {
  id?: number;
  code: string;
  libelle: string;
  description?: string;
  emballageId?: number;
  emballage?: any; // Object representation when received from API
  categorie?: string;
  poidsKg?: number;
  typeProduit?: string;
  actif?: boolean;
  isPackage?: boolean;
  ecozit?: boolean;
  prixGros: number;
  prixDetail: number;
  prixGerant: number;
  dateCreation?: Date;
  dateModification?: Date;
}

// Product response interface to handle the API response format
export interface ProductResponse {
  status: string;
  message: string;
  data: Product | Product[];
  timestamp: string;
}
