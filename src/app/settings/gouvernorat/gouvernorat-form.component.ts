import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GouvernoratService } from '../../core/services/gouvernorat/gouvernorat.service';

@Component({
  selector: 'app-gouvernorat-form',
  template: `
    <h2 mat-dialog-title>{{isEditMode ? 'Modifier' : 'Ajouter'}} un gouvernorat</h2>
    
    <form [formGroup]="gouvernoratForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Code</mat-label>
          <input matInput formControlName="code" required>
          <mat-error *ngIf="gouvernoratForm.get('code')!.hasError('required')">
            Le code est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Libellé</mat-label>
          <input matInput formControlName="libelle" required>
          <mat-error *ngIf="gouvernoratForm.get('libelle')!.hasError('required')">
            Le libellé est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Annuler</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="gouvernoratForm.invalid || isSubmitting">
          {{isEditMode ? 'Modifier' : 'Ajouter'}}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 15px; }
  `]
})
export class GouvernoratFormComponent implements OnInit {
  gouvernoratForm: FormGroup = this.fb.group({
    code: ['', Validators.required],
    libelle: ['', Validators.required],
    description: ['']
  });
  isEditMode: boolean;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private gouvernoratService: GouvernoratService,
    private dialogRef: MatDialogRef<GouvernoratFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.isEditMode = !!data;
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.gouvernoratForm = this.fb.group({
      code: [this.data?.code || '', Validators.required],
      libelle: [this.data?.libelle || '', Validators.required],
      description: [this.data?.description || '']
    });
  }

  onSubmit() {
    if (this.gouvernoratForm.valid) {
      this.isSubmitting = true;
      const gouvernorat = { ...this.gouvernoratForm.value };

      const request = this.isEditMode ?
        this.gouvernoratService.updateGouvernorat(this.data.id, gouvernorat) :
        this.gouvernoratService.createGouvernorat(gouvernorat);

      request.subscribe(
        response => {
          this.snackBar.open(
            `Gouvernorat ${this.isEditMode ? 'modifié' : 'ajouté'} avec succès`,
            'Fermer',
            { duration: 3000 }
          );
          this.dialogRef.close(true);
        },
        error => {
          this.isSubmitting = false;
          this.snackBar.open(
            `Erreur lors de ${this.isEditMode ? 'la modification' : 'l\'ajout'} du gouvernorat`,
            'Fermer',
            { duration: 3000 }
          );
        }
      );
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}