import { Role } from '../role';

export interface RegisterRequest {
  nom: string;
  prenom: string;
  matricule?: string;
  password: string;
  confirmPassword: string;
  email: string;
  telephone?: string;
  mobile?: string;
  titre?: string;
  adresse?: string;
  roles?: Role[];
  // username field removed
}
