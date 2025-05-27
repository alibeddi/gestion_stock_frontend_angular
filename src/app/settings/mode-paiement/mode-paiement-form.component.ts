import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModePaiementService } from './mode-paiement.service';

@Component({
  selector: 'app-mode-paiement-form',
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? 'Modifier' : 'Ajouter' }} un Mode de Paiement</h2>
    <form [formGroup]="modePaiementForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Code</mat-label>
          <input matInput formControlName="code" required>
          <mat-error *ngIf="modePaiementForm.get('code')?.hasError('required')">
            Le code est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Nom</mat-label>
          <input matInput formControlName="name" required>
          <mat-error *ngIf="modePaiementForm.get('name')?.hasError('required')">
            Le nom est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Annuler</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="modePaiementForm.invalid">
          {{ isEditMode ? 'Modifier' : 'Ajouter' }}
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class ModePaiementFormComponent implements OnInit {
  modePaiementForm!: FormGroup; // Add non-null assertion operator
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private modePaiementService: ModePaiementService,
    private dialogRef: MatDialogRef<ModePaiementFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.modePaiementForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
    });

    if (this.data) {
      this.isEditMode = true;
      this.modePaiementForm.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.modePaiementForm.valid) {
      const modePaiement = this.modePaiementForm.value;

      if (this.isEditMode) {
        this.modePaiementService.updateModePaiement(this.data.id, modePaiement)
          .subscribe(
            () => this.dialogRef.close(true),
            error => console.error('Error updating payment mode:', error)
          );
      } else {
        this.modePaiementService.createModePaiement(modePaiement)
          .subscribe(
            () => this.dialogRef.close(true),
            error => console.error('Error creating payment mode:', error)
          );
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}