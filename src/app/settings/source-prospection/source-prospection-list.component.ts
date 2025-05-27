import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SourceProspectionService } from '../../services/source-prospection.service';
import { SourceProspectionFormComponent } from './source-prospection-form.component';


@Component({
  selector: 'app-source-prospection-list',
  template: `
    <div >
      <div class="table-header">
        <h2>Sources de Prospection</h2>
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
            <button mat-icon-button color="primary" (click)="editSource(element)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteSource(element.id)">
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
export class SourceProspectionListComponent implements OnInit {
  displayedColumns = ['code', 'libelle', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private sourceProspectionService: SourceProspectionService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadSources();
  }

  loadSources() {
    this.sourceProspectionService.getAll().subscribe(response => {
      this.dataSource = new MatTableDataSource(response.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(SourceProspectionFormComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSources();
      }
    });
  }

  editSource(source: any) {
    const dialogRef = this.dialog.open(SourceProspectionFormComponent, {
      width: '400px',
      data: source
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSources();
      }
    });
  }

  deleteSource(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette source de prospection ?')) {
      this.sourceProspectionService.delete(id).subscribe(() => {
        this.loadSources();
      });
    }
  }
}