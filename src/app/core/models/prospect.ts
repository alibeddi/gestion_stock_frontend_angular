export interface Prospect {
  id?: number;
  nom: string;
  matriculeFiscale?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  secteurActivite?: string;
  sourceProspection?: string;
  dateCreation?: Date;
  statut?: string;
  notes?: string;
  potentiel?: string;
  dateProchainContact?: Date;
  responsableProspection?: string;
}

export interface ProspectFilter {
  nom?: string;
  matriculeFiscale?: string;
  email?: string;
  secteurActivite?: string;
  sourceProspection?: string;
  statut?: string;
  potentiel?: string;
  responsableProspection?: string;
}