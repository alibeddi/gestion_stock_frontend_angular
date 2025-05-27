import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SecteurActiviteService } from '../../services/secteur-activite.service';

@Component({
  selector: 'app-secteur-activite-form',
  template: `
    <h2 mat-dialog-title>{{data ? 'Modifier' : 'Ajouter'}} un secteur d'activité</h2>
    <mat-dialog-content>
      <form [formGroup]="secteurActiviteForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Code</mat-label>
          <input matInput formControlName="code" required>
          <mat-error *ngIf="secteurActiviteForm.get('code')?.hasError('required')">
            Le code est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Libellé</mat-label>
          <input matInput formControlName="libelle" required>
          <mat-error *ngIf="secteurActiviteForm.get('libelle')?.hasError('required')">
            Le libellé est requis
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!secteurActiviteForm.valid">
        {{data ? 'Modifier' : 'Ajouter'}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
  `]
})
export class SecteurActiviteFormComponent implements OnInit {
  secteurActiviteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private secteurActiviteService: SecteurActiviteService,
    private dialogRef: MatDialogRef<SecteurActiviteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.secteurActiviteForm = this.fb.group({
      code: ['', Validators.required],
      libelle: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.data) {
      this.secteurActiviteForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.secteurActiviteForm.valid) {
      const secteurActivite = this.secteurActiviteForm.value;
      if (this.data) {
        secteurActivite.id = this.data.id;
        this.secteurActiviteService.update(secteurActivite).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        this.secteurActiviteService.create(secteurActivite).subscribe(() => {
          this.dialogRef.close(true);
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}