import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Role, RoleService } from './role.service';

@Component({
  selector: 'app-role-form',
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? 'Modifier' : 'Ajouter' }} un rôle</h2>
    <form [formGroup]="roleForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field appearance="outline" class="w-100 mb-3">
          <mat-label>Code</mat-label>
          <input matInput formControlName="name" placeholder="Entrez le code du rôle">
          <mat-error *ngIf="roleForm.get('name')!.hasError('required')">Le code est requis</mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Libellé</mat-label>
          <input matInput formControlName="libelle" placeholder="Entrez le libellé du rôle">
        </mat-form-field>
      </div>
      
      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Annuler</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="roleForm.invalid">Enregistrer</button>
      </div>
    </form>
  `,
  styles: []
})
export class RoleFormComponent implements OnInit {
  roleForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<RoleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Role
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.isEditMode = !!this.data.id;
  }

  initForm(): void {
    this.roleForm = this.fb.group({
      name: [this.data.name || '', Validators.required],
      libelle: [this.data.libelle || '']
    });
  }

  onSubmit(): void {
    if (this.roleForm.invalid) return;

    const role: Role = {
      ...this.data,
      ...this.roleForm.value
    };

    this.roleService.createRole(role).subscribe({
      next: (response) => {
        this.snackBar.open(response.message, 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error saving role', error);
        this.snackBar.open('Erreur lors de l\'enregistrement du rôle', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}