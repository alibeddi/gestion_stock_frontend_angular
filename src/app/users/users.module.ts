import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { UserDetailComponent } from "./user-detail/user-detail.component";
import { UserFormComponent } from "./user-form/user-form.component";
import { UserListComponent } from "./user-list/user-list.component";
import { UserPermissionsDialogComponent } from "./user-permissions-dialog/user-permissions-dialog.component";
import { UsersRoutingModule } from "./users-routing.module";

@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent,
    UserFormComponent,
    UserPermissionsDialogComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
  ],
  exports: [
    UserListComponent,
    UserDetailComponent,
    UserFormComponent,
    UserPermissionsDialogComponent,
  ],
})
export class UsersModule {}
