import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProspectDetailComponent } from "./prospect-detail/prospect-detail.component";
import { ProspectFormComponent } from "./prospect-form/prospect-form.component";
import { ProspectListComponent } from "./prospect-list/prospect-list.component";

const routes: Routes = [
  { path: "", component: ProspectListComponent },
  { path: "new", component: ProspectFormComponent },
  { path: "edit/:id", component: ProspectFormComponent },
  { path: ":id", component: ProspectDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProspectsRoutingModule {}
