import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import {
  Permission,
  PermissionService,
} from "../permission/permission.service";
import { Role, RoleService } from "./role.service";

@Component({
  selector: "app-role-form",
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? "Modifier" : "Ajouter" }} un rôle</h2>
    <div *ngIf="isLoading" class="loading-container">
      <mat-spinner diameter="40"></mat-spinner>
    </div>
    <form [formGroup]="roleForm" (ngSubmit)="onSubmit()" *ngIf="!isLoading">
      <div mat-dialog-content>
        <mat-form-field appearance="outline" class="w-100 mb-3">
          <mat-label>Code</mat-label>
          <input
            matInput
            formControlName="name"
            placeholder="Entrez le code du rôle"
          />
          <mat-error *ngIf="roleForm.get('name')!.hasError('required')"
            >Le code est requis</mat-error
          >
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-100 mb-3">
          <mat-label>Libellé</mat-label>
          <input
            matInput
            formControlName="libelle"
            placeholder="Entrez le libellé du rôle"
          />
        </mat-form-field>

        <div class="permissions-section">
          <h3>Permissions</h3>
          <div class="permissions-wrapper">
            <div *ngIf="categories.length === 0">
              <p>Aucune permission disponible</p>
            </div>
            <div
              *ngFor="let category of categories"
              class="permission-category"
            >
              <h4>{{ category }}</h4>
              <div class="permission-list">
                <mat-checkbox
                  *ngFor="let permission of permissionsByCategory[category]"
                  [checked]="isPermissionSelected(permission.id)"
                  (change)="togglePermission(permission.id, $event.checked)"
                >
                  {{ permission.description || permission.name }}
                </mat-checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Annuler</button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="roleForm.invalid"
        >
          Enregistrer
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .loading-container {
        display: flex;
        justify-content: center;
        padding: 20px;
      }
      .permissions-section {
        margin-top: 20px;
      }
      .permissions-wrapper {
        max-height: 300px;
        overflow-y: auto;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        padding: 10px;
      }
      .permission-category {
        margin-bottom: 15px;
      }
      .permission-category h4 {
        margin-bottom: 10px;
        color: #3f51b5;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 5px;
      }
      .permission-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      mat-checkbox {
        margin-right: 15px;
        margin-bottom: 10px;
      }
      .w-100 {
        width: 100%;
      }
      .mb-3 {
        margin-bottom: 15px;
      }
    `,
  ],
})
export class RoleFormComponent implements OnInit {
  roleForm!: FormGroup;
  isEditMode = false;
  isLoading = false;

  permissions: Permission[] = [];
  selectedPermissionIds: Set<number> = new Set();
  categories: string[] = [];
  permissionsByCategory: { [category: string]: Permission[] } = {};

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<RoleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Role
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.isEditMode = !!this.data.id;
    this.initForm();
    this.loadData();
  }

  initForm(): void {
    this.roleForm = this.fb.group({
      name: [this.data.name || "", Validators.required],
      libelle: [this.data.libelle || ""],
    });
  }

  loadData(): void {
    // Load permissions
    const permissionsObs = this.permissionService.getAllPermissions().pipe(
      map((response) => {
        this.permissions = response.data;

        // Group permissions by category
        this.categories = [
          ...new Set(
            this.permissions.map((p) => p.category || "Uncategorized")
          ),
        ].sort();
        this.permissionsByCategory = {};

        for (const category of this.categories) {
          this.permissionsByCategory[category] = this.permissions.filter(
            (p) => (p.category || "Uncategorized") === category
          );
        }

        return response.data;
      })
    );

    // If editing, load role's permissions
    const observables: Observable<any>[] = [permissionsObs];

    if (this.isEditMode && this.data.id) {
      const rolePermissionsObs = this.roleService
        .getRoleById(this.data.id)
        .pipe(
          map((response) => {
            if (response.data.permissions) {
              for (const permission of response.data.permissions) {
                if (permission.id) {
                  this.selectedPermissionIds.add(permission.id);
                }
              }
            }
            return response.data;
          })
        );

      observables.push(rolePermissionsObs);
    }

    forkJoin(observables).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading data", error);
        this.snackBar.open("Erreur lors du chargement des données", "Fermer", {
          duration: 3000,
          panelClass: ["error-snackbar"],
        });
        this.isLoading = false;
      },
    });
  }

  isPermissionSelected(permissionId?: number): boolean {
    return permissionId ? this.selectedPermissionIds.has(permissionId) : false;
  }

  togglePermission(permissionId?: number, checked?: boolean): void {
    if (!permissionId) return;

    if (checked) {
      this.selectedPermissionIds.add(permissionId);
    } else {
      this.selectedPermissionIds.delete(permissionId);
    }
  }

  onSubmit(): void {
    if (this.roleForm.invalid) return;

    const role: Role = {
      ...this.data,
      ...this.roleForm.value,
      permissions: Array.from(this.selectedPermissionIds).map((id) => ({
        id,
      })),
    };

    this.isLoading = true;

    if (this.isEditMode && this.data.id) {
      this.roleService.updateRole(this.data.id, role).subscribe({
        next: (response) => {
          this.snackBar.open(
            response.message || "Rôle mis à jour avec succès",
            "Fermer",
            {
              duration: 3000,
              panelClass: ["success-snackbar"],
            }
          );
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error("Error updating role", error);
          this.snackBar.open(
            "Erreur lors de la mise à jour du rôle",
            "Fermer",
            {
              duration: 3000,
              panelClass: ["error-snackbar"],
            }
          );
          this.isLoading = false;
        },
      });
    } else {
      this.roleService.createRole(role).subscribe({
        next: (response) => {
          this.snackBar.open(response.message, "Fermer", {
            duration: 3000,
            panelClass: ["success-snackbar"],
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error("Error saving role", error);
          this.snackBar.open(
            "Erreur lors de l'enregistrement du rôle",
            "Fermer",
            {
              duration: 3000,
              panelClass: ["error-snackbar"],
            }
          );
          this.isLoading = false;
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
