import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DevisDetailComponent } from "./devis-detail/devis-detail.component";
import { DevisFormComponent } from "./devis-form/devis-form.component";
import { DevisListComponent } from "./devis-list/devis-list.component";

const routes: Routes = [
  {
    path: "",
    component: DevisListComponent,
  },
  {
    path: "new",
    component: DevisFormComponent,
  },
  {
    path: "edit/:id",
    component: DevisFormComponent,
  },
  {
    path: ":id",
    component: DevisDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevisRoutingModule {}
