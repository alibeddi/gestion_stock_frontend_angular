import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./core/guards/auth.guard";
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
      },
      {
        path: "prospects",
        loadChildren: () =>
          import("./prospects/prospects.module").then((m) => m.ProspectsModule),
      },
      {
        path: "products",
        loadChildren: () =>
          import("./products/products.module").then((m) => m.ProductsModule),
      },
      {
        path: "quotes",
        loadChildren: () =>
          import("./quotes/quotes.module").then((m) => m.QuotesModule),
      },
      {
        path: "contacts",
        loadChildren: () =>
          import("./contacts/contacts.module").then((m) => m.ContactsModule),
      },
      {
        path: "users",
        loadChildren: () =>
          import("./users/users.module").then((m) => m.UsersModule),
        data: { roles: ["ADMIN"] },
      },
    ],
  },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
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
