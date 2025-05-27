import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SecteurActiviteService } from '../../services/secteur-activite.service';
import { SecteurActiviteFormComponent } from './secteur-activite-form.component';

@Component({
  selector: 'app-secteur-activite-list',
  template: `
    <div >
      <div class="table-header">
        <h2>Secteurs d'Activité</h2>
        <button mat-raised-button color="primary" (click)="openDialog()">Ajouter</button>
      </div>

      <table mat-table [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="code">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Code</th>
          <td mat-cell *matCellDef="let element">{{element.code}}</td>
        </ng-container>

        <ng-container matColumnDef="libelle">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Libellé</th>
          <td mat-cell *matCellDef="let element">{{element.libelle}}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button color="primary" (click)="editSecteurActivite(element)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteSecteurActivite(element.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]"></mat-paginator>
    </div>
  `,
  styles: [`
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
    }
  `]
})
export class SecteurActiviteListComponent implements OnInit {
  displayedColumns = ['code', 'libelle', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private secteurActiviteService: SecteurActiviteService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadSecteurActivites();
  }

  loadSecteurActivites() {
    this.secteurActiviteService.getAll().subscribe(response => {
      // Use the data array from the response instead of the entire response object
      this.dataSource = new MatTableDataSource(response.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(SecteurActiviteFormComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSecteurActivites();
      }
    });
  }

  editSecteurActivite(secteurActivite: any) {
    const dialogRef = this.dialog.open(SecteurActiviteFormComponent, {
      width: '400px',
      data: secteurActivite
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSecteurActivites();
      }
    });
  }

  deleteSecteurActivite(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce secteur d\'activité ?')) {
      this.secteurActiviteService.delete(id).subscribe(() => {
        this.loadSecteurActivites();
      });
    }
  }
}