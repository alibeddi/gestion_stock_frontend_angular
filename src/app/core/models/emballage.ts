export interface Emballage {
  id?: number;
  code: string;
  libelle: string;
  description?: string;
  dateCreation?: Date;
  dateModification?: Date;
}

export interface EmballageResponse {
  status: string;
  message: string;
  data: Emballage | Emballage[];
  timestamp: string;
}
