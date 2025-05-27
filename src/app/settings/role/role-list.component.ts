import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Role, RoleService } from './role.service';
import { RoleFormComponent } from './role-form.component';


@Component({
  selector: 'app-role-list',
  template: `
    <div class="container-fluid p-0">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="card-title mb-0">Gestion des Rôles</h2>
          <button mat-raised-button color="primary" (click)="openRoleForm()" class="btn-sm">
            <mat-icon class="fs-5">add</mat-icon> Ajouter
          </button>
        </div>
        <div class="card-body">
    
          
          <div class="table-responsive">
            <table mat-table [dataSource]="dataSource" matSort class="w-100">
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> ID </th>
                <td mat-cell *matCellDef="let row"> {{row.id}} </td>
              </ng-container>

              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Code </th>
                <td mat-cell *matCellDef="let row"> {{row.name}} </td>
              </ng-container>

              <!-- Libelle Column -->
              <ng-container matColumnDef="libelle">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Libellé </th>
                <td mat-cell *matCellDef="let row"> {{row.libelle}} </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef> Actions </th>
                <td mat-cell *matCellDef="let row">
                  <button mat-icon-button color="primary" (click)="openRoleForm(row)" class="btn-sm">
                    <mat-icon class="fs-5">edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteRole(row)" class="btn-sm">
                    <mat-icon class="fs-5">delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

              <!-- Row shown when there is no matching data. -->
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell text-center" colspan="4">Aucune donnée trouvée</td>
              </tr>
            </table>
          </div>
          
          <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of roles"></mat-paginator>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mat-mdc-form-field {
      font-size: 14px;
      width: 100%;
    }
  `]
})
export class RoleListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'libelle', 'actions'];
  dataSource!: MatTableDataSource<Role>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private roleService: RoleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.error('Error loading roles', error);
        this.snackBar.open('Erreur lors du chargement des rôles', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openRoleForm(role?: Role): void {
    const dialogRef = this.dialog.open(RoleFormComponent, {
      width: '500px',
      data: role || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRoles();
      }
    });
  }

  deleteRole(role: Role): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le rôle ${role.name} ?`)) {
      this.roleService.deleteRole(role.id!).subscribe({
        next: (response) => {
          this.snackBar.open(response.message, 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadRoles();
        },
        error: (error) => {
          console.error('Error deleting role', error);
          this.snackBar.open('Erreur lors de la suppression du rôle', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}