import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    MainLayoutComponent,
  ],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    MainLayoutComponent,
  ],
})
export class LayoutModule {}
