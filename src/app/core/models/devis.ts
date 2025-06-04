import { Client } from "./client";
import { Prospect } from "./prospect";

export enum DelaiLivraison {
  IMMEDIAT = "IMMEDIAT",
  SOUS_24H = "SOUS_24H",
  SOUS_48H = "SOUS_48H",
  SOUS_72H = "SOUS_72H",
  UNE_SEMAINE = "UNE_SEMAINE",
  DEUX_SEMAINES = "DEUX_SEMAINES",
  UN_MOIS = "UN_MOIS",
}

export enum ModeDeLivraison {
  EN_MAGASIN = "EN_MAGASIN",
  LIVRAISON_GRATUITE = "LIVRAISON_GRATUITE",
  LIVRAISON_STANDARD = "LIVRAISON_STANDARD",
  TRANSPORT_EXPRESS = "TRANSPORT_EXPRESS",
}

export enum ModeDeReglement {
  ESPECES = "ESPECES",
  CHEQUE = "CHEQUE",
  VIREMENT = "VIREMENT",
  CARTE_BANCAIRE = "CARTE_BANCAIRE",
}

export interface LigneDevis {
  id?: number;
  produit?: any;
  description: string;
  quantite: number;
  prixUnitaire: number;
  tauxTVA: number;
  montantHT?: number;
  montantTTC?: number;
  poidsUnitaire?: number;
  poidsTotal?: number;
}

export interface Devis {
  id?: number;
  numeroDevis?: string;
  sujet: string;
  client?: Client;
  prospect?: Prospect;
  echeance?: Date;
  delaiLivraison?: DelaiLivraison;
  modeLivraison?: ModeDeLivraison;
  modePaiement?: ModeDeReglement;
  lignesDevis?: LigneDevis[];
  totalHT?: number;
  totalTVA?: number;
  totalTTC?: number;
  totalPoidsKg?: number;
  dateCreation?: Date;
  dateModification?: Date;
}
