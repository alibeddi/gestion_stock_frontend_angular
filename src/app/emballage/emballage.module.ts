import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../shared/shared.module";

// Material Imports
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";

// Components
import { EmballageDetailComponent } from "./emballage-detail/emballage-detail.component";
import { EmballageFormComponent } from "./emballage-form/emballage-form.component";
import { EmballageListComponent } from "./emballage-list/emballage-list.component";

const routes: Routes = [
  { path: "", component: EmballageListComponent },
  { path: "new", component: EmballageFormComponent },
  { path: "edit/:id", component: EmballageFormComponent },
  { path: "detail/:id", component: EmballageDetailComponent },
];

@NgModule({
  declarations: [
    EmballageListComponent,
    EmballageFormComponent,
    EmballageDetailComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    // Material Modules
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
})
export class EmballageModule {}
