import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { CompanySettingsComponent } from "./company-settings/company-settings.component";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { SecuritySettingsComponent } from "./security-settings/security-settings.component";
import { SettingsRoutingModule } from "./settings-routing.module";
import { SettingsComponent } from "./settings/settings.component";

// Import des composants utilisateurs
import { UserDetailComponent } from "../users/user-detail/user-detail.component";
import { UserFormComponent } from "../users/user-form/user-form.component";
import { UserListComponent } from "../users/user-list/user-list.component";

// Angular Material Imports
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { SharedModule } from "../shared/shared.module";
import { UserPermissionsDialogComponent } from "../users/user-permissions-dialog/user-permissions-dialog.component";
import { GouvernoratFormComponent } from "./gouvernorat/gouvernorat-form.component";
import { GouvernoratListComponent } from "./gouvernorat/gouvernorat-list.component";
import { ModePaiementFormComponent } from "./mode-paiement/mode-paiement-form.component";
import { ModePaiementListComponent } from "./mode-paiement/mode-paiement-list.component";
import { PermissionFormDialogComponent } from "./permission/permission-form-dialog.component";
import { PermissionListComponent } from "./permission/permission-list.component";
import { RoleFormComponent } from "./role/role-form.component";
import { RoleListComponent } from "./role/role-list.component";
import { SecteurActiviteFormComponent } from "./secteur-activite/secteur-activite-form.component";
import { SecteurActiviteListComponent } from "./secteur-activite/secteur-activite-list.component";
import { SourceProspectionFormComponent } from "./source-prospection/source-prospection-form.component";
import { SourceProspectionListComponent } from "./source-prospection/source-prospection-list.component";

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
    UserPermissionsDialogComponent,
    SecteurActiviteListComponent,
    SecteurActiviteFormComponent,
    SourceProspectionListComponent,
    SourceProspectionFormComponent,
    ModePaiementListComponent,
    ModePaiementFormComponent,
    RoleListComponent,
    RoleFormComponent,
    PermissionListComponent,
    PermissionFormDialogComponent,
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
    MatPaginatorModule,
    MatChipsModule,
    MatExpansionModule,
    SharedModule,
  ],
})
export class SettingsModule {}
