import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ProspectsRoutingModule } from './prospects-routing.module';
import { ProspectListComponent } from './prospect-list/prospect-list.component';
import { ProspectDetailComponent } from './prospect-detail/prospect-detail.component';
import { ProspectFormComponent } from './prospect-form/prospect-form.component';

// Angular Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    ProspectListComponent,
    ProspectDetailComponent,
    ProspectFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProspectsRoutingModule,
    // Angular Material Modules
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatChipsModule
  ]
})
export class ProspectsModule { }