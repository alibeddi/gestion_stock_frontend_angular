import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../core/guards/auth.guard";
import { FeatureAccessGuard } from "../core/guards/feature-access.guard";
import { UserDetailComponent } from "../users/user-detail/user-detail.component";
import { UserFormComponent } from "../users/user-form/user-form.component";
import { UserListComponent } from "../users/user-list/user-list.component";
import { CompanySettingsComponent } from "./company-settings/company-settings.component";
import { GouvernoratListComponent } from "./gouvernorat/gouvernorat-list.component";
import { ModePaiementListComponent } from "./mode-paiement/mode-paiement-list.component";
import { PermissionListComponent } from "./permission/permission-list.component";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { RoleListComponent } from "./role/role-list.component";
import { SecteurActiviteListComponent } from "./secteur-activite/secteur-activite-list.component";
import { SecuritySettingsComponent } from "./security-settings/security-settings.component";
import { SettingsComponent } from "./settings/settings.component";
import { SourceProspectionListComponent } from "./source-prospection/source-prospection-list.component";

const routes: Routes = [
  {
    path: "",
    component: SettingsComponent,
    canActivate: [AuthGuard],
    data: { roles: ["ADMIN"] },
    children: [
      { path: "", redirectTo: "profile", pathMatch: "full" },
      {
        path: "profile",
        component: ProfileSettingsComponent,
        // Profile settings can be accessed by the logged-in user
      },
      {
        path: "security",
        component: SecuritySettingsComponent,
        // Security settings can be accessed by the logged-in user
      },
      {
        path: "company",
        component: CompanySettingsComponent,
        canActivate: [AuthGuard, FeatureAccessGuard],
        data: { roles: ["ADMIN"], requiredFeature: "settings.update" },
      },
      {
        path: "users",
        component: UserListComponent,
        canActivate: [AuthGuard],
        data: { roles: ["ADMIN"] },
      },
      {
        path: "users/new",
        component: UserFormComponent,
        canActivate: [AuthGuard],
        data: { roles: ["ADMIN"] },
      },
      {
        path: "users/edit/:id",
        component: UserFormComponent,
        canActivate: [AuthGuard],
        data: { roles: ["ADMIN"] },
      },
      {
        path: "users/:id",
        component: UserDetailComponent,
        canActivate: [AuthGuard],
        data: { roles: ["ADMIN"] },
      },
      {
        path: "gouvernorats",
        component: GouvernoratListComponent,
        canActivate: [AuthGuard, FeatureAccessGuard],
        data: { roles: ["ADMIN"], requiredFeature: "settings.view" },
      },
      {
        path: "secteurs",
        component: SecteurActiviteListComponent,
        canActivate: [AuthGuard, FeatureAccessGuard],
        data: { roles: ["ADMIN"], requiredFeature: "settings.view" },
      },
      {
        path: "sources",
        component: SourceProspectionListComponent,
        canActivate: [AuthGuard, FeatureAccessGuard],
        data: { roles: ["ADMIN"], requiredFeature: "settings.view" },
      },
      {
        path: "paiements",
        component: ModePaiementListComponent,
        canActivate: [AuthGuard, FeatureAccessGuard],
        data: { roles: ["ADMIN"], requiredFeature: "settings.view" },
      },
      {
        path: "roles",
        component: RoleListComponent,
        canActivate: [AuthGuard, FeatureAccessGuard],
        data: { roles: ["ADMIN"], requiredFeature: "roles.view" },
      },
      {
        path: "permissions",
        component: PermissionListComponent,
        canActivate: [AuthGuard, FeatureAccessGuard],
        data: { roles: ["ADMIN"], requiredFeature: "roles.view" },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
