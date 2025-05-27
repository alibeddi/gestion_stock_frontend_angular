import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { PermissionFormDialogComponent } from "./permission-form-dialog.component";
import { Permission, PermissionService } from "./permission.service";

@Component({
  selector: "app-permission-list",
  templateUrl: "./permission-list.component.html",
  styleUrls: ["./permission-list.component.scss"],
})
export class PermissionListComponent implements OnInit {
  displayedColumns: string[] = [
    "id",
    "name",
    "description",
    "category",
    "actions",
  ];
  dataSource = new MatTableDataSource<Permission>([]);
  isLoading = false;
  error: string | null = null;
  categories: string[] = [];
  selectedCategory: string = "";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private permissionService: PermissionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPermissions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPermissions(): void {
    this.isLoading = true;
    this.error = null;

    this.permissionService.getAllPermissions().subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.isLoading = false;

        // Extract unique categories
        this.categories = [
          ...new Set(response.data.map((p) => p.category || "Uncategorized")),
        ];
      },
      error: (error: any) => {
        console.error("Error loading permissions:", error);
        this.error = "Failed to load permissions.";
        this.isLoading = false;
      },
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;

    if (!category) {
      // Reset filter
      this.loadPermissions();
      return;
    }

    this.isLoading = true;
    this.permissionService.getPermissionsByCategory(category).subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error("Error filtering permissions:", error);
        this.error = "Failed to filter permissions.";
        this.isLoading = false;
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openPermissionDialog(permission?: Permission): void {
    const dialogRef = this.dialog.open(PermissionFormDialogComponent, {
      width: "500px",
      data: permission ? { ...permission } : {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.id) {
          this.updatePermission(result);
        } else {
          this.createPermission(result);
        }
      }
    });
  }

  createPermission(permission: Permission): void {
    this.isLoading = true;
    this.permissionService.createPermission(permission).subscribe({
      next: () => {
        this.snackBar.open("Permission created successfully", "Close", {
          duration: 3000,
        });
        this.loadPermissions();
      },
      error: (error: any) => {
        console.error("Error creating permission:", error);
        this.snackBar.open("Failed to create permission", "Close", {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  updatePermission(permission: Permission): void {
    if (!permission.id) return;

    this.isLoading = true;
    this.permissionService
      .updatePermission(permission.id, permission)
      .subscribe({
        next: () => {
          this.snackBar.open("Permission updated successfully", "Close", {
            duration: 3000,
          });
          this.loadPermissions();
        },
        error: (error: any) => {
          console.error("Error updating permission:", error);
          this.snackBar.open("Failed to update permission", "Close", {
            duration: 3000,
          });
          this.isLoading = false;
        },
      });
  }

  deletePermission(permission: Permission): void {
    if (!permission.id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "350px",
      data: {
        title: "Confirm Deletion",
        message: `Are you sure you want to delete the permission "${permission.name}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.permissionService.deletePermission(permission.id!).subscribe({
          next: () => {
            this.snackBar.open("Permission deleted successfully", "Close", {
              duration: 3000,
            });
            this.loadPermissions();
          },
          error: (error: any) => {
            console.error("Error deleting permission:", error);
            this.snackBar.open("Failed to delete permission", "Close", {
              duration: 3000,
            });
            this.isLoading = false;
          },
        });
      }
    });
  }

  initializeDefaultPermissions(): void {
    this.isLoading = true;
    this.permissionService.initializeDefaultPermissions().subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.isLoading = false;
        this.snackBar.open(
          "Default permissions initialized successfully",
          "Close",
          {
            duration: 3000,
          }
        );
      },
      error: (error: any) => {
        this.error = "Failed to initialize default permissions.";
        this.isLoading = false;
        console.error(error);
      },
    });
  }
}
