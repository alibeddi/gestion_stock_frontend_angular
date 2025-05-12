import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CompanySettingsComponent } from "./company-settings/company-settings.component";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { SecuritySettingsComponent } from "./security-settings/security-settings.component";
import { SettingsComponent } from "./settings/settings.component";

const routes: Routes = [
  {
    path: "",
    component: SettingsComponent,
    children: [
      { path: "", redirectTo: "profile", pathMatch: "full" },
      { path: "profile", component: ProfileSettingsComponent },
      { path: "company", component: CompanySettingsComponent },
      { path: "security", component: SecuritySettingsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
