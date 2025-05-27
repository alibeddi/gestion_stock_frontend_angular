import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';

import { CompanySettingsComponent } from "./company-settings/company-settings.component";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { SecuritySettingsComponent } from "./security-settings/security-settings.component";
import { SettingsRoutingModule } from "./settings-routing.module";
import { SettingsComponent } from "./settings/settings.component";

// Import des composants utilisateurs
import { UserListComponent } from "../users/user-list/user-list.component";
import { UserDetailComponent } from "../users/user-detail/user-detail.component";
import { UserFormComponent } from "../users/user-form/user-form.component";

// Angular Material Imports
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { MatError, MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";
import { GouvernoratListComponent } from "./gouvernorat/gouvernorat-list.component";
import { GouvernoratFormComponent } from "./gouvernorat/gouvernorat-form.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatPaginatorModule } from "@angular/material/paginator";
import { SecteurActiviteListComponent } from './secteur-activite/secteur-activite-list.component';
import { SecteurActiviteFormComponent } from './secteur-activite/secteur-activite-form.component';
import { SourceProspectionListComponent } from './source-prospection/source-prospection-list.component';
import { SourceProspectionFormComponent } from './source-prospection/source-prospection-form.component';
import { ModePaiementListComponent } from './mode-paiement/mode-paiement-list.component';
import { ModePaiementFormComponent } from './mode-paiement/mode-paiement-form.component';
import { RoleListComponent } from './role/role-list.component';
import { RoleFormComponent } from './role/role-form.component';

@NgModule({
  declarations: [
    SettingsComponent,
    ProfileSettingsComponent,
    CompanySettingsComponent,
    SecuritySettingsComponent,
    GouvernoratListComponent,
    GouvernoratFormComponent,
    UserListComponent,
    UserDetailComponent,
    UserFormComponent,
    SecteurActiviteListComponent,
    SecteurActiviteFormComponent,
    SourceProspectionListComponent,
    SourceProspectionFormComponent,
    ModePaiementListComponent,
    ModePaiementFormComponent,
    RoleListComponent,
    RoleFormComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    SettingsRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTabsModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatSlideToggleModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule
  ],
})
export class SettingsModule { }
