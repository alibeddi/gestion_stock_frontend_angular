import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { ContactDetailComponent } from "./contact-detail/contact-detail.component";
import { ContactFormComponent } from "./contact-form/contact-form.component";
import { ContactListComponent } from "./contact-list/contact-list.component";
import { ContactsRoutingModule } from "./contacts-routing.module";

@NgModule({
  declarations: [
    ContactListComponent,
    ContactDetailComponent,
    ContactFormComponent,
  ],
  imports: [
    CommonModule,
    ContactsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class ContactsModule {}
