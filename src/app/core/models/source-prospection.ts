export interface SourceProspection {
  id?: number;
  code: string;
  libelle: string;
  description?: string;
  dateCreation?: Date;
  dateModification?: Date;
}

export interface SourceProspectionResponse {
  status: string;
  message: string;
  data: SourceProspection | SourceProspection[];
  timestamp: string;
}
