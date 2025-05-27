import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SourceProspectionService } from '../../services/source-prospection.service';

@Component({
  selector: 'app-source-prospection-form',
  template: `
    <h2 mat-dialog-title>{{data ? 'Modifier' : 'Ajouter'}} une source de prospection</h2>
    <mat-dialog-content>
      <form [formGroup]="sourceForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Code</mat-label>
          <input matInput formControlName="code" required>
          <mat-error *ngIf="sourceForm.get('code')?.hasError('required')">
            Le code est requis
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Libellé</mat-label>
          <input matInput formControlName="libelle" required>
          <mat-error *ngIf="sourceForm.get('libelle')?.hasError('required')">
            Le libellé est requis
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!sourceForm.valid">
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
export class SourceProspectionFormComponent implements OnInit {
  sourceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sourceProspectionService: SourceProspectionService,
    private dialogRef: MatDialogRef<SourceProspectionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.sourceForm = this.fb.group({
      code: ['', Validators.required],
      libelle: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.data) {
      this.sourceForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.sourceForm.valid) {
      const source = this.sourceForm.value;
      if (this.data) {
        source.id = this.data.id;
        this.sourceProspectionService.update(source).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        this.sourceProspectionService.create(source).subscribe(() => {
          this.dialogRef.close(true);
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}