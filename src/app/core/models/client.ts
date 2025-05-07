import { Gouvernorat } from './gouvernorat';
import { SecteurActivite } from './secteur-activite';

export interface Client {
  id?: number;
  nom: string;
  numeroCompte?: string;
  numeroSousCompte?: string;
  matriculeFiscal?: string;
  chiffreAffaires?: number;
  effectif?: number;
  secteurActivite?: SecteurActivite;
  exonere?: boolean;
  dateLimiteExoneration?: Date;
  modeReglement?: string;
  prixAchat?: string;
  gouvernorat?: Gouvernorat;
  mobile?: string;
  telephone?: string;
  autreTelephone?: string;
  fax?: string;
  email?: string;
  autreEmail?: string;
  siteWeb?: string;
  adresseRue?: string;
  adresseCodePostal?: string;
  adresseVille?: string;
  adressePays?: string;
  contacts?: any[];
  dateCreation?: Date;
  dateModification?: Date;
}
export interface ClientFilter {
  nom?: string;
  matriculeFiscale?: string;
  email?: string;
  secteurActivite?: string;
  sourceProspection?: string;
  statut?: string;
}