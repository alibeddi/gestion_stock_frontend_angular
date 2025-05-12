import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import {
  Emballage,
  EmballageService,
} from "../../core/services/emballage/emballage.service";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "app-emballage-list",
  templateUrl: "./emballage-list.component.html",
  styleUrls: ["./emballage-list.component.scss"],
})
export class EmballageListComponent implements OnInit {
  displayedColumns: string[] = [
    "code",
    "libelle",
    "poids",
    "typeEmballage",
    "actions",
  ];
  dataSource = new MatTableDataSource<Emballage>([]);
  isLoading = false;
  error: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private emballageService: EmballageService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmballages();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEmballages(): void {
    this.isLoading = true;
    this.error = null;

    this.emballageService
      .getAllEmballages()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.dataSource.data = response.data;
          } else {
            this.error = "Format de réponse inattendu";
          }
        },
        error: (error) => {
          console.error("Error loading emballages:", error);
          this.error = "Erreur lors du chargement des emballages";
        },
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editEmballage(id: number): void {
    this.router.navigate(["/emballages/edit", id]);
  }

  viewEmballage(id: number): void {
    this.router.navigate(["/emballages/detail", id]);
  }

  deleteEmballage(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "350px",
      data: {
        title: "Confirmation de suppression",
        message: "Êtes-vous sûr de vouloir supprimer cet emballage ?",
        confirmButton: "Supprimer",
        cancelButton: "Annuler",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;

        this.emballageService
          .deleteEmballage(id)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe({
            next: () => {
              this.snackBar.open("Emballage supprimé avec succès", "Fermer", {
                duration: 3000,
              });
              this.loadEmballages();
            },
            error: (error) => {
              console.error("Error deleting emballage:", error);
              this.snackBar.open(
                "Erreur lors de la suppression de l'emballage",
                "Fermer",
                {
                  duration: 3000,
                }
              );
            },
          });
      }
    });
  }

  addEmballage(): void {
    this.router.navigate(["/emballages/new"]);
  }

  refreshList(): void {
    this.loadEmballages();
  }
}
