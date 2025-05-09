import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ContactDetailComponent } from "./contact-detail/contact-detail.component";
import { ContactFormComponent } from "./contact-form/contact-form.component";
import { ContactListComponent } from "./contact-list/contact-list.component";

const routes: Routes = [
  {
    path: "",
    component: ContactListComponent,
  },
  {
    path: "new",
    component: ContactFormComponent,
  },
  {
    path: "edit/:id",
    component: ContactFormComponent,
  },
  {
    path: ":id",
    component: ContactDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactsRoutingModule {}
