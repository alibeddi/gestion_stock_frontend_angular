import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientDetailComponent } from './client-detail/client-detail.component';
import { ClientFormComponent } from './client-form/client-form.component';
import { ClientListComponent } from './client-list/client-list.component';

const routes: Routes = [
  {
    path: '',
    component: ClientListComponent,
  },
  {
    path: 'new',
    component: ClientFormComponent,
  },
  {
    path: 'edit/:id',
    component: ClientFormComponent,
  },
  {
    path: ':id',
    component: ClientDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientsRoutingModule {}
