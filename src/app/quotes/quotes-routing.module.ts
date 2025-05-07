import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuoteDetailComponent } from './quote-detail/quote-detail.component';
import { QuoteFormComponent } from './quote-form/quote-form.component';
import { QuoteListComponent } from './quote-list/quote-list.component';

const routes: Routes = [
  {
    path: '',
    component: QuoteListComponent,
  },
  {
    path: 'new',
    component: QuoteFormComponent,
  },
  {
    path: 'edit/:id',
    component: QuoteFormComponent,
  },
  {
    path: ':id',
    component: QuoteDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotesRoutingModule {}
