import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import {
  Permission,
  PermissionService,
} from "../../settings/permission/permission.service";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { UserPermissionsDialogComponent } from "../user-permissions-dialog/user-permissions-dialog.component";
import { User, UserService } from "../user.service";

@Component({
  selector: "app-user-detail",
  templateUrl: "./user-detail.component.html",
  styleUrls: ["./user-detail.component.scss"],
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  isLoading = false;
  error: string | null = null;
  userPermissions: Permission[] = [];
  allPermissions: Permission[] = [];
  permissionsByCategory: { [category: string]: Permission[] } = {};
  categories: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private permissionService: PermissionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    if (id) {
      this.fetchUser(id);
    } else {
      this.error = "Invalid user ID.";
    }
  }

  fetchUser(id: number): void {
    this.isLoading = true;
    this.userService.getUser(id).subscribe({
      next: (response) => {
        this.user = response;
        this.isLoading = false;
        this.loadPermissions(id);
      },
      error: (error) => {
        this.error = "Failed to load user.";
        this.isLoading = false;
        console.error(error);
      },
    });
  }

  loadPermissions(userId: number): void {
    this.isLoading = true;
    forkJoin({
      userPermissions: this.userService.getUserPermissions(userId),
      allPermissions: this.permissionService.getAllPermissions(),
    }).subscribe({
      next: (results) => {
        this.userPermissions = results.userPermissions.data;
        this.allPermissions = results.allPermissions.data;

        // Group permissions by category
        this.categories = [
          ...new Set(
            this.allPermissions.map((p) => p.category || "Uncategorized")
          ),
        ].sort();
        this.permissionsByCategory = {};

        for (const category of this.categories) {
          this.permissionsByCategory[category] = this.allPermissions.filter(
            (p) => (p.category || "Uncategorized") === category
          );
        }

        this.isLoading = false;
      },
      error: (error) => {
        this.error = "Failed to load permissions.";
        this.isLoading = false;
        console.error(error);
      },
    });
  }

  editUser(): void {
    if (this.user && this.user.id) {
      this.router.navigate(["/users/edit", this.user.id]);
    }
  }

  deleteUser(): void {
    if (!this.user) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "350px",
      data: {
        title: "Confirm Deletion",
        message: `Are you sure you want to delete ${this.user.prenom} ${this.user.nom}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.user && this.user.id) {
        this.isLoading = true;
        this.userService.deleteUser(this.user.id).subscribe({
          next: () => {
            this.snackBar.open("User deleted successfully", "Close", {
              duration: 3000,
            });
            this.router.navigate(["/users"]);
          },
          error: (error) => {
            this.isLoading = false;
            this.error = "Failed to delete user.";
            console.error(error);
          },
        });
      }
    });
  }

  getRoleNames(user: User): string {
    if (user.roles && user.roles.length > 0) {
      return user.roles.map((role) => role.libelle || role.name).join(", ");
    }
    return "No roles assigned";
  }

  managePermissions(): void {
    if (!this.user || !this.user.id) return;

    const dialogRef = this.dialog.open(UserPermissionsDialogComponent, {
      width: "800px",
      data: {
        user: this.user,
        userPermissions: this.userPermissions,
        allPermissions: this.allPermissions,
        permissionsByCategory: this.permissionsByCategory,
        categories: this.categories,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.updated) {
        this.fetchUser(this.user!.id!);
        this.snackBar.open("User permissions updated successfully", "Close", {
          duration: 3000,
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(["../"], { relativeTo: this.route });
  }
}
