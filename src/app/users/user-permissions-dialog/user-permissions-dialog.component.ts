import { SelectionModel } from "@angular/cdk/collections";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Permission } from "../../settings/permission/permission.service";
import { User, UserService } from "../user.service";

interface DialogData {
  user: User;
  userPermissions: Permission[];
  allPermissions: Permission[];
  permissionsByCategory: { [category: string]: Permission[] };
  categories: string[];
}

@Component({
  selector: "app-user-permissions-dialog",
  templateUrl: "./user-permissions-dialog.component.html",
  styleUrls: ["./user-permissions-dialog.component.scss"],
})
export class UserPermissionsDialogComponent implements OnInit {
  selection = new SelectionModel<number>(true, []);
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<UserPermissionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Initialize selection with current user permissions
    this.selection = new SelectionModel<number>(
      true,
      this.data.userPermissions.map((p) => p.id!)
    );
  }

  isPermissionSelected(permission: Permission): boolean {
    return this.selection.isSelected(permission.id!);
  }

  togglePermission(permission: Permission): void {
    this.selection.toggle(permission.id!);
  }

  toggleCategory(category: string): void {
    const categoryPermissions = this.data.permissionsByCategory[category];
    const allSelected = categoryPermissions.every((p) =>
      this.selection.isSelected(p.id!)
    );

    if (allSelected) {
      // Deselect all in category
      categoryPermissions.forEach((p) => this.selection.deselect(p.id!));
    } else {
      // Select all in category
      categoryPermissions.forEach((p) => this.selection.select(p.id!));
    }
  }

  isCategorySelected(category: string): boolean {
    const categoryPermissions = this.data.permissionsByCategory[category];
    return categoryPermissions.every((p) => this.selection.isSelected(p.id!));
  }

  isCategoryIndeterminate(category: string): boolean {
    const categoryPermissions = this.data.permissionsByCategory[category];
    const selectedCount = categoryPermissions.filter((p) =>
      this.selection.isSelected(p.id!)
    ).length;
    return selectedCount > 0 && selectedCount < categoryPermissions.length;
  }

  savePermissions(): void {
    this.isLoading = true;

    // Get IDs of selected permissions
    const selectedPermissionIds = this.selection.selected;

    // Get current permission IDs
    const currentPermissionIds = this.data.userPermissions.map((p) => p.id!);

    // Calculate permissions to add and remove
    const permissionsToAdd = selectedPermissionIds.filter(
      (id) => !currentPermissionIds.includes(id)
    );
    const permissionsToRemove = currentPermissionIds.filter(
      (id) => !selectedPermissionIds.includes(id)
    );

    // Check if there are changes
    if (permissionsToAdd.length === 0 && permissionsToRemove.length === 0) {
      this.dialogRef.close({ updated: false });
      return;
    }

    // Apply the changes
    let operationsCompleted = 0;
    let hasErrors = false;

    const finishOperation = () => {
      operationsCompleted++;
      if (operationsCompleted === 2) {
        this.isLoading = false;
        this.dialogRef.close({ updated: !hasErrors });
      }
    };

    // Add new permissions
    if (permissionsToAdd.length > 0) {
      this.userService
        .assignPermissionsToUser(this.data.user.id!, permissionsToAdd)
        .subscribe({
          next: () => finishOperation(),
          error: (error) => {
            hasErrors = true;
            console.error("Error adding permissions:", error);
            this.snackBar.open("Failed to add permissions", "Close", {
              duration: 3000,
            });
            finishOperation();
          },
        });
    } else {
      finishOperation();
    }

    // Remove permissions
    if (permissionsToRemove.length > 0) {
      this.userService
        .removePermissionsFromUser(this.data.user.id!, permissionsToRemove)
        .subscribe({
          next: () => finishOperation(),
          error: (error) => {
            hasErrors = true;
            console.error("Error removing permissions:", error);
            this.snackBar.open("Failed to remove permissions", "Close", {
              duration: 3000,
            });
            finishOperation();
          },
        });
    } else {
      finishOperation();
    }
  }

  cancel(): void {
    this.dialogRef.close({ updated: false });
  }
}
