import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModePaiementService } from './mode-paiement.service';
import { ModePaiementFormComponent } from './mode-paiement-form.component';


@Component({
  selector: 'app-mode-paiement-list',
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Mode de paiement</h2>
                <div class="d-flex align-items-center">
                  <mat-form-field appearance="outline" class="me-3" style="width: 300px">
                    <mat-label>Rechercher...</mat-label>
                    <input matInput (keyup)="applyFilter($event)" placeholder="Ex. ABC" #input>
                  </mat-form-field>
                  <button
                    mat-raised-button color="primary"
                    (click)="openModePaiementForm()"
                  >
                    Nouveau Mode de Paiement
                  </button>
                </div>
              </div>

              <div class="table-responsive">
                <table mat-table [dataSource]="dataSource" matSort class="table">
                  <ng-container matColumnDef="id">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header> ID </th>
                    <td mat-cell *matCellDef="let row"> {{row.id}} </td>
                  </ng-container>
                  <ng-container matColumnDef="code">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header> Code </th>
                    <td mat-cell *matCellDef="let row"> {{row.code}} </td>
                  </ng-container>
                  <ng-container matColumnDef="nom">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header> Nom </th>
                    <td mat-cell *matCellDef="let row"> {{row.nom || row.name}} </td>
                  </ng-container>

                  <ng-container matColumnDef="description">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header> Description </th>
                    <td mat-cell *matCellDef="let row"> {{row.description}} </td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef class="text-center"> Actions </th>
                    <td mat-cell *matCellDef="let row" class="text-center">
                      <button mat-icon-button color="primary" (click)="editModePaiement(row)" matTooltip="Modifier">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button color="warn" (click)="deleteModePaiement(row.id)" matTooltip="Supprimer">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

                  <tr class="mat-row" *matNoDataRow>
                    <td class="mat-cell text-center" [attr.colspan]="displayedColumns.length">
                      Aucun mode de paiement trouvé
                    </td>
                  </tr>
                </table>

                <mat-paginator 
                  [pageSizeOptions]="[5, 10, 25, 100]" 
                  [pageSize]="5"
                  showFirstLastButtons
                  class="mt-3">
                </mat-paginator>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ModePaiementListComponent implements OnInit {
  displayedColumns: string[] = ['id','code', 'nom', 'description', 'actions'];
  dataSource = new MatTableDataSource<any>([]); // Initialize with empty array

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Add non-null assertion operator
  @ViewChild(MatSort) sort!: MatSort; // Add non-null assertion operator

  constructor(
    private modePaiementService: ModePaiementService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadModePaiements();
  }

  ngAfterViewInit() {
    // Set paginator and sort after view is initialized
    if (this.dataSource.data.length > 0) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  loadModePaiements(): void {
    this.modePaiementService.getModePaiements().subscribe(
      (response) => {
        this.dataSource = new MatTableDataSource(response.data || response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error loading payment modes:', error);
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openModePaiementForm(): void {
    const dialogRef = this.dialog.open(ModePaiementFormComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadModePaiements();
      }
    });
  }

  editModePaiement(modePaiement: any): void {
    const dialogRef = this.dialog.open(ModePaiementFormComponent, {
      width: '500px',
      data: modePaiement
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadModePaiements();
      }
    });
  }

  deleteModePaiement(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce mode de paiement ?')) {
      this.modePaiementService.deleteModePaiement(id).subscribe(
        () => {
          this.loadModePaiements();
        },
        (error) => {
          console.error('Error deleting payment mode:', error);
        }
      );
    }
  }
}