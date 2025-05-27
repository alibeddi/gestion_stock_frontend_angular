import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GouvernoratService } from '../../core/services/gouvernorat/gouvernorat.service';
import { GouvernoratFormComponent } from './gouvernorat-form.component';


@Component({
  selector: 'app-gouvernorat-list',
  template: `
    <div class="container">
      <div class="header">
        <h2>Gestion des Gouvernorats</h2>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Nouveau Gouvernorat
        </button>
      </div>

      <mat-table [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="code">
          <mat-header-cell *matHeaderCellDef mat-sort-header>Code</mat-header-cell>
          <mat-cell *matCellDef="let row">{{row.code}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="libelle">
          <mat-header-cell *matHeaderCellDef mat-sort-header>Libellé</mat-header-cell>
          <mat-cell *matCellDef="let row">{{row.nom}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="actions">
          <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
          <mat-cell *matCellDef="let row">
            <button mat-icon-button (click)="openForm(row)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteGouvernorat(row)">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
      </mat-table>

      <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]"></mat-paginator>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 20px; 
    }
  `]
})
export class GouvernoratListComponent implements OnInit {
  displayedColumns = ['code', 'libelle', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private gouvernoratService: GouvernoratService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadGouvernorats();
  }

  loadGouvernorats() {
    this.gouvernoratService.getAllGouvernorats().subscribe(
      response => {
        this.dataSource = new MatTableDataSource(response.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        this.snackBar.open('Erreur lors du chargement des gouvernorats', 'Fermer', { duration: 3000 });
      }
    );
  }

  openForm(gouvernorat?: any) {
    const dialogRef = this.dialog.open(GouvernoratFormComponent, {
      width: '500px',
      data: gouvernorat
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGouvernorats();
      }
    });
  }

  deleteGouvernorat(gouvernorat: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce gouvernorat ?')) {
      this.gouvernoratService.deleteGouvernorat(gouvernorat.id).subscribe(
        () => {
          this.snackBar.open('Gouvernorat supprimé avec succès', 'Fermer', { duration: 3000 });
          this.loadGouvernorats();
        },
        error => {
          this.snackBar.open('Erreur lors de la suppression du gouvernorat', 'Fermer', { duration: 3000 });
        }
      );
    }
  }
}