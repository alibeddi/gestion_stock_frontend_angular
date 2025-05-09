export interface Contact {
  id?: number;
  nom: string;
  prenom?: string;
  fonction?: string;
  nomSociete?: string;

  mobile?: string;
  telephone?: string;
  fax?: string;

  email: string;
  emailSecondaire?: string;

  siteWeb?: string;

  adresseRue?: string;
  adresseCodePostal?: string;
  adresseVille?: string;
  adressePays?: string;

  clientId?: number;
  prospectId?: number;

  dateCreation?: Date | string;
  dateModification?: Date | string;
}

export interface ContactListResponse {
  data: Contact[];
  total: number;
  page: number;
  limit: number;
}

export interface ContactResponse {
  data: Contact;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
}
