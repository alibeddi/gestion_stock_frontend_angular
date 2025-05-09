import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { SharedModule } from "../shared/shared.module";
import { ProspectDetailComponent } from "./prospect-detail/prospect-detail.component";
import { ProspectFormComponent } from "./prospect-form/prospect-form.component";
import { ProspectListComponent } from "./prospect-list/prospect-list.component";
import { ProspectsRoutingModule } from "./prospects-routing.module";

@NgModule({
  declarations: [
    ProspectListComponent,
    ProspectDetailComponent,
    ProspectFormComponent,
  ],
  imports: [CommonModule, ProspectsRoutingModule, SharedModule],
})
export class ProspectsModule {}
