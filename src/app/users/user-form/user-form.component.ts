import { SelectionModel } from "@angular/cdk/collections";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import {
  Permission,
  PermissionService,
} from "../../settings/permission/permission.service";
import { Role, RoleService } from "../../settings/role/role.service";
import { UserService } from "../user.service";

@Component({
  selector: "app-user-form",
  templateUrl: "./user-form.component.html",
  styleUrls: ["./user-form.component.scss"],
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEdit = false;
  isLoading = false;
  error: string | null = null;
  userId: number | null = null;
  roles: Role[] = [];
  hidePassword = true; // For password visibility toggle

  // Permissions related properties
  allPermissions: Permission[] = [];
  userPermissions: Permission[] = [];
  permissionsByCategory: { [category: string]: Permission[] } = {};
  categories: string[] = [];
  permissionSelection = new SelectionModel<number>(true, []);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private roleService: RoleService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group(
      {
        username: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        nom: ["", Validators.required],
        prenom: ["", Validators.required],
        password: ["", Validators.required],
        confirmPassword: ["", Validators.required],
        role: ["", Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );

    // Load available roles and permissions
    this.loadInitialData();

    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.isEdit = true;
      this.userId = Number(id);
      this.fetchUser(this.userId);

      // Remove password validation for edit mode
      this.userForm.get("password")?.clearValidators();
      this.userForm.get("password")?.updateValueAndValidity();
      this.userForm.get("confirmPassword")?.clearValidators();
      this.userForm.get("confirmPassword")?.updateValueAndValidity();
    }
  }

  loadInitialData(): void {
    this.isLoading = true;
    forkJoin({
      roles: this.roleService.getAllRoles(),
      permissions: this.permissionService.getAllPermissions(),
    }).subscribe({
      next: (result) => {
        this.roles = result.roles.data;
        this.allPermissions = result.permissions.data;

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
        console.error("Error loading initial data", error);
        this.error = "Failed to load roles and permissions.";
        this.isLoading = false;
      },
    });
  }

  fetchUser(id: number): void {
    this.isLoading = true;

    // First get the user data
    this.userService.getUser(id).subscribe({
      next: (user) => {
        // Initialize form with user data
        this.userForm.patchValue(user);

        // Then try to get the permissions
        this.userService.getUserPermissions(id).subscribe({
          next: (response) => {
            this.userPermissions = response.data;

            // Initialize permission selection
            this.permissionSelection = new SelectionModel<number>(
              true,
              this.userPermissions.map((p) => p.id!)
            );

            this.isLoading = false;
          },
          error: (error) => {
            console.error("Error loading user permissions:", error);
            // Even if permissions fail, we've loaded the user data
            this.userPermissions = [];
            this.permissionSelection = new SelectionModel<number>(true, []);
            this.isLoading = false;
          },
        });
      },
      error: (error) => {
        this.error = "Failed to load user data.";
        this.isLoading = false;
        console.error(error);
      },
    });
  }

  isPermissionSelected(permission: Permission): boolean {
    return this.permissionSelection.isSelected(permission.id!);
  }

  togglePermission(permission: Permission): void {
    this.permissionSelection.toggle(permission.id!);
  }

  toggleCategory(category: string): void {
    const categoryPermissions = this.permissionsByCategory[category];
    const allSelected = categoryPermissions.every((p) =>
      this.permissionSelection.isSelected(p.id!)
    );

    if (allSelected) {
      // Deselect all in category
      categoryPermissions.forEach((p) =>
        this.permissionSelection.deselect(p.id!)
      );
    } else {
      // Select all in category
      categoryPermissions.forEach((p) =>
        this.permissionSelection.select(p.id!)
      );
    }
  }

  isCategorySelected(category: string): boolean {
    const categoryPermissions = this.permissionsByCategory[category];
    return categoryPermissions.every((p) =>
      this.permissionSelection.isSelected(p.id!)
    );
  }

  isCategoryIndeterminate(category: string): boolean {
    const categoryPermissions = this.permissionsByCategory[category];
    const selectedCount = categoryPermissions.filter((p) =>
      this.permissionSelection.isSelected(p.id!)
    ).length;
    return selectedCount > 0 && selectedCount < categoryPermissions.length;
  }

  cancel(): void {
    this.router.navigate(["/settings/users"]);
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;
    this.isLoading = true;
    this.error = null;
    const userData = this.userForm.value;

    if (this.isEdit && this.userId) {
      this.userService.updateUser(this.userId, userData).subscribe({
        next: () => {
          // After updating user, update permissions if needed
          this.updateUserPermissions(this.userId!);
        },
        error: (error) => {
          console.error("Update error:", error);
          this.error = error?.error?.message || "Failed to update user.";
          this.isLoading = false;
        },
      });
    } else {
      // For new user, first create the user then handle permissions separately
      this.userService.createUser(userData).subscribe({
        next: (createdUser) => {
          if (createdUser && createdUser.id) {
            // User created successfully, now try to add permissions
            this.updateUserPermissions(createdUser.id);
          } else {
            // User created but no ID returned
            this.isLoading = false;
            this.router.navigate(["/settings/users"]);
          }
        },
        error: (error) => {
          console.error("Creation error:", error);
          this.error = error?.error?.message || "Failed to create user.";
          this.isLoading = false;
        },
      });
    }
  }

  updateUserPermissions(userId: number): void {
    const selectedPermissionIds = this.permissionSelection.selected;

    // If no permissions selected, just navigate back
    if (selectedPermissionIds.length === 0) {
      this.isLoading = false;
      this.router.navigate(["/settings/users"]);
      return;
    }

    if (this.isEdit) {
      // For edit mode, we need to calculate permissions to add and remove
      const currentPermissionIds = this.userPermissions.map((p) => p.id!);

      // Calculate permissions to add and remove
      const permissionsToAdd = selectedPermissionIds.filter(
        (id) => !currentPermissionIds.includes(id)
      );
      const permissionsToRemove = currentPermissionIds.filter(
        (id) => !selectedPermissionIds.includes(id)
      );

      let operationsCompleted = 0;
      let operationsNeeded = 0;
      let hasErrors = false;

      // Count how many operations we need to perform
      if (permissionsToAdd.length > 0) operationsNeeded++;
      if (permissionsToRemove.length > 0) operationsNeeded++;

      // If no operations needed, just navigate back
      if (operationsNeeded === 0) {
        this.isLoading = false;
        this.router.navigate(["/settings/users"]);
        return;
      }

      const finishOperation = () => {
        operationsCompleted++;
        if (operationsCompleted === operationsNeeded) {
          this.isLoading = false;
          if (!hasErrors) {
            this.router.navigate(["/settings/users"]);
          }
        }
      };

      // Add new permissions
      if (permissionsToAdd.length > 0) {
        this.userService
          .assignPermissionsToUser(userId, permissionsToAdd)
          .subscribe({
            next: () => finishOperation(),
            error: (error) => {
              hasErrors = true;
              this.error = "Failed to add permissions";
              console.error("Error adding permissions:", error);
              finishOperation();
            },
          });
      }

      // Remove permissions
      if (permissionsToRemove.length > 0) {
        this.userService
          .removePermissionsFromUser(userId, permissionsToRemove)
          .subscribe({
            next: () => finishOperation(),
            error: (error) => {
              hasErrors = true;
              this.error = "Failed to remove permissions";
              console.error("Error removing permissions:", error);
              finishOperation();
            },
          });
      }
    } else {
      // For new users, just assign the selected permissions
      this.userService
        .assignPermissionsToUser(userId, selectedPermissionIds)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(["/settings/users"]);
          },
          error: (error) => {
            this.error = "User created but failed to assign permissions";
            this.isLoading = false;
            console.error("Error assigning permissions:", error);
            // Still navigate back since user was created
            setTimeout(() => {
              this.router.navigate(["/settings/users"]);
            }, 2000);
          },
        });
    }
  }

  // Custom validator to check if password and confirmPassword match
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get("password")?.value;
    const confirmPassword = formGroup.get("confirmPassword")?.value;

    if (password !== confirmPassword) {
      formGroup.get("confirmPassword")?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }
}
