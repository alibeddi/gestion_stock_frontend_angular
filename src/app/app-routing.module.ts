import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./core/guards/auth.guard";
import { FeatureAccessGuard } from "./core/guards/feature-access.guard";
import { MainLayoutComponent } from "./layout/main-layout/main-layout.component";

const routes: Routes = [
  {
    path: "",
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
      {
        path: "clients",
        loadChildren: () =>
          import("./clients/clients.module").then((m) => m.ClientsModule),
        canActivate: [FeatureAccessGuard],
        data: { requiredFeature: "clients.view" },
      },
      {
        path: "prospects",
        loadChildren: () =>
          import("./prospects/prospects.module").then((m) => m.ProspectsModule),
        canActivate: [FeatureAccessGuard],
        data: { requiredFeature: "prospects.view" },
      },
      // {
      //   path: "products",
      //   loadChildren: () =>
      //     import("./products/products.module").then((m) => m.ProductsModule),
      // },
      {
        path: "devis",
        loadChildren: () =>
          import("./devis/devis.module").then((m) => m.DevisModule),
        canActivate: [FeatureAccessGuard],
        data: { requiredFeature: "quotes.view" },
      },
      {
        path: "contacts",
        loadChildren: () =>
          import("./contacts/contacts.module").then((m) => m.ContactsModule),
        canActivate: [FeatureAccessGuard],
        data: { requiredFeature: "clients.view" },
      },
      // Supprimez ou commentez la route users suivante :
      /*
      {
        path: "users",
        loadChildren: () =>
          import("./users/users.module").then((m) => m.UsersModule),
        data: { roles: ["ADMIN"] },
      },
      */
      {
        path: "emballages",
        loadChildren: () =>
          import("./emballage/emballage.module").then((m) => m.EmballageModule),
        canActivate: [FeatureAccessGuard],
        data: { requiredFeature: "products.view" },
      },
    ],
  },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "settings",
    loadChildren: () =>
      import("./settings/settings.module").then((m) => m.SettingsModule),
    canActivate: [AuthGuard],
    data: { roles: ["ADMIN"] },
  },
  {
    path: "**",
    redirectTo: "dashboard",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
