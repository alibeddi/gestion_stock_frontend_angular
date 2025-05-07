export interface Product {
  id?: number;
  code: string;
  libelle: string;
  emballage?: any;
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
