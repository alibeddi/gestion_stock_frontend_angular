import { Role } from './role';

export interface User {
  id?: number;
  nom: string;
  prenom: string;
  matricule?: string;
  password?: string;
  confirmPassword?: string;
  email: string;
  telephone?: string;
  mobile?: string;
  titre?: string;
  adresse?: string;
  roles?: Role[];
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  credentialsNonExpired?: boolean;
  enabled?: boolean;
}
