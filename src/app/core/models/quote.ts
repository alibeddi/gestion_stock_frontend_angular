import { Client } from './client';

export interface Quote {
  id?: number;
  numeroDevis?: string;
  sujet: string;
  client?: Client;
  prospect?: any;
  echeance?: Date;
  delaiLivraison?: string;
  modeLivraison?: string;
  modePaiement?: string;
  lignesDevis?: any[];
  totalTTC?: number;
  totalPoidsKg?: number;
  dateCreation?: Date;
  dateModification?: Date;
}
